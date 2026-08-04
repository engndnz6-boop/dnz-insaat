import Link from "next/link";

const topics = [
  {
    title: "Alçıpan & galvaniz profil",
    text: "Alçıpan plaka, UW/CW ve tavan C (CD) galvaniz profil, askı ve aksesuar satışı.",
    href: "/katalog",
  },
  {
    title: "Clip-in / klipin asma tavan",
    text: "Clipin (klipin) metal asma tavan panelleri, ray ve taşıyıcı sistemler.",
    href: "/katalog",
  },
  {
    title: "Taşyünü, metal ve plastik tavan",
    text: "Taşyünü tavan, metal tavan, plastik tavan ve karolam asma tavan çözümleri.",
    href: "/katalog",
  },
  {
    title: "Bölme duvar",
    text: "Alçıpan bölme duvar malzemeleri, profil ve yalıtım dolguları.",
    href: "/katalog",
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
          Alçıpan yazan, profil veya galvaniz profil arayan, clip-in / klipin asma
          tavan, taşyünü tavan, metal tavan, plastik tavan ya da bölme duvar
          arayan herkes DNZ İnşaat üzerinden ürün, metraj ve teklife ulaşabilir.
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
