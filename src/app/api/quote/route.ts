import { NextResponse } from "next/server";
import { isOneDriveConfigured, readJsonFromOneDrive, writeJsonToOneDrive } from "@/lib/onedrive";
import { QUOTES_FILE, type QuoteRequest, type QuotesFile } from "@/lib/quotes";

export const runtime = "nodejs";

const QUOTE_EMAIL = process.env.QUOTE_EMAIL?.trim() || "dnzyapimalzemeleri@gmail.com";

const clean = (v: unknown, max = 2000) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const q: QuoteRequest = {
    id: `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    topic: clean(body.topic || body.projectType, 160),
    location: clean(body.location, 160),
    message: clean(body.message),
    status: "yeni",
  };

  if (!q.name || !q.phone || !q.topic || !q.message) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const results = await Promise.allSettled([
    // 1) Talep kaydı (admin > Teklif talepleri)
    (async () => {
      if (!isOneDriveConfigured()) return;
      const data = (await readJsonFromOneDrive<QuotesFile>(QUOTES_FILE)) || { quotes: [] };
      const quotes = Array.isArray(data.quotes) ? data.quotes : [];
      quotes.unshift(q);
      await writeJsonToOneDrive(QUOTES_FILE, { quotes: quotes.slice(0, 1000) } satisfies QuotesFile);
    })(),
    // 2) E-posta bildirimi
    (async () => {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(QUOTE_EMAIL)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "Ad soyad": q.name,
          Telefon: q.phone,
          "E-posta": q.email || "-",
          "Ürün / hizmet": q.topic,
          "Proje konumu": q.location || "-",
          Açıklama: q.message,
          _subject: `DNZ Teklif Talebi — ${q.topic}`,
          _template: "table",
          ...(q.email ? { _replyto: q.email } : {}),
        }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("E-posta gönderilemedi.");
    })(),
  ]);

  const saved = results[0].status === "fulfilled";
  const mailed = results[1].status === "fulfilled";
  if (!saved && !mailed) {
    return NextResponse.json({ error: "Talep iletilemedi." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, saved, mailed });
}
