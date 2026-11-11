/**
 * Server component that injects Organization + WebSite + SoftwareApplication
 * structured data as a single @graph. Rendered inside the root layout <body>.
 */
const BASE_URL = "https://www.lastehr.com";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // The single author of the project, resolvable to their own site, so
        // the work and the person are one entity across both domains.
        "@type": "Person",
        "@id": "https://www.cbetz.com/#chris-betz",
        name: "Chris Betz",
        url: "https://www.cbetz.com",
        jobTitle: "Head of Engineering",
        sameAs: [
          "https://www.cbetz.com",
          "https://github.com/cbetz",
          "https://www.linkedin.com/in/christopherbetz",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Last EHR",
        url: BASE_URL,
        logo: `${BASE_URL}/icon`,
        description:
          "Last EHR develops open-source AI tools for reading FHIR patient charts and reviewing proposed chart changes.",
        sameAs: ["https://github.com/cbetz/last-ehr", "https://x.com/lastehr"],
        founder: { "@id": "https://www.cbetz.com/#chris-betz" },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Last EHR",
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/#software`,
        name: "Last EHR",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        url: BASE_URL,
        publisher: { "@id": `${BASE_URL}/#organization` },
        author: { "@id": "https://www.cbetz.com/#chris-betz" },
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        isAccessibleForFree: true,
        description:
          "An alpha web app and MCP server for searching patients, reading FHIR charts, and proposing notes, observations, and follow-up tasks. Writes require human approval. The FHIR backend remains the system of record. In external model modes, chart reads are sent to the configured provider. Apache-2.0, with a synthetic-data demo.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Neutralize XSS by escaping the closing-angle bracket, per Next.js guidance.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
