import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { brand } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&q=80"
          alt="Asma tavan ve dekorasyon uygulaması"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
      </div>

      <div className="container-page relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 sm:pb-24 sm:pt-32">
        <div
          className="mb-6 flex items-center gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}
        >
          <LogoMark className="h-12 w-auto sm:h-14" priority />
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-light">
            {brand.tagline}
          </span>
        </div>
        <h1
          className="max-w-3xl font-display text-4xl font-medium leading-[1.1] text-white opacity-0 animate-fade-up sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          {brand.name}
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-white/85 opacity-0 animate-fade-up sm:text-lg"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Alçıpan asma tavan, ışık bandı, taşyünü, karolam, clip-in asma tavan ve
          bölme duvar uygulamaları. Malzeme satışı ve anahtar teslim dekorasyon.
        </p>
        <div
          className="mt-8 flex flex-wrap gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <Link href="/katalog" className="btn-primary">
            Ürün & Sistemler
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/iletisim" className="btn-secondary">
            Teklif Al
          </Link>
        </div>
      </div>
    </section>
  );
}
