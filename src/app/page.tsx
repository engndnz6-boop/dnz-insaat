import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Testimonials } from "@/components/home/Testimonials";
import { SeoTopics } from "@/components/home/SeoTopics";
import { ContactBand } from "@/components/home/ContactBand";
import { MissionBand } from "@/components/home/MissionBand";
import { projects } from "@/lib/data/projects";
import { testimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <ProcessSteps />
      <FeaturedProducts />
      <FeaturedProjects projects={projects} />
      <MissionBand />
      <Testimonials items={testimonials} />
      <SeoTopics />
      <ContactBand />
    </>
  );
}
