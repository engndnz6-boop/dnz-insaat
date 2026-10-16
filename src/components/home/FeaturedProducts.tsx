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
    <section className="border-t border-black/5 bg-brand-paper">
      <div className="container-page py-20 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="home-heading">Öne çıkan ürünler</h2>
          <p className="mt-3 text-base leading-relaxed text-brand-mist sm:text-lg">
            Sepete ekleyip sipariş verin ya da tek tıkla WhatsApp’tan fiyat sorun.
          </p>
        </div>
        <Link
          href="/katalog"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-navy transition hover:text-brand-gold"
        >
          Tüm katalog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
