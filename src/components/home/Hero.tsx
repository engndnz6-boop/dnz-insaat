"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings-context";
import { useImalat } from "@/lib/imalat/context";
import { brand } from "@/lib/brand";
import { CeilingDrawing } from "./CeilingDrawing";

function QuickEstimate() {
  const { systems } = useImalat();
  const [systemId, setSystemId] = useState("");
  const [m2, setM2] = useState("");

  const selected = systemId || systems[0]?.id || "";
  const href = useMemo(() => {
    const params = new URLSearchParams();
    if (selected) params.set("sistem", selected);
    const area = Number(m2.replace(",", "."));
    if (area > 0) params.set("m2", String(area));
    const q = params.toString();
    return q ? `/imalat-sistemleri?${q}` : "/imalat-sistemleri";
  }, [selected, m2]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-px overflow-hidden rounded-lg border border-black/10 bg-white shadow-red sm:grid-cols-[1.3fr_0.7fr_auto] sm:items-center"
      aria-label="Hızlı metraj hesabı"
    >
      <label className="flex flex-col border-b border-black/10 bg-white px-5 py-3.5 sm:border-b-0 sm:border-r">
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
      <label className="flex flex-col border-b border-black/10 bg-white px-5 py-3.5 sm:border-b-0 sm:border-r">
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
        className="btn-gold m-1.5 px-7 py-3.5"
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
    <section className="relative bg-gradient-to-b from-[#E8F4F3] via-[#DCEEEE] to-[#C8E2E5]">
      {/* İnce modül çizgileri: 60 cm karo ritmi */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0B2C5E 1px, transparent 1px)",
          backgroundSize: "120px 100%",
        }}
      />

      <div className="container-page relative grid items-center gap-8 pb-28 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-10 lg:pb-36 lg:pt-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-brand-gold">
            {settings.companyName.toLocaleUpperCase("tr")} | GÖLBAŞI / ANKARA
          </p>
          <h1 className="type-wide mt-5 text-[2.1rem] font-bold leading-[1.06] tracking-[-0.02em] text-brand-navy sm:text-[2.9rem] lg:text-[3.25rem]">
            Hayalinizdeki yapı, tek adreste.
            <span className="mt-2 block text-[1.35rem] font-semibold leading-snug tracking-normal text-brand-bone/60 sm:text-[1.7rem] lg:text-[1.9rem]">
              Baştan sona DNZ güvencesiyle.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-brand-bone/80 sm:text-lg">
            Sıfırdan inşaat, komple tadilat, tamirat ve dekorasyon… İhtiyacınız
            olan tüm inşaat malzemeleri ve profesyonel uygulama hizmetleri tek
            çatı altında.
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-brand-mist">
            Malzemeden ustalığa, projeden son dokunuşa kadar her aşamada
            yanınızdayız.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/#hizmetler"
              className="btn-gold px-6 py-3.5"
            >
              Hizmetlerimizi keşfedin
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/iletisim"
              className="btn-light px-6 py-3.5"
            >
              Teklif alın
            </Link>
          </div>

          <a
            href={`tel:${brand.phoneTel}`}
            className="mt-8 inline-flex items-center gap-3 text-brand-bone/80 transition hover:text-brand-navy"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-navy/20 text-brand-navy">
              <Phone className="h-4 w-4" />
            </span>
            <span className="text-sm">
              Projenizi birlikte planlayalım. Hemen arayın:{" "}
              <span className="whitespace-nowrap font-semibold tabular-nums text-brand-navy">
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
          <p className="mb-3 text-sm text-brand-mist">
            Kaç m²? Sistemi seçin, malzeme listesini ve tahmini tutarı görün.
          </p>
          <QuickEstimate />
        </div>
      </div>
    </section>
  );
}
