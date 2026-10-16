"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product, Project } from "@/lib/types";
import { useProducts } from "@/lib/products-context";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductVideo } from "@/components/product/ProductVideo";

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
    videoUrl: p.videoUrl || "",
    works: p.projectWorks || "",
    materials: p.projectMaterials || "",
    status: p.projectStatus || "",
  };
}

function BeforeAfterCard({
  project,
  slug,
}: {
  project: Project;
  slug?: string;
}) {
  const [pos, setPos] = useState(50);
  const [showVideo, setShowVideo] = useState(false);
  const hasPair =
    Boolean(project.beforeImage) &&
    Boolean(project.afterImage) &&
    project.beforeImage !== project.afterImage;
  const hasVideo = Boolean(project.videoUrl);

  return (
    <article className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-red">
      <div className="relative aspect-[4/3] select-none overflow-hidden bg-brand-steel/40">
        {showVideo && hasVideo ? (
          <ProductVideo
            url={project.videoUrl!}
            title={project.title}
            className="absolute inset-0 aspect-auto h-full border-0"
          />
        ) : hasPair ? (
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
        <p className="text-sm font-medium text-brand-gold">
          {project.category}, {project.location}
        </p>
        <h3 className="mt-1.5 text-lg font-bold text-brand-bone">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-mist">
          {project.description}
        </p>
        {project.works || project.materials || project.status ? (
          <dl className="mt-3 space-y-1 text-xs">
            {project.works ? (
              <div className="flex gap-2">
                <dt className="shrink-0 text-brand-mist">Uygulanan işler:</dt>
                <dd className="text-brand-bone">{project.works}</dd>
              </div>
            ) : null}
            {project.materials ? (
              <div className="flex gap-2">
                <dt className="shrink-0 text-brand-mist">Malzemeler:</dt>
                <dd className="text-brand-bone">{project.materials}</dd>
              </div>
            ) : null}
            {project.status ? (
              <div className="flex gap-2">
                <dt className="shrink-0 text-brand-mist">Durum:</dt>
                <dd className="font-semibold text-emerald-700">{project.status}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {hasVideo ? (
            <button
              type="button"
              onClick={() => setShowVideo((v) => !v)}
              className="bg-brand-gold px-3 py-1.5 text-xs font-semibold text-[#151920] transition hover:bg-brand-gold-light"
            >
              {showVideo ? "Fotoğrafa dön" : "Videoyu izle"}
            </button>
          ) : null}
          {slug ? (
            <Link
              href={`/urun/${slug}`}
              className="border border-black/10 px-3 py-1.5 text-xs font-semibold text-brand-mist transition hover:text-brand-bone"
            >
              Detay
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function FeaturedProjects({
  projects: seedProjects = [],
  limit,
  asPage = false,
}: {
  projects?: Project[];
  /** Ana sayfada gösterilecek en fazla proje */
  limit?: number;
  /** Projelerimiz sayfası: başlık h1, buton yok */
  asPage?: boolean;
}) {
  const { getProjects, ready } = useProducts();
  const items = useMemo(() => {
    const fromAdmin = getProjects();
    const mapped = fromAdmin.map((p) => ({
      project: productToProject(p),
      slug: p.slug,
    }));
    // Admin’de en az bir proje varsa yalnızca gerçek projeler gösterilir;
    // örnek (seed) projeler sadece hiç proje yokken yer tutucu olarak çıkar.
    const all =
      mapped.length > 0
        ? mapped
        : seedProjects.map((p) => ({ project: p, slug: undefined as string | undefined }));
    return limit ? all.slice(0, limit) : all;
  }, [getProjects, seedProjects, limit]);

  return (
    <section id="projeler" className="container-page scroll-mt-24 py-20 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {asPage ? (
            <h1 className="home-heading">Projelerimiz</h1>
          ) : (
            <h2 className="home-heading">Kalitemiz, ortaya çıkardığımız işlerde.</h2>
          )}
          <p className="mt-3 text-base leading-relaxed text-brand-mist sm:text-lg">
            {asPage
              ? "Kalitemiz, ortaya çıkardığımız işlerde. Tamamlanan projelerden gerçek fotoğraflar ve uygulama detayları."
              : "Tamamlanan projelerden gerçek fotoğraflar ve uygulama detayları. Önce ve sonrayı görmek için çizgiyi kaydırın."}
          </p>
        </div>
        {!asPage ? (
          <Link href="/projelerimiz" className="btn-light shrink-0 px-5 py-3">
            Projelerimizi keşfet
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {!ready
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse bg-brand-anthracite"
              />
            ))
          : items.map(({ project, slug }) => (
              <BeforeAfterCard
                key={project.id}
                project={project}
                slug={slug}
              />
            ))}
      </div>
    </section>
  );
}
