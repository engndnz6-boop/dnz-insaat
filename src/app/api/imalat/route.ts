import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import type { ImalatSystem } from "@/lib/imalat/engine";
import {
  isOneDriveConfigured,
  readJsonFromOneDrive,
  writeJsonToOneDrive,
} from "@/lib/onedrive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = "imalat-sistemleri.json";
type ImalatFile = { systems: ImalatSystem[]; updatedAt?: string };

/** İmalat sistemleri (OneDrive: imalat-sistemleri.json) */
export async function GET() {
  try {
    if (isOneDriveConfigured()) {
      const data = await readJsonFromOneDrive<ImalatFile>(FILE);
      if (data && Array.isArray(data.systems) && data.systems.length) {
        return NextResponse.json({ source: "onedrive", systems: data.systems });
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
    return NextResponse.json({ error: "OneDrive yapılandırılmamış." }, { status: 503 });
  }
  let body: { systems?: ImalatSystem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }
  if (!Array.isArray(body.systems) || body.systems.length === 0) {
    return NextResponse.json({ error: "En az bir sistem gerekli." }, { status: 400 });
  }
  try {
    await writeJsonToOneDrive(FILE, {
      systems: body.systems,
      updatedAt: new Date().toISOString(),
    } satisfies ImalatFile);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kayıt hatası" },
      { status: 500 }
    );
  }
}
