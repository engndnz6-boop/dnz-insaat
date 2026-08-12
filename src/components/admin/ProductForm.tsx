"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
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
import { uploadVideoToOneDrive } from "@/lib/video-upload";
import { ProductImage } from "@/components/product/ProductImage";
import { ImagePlus, Trash2 } from "lucide-react";

const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

function isPlaceholderImage(src: string): boolean {
  return src.includes("images.unsplash.com");
}

/** OneDrive varsa oraya; yapılandırılmamışsa tarayıcı IndexedDB’ye kaydet */
async function storeImage(blob: Blob, key: string): Promise<string> {
  const body = new FormData();
  // Tip her zaman image/jpeg olsun (bazı tarayıcılarda boş type 400 veriyor)
  const file = new File([blob], `${key}.jpg`, {
    type: blob.type || "image/jpeg",
  });
  body.append("file", file);
  body.append("kind", "image");

  let lastError = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
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

    lastError =
      data.error ||
      `Fotoğraf OneDrive’a yüklenemedi (HTTP ${res.status}). Admin’de OneDrive bandını kontrol edin.`;

    // Geçici hata ise bir kez daha dene
    if (attempt === 1 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 800));
      continue;
    }
    break;
  }

  throw new Error(lastError);
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
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subcategories = getSubcategories(form.categoryId);
  const imageSlotsLeft = Math.max(0, MAX_IMAGES - form.images.length);

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onCategoryChange = (categoryId: string) => {
    setForm((f) => ({
      ...f,
      categoryId,
      subcategoryId: undefined,
    }));
  };

  const removeImageAt = (index: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== index),
    }));
  };

  const clearAllImages = () => {
    if (!form.images.length) return;
    if (!confirm("Tüm ürün fotoğrafları silinsin mi?")) return;
    setForm((f) => ({ ...f, images: [] }));
  };

  const uploadFilesNow = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    setError("");
    setUploadingImages(true);
    try {
      const room = Math.max(0, MAX_IMAGES - form.images.length);
      const toUpload = files.slice(0, room);
      if (!toUpload.length) {
        throw new Error(`En fazla ${MAX_IMAGES} fotoğraf eklenebilir.`);
      }

      const savedUrls: string[] = [];
      for (let i = 0; i < toUpload.length; i++) {
        const file = toUpload[i];
        setProgress(`Fotoğraf ${i + 1}/${toUpload.length} yükleniyor…`);
        const looksImage =
          file.type.startsWith("image/") ||
          /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);
        if (!looksImage) {
          throw new Error(`"${file.name}" görsel değil. JPG / PNG seçin.`);
        }
        let blob: Blob;
        try {
          blob = await compressImageFile(file);
        } catch {
          throw new Error(
            `"${file.name}" okunamadı. JPG veya PNG deneyin.`
          );
        }
        if (blob.size > MAX_IMAGE_BYTES) {
          throw new Error(`"${file.name}" çok büyük (max 2.5 MB).`);
        }
        const key = `img-${form.id}-${Date.now()}-${i}`;
        savedUrls.push(await storeImage(blob, key));
      }

      setForm((f) => {
        const kept = f.images.filter((src) => !isPlaceholderImage(src));
        return {
          ...f,
          images: [...kept, ...savedUrls].slice(0, MAX_IMAGES),
        };
      });
      setProgress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraf yüklenemedi");
      setProgress("");
    } finally {
      setUploadingImages(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setProgress("");
    setSaving(true);
    try {
      let next = {
        ...form,
        slug: form.slug.trim() || slugify(form.name),
        price: Number(form.price) || 0,
        images: form.images.filter((src) => !isPlaceholderImage(src)),
      };

      if (!next.images.length) {
        throw new Error("En az bir ürün görseli ekleyin.");
      }

      if (pendingVideo) {
        setProgress("Video yükleniyor…");
        try {
          const videoUrl = await uploadVideoToOneDrive(pendingVideo, (pct) => {
            setProgress(`Video yükleniyor… %${pct}`);
          });
          next = { ...next, videoUrl };
        } catch (err) {
          throw new Error(
            err instanceof Error
              ? err.message
              : "Video yüklenemedi. YouTube linki de yapıştırabilirsiniz."
          );
        }
      }

      if (pdfFile) {
        setProgress("PDF yükleniyor…");
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

      setProgress("Kaydediliyor…");
      await onSave(next);
      setForm(next);
      setPendingVideo(null);
      setPdfFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt hatası");
    } finally {
      setSaving(false);
      setProgress("");
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

      {/* Fotoğraflar — üstte, kolay ekle / sil */}
      <section className="border border-black/10 bg-brand-ink/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-brand-bone">
              Ürün fotoğrafları
            </h2>
            <p className="mt-1 text-xs text-brand-mist">
              Seçince hemen yüklenir · Silmek için kırmızı Sil’e basın · En sonda
              Kaydet
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploadingImages || saving || imageSlotsLeft <= 0}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-brand-gold px-4 py-2.5 text-sm font-semibold text-[#151920] disabled:opacity-50"
            >
              <ImagePlus className="h-4 w-4" />
              {uploadingImages ? "Yükleniyor…" : "Fotoğraf ekle"}
            </button>
            {form.images.length > 0 ? (
              <button
                type="button"
                disabled={uploadingImages || saving}
                onClick={clearAllImages}
                className="inline-flex items-center gap-2 border border-red-400/40 px-3 py-2.5 text-sm text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Tümünü sil
              </button>
            ) : null}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,image/heif,.jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files?.length) void uploadFilesNow(files);
            e.target.value = "";
          }}
        />

        {form.images.length === 0 ? (
          <button
            type="button"
            disabled={uploadingImages || saving}
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex min-h-[140px] w-full flex-col items-center justify-center gap-2 border border-dashed border-black/20 bg-brand-anthracite/50 px-4 py-8 text-sm text-brand-mist hover:border-brand-gold/40 hover:text-brand-bone"
          >
            <ImagePlus className="h-8 w-8 text-brand-gold" />
            Fotoğraf seçmek için dokunun
            <span className="text-xs opacity-70">JPG / PNG · max {MAX_IMAGES}</span>
          </button>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {form.images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="overflow-hidden border border-black/10 bg-brand-anthracite"
              >
                <div className="relative aspect-square">
                  <ProductImage
                    src={src}
                    alt={`Görsel ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <span className="absolute left-2 top-2 bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={uploadingImages || saving}
                  onClick={() => removeImageAt(i)}
                  className="flex w-full items-center justify-center gap-1.5 bg-red-600/90 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
              </div>
            ))}
            {imageSlotsLeft > 0 ? (
              <button
                type="button"
                disabled={uploadingImages || saving}
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-black/20 text-xs text-brand-mist hover:border-brand-gold/40 hover:text-brand-bone"
              >
                <ImagePlus className="h-6 w-6" />
                Daha ekle
              </button>
            ) : null}
          </div>
        )}

        <div className="mt-3">
          <button
            type="button"
            className="text-xs text-brand-gold underline"
            onClick={() => setShowUrlField((v) => !v)}
          >
            {showUrlField ? "URL alanını gizle" : "URL ile fotoğraf ekle (opsiyonel)"}
          </button>
          {showUrlField ? (
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                className="input-field flex-1"
                placeholder="https://i.ibb.co/....jpg"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
              />
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => {
                  const url = urlDraft.trim();
                  if (!url) return;
                  if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
                    setError("Geçerli bir http(s) URL girin.");
                    return;
                  }
                  setForm((f) => ({
                    ...f,
                    images: [...f.images, url].slice(0, MAX_IMAGES),
                  }));
                  setUrlDraft("");
                }}
              >
                URL ekle
              </button>
            </div>
          ) : null}
        </div>
      </section>

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
          <Field label="Video dosyası yükle (telefon / bilgisayar)">
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              disabled={saving}
              className="input-field file:mr-3 file:border-0 file:bg-brand-gold file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#151920]"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setPendingVideo(f);
                e.target.value = "";
              }}
            />
            <p className="mt-1 text-xs text-brand-mist">
              MP4 / MOV / WEBM · en fazla 200 MB
              {pendingVideo
                ? ` · seçildi: ${pendingVideo.name} (${Math.round(pendingVideo.size / (1024 * 1024))} MB) — Kaydet deyince yüklenir`
                : ""}
            </p>
            {pendingVideo ? (
              <button
                type="button"
                className="mt-1 text-xs text-brand-gold underline"
                onClick={() => setPendingVideo(null)}
              >
                Seçimi kaldır
              </button>
            ) : null}
          </Field>
          <Field label="veya video linki (YouTube / Vimeo / MP4 URL)">
            <input
              className="input-field"
              placeholder="https://www.youtube.com/watch?v=... veya https://youtu.be/..."
              value={form.videoUrl || ""}
              onChange={(e) => set("videoUrl", e.target.value.trim())}
              disabled={!!pendingVideo}
            />
            <p className="mt-1 text-xs text-brand-mist">
              Dosya seçtiyseniz link gerekmez. YouTube’a yükleyip link de
              yapıştırabilirsiniz.
            </p>
            {form.videoUrl && !pendingVideo ? (
              <button
                type="button"
                className="mt-2 text-xs text-brand-gold underline"
                onClick={() => set("videoUrl", "")}
              >
                Videoyu kaldır
              </button>
            ) : null}
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
      {progress && !error && (
        <p className="text-sm text-brand-gold">{progress}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || uploadingImages}
          className="btn-primary"
        >
          {saving
            ? progress || "Kaydediliyor…"
            : uploadingImages
              ? "Fotoğraf yükleniyor…"
              : "Kaydet"}
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
