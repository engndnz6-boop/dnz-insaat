import {
  downloadOneDriveItem,
  getOneDriveContentRedirectUrl,
} from "@/lib/onedrive";

export const runtime = "nodejs";

function guessContentType(name: string | null, fallback: string): string {
  const n = (name || "").toLowerCase();
  if (n.endsWith(".mp4")) return "video/mp4";
  if (n.endsWith(".webm")) return "video/webm";
  if (n.endsWith(".ogg") || n.endsWith(".ogv")) return "video/ogg";
  if (n.endsWith(".mov")) return "video/quicktime";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".webp")) return "image/webp";
  if (n.endsWith(".pdf")) return "application/pdf";
  if (fallback && fallback !== "application/octet-stream") return fallback;
  return "application/octet-stream";
}

function isVideoName(name: string | null): boolean {
  return /\.(mp4|webm|ogg|ogv|mov)(\?|$)/i.test(name || "");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id")?.trim();
    const fileName = searchParams.get("name");
    if (!itemId) {
      return Response.json({ error: "id parametresi gerekli." }, { status: 400 });
    }

    // Video: geçici OneDrive URL’sine yönlendir (seek / Range çalışır)
    if (isVideoName(fileName) || searchParams.get("stream") === "1") {
      const location = await getOneDriveContentRedirectUrl(itemId);
      if (location) {
        return Response.redirect(location, 302);
      }
    }

    const file = await downloadOneDriveItem(itemId);
    const contentType = guessContentType(fileName, file.contentType);

    return new Response(file.bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        ...(file.etag ? { ETag: file.etag } : {}),
      },
    });
  } catch (err) {
    return Response.json(
      {
        error: err instanceof Error ? err.message : "Dosya okunamadı",
      },
      { status: 500 }
    );
  }
}
