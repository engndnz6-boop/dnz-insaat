"use client";

import { FileDown } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";
import { openPdf } from "@/lib/pdf-storage";

export default function PdfCatalogsPublicPage() {
  const { categories, pdfCatalogs, ready } = useCatalog();

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
          Dokümanlar
        </p>
        <h1 className="section-title mt-3">PDF Kataloglar</h1>
        <p className="section-subtitle">
          Ürün ve sistem kataloglarını indirin. Mimari / şantiye ekipleri için
          teknik dokümanlar.
        </p>
      </div>

      {!ready ? (
        <p className="mt-10 text-brand-mist">Yükleniyor…</p>
      ) : pdfCatalogs.length === 0 ? (
        <div className="mt-10 border border-dashed border-white/10 p-12 text-center text-sm text-brand-mist">
          Henüz yayınlanmış PDF katalog yok.
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {pdfCatalogs.map((pdf) => {
            const cat = categories.find((c) => c.id === pdf.categoryId);
            return (
              <li
                key={pdf.id}
                className="flex flex-col border border-white/5 bg-brand-anthracite/50 p-6"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold">
                  {cat?.name || "Genel katalog"}
                </p>
                <h2 className="mt-2 font-display text-xl text-brand-bone">
                  {pdf.title}
                </h2>
                {pdf.description && (
                  <p className="mt-2 flex-1 text-sm text-brand-mist">
                    {pdf.description}
                  </p>
                )}
                <button
                  type="button"
                  className="btn-primary mt-6 self-start text-xs"
                  onClick={() => openPdf(pdf.storageKey || pdf.url || "")}
                >
                  <FileDown className="h-4 w-4" />
                  PDF İndir / Aç
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
