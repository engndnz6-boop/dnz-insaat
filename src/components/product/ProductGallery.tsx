"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden border border-black/5 bg-brand-anthracite sm:aspect-square">
        <Image
          src={images[active]}
          alt={`${name} — görsel ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border transition ${
                active === i
                  ? "border-brand-gold"
                  : "border-black/10 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
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
