"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCatalog } from "@/lib/catalog-context";

export function ProductCard({ product }: { product: Product }) {
  const { getCategory } = useCatalog();
  const cat = getCategory(product.categoryId);
  const sub = product.subcategoryId
    ? getCategory(product.subcategoryId)
    : undefined;
  const badge =
    product.brand || sub?.name || cat?.name || "Ürün";

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex flex-col overflow-hidden border border-white/5 bg-brand-anthracite transition hover:border-brand-gold/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute left-3 top-3 bg-brand-ink/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-gold">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg text-brand-bone transition group-hover:text-brand-gold">
          {product.name}
        </h3>
        {(product.brand || product.model) && (
          <p className="mt-1 text-xs text-brand-gold/90">
            {[product.brand, product.model].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-mist">
          {product.shortDescription}
        </p>
        <p className="mt-auto pt-4 text-sm font-semibold text-brand-gold">
          {formatPrice(product.price)}
          <span className="ml-1 text-xs font-normal text-brand-mist">
            / birim
          </span>
        </p>
      </div>
    </Link>
  );
}
