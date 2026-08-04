import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Alçıpan & Galvaniz Profil",
    href: "/katalog",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  },
  {
    title: "Clip-in / Klipin Asma Tavan",
    href: "/katalog",
    image:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1200&q=80",
  },
  {
    title: "Taşyünü, Metal & Plastik Tavan",
    href: "/katalog",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80",
  },
  {
    title: "Bölme Duvar",
    href: "/katalog",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  },
];

export function CategoryShowcase() {
  return (
    <section className="bg-brand-navy py-16 sm:py-20">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Ürünlerimiz
        </p>
        <h2 className="mt-3 text-center font-sans text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Çalışma Alanları
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative aspect-[4/5] overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-sans text-lg font-bold uppercase tracking-wide text-white">
                  {cat.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-gold-light">
                  Ürünleri Gör
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
