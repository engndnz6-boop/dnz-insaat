import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Handshake, Layers, ShieldCheck, Users } from "lucide-react";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Kurumsal: Misyonumuz, Vizyonumuz ve Değerlerimiz",
  description:
    "DNZ İnşaat Malzemeleri: inşaat malzemesi tedarikinden profesyonel uygulamaya, sıfırdan yapıdan tadilat ve dekorasyona tek çatı altında hizmet. Gölbaşı / Ankara.",
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  { icon: ShieldCheck, title: "Güven", text: "Her işte dürüstlük ve şeffaflık." },
  { icon: BadgeCheck, title: "Kalite", text: "Doğru malzeme, özenli işçilik." },
  { icon: Layers, title: "Çözüm odaklılık", text: "Malzemeden uygulamaya kadar tek noktadan hizmet." },
  { icon: Users, title: "Müşteri memnuniyeti", text: "Her projeye özel yaklaşım." },
  { icon: Handshake, title: "Süreklilik", text: "Uzun ömürlü işler ve kalıcı iş ilişkileri." },
];

export default function HakkimizdaPage() {
  return (
    <div>
      {/* Başlık */}
      <section className="bg-gradient-to-b from-[#E8F4F3] to-[#CFE5E6]">
        <div className="container-page py-16 sm:py-20">
          <p className="text-sm font-semibold tracking-wide text-brand-gold">
            {brand.name.toLocaleUpperCase("tr")} | KURUMSAL
          </p>
          <h1 className="type-wide mt-4 max-w-3xl text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-brand-navy sm:text-5xl">
            {brand.slogan}
          </h1>
        </div>
      </section>

      {/* Misyon ve vizyon */}
      <section className="bg-brand-soft py-16 sm:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-black/10 bg-white p-7 shadow-red sm:p-10">
            <h2 className="text-sm font-semibold text-brand-gold">Misyonumuz</h2>
            <p className="type-wide mt-3 text-2xl font-bold leading-snug text-brand-navy sm:text-[1.7rem]">
              Her projeye güven, her detaya kalite katmak.
            </p>
            <p className="mt-5 leading-relaxed text-brand-bone/80">
              DNZ İnşaat olarak; inşaat malzemeleri tedarikinden profesyonel
              uygulamaya, sıfırdan yapı projelerinden tadilat ve dekorasyona
              kadar tüm ihtiyaçları tek çatı altında karşılamayı amaçlıyoruz.
              Kaliteli malzeme, titiz işçilik, dürüst hizmet ve müşteri
              memnuniyetini esas alarak projeleri zamanında, güvenilir ve uzun
              ömürlü çözümlerle hayata geçiriyoruz.
            </p>
          </article>

          <article className="rounded-lg border border-black/10 bg-white p-7 shadow-red sm:p-10">
            <h2 className="text-sm font-semibold text-brand-gold">Vizyonumuz</h2>
            <p className="type-wide mt-3 text-2xl font-bold leading-snug text-brand-navy sm:text-[1.7rem]">
              İnşaat ve yaşam alanlarında güvenin ilk adresi olmak.
            </p>
            <p className="mt-5 leading-relaxed text-brand-bone/80">
              DNZ İnşaat olarak; yenilikçi yaklaşımımız, geniş ürün yelpazemiz
              ve profesyonel uygulama hizmetlerimizle Ankara’dan başlayarak
              Türkiye genelinde tercih edilen, güvenilir ve öncü bir marka
              olmayı hedefliyoruz. Kaliteyi, estetiği ve teknolojiyi bir araya
              getirerek insanların yaşam alanlarına değer katmak ve sektörde
              kalıcı bir güven oluşturmak istiyoruz.
            </p>
          </article>
        </div>
      </section>

      {/* Değerler */}
      <section className="bg-brand-paper py-16 sm:py-20">
        <div className="container-page">
          <h2 className="home-heading">Kurumsal değerlerimiz</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <li key={v.title} className="rounded-lg border border-black/10 bg-white p-6 shadow-red">
                <v.icon className="h-7 w-7 text-brand-gold" aria-hidden />
                <h3 className="mt-4 text-lg font-bold text-brand-navy">{v.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-brand-mist">{v.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/iletisim" className="btn-gold px-6 py-3.5">
              Teklif alın
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/katalog" className="btn-light px-6 py-3.5">
              Ürünleri inceleyin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
