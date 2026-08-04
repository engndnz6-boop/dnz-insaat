import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { brand } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&q=80"
          alt="Asma tavan ve dekorasyon uygulaması"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/55" />
      </div>

      <div className="container-page relative flex min-h-[78vh] flex-col justify-center py-20 sm:min-h-[72vh] sm:py-24">
        <div
          className="mb-5 flex items-center gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}
        >
          <LogoMark className="h-11 w-auto sm:h-12" priority />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
            {brand.tagline}
          </span>
        </div>
        <h1
          className="max-w-3xl font-sans text-4xl font-bold leading-[1.12] text-white opacity-0 animate-fade-up sm:text-5xl lg:text-[3.5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Yapı malzemelerinde güvenilir çözüm ortağınız
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-white/80 opacity-0 animate-fade-up sm:text-lg"
          style={{ animationDelay: "0.28s", animationFillMode: "forwards" }}
        >
          Alçıpan asma tavan, ışık bandı, taşyünü, karolam, clip-in sistemler ve
          bölme duvar uygulamaları. Malzeme satışı ve anahtar teslim uygulama.
        </p>
        <div
          className="mt-8 flex flex-wrap gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link href="/katalog" className="inline-flex items-center gap-2 bg-brand-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-gold-light">
            Ürünleri İncele
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/iletisim" className="inline-flex items-center gap-2 border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Teklif Al
          </Link>
        </div>
      </div>
    </section>
  );
}
