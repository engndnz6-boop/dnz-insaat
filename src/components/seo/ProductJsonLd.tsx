import { brand } from "@/lib/brand";
import { absoluteImageUrl, absoluteUrl } from "@/lib/seo";
import type { Product } from "@/lib/types";

export function ProductJsonLd({
  product,
  categoryName,
}: {
  product: Product;
  categoryName?: string;
}) {
  const url = absoluteUrl(`/urun/${product.slug}`);
  const image = absoluteImageUrl(product.images[0]);

  const data =
    product.kind === "project"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: product.name,
          description: product.description,
          image,
          url,
          provider: { "@id": `${brand.url}/#localbusiness` },
          areaServed: "Ankara",
          category: categoryName || product.projectCategory,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription || product.description,
          image,
          url,
          sku: product.id,
          brand: {
            "@type": "Brand",
            name: product.brand || brand.name,
          },
          category: categoryName,
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: product.currency,
            price: product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: { "@id": `${brand.url}/#localbusiness` },
          },
        };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: brand.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName || "Katalog",
        item: absoluteUrl("/katalog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
