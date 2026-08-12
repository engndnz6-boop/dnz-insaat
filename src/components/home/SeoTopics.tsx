import Link from "next/link";
import { brand } from "@/lib/brand";

const topics = [
  {
    title: "Alçıpan, alçı, boya & profil",
    text: "Alçıpan, alçı, boya, galvaniz profil, kutu profil, ABS ve UMS profil satışı.",
    href: "/kategori/alcipan-asma-tavan-malzemeleri",
  },
  {
    title: "Asma tavan sistemleri",
    text: "Clip-in, petek, karolam, taşyünü, vinil asma tavan ve plastik lambiri.",
    href: "/kategori/clipin-petek-asma-tavan",
  },
  {
    title: "Duvar, seramik & parke",
    text: "Bölme duvar, alçıpan giydirme duvar, seramik, parke ve genel malzeme.",
    href: "/kategori/bolme-duvar-malzemeleri",
  },
  {
    title: "Tadilat & tamirat",
    text: "Ev, okul ve ofis tadilatı; elektrik / su tamiratı, kombi yedek parça, anahtar teslim.",
    href: "/kategori/ev-okul-ofis-tadilati",
  },
];

/** Arama motorları ve ziyaretçiler için anahtar kelime odaklı içerik */
export function SeoTopics() {
  return (
    <section className="border-y border-black/5 bg-white py-14 sm:py-16">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Ankara Gölbaşı
          </p>
          <h2 className="section-title mt-3">
            İnşaat Malzemeleri & Asma Tavan
          </h2>
          <p className="section-subtitle">
            {brand.name} — alçıpan, profil, asma tavan, bölme duvar, seramik,
            parke, elektrik ve su tesisatı malzemeleri; ev, okul ve ofis
            tadilatı.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group border border-black/10 bg-brand-ink/30 p-6 transition hover:border-brand-gold/40"
            >
              <h3 className="font-sans text-lg font-bold text-brand-bone group-hover:text-brand-navy">
                {t.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-mist">
                {t.text}
              </p>
              <span className="mt-4 inline-block text-xs font-semibold text-brand-gold">
                Detay →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {brand.keywords.slice(0, 24).map((kw) => (
            <Link
              key={kw}
              href="/katalog"
              className="border border-black/10 px-3 py-1.5 text-xs text-brand-mist transition hover:border-brand-gold/50 hover:text-brand-navy"
            >
              {kw}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
