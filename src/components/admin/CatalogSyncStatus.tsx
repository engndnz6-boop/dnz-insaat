"use client";

import { useCatalog } from "@/lib/catalog-context";

/** Kategoriler / PDF katalogları OneDrive’a kayıtlı mı — admin için durum çubuğu */
export function CatalogSyncStatus() {
  const { source, syncError, syncing, syncNow, ready, pdfCatalogs } =
    useCatalog();
  if (!ready) return null;

  const localPdfs = pdfCatalogs.filter((p) => p.storageKey && !p.url).length;

  if (syncError) {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        <span>Kaydedilemedi: {syncError}</span>
        <button
          type="button"
          onClick={() => void syncNow()}
          disabled={syncing}
          className="bg-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {syncing ? "Kaydediliyor…" : "Tekrar dene"}
        </button>
      </div>
    );
  }

  if (source !== "onedrive") {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <span>
          Bu liste henüz sadece bu tarayıcıda. Ziyaretçilerin de görmesi için
          OneDrive’a kaydedin.
        </span>
        <button
          type="button"
          onClick={() => void syncNow()}
          disabled={syncing}
          className="bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {syncing ? "Kaydediliyor…" : "OneDrive’a kaydet"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      {syncing
        ? "Kaydediliyor…"
        : "OneDrive’a kayıtlı. Değişiklikler ziyaretçilere de görünür."}
      {localPdfs > 0 ? (
        <span className="mt-1 block text-amber-800">
          {localPdfs} PDF eski yöntemle sadece bu tarayıcıda duruyor; ziyaretçiler
          indiremez. Silip yeniden yükleyin.
        </span>
      ) : null}
    </div>
  );
}
