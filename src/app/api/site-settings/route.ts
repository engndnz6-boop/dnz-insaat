import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import {
  isOneDriveConfigured,
  readJsonFromOneDrive,
  writeJsonToOneDrive,
} from "@/lib/onedrive";

export const runtime = "nodejs";

const FILE = "site-settings.json";

type SettingsFile = SiteSettings & { updatedAt?: string };

export async function GET() {
  try {
    if (isOneDriveConfigured()) {
      const data = await readJsonFromOneDrive<SettingsFile>(FILE);
      if (data) {
        return NextResponse.json({
          source: "onedrive",
          settings: normalizeSiteSettings(data),
        });
      }
    }
    return NextResponse.json({
      source: "default",
      settings: DEFAULT_SITE_SETTINGS,
    });
  } catch (err) {
    return NextResponse.json({
      source: "default",
      settings: DEFAULT_SITE_SETTINGS,
      warning: err instanceof Error ? err.message : "Okunamadı",
    });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  if (!isOneDriveConfigured()) {
    return NextResponse.json(
      { error: "OneDrive yapılandırılmamış." },
      { status: 503 }
    );
  }

  let body: Partial<SiteSettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const settings = normalizeSiteSettings(body);

  try {
    await writeJsonToOneDrive(FILE, {
      ...settings,
      updatedAt: new Date().toISOString(),
    } satisfies SettingsFile);
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kayıt hatası" },
      { status: 500 }
    );
  }
}
