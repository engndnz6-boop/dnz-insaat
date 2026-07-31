"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileDown } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { TechnicalSpecsTable } from "@/components/product/TechnicalSpecs";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppInquiryButton } from "@/components/product/WhatsAppInquiryButton";
import { useProducts } from "@/lib/products-context";
import { useCatalog } from "@/lib/catalog-context";
import { openPdf } from "@/lib/pdf-storage";
import {
  COLOR_LABELS,
  MATERIAL_LABELS,
  USAGE_LABELS,
  formatPrice,
} from "@/lib/utils";

export default function ProductPage() {
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

  return (
    <div className="container-page py-10 sm:py-16">
      <nav className="mb-8 text-xs text-brand-mist">
        <Link href="/" className="hover:text-brand-gold">
          Ana Sayfa
        </Link>
        <span className="mx-2">/</span>
        <Link href="/katalog" className="hover:text-brand-gold">
          Katalog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-bone">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            {[
              category?.name,
              product.subcategoryId
                ? getCategory(product.subcategoryId)?.name
                : null,
              product.brand,
            ]
              .filter(Boolean)
              .join(" · ") || MATERIAL_LABELS[product.material]}
          </p>
          {(product.brand || product.model) && (
            <p className="mt-2 text-sm text-brand-mist">
              {product.brand}
              {product.brand && product.model ? " / " : ""}
              {product.model}
            </p>
          )}
          <h1 className="mt-3 font-display text-3xl text-brand-bone sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-brand-mist sm:text-base">
            {product.description}
          </p>

          <p className="mt-6 font-display text-3xl text-brand-gold">
            {formatPrice(product.price)}
            <span className="ml-2 font-sans text-sm font-normal text-brand-mist">
              / birim · KDV hariç
            </span>
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            <li className="border border-white/10 px-3 py-1 text-xs text-brand-mist">
              Boyut: {product.size}
            </li>
            {product.usageAreas.map((area) => (
              <li
                key={area}
                className="border border-white/10 px-3 py-1 text-xs text-brand-mist"
              >
                {USAGE_LABELS[area]}
              </li>
            ))}
            <li
              className={`px-3 py-1 text-xs ${
                product.inStock
                  ? "bg-brand-gold/15 text-brand-gold"
                  : "bg-red-500/15 text-red-300"
              }`}
            >
              {product.inStock ? "Stokta" : "Tükendi"}
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} />
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

          <div className="mt-10">
            <TechnicalSpecsTable specs={product.specs} />
          </div>
        </div>
      </div>
    </div>
  );
}
