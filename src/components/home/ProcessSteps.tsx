import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

const steps = [
  {
    title: "Sistemi seçin",
    text: "Alçıpan, clip-in, taşyünü, karolam ya da bölme duvar. Kararsızsanız birlikte seçelim.",
    href: "/katalog",
    cta: "Ürünlere bak",
  },
  {
    title: "Metrajı hesaplayın",
    text: "Oda ölçüsünü ya da m²’yi girin; plaka, profil ve aksesuar listesi tahmini tutarıyla çıksın.",
    href: "/hesaplama",
    cta: "Hesaplamaya git",
  },
  {
    title: "Teklifinizi alın",
    text: "Listeyi WhatsApp’tan gönderin ya da formu doldurun; size net fiyatı iletelim.",
    href: "/iletisim",
    cta: "Teklif iste",
  },
  {
    title: "Teslimat ya da montaj",
    text: "Malzemeyi mağazadan alın, şantiyenize gönderelim ya da ekibimiz uygulasın.",
    href: "/iletisim",
    cta: "Bize ulaşın",
  },
];

const stats = [
  { value: "10+", label: "yıllık tecrübe" },
  { value: "500+", label: "tamamlanan proje" },
  { value: "7", label: "ürün grubu" },
];

export function ProcessSteps() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <h2 className="home-heading">Ölçüden montaja dört adım</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-brand-mist">
              İster sadece malzeme alın, ister anahtar teslim yaptırın. Süreç
              her iki durumda da aynı netlikte ilerler.
            </p>

            <dl className="mt-10 grid grid-cols-3 border-t border-black/10">
              {stats.map((s) => (
                <div key={s.label} className="pt-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="type-wide text-3xl font-bold tabular-nums text-brand-navy sm:text-4xl">
                    {s.value}
                  </dd>
                  <dd className="mt-1 text-sm text-brand-mist">{s.label}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/kataloglar"
              className="mt-10 flex items-center gap-4 border border-black/10 p-4 transition hover:border-brand-navy/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand-paper text-brand-navy">
                <FileText className="h-5 w-5" />
              </span>
              <span className="text-sm leading-snug">
                <span className="block font-semibold text-brand-bone">
                  Teknik dokümanlar ve kataloglar
                </span>
                <span className="text-brand-mist">
                  Ürün föylerini PDF olarak indirin
                </span>
              </span>
            </Link>
          </div>

          <ol className="relative grid gap-px bg-black/10 sm:grid-cols-2">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-white">
                <Link
                  href={step.href}
                  className="group flex h-full flex-col p-6 transition hover:bg-brand-paper sm:p-8"
                >
                  <span className="type-wide text-5xl font-bold leading-none text-brand-steel transition group-hover:text-brand-gold">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-brand-bone">
                    {step.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-brand-mist">
                    {step.text}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
                    {step.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
