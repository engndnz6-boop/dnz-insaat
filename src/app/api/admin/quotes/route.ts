import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { isOneDriveConfigured, readJsonFromOneDrive, writeJsonToOneDrive } from "@/lib/onedrive";
import { QUOTES_FILE, type QuoteRequest, type QuotesFile } from "@/lib/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  if (!isOneDriveConfigured()) return NextResponse.json({ quotes: [], warning: "OneDrive yapılandırılmamış." });
  try {
    const data = await readJsonFromOneDrive<QuotesFile>(QUOTES_FILE);
    return NextResponse.json({ quotes: data?.quotes || [] });
  } catch (err) {
    return NextResponse.json({ quotes: [], warning: err instanceof Error ? err.message : "Okunamadı" });
  }
}

/** Tek bir talebin durumunu / notunu günceller ya da siler */
export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  if (!isOneDriveConfigured()) return NextResponse.json({ error: "OneDrive yapılandırılmamış." }, { status: 503 });
  let body: { id?: string; status?: QuoteRequest["status"]; note?: string; remove?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }
  try {
    const data = (await readJsonFromOneDrive<QuotesFile>(QUOTES_FILE)) || { quotes: [] };
    let quotes = data.quotes || [];
    if (body.remove) quotes = quotes.filter((q) => q.id !== body.id);
    else
      quotes = quotes.map((q) =>
        q.id === body.id
          ? { ...q, ...(body.status ? { status: body.status } : {}), ...(body.note !== undefined ? { note: body.note } : {}) }
          : q
      );
    await writeJsonToOneDrive(QUOTES_FILE, { quotes } satisfies QuotesFile);
    return NextResponse.json({ ok: true, quotes });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Kayıt hatası" }, { status: 500 });
  }
}
