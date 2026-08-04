import { brand } from "@/lib/brand";

/** Google / arama motorları için LocalBusiness + Organization şeması */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${brand.url}/#organization`,
        name: brand.name,
        url: brand.url,
        logo: `${brand.url}/logo-dnz.png`,
        email: brand.email,
        telephone: brand.phoneTel,
        sameAs: [],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${brand.url}/#localbusiness`,
        name: `${brand.name} Malzemeleri`,
        image: `${brand.url}/logo-dnz.png`,
        url: brand.url,
        telephone: brand.phoneTel,
        email: brand.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Karşıyaka Mah. Şehit Ali Gaffar Okkan Cad. No: 42/A",
          addressLocality: "Gölbaşı",
          addressRegion: "Ankara",
          addressCountry: "TR",
        },
        openingHours: "Mo-Sa 09:00-18:00",
        description: brand.description,
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Ankara",
        },
        knowsAbout: [...brand.keywords],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Asma tavan ve inşaat malzemeleri",
          itemListElement: brand.services.map((name, i) => ({
            "@type": "OfferCatalog",
            position: i + 1,
            name,
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${brand.url}/#website`,
        url: brand.url,
        name: brand.name,
        description: brand.description,
        publisher: { "@id": `${brand.url}/#organization` },
        inLanguage: "tr-TR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${brand.url}/katalog`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
