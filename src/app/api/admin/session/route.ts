import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminPassword,
  safeEqual,
} from "@/lib/admin-auth";

export async function GET() {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return NextResponse.json({ authenticated: false });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("dnz_admin_session")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const expected = createAdminSessionToken(adminPassword);
  return NextResponse.json({ authenticated: safeEqual(token, expected) });
}
