"use client";

import { useMemo, useState } from "react";
import type { Product, Project } from "@/lib/types";
import { useProducts } from "@/lib/products-context";
import { ProductImage } from "@/components/product/ProductImage";

function productToProject(p: Product): Project {
  const after = p.images[0] || "";
  const before = p.images[1] || p.images[0] || "";
  return {
    id: p.id,
    title: p.name,
    location: p.projectLocation || "Ankara",
    category: p.projectCategory || "İmalat",
    beforeImage: before,
    afterImage: after,
    description: p.shortDescription || p.description,
  };
}

function BeforeAfterCard({ project }: { project: Project }) {
  const [pos, setPos] = useState(50);
  const hasPair =
    Boolean(project.beforeImage) &&
    Boolean(project.afterImage) &&
    project.beforeImage !== project.afterImage;

  return (
    <article className="group overflow-hidden border border-black/5 bg-brand-anthracite shadow-soft">
      <div className="relative aspect-[4/3] select-none overflow-hidden">
        {hasPair ? (
          <>
            <ProductImage
              src={project.afterImage}
              alt={`${project.title} — sonra`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${pos}%` }}
            >
              <div
                className="relative h-full"
                style={{ width: `${10000 / pos}%` }}
              >
                <ProductImage
                  src={project.beforeImage}
                  alt={`${project.title} — önce`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-brand-gold"
              style={{ left: `${pos}%` }}
            >
              <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-brand-gold bg-[#151920] text-[10px] font-bold text-brand-gold">
                ↔
              </span>
            </div>

            <input
              type="range"
              min={5}
              max={95}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              className="before-after-range absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
              aria-label="Öncesi sonrası karşılaştırma"
            />

            <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90">
              Önce
            </span>
            <span className="absolute right-3 top-3 bg-brand-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#151920]">
              Sonra
            </span>
          </>
        ) : (
          <ProductImage
            src={project.afterImage || project.beforeImage}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
          {project.category} · {project.location}
        </p>
        <h3 className="mt-2 font-display text-xl text-brand-bone">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-mist">
          {project.description}
        </p>
      </div>
    </article>
  );
}

export function FeaturedProjects({
  projects: seedProjects = [],
}: {
  projects?: Project[];
}) {
  const { getProjects, ready } = useProducts();
  const items = useMemo(() => {
    const fromAdmin = getProjects().map(productToProject);
    const seedIds = new Set(fromAdmin.map((p) => p.id));
    const seeds = seedProjects.filter((p) => !seedIds.has(p.id));
    return [...fromAdmin, ...seeds];
  }, [getProjects, seedProjects]);

  return (
    <section id="projeler" className="container-page scroll-mt-24 py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="section-kicker">Projeler</p>
        <h2 className="section-title mt-3">Yaptığımız işler</h2>
        <p className="section-subtitle">
          Alçıpan asma tavan, bölme duvar ve tadilat imalatlarından örnekler.
          Admin’den “İmalat / proje” olarak eklenen kayıtlar burada listelenir.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!ready
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse bg-brand-anthracite"
              />
            ))
          : items.map((project) => (
              <BeforeAfterCard key={project.id} project={project} />
            ))}
      </div>
    </section>
  );
}
