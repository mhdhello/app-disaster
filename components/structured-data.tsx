export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RiseAgain Sri Lanka",
    url: "https://app-disaster.vercel.app",
    logo: "https://app-disaster.vercel.app/Logo.png",
    description:
      "Official emergency response portal for Sri Lanka flood disaster relief. Report flood damage, offer help, and coordinate relief efforts.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+94-119",
      contactType: "Emergency",
      areaServed: "LK",
      availableLanguage: ["en", "si", "ta"],
    },
    sameAs: [
      // Add social media links if available
    ],
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RiseAgain Sri Lanka",
    url: "https://app-disaster.vercel.app",
    description:
      "Official emergency response portal for Sri Lanka flood disaster relief.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://app-disaster.vercel.app/maps?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Emergency Response Service",
    provider: {
      "@type": "Organization",
      name: "RiseAgain Sri Lanka",
    },
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    description:
      "Emergency response services for flood disaster relief in Sri Lanka. Report damage, offer help, and coordinate relief efforts.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "LKR",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}

