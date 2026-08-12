import type { MetadataRoute } from "next";
import { getRootCategories } from "@/lib/categories-server";
import { brand } from "@/lib/brand";
import { getProducts } from "@/lib/products-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = brand.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/katalog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/hesaplama`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/kataloglar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/iletisim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  const categories = getRootCategories().map((c) => ({
    url: `${base}/kategori/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  const products = await getProducts();
  const productPages = products.map((p) => ({
    url: `${base}/urun/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p.kind === "project" ? 0.75 : 0.82,
  }));

  return [...staticPages, ...categories, ...productPages];
}
