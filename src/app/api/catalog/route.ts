import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import type { Category, PdfCatalog } from "@/lib/types";
import {
  isOneDriveConfigured,
  readJsonFromOneDrive,
  writeJsonToOneDrive,
} from "@/lib/onedrive";
import { CATALOG_FILE, type CatalogFile } from "@/lib/categories-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Kategoriler + PDF katalog listesi (OneDrive: catalog.json) */
export async function GET() {
  try {
    if (isOneDriveConfigured()) {
      const data = await readJsonFromOneDrive<CatalogFile>(CATALOG_FILE);
      if (data && Array.isArray(data.categories) && data.categories.length) {
        return NextResponse.json({
          source: "onedrive",
          categories: data.categories,
          pdfCatalogs: Array.isArray(data.pdfCatalogs) ? data.pdfCatalogs : [],
        });
      }
    }
    return NextResponse.json({ source: "seed" });
  } catch (err) {
    return NextResponse.json({
      source: "seed",
      warning: err instanceof Error ? err.message : "OneDrive okunamadı",
    });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  if (!isOneDriveConfigured()) {
    return NextResponse.json(
      { error: "OneDrive yapılandırılmamış." },
      { status: 503 }
    );
  }

  let body: { categories?: Category[]; pdfCatalogs?: PdfCatalog[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  if (!Array.isArray(body.categories) || body.categories.length === 0) {
    return NextResponse.json(
      { error: "categories dizisi gerekli." },
      { status: 400 }
    );
  }

  // Yalnızca tarayıcıda (IndexedDB) duran PDF'ler ziyaretçiye açılamaz;
  // listeye sadece bağlantısı olanlar yazılır.
  const pdfCatalogs = (Array.isArray(body.pdfCatalogs) ? body.pdfCatalogs : [])
    .filter((p) => Boolean(p.url))
    .map((p) => ({ ...p, storageKey: undefined }));

  try {
    await writeJsonToOneDrive(CATALOG_FILE, {
      categories: body.categories,
      pdfCatalogs,
      updatedAt: new Date().toISOString(),
    } satisfies CatalogFile);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kayıt hatası" },
      { status: 500 }
    );
  }
}
