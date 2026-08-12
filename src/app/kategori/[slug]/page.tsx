import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getRootCategories,
} from "@/lib/categories-server";
import { getProducts } from "@/lib/products-server";
import { buildCategoryMetadata } from "@/lib/seo";
import { CategoryJsonLd } from "@/components/seo/CategoryJsonLd";
import { CategoryPageClient } from "./CategoryPageClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getRootCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Kategori bulunamadı" };
  return buildCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProducts();
  const categoryProducts = products.filter(
    (p) => p.categoryId === category.id
  );

  return (
    <>
      <CategoryJsonLd category={category} products={categoryProducts} />
      <CategoryPageClient
        categoryId={category.id}
        categoryName={category.name}
        categoryDescription={category.description}
      />
    </>
  );
}
