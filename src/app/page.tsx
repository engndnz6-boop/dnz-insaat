import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { WhyDnz } from "@/components/home/WhyDnz";
import { MissionBand } from "@/components/home/MissionBand";
import { QuoteSection } from "@/components/home/QuoteSection";
import { ContactBand } from "@/components/home/ContactBand";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <ServicesSection />
      <FeaturedProducts />
      <FeaturedProjects projects={projects} limit={3} />
      <WhyDnz />
      <MissionBand />
      <QuoteSection />
      <ContactBand />
    </>
  );
}
