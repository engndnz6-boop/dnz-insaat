"use client";

import Link from "next/link";
import { ProductCatalog } from "@/components/catalog/ProductFilters";
import { useProducts } from "@/lib/products-context";

export function CategoryPageClient({
  categoryId,
  categoryName,
  categoryDescription,
}: {
  categoryId: string;
  categoryName: string;
  categoryDescription?: string;
}) {
  const { products, ready } = useProducts();

  if (!ready) {
    return (
      <div className="container-page py-20">
        <div className="h-8 w-48 animate-pulse bg-brand-anthracite" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse bg-brand-anthracite"
            />
          ))}
        </div>
      </div>
    );
  }

  const saleProducts = products.filter(
    (p) => p.kind !== "project" && p.categoryId === categoryId
  );

  return (
    <>
      <div className="border-b border-black/5 bg-brand-navy px-4 py-8 sm:px-6 lg:px-8">
        <div className="container-page">
          <nav className="text-xs text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">
              Ana Sayfa
            </Link>
            <span className="mx-2">/</span>
            <Link href="/katalog" className="hover:text-white">
              Katalog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{categoryName}</span>
          </nav>
          <h1 className="mt-4 font-sans text-3xl font-bold text-white sm:text-4xl">
            {categoryName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            {categoryDescription ||
              `${categoryName} — Ankara Gölbaşı malzeme satışı ve uygulama.`}
          </p>
        </div>
      </div>

      <ProductCatalog
        products={saleProducts}
        initialCategoryId={categoryId}
        hideCategoryPicker
        hideHeader
        title={categoryName}
        subtitle={`${categoryName} ürünleri — Gölbaşı Ankara.`}
      />
    </>
  );
}
