"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProducts } from "@/lib/products-context";
import { ProductImage } from "@/components/product/ProductImage";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "Alçıpan ve galvaniz profil",
    text: "Plaka, C ve U profil, kutu profil, ABS / UMS profil, askı ve aksesuar.",
    href: "/kategori/alcipan-asma-tavan-malzemeleri",
    categoryIds: ["cat-alcipan-tavan", "cat-isik-bandi"],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
  },
  {
    title: "Clip-in ve petek asma tavan",
    text: "Metal panel ve taşıyıcı sistemler.",
    href: "/kategori/clipin-petek-asma-tavan",
    categoryIds: ["cat-clipin"],
    image:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80",
  },
  {
    title: "Taşyünü, karolam ve vinil",
    text: "Akustik ve yangına dayanıklı tavan panelleri.",
    href: "/kategori/tasyunu-asma-tavan-malzemeleri",
    categoryIds: ["cat-tasyunu", "cat-karolam"],
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80",
  },
  {
    title: "Bölme ve giydirme duvar",
    text: "Ofis, okul ve konut için alçıpan duvar sistemleri.",
    href: "/kategori/bolme-duvar-malzemeleri",
    categoryIds: ["cat-bolme"],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  },
];

const spans = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[320px] lg:min-h-0",
  "min-h-[240px]",
  "min-h-[240px]",
  "sm:col-span-2 lg:col-span-2 min-h-[240px]",
];

export function CategoryShowcase() {
  const { products } = useProducts();

  // Admin’de o kategoriye yüklenen ilk fotoğraf (önce projeler, sonra ürünler);
  // hiç yoksa varsayılan görsel kullanılır.
  const images = useMemo(
    () =>
      categories.map((cat) => {
        const inCat = products.filter(
          (p) => cat.categoryIds.includes(p.categoryId) && p.images?.[0]
        );
        const pick =
          inCat.find((p) => p.kind === "project") || inCat[0] || null;
        return pick ? pick.images[0] : cat.image;
      }),
    [products]
  );

  return (
    <section className="bg-brand-paper pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="home-heading">Ürün grupları</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-mist sm:text-lg">
              Tavandan duvara, bir şantiyenin ihtiyaç duyduğu malzemenin çoğu
              Gölbaşı&apos;ndaki mağazamızda hazır.
            </p>
          </div>
          <Link
            href="/katalog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-navy transition hover:text-brand-gold"
          >
            Tüm ürünler
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-3 lg:auto-rows-[250px] sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative flex overflow-hidden rounded-lg bg-brand-navy shadow-red ${spans[i]}`}
            >
              <ProductImage
                src={images[i]}
                alt={`${cat.title}, Ankara Gölbaşı`}
                fill
                sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 25vw"}
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night via-brand-night/55 to-brand-night/5" />
              <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <h3
                    className={`type-wide font-bold leading-tight text-white ${
                      i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/75">
                    {cat.text}
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-white/10 text-white transition group-hover:bg-brand-gold">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
