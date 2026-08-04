"use client";

import { useState } from "react";
import { FileDown, Plus, Trash2 } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";
import { openPdf } from "@/lib/pdf-storage";

export default function AdminPdfCatalogsPage() {
  const { categories, pdfCatalogs, addPdfCatalog, deletePdfCatalog } =
    useCatalog();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addPdfCatalog({
        title,
        description,
        categoryId: categoryId || undefined,
        file: file || undefined,
        url: url || undefined,
      });
      setTitle("");
      setDescription("");
      setCategoryId("");
      setFile(null);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-bone">PDF Kataloglar</h1>
      <p className="mt-2 text-sm text-brand-mist">
        Müşterilerin indirebileceği PDF katalogları yükleyin (max 4 MB) veya
        link ekleyin.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 border border-black/5 bg-brand-anthracite/40 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Katalog başlığı *</label>
            <input
              required
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Alçıpan Asma Tavan Katalog 2026"
            />
          </div>
          <div>
            <label className="label-field">Kategori (opsiyonel)</label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Genel</option>
              {categories
                .filter((c) => !c.parentId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Açıklama</label>
            <input
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">PDF dosyası yükle</label>
            <input
              type="file"
              accept="application/pdf"
              className="input-field file:mr-3 file:border-0 file:bg-brand-gold file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand-ink"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label className="label-field">veya PDF linki</label>
            <input
              className="input-field"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary">
          <Plus className="h-4 w-4" />
          {loading ? "Yükleniyor…" : "Katalog Ekle"}
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {pdfCatalogs.length === 0 && (
          <li className="border border-dashed border-black/10 p-8 text-center text-sm text-brand-mist">
            Henüz PDF katalog yok.
          </li>
        )}
        {pdfCatalogs.map((pdf) => {
          const cat = categories.find((c) => c.id === pdf.categoryId);
          return (
            <li
              key={pdf.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-black/5 bg-brand-anthracite/50 p-4"
            >
              <div>
                <p className="font-medium text-brand-bone">{pdf.title}</p>
                <p className="mt-1 text-xs text-brand-mist">
                  {pdf.fileName}
                  {cat ? ` · ${cat.name}` : " · Genel"}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn-secondary py-2 text-xs"
                  onClick={() =>
                    openPdf(pdf.storageKey || pdf.url || "")
                  }
                >
                  <FileDown className="h-3.5 w-3.5" />
                  Aç
                </button>
                <button
                  type="button"
                  className="p-2 text-brand-mist hover:text-red-400"
                  onClick={() => {
                    if (confirm("Bu katalog silinsin mi?")) {
                      void deletePdfCatalog(pdf.id);
                    }
                  }}
                  aria-label="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
