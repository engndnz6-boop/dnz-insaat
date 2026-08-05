import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { isOneDriveConfigured, uploadToOneDrive } from "@/lib/onedrive";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  if (!isOneDriveConfigured()) {
    return NextResponse.json(
      {
        error:
          "OneDrive yapılandırılmamış. Vercel env: MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_REFRESH_TOKEN",
      },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz form." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Dosya en fazla 4 MB olabilir." },
      { status: 400 }
    );
  }

  const kind = String(form.get("kind") || "image");
  const isPdf = kind === "pdf" || file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  if (!isPdf && !isImage) {
    return NextResponse.json(
      { error: "Sadece görsel veya PDF yüklenebilir." },
      { status: 400 }
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const { url, itemId } = await uploadToOneDrive({
      fileName: file.name || (isPdf ? "dosya.pdf" : "gorsel.jpg"),
      contentType: file.type || (isPdf ? "application/pdf" : "image/jpeg"),
      bytes,
      subfolder: isPdf ? "pdfs" : "images",
    });
    return NextResponse.json({ url, itemId });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Yükleme hatası",
      },
      { status: 500 }
    );
  }
}
