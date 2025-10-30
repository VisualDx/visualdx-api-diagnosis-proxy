import axios from "axios";
import NodeCache from "node-cache";
import config from "../../../../config.js";
import {BODY_LOCATION_MAP, BODY_ORDER} from "@/utils/bodyLocationMap";

// Initialize cache with configurable TTL
const cache = new NodeCache({stdTTL: config.CACHE_TTL});

// Token management
let apiToken = null;
let tokenExpiration = null;

async function fetchToken() {
    console.log("Fetching new API token...");
    const response = await axios.post(
        config.TOKEN_URL,
        {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            audience: config.AUDIENCE,
            grant_type: "client_credentials",
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(
                    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                ).toString("base64")}`,
            },
        }
    );

    const {access_token, expires_in} = response.data;
    apiToken = access_token;
    tokenExpiration = Date.now() + expires_in * 1000;
    console.log("Token obtained successfully");
}

async function ensureToken() {
    if (!apiToken || Date.now() >= tokenExpiration) await fetchToken();
}

function condenseBodyLocations(raw = []) {
    if (!Array.isArray(raw)) return [];

    const mapped = raw.map((locId) => BODY_LOCATION_MAP[locId] || null).filter(Boolean);
    const unique = [...new Set(mapped)];
    return BODY_ORDER.filter((x) => unique.includes(x));
}

// --- Main Handler ---
export default async function handler(req, res) {
    if (req.method !== "GET")
        return res.status(405).json({error: "Method Not Allowed"});

    const {diagnosisId, viewId} = req.query;
    const {textFormat = "md"} = req.query;

    if (!diagnosisId || !viewId)
        return res.status(400).json({error: "Diagnosis ID and viewId are required"});

    const cacheKey = `diagnosis:${diagnosisId}:${viewId}:${textFormat}`;
    const apiUrl = `${config.API_BASE_URL}/libraries/${config.AUDIENCE}/diagnoses/${diagnosisId}`;

    try {
        await ensureToken();

        // Serve from cache if available
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log(`Serving from cache [${cacheKey}]`);
            res.setHeader("Cache-Control", `public, s-maxage=${config.CACHE_TTL}`);
            return res.status(200).json(cached);
        }

        console.log(`Fetching diagnosis (${diagnosisId}) view ${viewId} from API...`);
        const response = await axios.get(apiUrl, {
            headers: {Authorization: `Bearer ${apiToken}`},
            params: {viewId, textFormat},
        });

        if (response.status !== 200)
            return res.status(response.status).send(response.data);

        const dx = response.data?.data;

        // Normalize / simplify
        const simplified = {
            id: dx?.id,
            name: dx?.name,
            authors: dx?.authors,
            updated: dx?.updated,
            severity: dx?.severity,
            sections:
                dx?.sections?.map((s) => ({
                    title: s.title,
                    body: s.body,
                })) || [],
            images: dx?.images?.map((img) => {
                const rawLocations = img.bodyLocations || [];
                return {
                    id: img.id,
                    caption: img.caption,
                    bodyLocations: condenseBodyLocations(rawLocations),
                    sex: img.sex,
                    skinType: img.skinType,
                };
            }) || [],
            views: response.data?.views || [],
        };

        cache.set(cacheKey, simplified);
        res.setHeader("Cache-Control", `public, s-maxage=${config.CACHE_TTL}`);
        return res.status(200).json(simplified);
    } catch (err) {
        console.error("dxJson error:", err.message);
        if (err.response)
            return res.status(err.response.status).send(err.response.data);
        return res.status(500).json({error: "Unexpected error occurred"});
    }
}
