import { createHmac, timingSafeEqual } from "crypto";

export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password ? password : null;
}

export function createAdminSessionToken(password: string): string {
  return createHmac("sha256", password)
    .update("dnz-admin-session-v1")
    .digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
