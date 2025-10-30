import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
    return (
        <>
            <Head>
                <title>VisualDx Diagnosis API Proxy</title>
                <meta
                    name="description"
                    content="A Next.js sample app implementing a reverse proxy for the VisualDx Diagnosis Write-Up API."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>

            <div className={styles.page}>
                <main className={styles.main}>
                    <h1>VisualDx Diagnosis API Proxy</h1>
                    <p>
                        This sample application provides a reverse proxy for accessing
                        <strong> diagnosis write-ups </strong> and associated image metadata
                        from the VisualDx API. It automatically handles authentication,
                        caching, and body location mapping for simplified integration.
                    </p>

                    <h2>Getting Started</h2>
                    <ol>
                        <li>Clone this repository and install dependencies:</li>
                        <pre>
              <code>git clone https://github.com/VisualDx/visualdx-api-diagnosis-proxy.git</code>
              <br/>
              <code>cd visualdx-api-diagnosis-proxy</code>
              <br/>
              <code>npm install</code>
            </pre>

                        <li>Set up your <code>.env.local</code> file:</li>
                        <pre>
              <code>
                API_BASE_URL=https://api.visualdx.com/v1{"\n"}
                  TOKEN_URL=https://api-dev.visualdx.com/v1/auth/token{"\n"}
                  CLIENT_ID=your_client_id{"\n"}
                  CLIENT_SECRET=your_client_secret{"\n"}
                  AUDIENCE=clinical{"\n"}
                  CACHE_TTL=259200{"\n"}
              </code>
            </pre>

                        <li>Start the development server:</li>
                        <pre>
              <code>npm run dev</code>
            </pre>

                        <li>Test the Diagnosis JSON endpoint:</li>
                        <pre>
              <code>
                curl "http://localhost:3000/api/diagnoses/52228/101"
              </code>
            </pre>
                    </ol>

                    <h2>Endpoint Overview</h2>
                    <p>
                        <strong>GET /api/diagnoses/:diagnosisId/:viewId</strong>
                    </p>
                    <ul>
                        <li>
                            <strong>diagnosisId</strong> – Unique ID for a diagnosis (e.g.,
                            <code>52228</code> for Psoriasis).
                        </li>
                        <li>
                            <strong>viewId</strong> – VisualDx view ID (e.g.,
                            <code>101</code> for Adult, <code>102</code> for Child).
                        </li>
                        <li>
                            <strong>textFormat</strong> (optional query param) – <code>md</code> or{" "}
                            <code>html</code>. Defaults to <code>md</code>.
                        </li>
                    </ul>

                    <p>
                        The proxy returns normalized JSON including metadata, sections,
                        authors, images, and condensed body locations derived from the
                        Grouped Body Locations spreadsheet.
                    </p>

                    <pre>
            <code>
{`{
  "id": 52228,
  "name": "Psoriasis",
  "sections": [
    { "title": "Synopsis", "body": "..." }
  ],
  "images": [
    {
      "id": 494019,
      "caption": "Scaly plaques on legs.",
      "bodyLocations": ["Leg", "Foot or toes"]
    }
  ]
}`}
            </code>
          </pre>

                    <h2>Resources</h2>
                    <ul>
                        <li>
                            <a
                                href="https://developers.visualdx.com/spec"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                VisualDx API Documentation
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://nextjs.org/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Next.js Documentation
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://vercel.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Deploy on Vercel
                            </a>
                        </li>
                    </ul>
                </main>

                <footer className={styles.footer}>
                    <p>Powered by Next.js | VisualDx Diagnosis API Integration</p>
                </footer>
            </div>
        </>
    );
}
