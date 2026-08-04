"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useProducts } from "@/lib/products-context";

export function FeaturedProducts() {
  const { getFeatured, ready } = useProducts();
  const products = useMemo(() => getFeatured(), [getFeatured]);

  return (
    <section className="container-page py-20 sm:py-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="section-kicker">Katalog</p>
          <h2 className="section-title mt-3">Öne çıkan ürünler</h2>
          <p className="section-subtitle">
            Alçıpan, taşyünü, karolam, clip-in asma tavan, ışık bandı, bölme duvar
            ve bağlı malzemeler.
          </p>
        </div>
          <Link href="/katalog" className="btn-ghost shrink-0">
            Malzeme satışı
            <ArrowRight className="h-4 w-4" />
          </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {!ready
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse bg-brand-anthracite"
              />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
