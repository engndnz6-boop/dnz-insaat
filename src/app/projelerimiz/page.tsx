import type { Metadata } from "next";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projelerimiz: Tamamlanan Asma Tavan, Tadilat ve Uygulama İşleri",
  description:
    "DNZ İnşaat Malzemeleri’nin Ankara ve Gölbaşı’nda tamamladığı asma tavan, bölme duvar, tadilat ve dekorasyon projelerinden gerçek fotoğraflar.",
  alternates: { canonical: "/projelerimiz" },
};

export default function ProjelerimizPage() {
  return (
    <div className="bg-brand-soft">
      <FeaturedProjects projects={projects} asPage />
    </div>
  );
}
