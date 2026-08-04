import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminPassword,
  safeEqual,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin şifresi sunucuda tanımlı değil." },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const password = body.password ?? "";
  if (!safeEqual(password, adminPassword)) {
    return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("dnz_admin_session", createAdminSessionToken(adminPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
