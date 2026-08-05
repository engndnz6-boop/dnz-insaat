import { NextResponse } from "next/server";

export const runtime = "nodejs";

const QUOTE_EMAIL =
  process.env.QUOTE_EMAIL?.trim() || "dnzyapimalzemeleri@gmail.com";

type QuoteBody = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectType?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: QuoteBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const company = String(body.company || "").trim();
  const projectType = String(body.projectType || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !phone || !projectType || !message) {
    return NextResponse.json(
      { error: "Zorunlu alanlar eksik." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(QUOTE_EMAIL)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company: company || "-",
          projectType,
          message,
          _subject: `DNZ Teklif Talebi — ${projectType}`,
          _template: "table",
          _replyto: email,
        }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "E-posta gönderilemedi.", detail: text.slice(0, 200) },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, email: QUOTE_EMAIL });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "E-posta hatası",
      },
      { status: 500 }
    );
  }
}
