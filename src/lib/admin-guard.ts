import { cookies } from "next/headers";
import {
  createAdminSessionToken,
  getAdminPassword,
  safeEqual,
} from "@/lib/admin-auth";

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get("dnz_admin_session")?.value;
  if (!token) return false;

  return safeEqual(token, createAdminSessionToken(adminPassword));
}
