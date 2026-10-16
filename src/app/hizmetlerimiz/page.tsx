import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/lib/services";
import { brand } from "@/lib/brand";
import { ServiceIcon } from "@/components/home/ServiceIcon";

export const metadata: Metadata = {
  title: "Hizmetlerimiz: İnşaat, Tadilat ve Uygulama | Gölbaşı Ankara",
  description:
    "Sıfırdan inşaat, komple tadilat, seramik ve fayans, elektrik ve su tesisatı, alçıpan ve asma tavan, parke ve dekorasyon uygulamaları. DNZ İnşaat Malzemeleri, Gölbaşı / Ankara.",
  alternates: { canonical: "/hizmetlerimiz" },
};

export default function HizmetlerimizPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#E8F4F3] to-[#CFE5E6]">
        <div className="container-page py-14 sm:py-20">
          <p className="text-sm font-semibold text-brand-gold">Hizmetlerimiz</p>
          <h1 className="type-wide mt-3 max-w-3xl text-[2rem] font-bold leading-tight text-brand-navy sm:text-5xl">
            Sadece malzeme değil, eksiksiz çözüm.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-bone/80">
            Malzeme tedarikinden uygulamaya kadar ihtiyaç duyduğunuz çözümleri
            tek çatı altında planlıyoruz. Gölbaşı merkezli olarak Ankara genelinde
            hizmet veriyoruz.
          </p>
        </div>
      </section>

      <section className="bg-brand-soft py-14 sm:py-20">
        <div className="container-page space-y-6">
          {services.map((s) => (
            <article
              key={s.slug}
              id={s.slug}
              className="scroll-mt-28 grid gap-6 rounded-lg border border-black/5 bg-white p-6 shadow-red sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,0.8fr)] lg:items-start lg:gap-10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-md bg-brand-navy text-white">
                <ServiceIcon name={s.icon} className="h-7 w-7" />
              </span>
              <div>
                <h2 className="type-wide text-2xl font-bold text-brand-navy">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-brand-bone/80">{s.long}</p>
              </div>
              <ul className="space-y-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-brand-bone">
                    <Check className="h-4 w-4 shrink-0 text-brand-gold" />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-brand-navy p-6 text-white shadow-red sm:p-8">
            <p className="type-wide text-xl font-bold sm:text-2xl">Projenizi birlikte planlayalım.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/iletisim" className="btn-gold px-6 py-3.5">
                Projem için teklif al
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`tel:${brand.phoneTel}`} className="btn-light px-6 py-3.5">
                {brand.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
