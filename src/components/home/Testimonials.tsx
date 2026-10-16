import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const [lead, ...rest] = items;

  return (
    <section className="bg-brand-night py-20 text-white sm:py-28">
      <div className="container-page">
        <h2 className="home-heading !text-white">Birlikte çalıştıklarımız ne diyor</h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <figure>
            <blockquote className="type-wide text-2xl font-semibold leading-snug text-white sm:text-[2rem]">
              “{lead.quote}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center bg-brand-gold text-base font-bold">
                {lead.name.charAt(0)}
              </span>
              <span>
                <span className="block font-semibold">{lead.name}</span>
                <span className="block text-sm text-white/60">
                  {lead.role}, {lead.company}
                </span>
              </span>
            </figcaption>
          </figure>

          <div className="space-y-8 border-white/10 lg:border-l lg:pl-12">
            {rest.map((item) => (
              <figure key={item.id}>
                <blockquote className="text-[15px] leading-relaxed text-white/80">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-3 text-sm">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-white/55">
                    , {item.role}, {item.company}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
