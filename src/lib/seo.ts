import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import type { Category, Product } from "@/lib/types";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${brand.url}${p}`;
}

export function absoluteImageUrl(src?: string): string {
  if (!src) return `${brand.url}/logo-dnz.png`;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return `${brand.url}${src}`;
  return `${brand.url}/logo-dnz.png`;
}

export function truncate(text: string, max = 155): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

export function buildProductMetadata(
  product: Product,
  categoryName?: string
): Metadata {
  const location = "Ankara Gölbaşı";
  const title =
    product.kind === "project"
      ? `${product.name} | Proje Örneği ${location}`
      : `${product.name}${categoryName ? ` | ${categoryName}` : ""} ${location}`;

  const description = truncate(
    `${product.shortDescription || product.description} — ${brand.name}, ${location}. Tel: ${brand.phone}`
  );

  const image = absoluteImageUrl(product.images[0]);
  const url = absoluteUrl(`/urun/${product.slug}`);

  return {
    title,
    description,
    keywords: [
      product.name,
      categoryName,
      "Ankara",
      "Gölbaşı",
      brand.name,
      ...(product.kind === "project" ? ["asma tavan uygulama", "proje"] : ["malzeme satışı"]),
    ].filter(Boolean) as string[],
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      title,
      description,
      siteName: brand.name,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} Ankara Gölbaşı`;
  const description = truncate(
    `${category.description || category.name} — ${brand.name} Gölbaşı Ankara. Alçıpan, asma tavan, bölme duvar malzeme satışı ve uygulama. Tel: ${brand.phone}`
  );
  const url = absoluteUrl(`/kategori/${category.slug}`);

  return {
    title,
    description,
    keywords: [
      category.name,
      `${category.name} Ankara`,
      `${category.name} Gölbaşı`,
      "inşaat malzemeleri",
      "asma tavan",
      "alçıpan",
      brand.name,
    ],
    alternates: { canonical: `/kategori/${category.slug}` },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      title,
      description,
      siteName: brand.name,
      images: [{ url: `${brand.url}/logo-dnz.png`, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${brand.url}/logo-dnz.png`],
    },
  };
}
