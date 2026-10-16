"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileDown } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductVideo } from "@/components/product/ProductVideo";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppInquiryButton } from "@/components/product/WhatsAppInquiryButton";
import { useProducts } from "@/lib/products-context";
import { useCatalog } from "@/lib/catalog-context";
import { openPdf } from "@/lib/pdf-storage";
import { MATERIAL_LABELS, formatPrice, productSpecRows } from "@/lib/utils";

export function ProductPageClient() {
  const params = useParams<{ slug: string }>();
  const { getBySlug, ready } = useProducts();
  const { getCategory } = useCatalog();
  const product = getBySlug(params.slug);
  const category = product ? getCategory(product.categoryId) : undefined;

  if (!ready) {
    return (
      <div className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse bg-brand-anthracite" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse bg-brand-anthracite" />
            <div className="h-24 animate-pulse bg-brand-anthracite" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="section-title">Ürün bulunamadı</h1>
        <Link href="/katalog" className="btn-primary mt-8">
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  const specRows = productSpecRows(product);
  const categoryHref = category?.slug
    ? `/kategori/${category.slug}`
    : "/katalog";

  return (
    <div className="container-page py-10 sm:py-16">
      <nav className="mb-8 text-xs text-brand-mist" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-gold">
          Ana Sayfa
        </Link>
        <span className="mx-2">/</span>
        <Link href={categoryHref} className="hover:text-brand-gold">
          {category?.name || "Katalog"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-bone">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-4">
          <ProductGallery images={product.images} name={product.name} />
          {product.videoUrl ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Video
              </p>
              <ProductVideo url={product.videoUrl} title={product.name} />
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            {product.kind === "project"
              ? [product.projectCategory || "İmalat", product.projectLocation]
                  .filter(Boolean)
                  .join(" · ")
              : [
                  category?.name,
                  product.subcategoryId
                    ? getCategory(product.subcategoryId)?.name
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || MATERIAL_LABELS[product.material]}
          </p>
          <h1 className="mt-3 font-display text-3xl text-brand-bone sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-brand-mist sm:text-base">
            {product.description}
          </p>

          {product.kind === "project" ? (
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-gold">
              İmalat / proje örneği
            </p>
          ) : (
            <p className="mt-6 font-display text-3xl text-brand-gold">
              {formatPrice(product.price)}
              <span className="ml-2 font-sans text-sm font-normal text-brand-mist">
                / birim · KDV hariç
              </span>
            </p>
          )}

          {product.kind !== "project" && specRows.length > 0 ? (
            <dl className="mt-6 divide-y divide-black/5 border-y border-black/10 text-sm">
              {specRows.map((r) => (
                <div key={r.label} className="grid grid-cols-[9rem_1fr] gap-4 py-2.5">
                  <dt className="text-brand-mist">{r.label}</dt>
                  <dd className="font-medium text-brand-bone">{r.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {product.kind !== "project" && (
            <p className={`mt-4 inline-block px-3 py-1 text-xs font-semibold ${product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {product.inStock ? "Stokta" : "Tükendi"}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {product.kind !== "project" && (
              <AddToCartButton product={product} />
            )}
            <WhatsAppInquiryButton productName={product.name} />
          </div>

          {(product.pdfStorageKey || product.pdfUrl) && (
            <button
              type="button"
              className="btn-ghost mt-4 px-0"
              onClick={() =>
                openPdf(product.pdfStorageKey || product.pdfUrl)
              }
            >
              <FileDown className="h-4 w-4" />
              PDF Teknik Doküman İndir
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
