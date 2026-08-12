import { brand } from "@/lib/brand";
import { absoluteUrl } from "@/lib/seo";
import type { Category, Product } from "@/lib/types";

export function CategoryJsonLd({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const url = absoluteUrl(`/kategori/${category.slug}`);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${category.name} Ankara Gölbaşı`,
        description: category.description || category.name,
        url,
        isPartOf: { "@id": `${brand.url}/#website` },
        about: {
          "@type": "Thing",
          name: category.name,
        },
      },
      {
        "@type": "ItemList",
        name: category.name,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(`/urun/${p.slug}`),
          name: p.name,
        })),
      },
      {
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
            name: "Katalog",
            item: absoluteUrl("/katalog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: url,
          },
        ],
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
