"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings-context";
import { useCalculators } from "@/lib/calculators-context";
import { brand } from "@/lib/brand";
import { CeilingDrawing } from "./CeilingDrawing";

function QuickEstimate() {
  const { systems } = useCalculators();
  const [systemId, setSystemId] = useState("");
  const [m2, setM2] = useState("");

  const selected = systemId || systems[0]?.id || "";
  const href = useMemo(() => {
    const params = new URLSearchParams();
    if (selected) params.set("sistem", selected);
    const area = Number(m2.replace(",", "."));
    if (area > 0) params.set("m2", String(area));
    const q = params.toString();
    return q ? `/hesaplama?${q}` : "/hesaplama";
  }, [selected, m2]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-px bg-brand-steel/60 shadow-[0_30px_60px_-30px_rgba(7,29,63,0.55)] sm:grid-cols-[1.3fr_0.7fr_auto]"
      aria-label="Hızlı metraj hesabı"
    >
      <label className="flex flex-col bg-white px-5 py-3.5">
        <span className="text-xs font-medium text-brand-mist">Sistem</span>
        <select
          value={selected}
          onChange={(e) => setSystemId(e.target.value)}
          className="mt-0.5 w-full appearance-none bg-transparent text-[15px] font-semibold text-brand-bone outline-none"
        >
          {systems.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col bg-white px-5 py-3.5">
        <span className="text-xs font-medium text-brand-mist">Alan (m²)</span>
        <input
          inputMode="decimal"
          placeholder="Örn. 45"
          value={m2}
          onChange={(e) => setM2(e.target.value)}
          className="mt-0.5 w-full bg-transparent text-[15px] font-semibold text-brand-bone outline-none placeholder:font-normal placeholder:text-brand-mist/60"
        />
      </label>
      <Link
        href={href}
        className="flex items-center justify-center gap-2 bg-brand-gold px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
      >
        Metrajı hesapla
        <ArrowRight className="h-4 w-4" />
      </Link>
    </form>
  );
}

export function Hero() {
  const { settings } = useSiteSettings();

  return (
    <section className="relative bg-brand-night">
      {/* İnce modül çizgileri: 60 cm karo ritmi */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C9D1DC 1px, transparent 1px)",
          backgroundSize: "120px 100%",
        }}
      />

      <div className="container-page relative grid items-center gap-8 pb-28 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-10 lg:pb-36 lg:pt-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-brand-steel/80">
            {settings.companyName}, Gölbaşı / Ankara
          </p>
          <h1 className="type-wide mt-5 text-[2.1rem] font-bold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.9rem] lg:text-[3.25rem]">
            Asma tavan ve alçıpan işlerinde malzeme de uygulama da bizden.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            {settings.heroSubtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-brand-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-gold-light"
            >
              Ürünleri incele
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
            >
              Teklif al
            </Link>
          </div>

          <a
            href={`tel:${brand.phoneTel}`}
            className="mt-8 inline-flex items-center gap-3 text-white/80 transition hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-white/20">
              <Phone className="h-4 w-4" />
            </span>
            <span className="text-sm">
              Hemen arayın{" "}
              <span className="ml-1 font-semibold tabular-nums text-white">
                {brand.phone}
              </span>
            </span>
          </a>
        </div>

        <div className="relative -mx-4 sm:mx-0">
          <CeilingDrawing className="h-auto w-full" />
        </div>
      </div>

      {/* Hızlı metraj çubuğu: hero ile sonraki bölüm arasında */}
      <div className="container-page relative -mb-14 -mt-20 lg:-mt-24">
        <div className="max-w-4xl">
          <p className="mb-3 text-sm text-white/70">
            Kaç m²? Sistemi seçin, malzeme listesini ve tahmini tutarı görün.
          </p>
          <QuickEstimate />
        </div>
      </div>
    </section>
  );
}
