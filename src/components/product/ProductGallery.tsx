"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];

  if (!list.length) {
    return (
      <div className="flex aspect-square items-center justify-center border border-black/5 bg-brand-anthracite text-sm text-brand-mist">
        Görsel yok
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden border border-black/5 bg-brand-anthracite sm:aspect-square">
        <ProductImage
          src={list[active]}
          alt={`${name} — görsel ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border transition ${
                active === i
                  ? "border-brand-gold"
                  : "border-black/10 opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage
                src={src}
                alt={`${name} küçük ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
