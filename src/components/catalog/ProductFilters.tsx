"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import {
  COLOR_LABELS,
  MATERIAL_LABELS,
  USAGE_LABELS,
} from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { SlidersHorizontal, X } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";

type Filters = {
  category: string;
  subcategory: string;
  brand: string;
  material: string;
  color: string;
  size: string;
  usage: string;
};

const empty: Filters = {
  category: "",
  subcategory: "",
  brand: "",
  material: "",
  color: "",
  size: "",
  usage: "",
};

type ProductCatalogProps = {
  products: Product[];
  initialCategoryId?: string;
  hideCategoryPicker?: boolean;
  hideHeader?: boolean;
  title?: string;
  subtitle?: string;
  backHref?: string;
};

export function ProductCatalog({
  products,
  initialCategoryId = "",
  hideCategoryPicker = false,
  hideHeader = false,
  title = "Sistem & Malzeme Kataloğu",
  subtitle = "Ana kategori, alt kategori ve markaya göre filtreleyin (ör. Elektrik → Anahtar Prizler → Viko).",
}: ProductCatalogProps) {
  const { rootCategories, getSubcategories, getCategory } = useCatalog();
  const [filters, setFilters] = useState<Filters>({
    ...empty,
    category: initialCategoryId,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const sizes = useMemo(
    () => Array.from(new Set(products.map((p) => p.size))).sort(),
    [products]
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          products.map((p) => p.brand?.trim()).filter(Boolean) as string[]
        )
      ).sort((a, b) => a.localeCompare(b, "tr")),
    [products]
  );

  const subOptions = filters.category
    ? getSubcategories(filters.category)
    : [];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.category && p.categoryId !== filters.category) return false;
      if (filters.subcategory && p.subcategoryId !== filters.subcategory)
        return false;
      if (
        filters.brand &&
        (p.brand || "").toLowerCase() !== filters.brand.toLowerCase()
      )
        return false;
      if (filters.material && p.material !== filters.material) return false;
      if (filters.color && p.color !== filters.color) return false;
      if (filters.size && p.size !== filters.size) return false;
      if (
        filters.usage &&
        !p.usageAreas.includes(filters.usage as Product["usageAreas"][number])
      )
        return false;
      return true;
    });
  }, [products, filters]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const setCategory = (id: string) =>
    setFilters((f) => ({ ...f, category: id, subcategory: "" }));

  const FilterPanel = (
    <div className="space-y-6">
      <FilterGroup
        label="Ana kategori"
        value={filters.category}
        options={rootCategories.map((c) => [c.id, c.name])}
        onChange={setCategory}
      />
      {subOptions.length > 0 && (
        <FilterGroup
          label="Alt kategori"
          value={filters.subcategory}
          options={subOptions.map((c) => [c.id, c.name])}
          onChange={(v) => setFilters((f) => ({ ...f, subcategory: v }))}
        />
      )}
      {brands.length > 0 && (
        <FilterGroup
          label="Marka"
          value={filters.brand}
          options={brands.map((b) => [b, b])}
          onChange={(v) => setFilters((f) => ({ ...f, brand: v }))}
        />
      )}
      <FilterGroup
        label="Malzeme tipi"
        value={filters.material}
        options={Object.entries(MATERIAL_LABELS)}
        onChange={(v) => setFilters((f) => ({ ...f, material: v }))}
      />
      <FilterGroup
        label="Renk"
        value={filters.color}
        options={Object.entries(COLOR_LABELS)}
        onChange={(v) => setFilters((f) => ({ ...f, color: v }))}
      />
      <FilterGroup
        label="Boyut"
        value={filters.size}
        options={sizes.map((s) => [s, s])}
        onChange={(v) => setFilters((f) => ({ ...f, size: v }))}
      />
      <FilterGroup
        label="Kullanım Alanı"
        value={filters.usage}
        options={Object.entries(USAGE_LABELS)}
        onChange={(v) => setFilters((f) => ({ ...f, usage: v }))}
      />
      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => setFilters(empty)}
          className="btn-ghost w-full justify-start px-0 text-brand-gold"
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page py-12 sm:py-16">
      {!hideHeader && (
      <div className="max-w-2xl">
        {!hideCategoryPicker && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
            Ürün Kataloğu
          </p>
        )}
        <h1 className={`section-title ${hideCategoryPicker ? "" : "mt-3"}`}>
          {title}
        </h1>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      )}

      {!hideCategoryPicker && (
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setCategory("")}
          className={`shrink-0 px-3 py-2 text-xs transition ${
            !filters.category
              ? "bg-brand-gold text-brand-ink"
              : "border border-black/10 text-brand-mist hover:border-brand-gold/40"
          }`}
        >
          Tümü
        </button>
        {rootCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`shrink-0 px-3 py-2 text-xs transition ${
              filters.category === c.id
                ? "bg-brand-gold text-brand-ink"
                : "border border-black/10 text-brand-mist hover:border-brand-gold/40"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      )}

      {!hideCategoryPicker && subOptions.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setFilters((f) => ({ ...f, subcategory: "" }))}
            className={`shrink-0 px-3 py-1.5 text-[11px] transition ${
              !filters.subcategory
                ? "border border-brand-gold text-brand-gold"
                : "border border-black/10 text-brand-mist"
            }`}
          >
            Tüm alt kategoriler
          </button>
          {subOptions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                setFilters((f) => ({ ...f, subcategory: c.id }))
              }
              className={`shrink-0 px-3 py-1.5 text-[11px] transition ${
                filters.subcategory === c.id
                  ? "border border-brand-gold text-brand-gold"
                  : "border border-black/10 text-brand-mist"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
        <p className="text-sm text-brand-mist">
          {filtered.length} ürün
          {activeCount > 0 ? ` · ${activeCount} filtre` : ""}
        </p>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn-secondary py-2 text-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtrele
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 border border-black/5 bg-brand-anthracite/50 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Filtreler
            </h2>
            <div className="mt-6">{FilterPanel}</div>
          </div>
        </aside>

        <div>
          <p className="mb-6 hidden text-sm text-brand-mist lg:block">
            {filtered.length} ürün listeleniyor
            {filters.category
              ? ` · ${getCategory(filters.category)?.name || ""}`
              : ""}
          </p>
          {filtered.length === 0 ? (
            <div className="border border-dashed border-black/10 p-12 text-center text-sm text-brand-mist">
              Bu filtrelere uygun ürün bulunamadı.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Kapat"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto border-t border-black/10 bg-brand-anthracite p-6 animate-fade-up">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
                Filtreler
              </h2>
              <button type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-brand-bone" />
              </button>
            </div>
            {FilterPanel}
            <button
              type="button"
              className="btn-primary mt-8 w-full"
              onClick={() => setMobileOpen(false)}
            >
              Sonuçları Göster ({filtered.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-wider text-brand-mist">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`px-3 py-1.5 text-xs transition ${
            value === ""
              ? "bg-brand-gold text-brand-ink"
              : "border border-black/10 text-brand-mist hover:border-brand-gold/40"
          }`}
        >
          Tümü
        </button>
        {options.map(([key, name]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 text-xs transition ${
              value === key
                ? "bg-brand-gold text-brand-ink"
                : "border border-black/10 text-brand-mist hover:border-brand-gold/40"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
