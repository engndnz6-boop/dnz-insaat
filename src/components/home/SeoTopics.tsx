import Link from "next/link";
import { brand } from "@/lib/brand";

const topics = [
  {
    title: "Alçıpan, alçı, boya & profil",
    text: "Alçıpan, alçı, boya, galvaniz profil, kutu profil, ABS ve UMS profil satışı.",
    href: "/katalog",
  },
  {
    title: "Asma tavan sistemleri",
    text: "Clip-in, petek, karolam, taşyünü, vinil asma tavan ve plastik lambiri.",
    href: "/katalog",
  },
  {
    title: "Duvar, seramik & parke",
    text: "Bölme duvar, alçıpan giydirme duvar, seramik, parke ve genel malzeme.",
    href: "/katalog",
  },
  {
    title: "Tadilat & tamirat",
    text: "Ev, okul ve ofis tadilatı; elektrik / su tamiratı, kombi yedek parça, anahtar teslim.",
    href: "/iletisim",
  },
];

/** Arama motorları ve ziyaretçiler için anahtar kelime odaklı içerik */
export function SeoTopics() {
  return (
    <section className="border-y border-black/5 bg-white py-14 sm:py-16">
      <div className="container-page">
        <p className="section-kicker text-center">DNZ İnşaat malzemeleri</p>
        <h2 className="mt-2 text-center section-title">
          Ne arıyorsanız buradan ulaşın
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-brand-mist">
          Alçıpan, profil, alçı, boya, asma tavan, karolam tavan, petek asma
          tavan, clipin asma tavan, taşyünü ve vinil asma tavan, plastik
          lambiri, bölme duvar, alçıpan giydirme duvar, seramik, parke, malzeme,
          yedek parça, kombi parçası, elektrik ve su tamiratı, ev–okul–ofis
          tadilatı ve anahtar teslim için DNZ İnşaat — Ankara Gölbaşı.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="border border-black/10 bg-brand-ink p-5 transition hover:border-brand-navy/40"
            >
              <h3 className="font-sans text-base font-bold text-brand-navy">
                {t.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-mist">
                {t.text}
              </p>
            </Link>
          ))}
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-2" aria-label="Arama konuları">
          {brand.keywords.map((kw) => (
            <li key={kw}>
              <Link
                href="/katalog"
                className="inline-block border border-black/10 bg-white px-3 py-1.5 text-xs text-brand-mist transition hover:border-brand-navy/30 hover:text-brand-navy"
              >
                {kw}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/katalog" className="btn-primary">
            Ürün kataloğu
          </Link>
          <Link href="/hesaplama" className="btn-secondary">
            Metraj hesapla
          </Link>
          <Link href="/iletisim" className="btn-ghost">
            Teklif al
          </Link>
        </div>
      </div>
    </section>
  );
}
