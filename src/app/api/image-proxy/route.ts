import { NextResponse } from "next/server";
import {
  downloadOneDriveShareContentUrl,
  isOneDriveConfigured,
  isOneDriveShareContentUrl,
} from "@/lib/onedrive";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const urlObj = new URL(request.url);
  const url = urlObj.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "url parametresi gerekli." },
      { status: 400 }
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Geçersiz url." }, { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json(
      { error: "Sadece http/https desteklenir." },
      { status: 400 }
    );
  }

  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.startsWith("127.") ||
    host.startsWith("0.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("169.254.")
  ) {
    return NextResponse.json({ error: "Host izni yok." }, { status: 400 });
  }

  // Eski OneDrive share linkleri tarayıcıda 401 verir → Graph ile çek
  if (isOneDriveShareContentUrl(url)) {
    if (!isOneDriveConfigured()) {
      return NextResponse.json(
        { error: "OneDrive yapılandırılmamış." },
        { status: 503 }
      );
    }
    try {
      const file = await downloadOneDriveShareContentUrl(url);
      return new Response(file.bytes, {
        status: 200,
        headers: {
          "Content-Type": file.contentType,
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error ? err.message : "OneDrive görseli okunamadı",
        },
        { status: 502 }
      );
    }
  }

  const res = await fetch(parsed.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok || !res.body) {
    return NextResponse.json(
      { error: "Görsel proxy edilemedi." },
      { status: 502 }
    );
  }

  const contentType =
    res.headers.get("content-type") || "application/octet-stream";

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
