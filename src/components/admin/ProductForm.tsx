"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
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
import {
  compressImageFile,
  saveFileBlob,
  toIdbImageRef,
} from "@/lib/pdf-storage";
import { ProductImage } from "@/components/product/ProductImage";
import { X } from "lucide-react";

const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

/** OneDrive varsa oraya; yapılandırılmamışsa tarayıcı IndexedDB’ye kaydet */
async function storeImage(blob: Blob, key: string): Promise<string> {
  const body = new FormData();
  body.append("file", blob, `${key}.jpg`);
  body.append("kind", "image");

  let res: Response;
  try {
    res = await fetch("/api/admin/upload", { method: "POST", body });
  } catch {
    await saveFileBlob(key, blob);
    return toIdbImageRef(key);
  }

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (res.ok && data.url) return data.url;

  // OneDrive kurulu değilse yerel yedek
  if (res.status === 503) {
    await saveFileBlob(key, blob);
    return toIdbImageRef(key);
  }

  throw new Error(
    data.error ||
      `Fotoğraf OneDrive’a yüklenemedi (HTTP ${res.status}). Admin’de OneDrive bandını kontrol edin.`
  );
}

async function storePdf(
  file: File,
  key: string
): Promise<{ url?: string; storageKey?: string }> {
  const body = new FormData();
  body.append("file", file, file.name);
  body.append("kind", "pdf");

  let res: Response;
  try {
    res = await fetch("/api/admin/upload", { method: "POST", body });
  } catch {
    await saveFileBlob(key, file);
    return { storageKey: key };
  }

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (res.ok && data.url) return { url: data.url };

  if (res.status === 503) {
    await saveFileBlob(key, file);
    return { storageKey: key };
  }

  throw new Error(data.error || `PDF OneDrive’a yüklenemedi (HTTP ${res.status}).`);
}

export function ProductForm({
  initial,
  onSave,
}: {
  initial: Product;
  onSave: (product: Product) => void | Promise<void>;
}) {
  const { rootCategories, getSubcategories } = useCatalog();
  const [form, setForm] = useState<Product>(initial);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
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
      let next = {
        ...form,
        slug: form.slug.trim() || slugify(form.name),
        price: Number(form.price) || 0,
      };

      if (pendingImages.length) {
        const savedUrls: string[] = [];
        for (let i = 0; i < pendingImages.length; i++) {
          const file = pendingImages[i];
          if (!file.type.startsWith("image/")) {
            throw new Error("Sadece görsel dosyaları yüklenebilir.");
          }
          const blob = await compressImageFile(file);
          if (blob.size > MAX_IMAGE_BYTES) {
            throw new Error(
              `"${file.name}" sıkıştırıldıktan sonra hala çok büyük (max 2.5 MB).`
            );
          }
          const key = `img-${form.id}-${Date.now()}-${i}`;
          savedUrls.push(await storeImage(blob, key));
        }
        next = { ...next, images: [...next.images, ...savedUrls] };
      }

      if (!next.images.length) {
        throw new Error("En az bir ürün görseli ekleyin (yükleme veya URL).");
      }

      if (pdfFile) {
        if (pdfFile.size > 4 * 1024 * 1024) {
          throw new Error("Ürün PDF en fazla 4 MB olabilir.");
        }
        const key = `pdf-${form.id}-${Date.now()}`;
        const stored = await storePdf(pdfFile, key);
        next = {
          ...next,
          pdfUrl: stored.url || "",
          pdfStorageKey: stored.storageKey,
        };
      }
      await onSave(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt hatası");
    } finally {
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
    <form onSubmit={onSubmit} className="space-y-6 border border-black/5 bg-brand-anthracite/40 p-6">
      <fieldset className="border border-black/10 p-4">
        <legend className="label-field px-1">Kayıt türü *</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          <label className="flex cursor-pointer items-center gap-2 border border-black/10 bg-brand-ink px-4 py-3 text-sm">
            <input
              type="radio"
              name="kind"
              checked={form.kind !== "project"}
              onChange={() => set("kind", "sale")}
              className="accent-[#C9A14A]"
            />
            <span>
              <strong className="text-brand-bone">Satış ürünü</strong>
              <span className="mt-0.5 block text-xs text-brand-mist">
                Alçı plaka, profil… — katalogda fiyat ve özellik
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 border border-black/10 bg-brand-ink px-4 py-3 text-sm">
            <input
              type="radio"
              name="kind"
              checked={form.kind === "project"}
              onChange={() => set("kind", "project")}
              className="accent-[#C9A14A]"
            />
            <span>
              <strong className="text-brand-bone">İmalat / proje</strong>
              <span className="mt-0.5 block text-xs text-brand-mist">
                Yapılan iş fotoğrafı — Projeler bölümünde görünür
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ürün / iş adı *">
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
        {form.kind === "project" ? (
          <>
            <Field label="Lokasyon">
              <input
                className="input-field"
                placeholder="Gölbaşı / Ankara"
                value={form.projectLocation || ""}
                onChange={(e) => set("projectLocation", e.target.value)}
              />
            </Field>
            <Field label="İş türü etiketi">
              <input
                className="input-field"
                placeholder="Alçıpan asma tavan imalatı"
                value={form.projectCategory || ""}
                onChange={(e) => set("projectCategory", e.target.value)}
              />
            </Field>
          </>
        ) : null}
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
        <Field label={form.kind === "project" ? "Referans tutar (opsiyonel)" : "Fiyat (TRY) *"}>
          <input
            type="number"
            required={form.kind !== "project"}
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
        <div className="sm:col-span-2 space-y-3">
          <Field label="Ürün fotoğrafları (bilgisayardan yükle)">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              multiple
              className="input-field file:mr-3 file:border-0 file:bg-brand-gold file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#151920]"
              onChange={(e) => {
                const files = e.target.files;
                if (!files?.length) return;
                const room = Math.max(0, MAX_IMAGES - form.images.length);
                setPendingImages((prev) =>
                  [...prev, ...Array.from(files)].slice(0, room)
                );
                e.target.value = "";
              }}
            />
            <p className="mt-1 text-xs text-brand-mist">
              {form.kind === "project"
                ? "Yapılmış iş fotoğrafları (sonra / önce). Projeler’de görünür."
                : "Satış ürünü fotoğrafları. Katalogda görünür."}{" "}
              · JPG / PNG / WEBP · max {MAX_IMAGES}
              {pendingImages.length > 0
                ? ` · ${pendingImages.length} dosya seçildi (kayıtta yüklenecek)`
                : ""}
            </p>
          </Field>

          {(form.images.length > 0 || pendingImages.length > 0) && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {form.images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="relative aspect-square overflow-hidden border border-black/10 bg-brand-ink"
                >
                  <ProductImage
                    src={src}
                    alt={`Görsel ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        images: f.images.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute right-1 top-1 bg-black/70 p-1 text-white"
                    aria-label="Görseli kaldır"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {pendingImages.map((file, i) => (
                <PendingImageThumb
                  key={`${file.name}-${file.size}-${i}`}
                  file={file}
                  onRemove={() =>
                    setPendingImages((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    )
                  }
                />
              ))}
            </div>
          )}

          <Field label="veya görsel URL (virgülle birden fazla)">
            <input
              className="input-field"
              placeholder="https://...jpg, https://...png"
              value={form.images
                .filter(
                  (src) =>
                    src.startsWith("http") ||
                    src.startsWith("/") ||
                    src.startsWith("data:")
                )
                .join(", ")}
              onChange={(e) => {
                const urls = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                const localRefs = form.images.filter((src) =>
                  src.startsWith("idb:")
                );
                set("images", [...localRefs, ...urls]);
              }}
            />
          </Field>
        </div>
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
                  : "border border-black/10 text-brand-mist"
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

function PendingImageThumb({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative aspect-square overflow-hidden border border-brand-gold/50 bg-brand-ink">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={file.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] text-brand-mist">
          {file.name}
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 bg-black/70 p-1 text-white"
        aria-label="Seçimi kaldır"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
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
