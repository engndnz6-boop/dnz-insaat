"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/types";

function BeforeAfterCard({ project }: { project: Project }) {
  const [pos, setPos] = useState(50);

  return (
    <article className="group overflow-hidden border border-white/5 bg-brand-anthracite">
      <div className="relative aspect-[4/3] select-none overflow-hidden">
        <Image
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
          <div className="relative h-full" style={{ width: `${10000 / pos}%` }}>
            <Image
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
          <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-brand-gold bg-brand-ink text-[10px] font-bold text-brand-gold">
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

        <span className="absolute left-3 top-3 bg-brand-ink/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-mist">
          Önce
        </span>
        <span className="absolute right-3 top-3 bg-brand-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-ink">
          Sonra
        </span>
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

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section id="projeler" className="container-page scroll-mt-24 py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
          Öne Çıkan Projeler
        </p>
        <h2 className="section-title mt-3">Öncesi / Sonrası</h2>
        <p className="section-subtitle">
          Tamamladığımız konut, ofis ve dış cephe dönüşümlerinden seçkiler.
          Kaydırıcıyı sürükleyerek farkı görün.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <BeforeAfterCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
