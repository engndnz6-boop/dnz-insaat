import { Hero } from "@/components/home/Hero";
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
      <FeaturedProjects projects={projects} />
      <FeaturedProducts />
      <Testimonials items={testimonials} />

      <section className="container-page py-20 sm:py-24">
        <div className="relative overflow-hidden border border-brand-gold/20 bg-brand-anthracite px-8 py-14 sm:px-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl text-brand-bone sm:text-4xl">
              Projeniz için teklif alın
            </h2>
            <p className="mt-3 text-brand-mist">
              Asma tavan, ışık bandı, bölme duvar uygulaması veya toplu malzeme
              alımı için DNZ İnşaat ile iletişime geçin.
            </p>
            <Link href="/iletisim" className="btn-primary mt-8">
              Teklif Formuna Git
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
