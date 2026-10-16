import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { services } from "@/lib/services";
import { ServiceIcon } from "./ServiceIcon";

export function ServicesSection() {
  return (
    <section id="hizmetler" className="scroll-mt-24 bg-brand-soft py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="home-heading">Sadece malzeme değil, eksiksiz çözüm.</h2>
            <p className="mt-3 text-base leading-relaxed text-brand-mist sm:text-lg">
              Malzeme tedarikinden uygulamaya kadar ihtiyaç duyduğunuz çözümleri
              tek çatı altında planlayın.
            </p>
          </div>
          <Link href="/hizmetlerimiz" className="btn-light shrink-0 px-5 py-3">
            Hizmetlerimizi incele
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/hizmetlerimiz#${s.slug}`}
                className="group flex h-full gap-4 rounded-lg border border-black/5 bg-white p-6 shadow-red transition hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand-navy text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-lg font-bold leading-snug text-brand-navy">{s.title}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-brand-mist">{s.short}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/imalat-sistemleri"
          className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-brand-gold/30 bg-white/70 px-6 py-4 text-sm transition hover:border-brand-gold"
        >
          <span className="flex items-center gap-3">
            <Calculator className="h-5 w-5 text-brand-gold" />
            <span>
              <strong className="text-brand-navy">Asma tavan ya da bölme duvar mı yaptıracaksınız?</strong>{" "}
              <span className="text-brand-mist">Ölçünüzü girin, malzeme listesi ve tahmini tutar hemen çıksın.</span>
            </span>
          </span>
          <span className="font-semibold text-brand-gold">İmalat sistemleri →</span>
        </Link>
      </div>
    </section>
  );
}
