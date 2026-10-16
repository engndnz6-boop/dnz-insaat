import { QuoteForm } from "@/components/contact/QuoteForm";

export function QuoteSection() {
  return (
    <section id="teklif" className="scroll-mt-24 bg-brand-soft py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Teklif ve keşif</p>
          <h2 className="home-heading mt-3">Projenizi birlikte planlayalım.</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-brand-mist">
            İhtiyacınızı anlatın, malzeme veya uygulama için size özel teklif
            hazırlayalım. Gerekirse yerinde keşif için randevu oluşturalım.
          </p>
        </div>
        <QuoteForm compact />
      </div>
    </section>
  );
}
