import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/categories-server";
import { getProductBySlug, getProductSlugs } from "@/lib/products-server";
import { buildProductMetadata } from "@/lib/seo";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { ProductPageClient } from "./ProductPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  const category = getCategoryById(product.categoryId);
  return buildProductMetadata(product, category?.name);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryById(product.categoryId);

  return (
    <>
      <ProductJsonLd product={product} categoryName={category?.name} />
      <ProductPageClient />
    </>
  );
}
