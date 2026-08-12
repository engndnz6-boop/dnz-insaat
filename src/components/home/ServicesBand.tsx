import Link from "next/link";
import { Calculator, Package, FileSpreadsheet } from "lucide-react";

const items = [
  {
    title: "Analiz & maliyet hesaplama",
    text: "Oda en × boy veya m² girin; yaklaşık maliyet için teklif alın.",
    href: "/hesaplama",
    icon: Calculator,
    cta: "Hesaplamaya git",
  },
  {
    title: "Malzeme satışı",
    text: "Alçıpan, profil, taşyünü, karolam, clip-in ve aksesuarları katalogdan inceleyin.",
    href: "/katalog",
    icon: Package,
    cta: "Kataloğu aç",
  },
  {
    title: "PDF fiyat / teknik doküman",
    text: "Ürün teknik PDF’leri ve katalog dosyalarını indirin.",
    href: "/kataloglar",
    icon: FileSpreadsheet,
    cta: "Dokümanlar",
  },
];

export function ServicesBand() {
  return (
    <section className="border-y border-black/5 bg-white py-14 sm:py-16">
      <div className="container-page">
        <p className="section-kicker text-center">Hizmetler</p>
        <h2 className="mt-2 text-center section-title">
          Hesaplama, analiz ve malzeme satışı
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-brand-mist">
          Ulaş tarzı pratik araçlar: metraj hesapla, malzemeyi seç, teklif al.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border border-black/10 bg-brand-ink p-6 transition hover:border-brand-navy/40 hover:shadow-soft"
            >
              <item.icon className="h-8 w-8 text-brand-navy transition group-hover:text-brand-gold" />
              <h3 className="mt-4 font-sans text-lg font-bold text-brand-bone">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-mist">
                {item.text}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-navy group-hover:text-brand-gold">
                {item.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
