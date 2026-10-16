import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brand } from "@/lib/brand";

/** Ana sayfa: misyon özeti ve slogan, Kurumsal sayfasına bağlantı */
export function MissionBand() {
  return (
    <section className="bg-brand-paper py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-8 rounded-xl border border-black/10 bg-white p-7 shadow-red sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Misyonumuz</p>
            <h2 className="type-wide mt-3 text-[1.7rem] font-bold leading-tight text-brand-navy sm:text-[2.1rem]">
              Her projeye güven, her detaya kalite katmak.
            </h2>
          </div>
          <div>
            <p className="leading-relaxed text-brand-bone/80">
              İnşaat malzemesi tedarikinden profesyonel uygulamaya, sıfırdan yapı
              projelerinden tadilat ve dekorasyona kadar tüm ihtiyaçları tek çatı
              altında karşılıyoruz. Kaliteli malzeme, titiz işçilik ve dürüst
              hizmetle projeleri zamanında ve uzun ömürlü çözümlerle hayata
              geçiriyoruz.
            </p>
            <p className="mt-4 font-semibold text-brand-navy">{brand.slogan}</p>
            <Link href="/hakkimizda" className="btn-light mt-6 px-5 py-3">
              Misyon, vizyon ve değerlerimiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
