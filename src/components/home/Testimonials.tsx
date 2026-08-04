import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="border-y border-black/5 bg-brand-anthracite/60 py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="section-kicker">Referanslar</p>
          <h2 className="section-title mt-3">Müşteri Yorumları</h2>
          <p className="section-subtitle">
            Mimarlar, müteahhitler ve ev sahiplerinden gelen gerçek geri
            bildirimler.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <blockquote
              key={item.id}
              className="flex flex-col border border-black/5 bg-brand-ink/40 p-6 opacity-0 animate-fade-up"
              style={{
                animationDelay: `${0.1 + index * 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex gap-0.5 text-brand-gold">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-bone/85">
                “{item.quote}”
              </p>
              <footer className="mt-6 border-t border-black/5 pt-4">
                <cite className="not-italic">
                  <span className="block text-sm font-semibold text-brand-bone">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-brand-mist">
                    {item.role} · {item.company}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
