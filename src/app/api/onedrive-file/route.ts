import { downloadOneDriveItem } from "@/lib/onedrive";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id")?.trim();
    if (!itemId) {
      return Response.json({ error: "id parametresi gerekli." }, { status: 400 });
    }

    const file = await downloadOneDriveItem(itemId);

    return new Response(file.bytes, {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
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
