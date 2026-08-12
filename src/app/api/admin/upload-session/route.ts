import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import {
  createOneDriveUploadSession,
  isOneDriveConfigured,
} from "@/lib/onedrive";

export const runtime = "nodejs";

/** Büyük video yükleme: OneDrive upload session URL’si üretir */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  if (!isOneDriveConfigured()) {
    return NextResponse.json(
      { error: "OneDrive yapılandırılmamış." },
      { status: 503 }
    );
  }

  let body: { fileName?: string; kind?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const fileName = (body.fileName || "video.mp4").trim();
  const kind = (body.kind || "video").trim();
  const subfolder = kind === "pdf" ? "pdfs" : kind === "image" ? "images" : "videos";

  try {
    const session = await createOneDriveUploadSession({
      fileName,
      subfolder,
    });
    return NextResponse.json(session);
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Session hatası",
      },
      { status: 500 }
    );
  }
}
