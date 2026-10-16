import { CheckCircle2 } from "lucide-react";

const reasons = [
  { title: "Malzeme ve uygulama tek çatı altında", text: "Ürünü alın, ister kendiniz uygulayın ister ekibimize bırakın." },
  { title: "İhtiyaca uygun ürün seçenekleri", text: "Bütçenize ve projenize uygun malzemeyi birlikte seçelim." },
  { title: "Projeye özel çözüm ve teklif", text: "Ölçü ve ihtiyaca göre metraj çıkarıp size özel teklif hazırlarız." },
  { title: "Titiz işçilik ve müşteri odaklı hizmet", text: "Keşiften teslime kadar her aşamada yanınızdayız." },
];

const stats = [
  { value: "10+", label: "yıllık tecrübe" },
  { value: "500+", label: "tamamlanan proje" },
  { value: "7", label: "ürün grubu" },
];

export function WhyDnz() {
  return (
    <section className="bg-brand-soft py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Neden DNZ İnşaat?</p>
          <h2 className="home-heading mt-3">Her aşamada yanınızda olan çözüm ortağınız.</h2>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="type-wide text-2xl font-bold text-brand-navy sm:text-3xl">{s.value}</dd>
                <dd className="mt-1 text-sm text-brand-mist">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {reasons.map((r) => (
            <li key={r.title} className="rounded-lg border border-black/5 bg-white p-6 shadow-red">
              <CheckCircle2 className="h-6 w-6 text-brand-gold" aria-hidden />
              <h3 className="mt-3 font-bold leading-snug text-brand-navy">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-mist">{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
