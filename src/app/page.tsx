import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ServicesBand } from "@/components/home/ServicesBand";
import { SeoTopics } from "@/components/home/SeoTopics";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Testimonials } from "@/components/home/Testimonials";
import { projects } from "@/lib/data/projects";
import { testimonials } from "@/lib/data/testimonials";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SeoTopics />
      <ServicesBand />
      <CategoryShowcase />
      <StatsStrip />
      <ProcessSteps />
      <FeaturedProducts />
      <FeaturedProjects projects={projects} />
      <Testimonials items={testimonials} />

      <section className="container-page py-16 sm:py-20">
        <div className="bg-brand-navy px-8 py-14 sm:px-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              İletişim
            </p>
            <h2 className="mt-3 font-sans text-3xl font-bold text-white sm:text-4xl">
              Projeniz için teklif alın
            </h2>
            <p className="mt-3 text-white/75">
              Alçıpan, galvaniz profil, clip-in asma tavan, taşyünü, metal /
              plastik tavan veya bölme duvar için DNZ İnşaat ile iletişime
              geçin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/hesaplama"
                className="inline-flex bg-brand-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-gold-light"
              >
                Maliyet Hesapla
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Teklif Formu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
