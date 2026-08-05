import { NextResponse } from "next/server";
import {
  downloadOneDriveShareContentUrl,
  isOneDriveConfigured,
  isOneDriveShareContentUrl,
} from "@/lib/onedrive";
import { extractOgImage, isImgbbPageUrl } from "@/lib/image-url";

export const runtime = "nodejs";

async function fetchImageBytes(url: string): Promise<{
  bytes: ArrayBuffer;
  contentType: string;
}> {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    redirect: "follow",
    headers: {
      // Bazı CDN’ler bot isteğini reddeder
      "User-Agent":
        "Mozilla/5.0 (compatible; DNZSiteImageProxy/1.0; +https://dnzinşaat.com.tr)",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });
  if (!res.ok) {
    throw new Error(`Görsel alınamadı (${res.status})`);
  }
  const bytes = await res.arrayBuffer();
  let contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    contentType = "image/jpeg";
  }
  return { bytes, contentType };
}

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

  // imgbb sayfa linki (ibb.co/xxx) → og:image ile gerçek fotoğrafa çöz
  if (isImgbbPageUrl(url)) {
    try {
      const pageRes = await fetch(url, {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      if (!pageRes.ok) {
        return NextResponse.json(
          { error: "ImgBB sayfası okunamadı." },
          { status: 502 }
        );
      }
      const html = await pageRes.text();
      const og = extractOgImage(html);
      if (!og) {
        return NextResponse.json(
          {
            error:
              "ImgBB’de Direct link bulunamadı. i.ibb.co/... adresini kullanın.",
          },
          { status: 422 }
        );
      }
      const file = await fetchImageBytes(og);
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
            err instanceof Error ? err.message : "ImgBB görseli çözülemedi",
        },
        { status: 502 }
      );
    }
  }

  try {
    const file = await fetchImageBytes(parsed.toString());
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
        error: err instanceof Error ? err.message : "Görsel proxy edilemedi.",
      },
      { status: 502 }
    );
  }
}
