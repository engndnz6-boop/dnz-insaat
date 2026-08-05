"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings-context";

export function Hero() {
  const { settings } = useSiteSettings();

  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&q=80"
          alt="İnşaat malzemeleri ve uygulama"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/55" />
      </div>

      <div className="container-page relative flex min-h-[70vh] flex-col justify-center py-20 sm:min-h-[68vh] sm:py-24">
        <h1
          className="max-w-3xl font-display text-4xl font-semibold uppercase tracking-[0.04em] leading-[1.1] text-white opacity-0 animate-fade-up sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "0.08s", animationFillMode: "forwards" }}
        >
          {settings.companyName}
        </h1>
        <p
          className="mt-5 max-w-lg text-base leading-relaxed text-white/80 opacity-0 animate-fade-up sm:text-lg"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          {settings.heroSubtitle}
        </p>
        <div
          className="mt-8 flex flex-wrap gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.32s", animationFillMode: "forwards" }}
        >
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 bg-brand-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-gold-light"
          >
            Ürünleri İncele
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Teklif Al
          </Link>
        </div>
      </div>
    </section>
  );
}
