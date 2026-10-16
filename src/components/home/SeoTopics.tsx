import Link from "next/link";
import { brand } from "@/lib/brand";

const topics = [
  {
    title: "Alçıpan, alçı, boya ve profil",
    items: ["Alçıpan plaka", "Alçı ve boya", "Galvaniz profil", "Kutu profil", "ABS ve UMS profil"],
    href: "/kategori/alcipan-asma-tavan-malzemeleri",
  },
  {
    title: "Asma tavan sistemleri",
    items: ["Clip-in / klipin", "Petek", "Karolam", "Taşyünü", "Vinil", "Plastik lambiri"],
    href: "/kategori/clipin-petek-asma-tavan",
  },
  {
    title: "Duvar, seramik ve parke",
    items: ["Alçıpan bölme duvar", "Alçıpan giydirme duvar", "Seramik", "Parke", "Genel malzeme"],
    href: "/kategori/bolme-duvar-malzemeleri",
  },
  {
    title: "Tadilat ve tamirat",
    items: ["Ev, okul ve ofis tadilatı", "Elektrik tamiratı", "Su tamiratı", "Kombi yedek parça", "Anahtar teslim"],
    href: "/kategori/ev-okul-ofis-tadilati",
  },
];

/** Arama motorları ve ziyaretçiler için hizmet dizini */
export function SeoTopics() {
  return (
    <section className="border-t border-black/5 bg-brand-paper py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <h2 className="type-wide text-2xl font-bold leading-tight text-brand-bone sm:text-[1.75rem]">
            Ankara Gölbaşı’nda inşaat malzemeleri ve asma tavan
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-brand-mist">
            {brand.name}; alçıpan, profil, asma tavan, bölme duvar, seramik,
            parke, elektrik ve su tesisatı malzemesi satar. Ev, okul ve ofis
            tadilatını anahtar teslim üstlenir.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-brand-mist">
            {brand.address}
            <br />
            {brand.hours.replace(" · ", ", ")}
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {topics.map((t) => (
            <div key={t.href} className="border-t-2 border-brand-navy pt-5">
              <h3 className="text-lg font-bold text-brand-bone">
                <Link href={t.href} className="transition hover:text-brand-gold">
                  {t.title}
                </Link>
              </h3>
              <ul className="mt-3 space-y-1.5">
                {t.items.map((item) => (
                  <li key={item}>
                    <Link
                      href={t.href}
                      className="text-[15px] text-brand-mist transition hover:text-brand-navy"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
