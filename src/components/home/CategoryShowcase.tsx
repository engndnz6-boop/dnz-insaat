"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Grid3x3,
  Layers,
  LayoutGrid,
  PaintRoller,
  Plug,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { ProductImage } from "@/components/product/ProductImage";

type Group = {
  title: string;
  text: string;
  href: string;
  categoryIds: string[];
  icon: LucideIcon;
  /** Admin’de fotoğraf yoksa kullanılan görsel (yoksa simgeli kutu) */
  fallback?: string;
};

const groups: Group[] = [
  {
    title: "Alçıpan ve profil sistemleri",
    text: "Alçıpan plaka, galvaniz, kutu, ABS ve UMS profil, bölme duvar.",
    href: "/kategori/alcipan-asma-tavan-malzemeleri",
    categoryIds: ["cat-alcipan-tavan", "cat-bolme"],
    icon: Layers,
    fallback: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80",
  },
  {
    title: "Asma tavan malzemeleri",
    text: "Clip-in, karolam, taşyünü, vinil tavan, lambiri ve ışık bandı.",
    href: "/kategori/clipin-petek-asma-tavan",
    categoryIds: ["cat-clipin", "cat-karolam", "cat-tasyunu", "cat-vinil-lambiri", "cat-isik-bandi"],
    icon: LayoutGrid,
    fallback: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1000&q=80",
  },
  {
    title: "Seramik ve fayans",
    text: "Banyo, mutfak ve zemin için seramik ve fayans.",
    href: "/kategori/seramik-parke",
    categoryIds: ["cat-seramik-parke"],
    icon: Grid3x3,
  },
  {
    title: "Boya ve alçı ürünleri",
    text: "İç ve dış cephe boyası, saten ve kara alçı, astar.",
    href: "/kategori/alci-boya-malzeme",
    categoryIds: ["cat-boya-alci"],
    icon: PaintRoller,
  },
  {
    title: "Parke ve kapılar",
    text: "Laminat parke, süpürgelik, iç kapı ve aksesuar.",
    href: "/kategori/seramik-parke",
    categoryIds: ["cat-seramik-parke"],
    icon: DoorOpen,
  },
  {
    title: "Elektrik ve su tesisatı ürünleri",
    text: "Anahtar, priz, kablo, aydınlatma, boru, fittings ve kombi parçası.",
    href: "/kategori/elektrik-malzemeleri-tamirat",
    categoryIds: ["cat-elektrik", "cat-su"],
    icon: Plug,
  },
];

export function CategoryShowcase() {
  const { products } = useProducts();

  // Admin’de o gruba yüklenen ilk ürün fotoğrafı; aynı fotoğraf iki kutuda tekrar etmesin
  const images = useMemo(() => {
    const used = new Set<string>();
    return groups.map((g) => {
      const pick = products.find(
        (p) =>
          p.kind !== "project" &&
          g.categoryIds.includes(p.categoryId) &&
          p.images?.[0] &&
          !used.has(p.images[0])
      );
      const src = pick?.images[0] || g.fallback || "";
      if (src) used.add(src);
      return src;
    });
  }, [products]);

  return (
    <section className="bg-brand-paper pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="home-heading">Yapınız için doğru malzeme, doğru adres.</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-mist sm:text-lg">
              Kaliteli ürünleri inceleyin, ihtiyacınıza uygun seçenekleri bulun.
            </p>
          </div>
          <Link href="/katalog" className="btn-light shrink-0 px-5 py-3">
            Tüm ürünleri gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Link
              key={g.title}
              href={g.href}
              className="group flex flex-col overflow-hidden rounded-lg border border-black/5 bg-white shadow-red transition hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-navy to-[#1d4a7c]">
                {images[i] ? (
                  <ProductImage
                    src={images[i]}
                    alt={`${g.title}, DNZ İnşaat Malzemeleri Gölbaşı`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <g.icon className="h-16 w-16 text-white/80" strokeWidth={1.25} aria-hidden />
                  </div>
                )}
              </div>
              <div className="flex flex-1 items-start justify-between gap-4 p-5">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">{g.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-mist">{g.text}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-brand-gold transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
