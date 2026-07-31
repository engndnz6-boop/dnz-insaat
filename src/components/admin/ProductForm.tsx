"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type {
  ColorOption,
  MaterialType,
  Product,
  UsageArea,
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  COLOR_LABELS,
  MATERIAL_LABELS,
  USAGE_LABELS,
} from "@/lib/utils";
import { useCatalog } from "@/lib/catalog-context";
import { savePdfBlob } from "@/lib/pdf-storage";

export function ProductForm({
  initial,
  onSave,
}: {
  initial: Product;
  onSave: (product: Product) => void;
}) {
  const { rootCategories, getSubcategories } = useCatalog();
  const [form, setForm] = useState<Product>(initial);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subcategories = getSubcategories(form.categoryId);

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onCategoryChange = (categoryId: string) => {
    setForm((f) => ({
      ...f,
      categoryId,
      subcategoryId: undefined,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let next = { ...form, slug: form.slug.trim() || slugify(form.name), price: Number(form.price) || 0 };
      if (pdfFile) {
        if (pdfFile.size > 4 * 1024 * 1024) {
          throw new Error("Ürün PDF en fazla 4 MB olabilir.");
        }
        const key = `product-pdf-${form.id}`;
        await savePdfBlob(key, pdfFile);
        next = { ...next, pdfStorageKey: key, pdfUrl: "" };
      }
      onSave(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt hatası");
      setSaving(false);
    }
  };

  const toggleUsage = (area: UsageArea) => {
    set(
      "usageAreas",
      form.usageAreas.includes(area)
        ? form.usageAreas.filter((a) => a !== area)
        : [...form.usageAreas, area]
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 border border-white/5 bg-brand-anthracite/40 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ürün adı *">
          <input
            required
            className="input-field"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({
                ...f,
                name,
                slug: f.id.startsWith("p-") ? slugify(name) : f.slug,
              }));
            }}
          />
        </Field>
        <Field label="Ana kategori *">
          <select
            required
            className="input-field"
            value={form.categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {rootCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Alt kategori">
          <select
            className="input-field"
            value={form.subcategoryId || ""}
            onChange={(e) =>
              set("subcategoryId", e.target.value || undefined)
            }
            disabled={subcategories.length === 0}
          >
            <option value="">
              {subcategories.length === 0
                ? "Alt kategori yok"
                : "Seçiniz (opsiyonel)"}
            </option>
            {subcategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Marka (ör. Viko)">
          <input
            className="input-field"
            placeholder="Viko, Schneider, Legrand..."
            value={form.brand || ""}
            onChange={(e) => set("brand", e.target.value)}
          />
        </Field>
        <Field label="Model">
          <input
            className="input-field"
            placeholder="Örn. Novella, Karre..."
            value={form.model || ""}
            onChange={(e) => set("model", e.target.value)}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            className="input-field"
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
          />
        </Field>
        <Field label="Kısa açıklama">
          <input
            className="input-field"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
          />
        </Field>
        <Field label="Fiyat (TRY) *">
          <input
            type="number"
            required
            min={0}
            className="input-field"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Açıklama">
            <textarea
              rows={4}
              className="input-field resize-y"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Malzeme tipi">
          <select
            className="input-field"
            value={form.material}
            onChange={(e) => set("material", e.target.value as MaterialType)}
          >
            {Object.entries(MATERIAL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Renk">
          <select
            className="input-field"
            value={form.color}
            onChange={(e) => set("color", e.target.value as ColorOption)}
          >
            {Object.entries(COLOR_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Boyut">
          <input
            className="input-field"
            value={form.size}
            onChange={(e) => set("size", e.target.value)}
          />
        </Field>
        <Field label="Görsel URL (virgülle birden fazla)">
          <input
            className="input-field"
            value={form.images.join(", ")}
            onChange={(e) =>
              set(
                "images",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </Field>
        <Field label="Teknik PDF dosyası (yükle)">
          <input
            type="file"
            accept="application/pdf"
            className="input-field file:mr-3 file:border-0 file:bg-brand-gold file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand-ink"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
          <p className="mt-1 text-xs text-brand-mist">
            Max 4 MB. {form.pdfStorageKey ? "Kayıtlı PDF var." : form.pdfUrl ? `Link: ${form.pdfUrl}` : "PDF yok."}
          </p>
        </Field>
        <Field label="veya PDF linki">
          <input
            className="input-field"
            placeholder="/docs/... veya https://..."
            value={form.pdfUrl}
            onChange={(e) => set("pdfUrl", e.target.value)}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="label-field">Kullanım alanları</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(USAGE_LABELS) as UsageArea[]).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleUsage(area)}
              className={`px-3 py-1.5 text-xs ${
                form.usageAreas.includes(area)
                  ? "bg-brand-gold text-brand-ink"
                  : "border border-white/10 text-brand-mist"
              }`}
            >
              {USAGE_LABELS[area]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teknik: Boyut">
          <input
            className="input-field"
            value={form.specs.dimensions}
            onChange={(e) =>
              set("specs", { ...form.specs, dimensions: e.target.value })
            }
          />
        </Field>
        <Field label="Teknik: Malzeme">
          <input
            className="input-field"
            value={form.specs.material}
            onChange={(e) =>
              set("specs", { ...form.specs, material: e.target.value })
            }
          />
        </Field>
        <Field label="Teknik: Ağırlık">
          <input
            className="input-field"
            value={form.specs.weight}
            onChange={(e) =>
              set("specs", { ...form.specs, weight: e.target.value })
            }
          />
        </Field>
        <Field label="Teknik: Garanti">
          <input
            className="input-field"
            value={form.specs.warranty}
            onChange={(e) =>
              set("specs", { ...form.specs, warranty: e.target.value })
            }
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-brand-mist">
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="accent-[#C9A14A]"
          />
          Öne çıkan
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-mist">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => set("inStock", e.target.checked)}
            className="accent-[#C9A14A]"
          />
          Stokta
        </label>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <Link href="/admin/urunler" className="btn-secondary">
          İptal
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="label-field">{label}</span>
      {children}
    </div>
  );
}
