# VisualDx Diagnosis API Proxy

The [VisualDx API](https://developers.visualdx.com/spec) provides the data and tools needed to build applications that display diagnostic content, medical images, and curated medical knowledge.  
This **Next.js sample application** acts as a **reverse proxy** for the **Diagnosis Write-Up JSON endpoint** — allowing you to securely fetch and cache diagnosis data from the VisualDx API.

---

## ✨ Features

✅ **Diagnosis JSON Proxy** – Fetches diagnosis write-ups (including metadata and associated images).  
✅ **Condensed Body Locations** – Maps raw body location IDs to human-readable groups (e.g., “Arm”, “Leg”).  
✅ **Configurable Cache TTL** – Default 72-hour in-memory cache using `NodeCache`.  
✅ **Supports Multiple Views** – Each `viewId` is handled and cached separately.  
✅ **Error-Resilient** – Handles expired tokens and upstream API errors gracefully.  

---

## ⚙️ API Endpoint

### **GET** `/api/diagnoses/:diagnosisId/:viewId`

Fetches the normalized Diagnosis Write-Up JSON for a specific diagnosis and view.

#### 🧾 Input Parameters

| Name | Type | Required | Description |
|------|------|-----------|--------------|
| `diagnosisId` | `number` | ✅ | Unique identifier of the diagnosis (e.g., `52228` for *Psoriasis*). |
| `viewId` | `number` | ✅ | The VisualDx *View ID* specifying audience or variant (e.g., `101` for *Adult*, `102` for *Child*). |
| `textFormat` | `string` (query param, optional) | ❌ | Format of the write-up text: `md` (Markdown, default) or `html`. |

#### Example Request

```bash
curl "http://localhost:3000/api/diagnoses/52228/101"
```

#### Example Response

```json
{
  "id": 52228,
  "name": "Psoriasis",
  "authors": "Jeffrey M. Cohen MD",
  "updated": "2025-09-22",
  "sections": [
    { "title": "Synopsis", "body": "..." },
    { "title": "Therapy", "body": "..." }
  ],
  "images": [
    {
      "id": 494019,
      "caption": "Scaly papules and plaques with erythema in a patient with AIDS.",
      "bodyLocations": ["Leg", "Foot or toes"],
      "sex": "M",
      "skinType": 2
    }
  ],
  "views": [
    { "id": 101, "name": "Adult" }
  ]
}
```

---

## ⚙️ Configuration (.env.local)

```bash
# VisualDx API Base URL
API_BASE_URL=https://api.visualdx.com/v1

# Token Endpoint for authentication
TOKEN_URL=https://api.visualdx.com/v1/auth/token

# Authentication Credentials
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret

# Audience
AUDIENCE=clinical

# Cache TTL (in seconds) - Default 72 hours (72 * 3600 = 259200 seconds)
CACHE_TTL=259200

# **Note**: If your `CLIENT_SECRET` contains special characters, **wrap it in double quotes**:

```

---

## 🧩 Body Location Condensing

This proxy automatically condenses raw `bodyLocation` IDs (like `1217`, `23523`) into readable labels (`Arm`, `Scalp`, etc.) using mappings derived from the official *Grouped Body Locations* spreadsheet.

See [`utils/bodyLocationMap.js`](./utils/bodyLocationMap.js) for full details.

---

## 🧱 Project Structure

```
pages/
  api/
    diagnoses/
      [diagnosisId]/
        [viewId].js
utils/
  bodyLocationMap.js
config.js
```

---

## 🏗️ Deployment

### Build and Run

```bash
npm run build
npm start
```

Deploy easily on **Vercel**, adding environment variables from `.env.local`.

---

## 📚 Learn More

- [VisualDx Developer Portal](https://developers.visualdx.com/spec)
- [Next.js Documentation](https://nextjs.org/docs)
