import Link from "next/link";
import { Calculator, FileCheck, Layers } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Sistemini seç",
    text: "Asma tavan, ışık bandı veya bölme duvar için uygun sistemi belirleyin.",
    icon: Layers,
    href: "/katalog",
  },
  {
    n: "02",
    title: "Çözümünü bul",
    text: "Malzeme ve uygulama seçeneklerini kataloğumuzdan inceleyin.",
    icon: FileCheck,
    href: "/kataloglar",
  },
  {
    n: "03",
    title: "Teklif al",
    text: "Projenize özel metraj ve fiyat teklifi için bize ulaşın.",
    icon: Calculator,
    href: "/iletisim",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="bg-brand-navy px-6 py-4 sm:px-8">
          <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Projede kolaylık
          </h2>
        </div>
        <div className="grid border border-t-0 border-black/10 bg-white lg:grid-cols-3">
          {steps.map((step) => (
            <Link
              key={step.n}
              href={step.href}
              className="group border-b border-black/10 p-7 transition hover:bg-brand-ink last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-bold tracking-[0.2em] text-brand-navy/40">
                  {step.n}
                </span>
                <step.icon className="h-7 w-7 text-brand-navy transition group-hover:text-brand-gold" />
              </div>
              <h3 className="mt-5 font-sans text-lg font-bold uppercase tracking-wide text-brand-bone">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-mist">
                {step.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
