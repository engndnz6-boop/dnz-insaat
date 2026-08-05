"use client";

import { ProductCatalog } from "@/components/catalog/ProductFilters";
import { useProducts } from "@/lib/products-context";

export default function KatalogPage() {
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

  return <ProductCatalog products={products.filter((p) => p.kind !== "project")} />;
}
