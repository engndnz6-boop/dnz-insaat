import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { probeOneDrive } from "@/lib/onedrive";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const status = await probeOneDrive();
  return NextResponse.json(status);
}
