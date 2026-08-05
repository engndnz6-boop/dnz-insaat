import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import type { Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";
import {
  isOneDriveConfigured,
  readJsonFromOneDrive,
  writeJsonToOneDrive,
} from "@/lib/onedrive";

export const runtime = "nodejs";

const FILE = "products.json";

type ProductsFile = { products: Product[]; updatedAt?: string };

export async function GET() {
  try {
    if (isOneDriveConfigured()) {
      const data = await readJsonFromOneDrive<ProductsFile>(FILE);
      if (data?.products && Array.isArray(data.products) && data.products.length) {
        return NextResponse.json({
          source: "onedrive",
          products: data.products,
        });
      }
    }
    return NextResponse.json({
      source: "seed",
      products: seedProducts,
    });
  } catch (err) {
    return NextResponse.json(
      {
        source: "seed",
        products: seedProducts,
        warning: err instanceof Error ? err.message : "OneDrive okunamadı",
      },
      { status: 200 }
    );
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

  let body: { products?: Product[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  if (!Array.isArray(body.products)) {
    return NextResponse.json(
      { error: "products dizisi gerekli." },
      { status: 400 }
    );
  }

  try {
    await writeJsonToOneDrive(FILE, {
      products: body.products,
      updatedAt: new Date().toISOString(),
    } satisfies ProductsFile);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kayıt hatası" },
      { status: 500 }
    );
  }
}
