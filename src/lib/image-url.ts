/** Görsel URL yardımcıları — imgbb sayfa linki, OneDrive share vb. */

export function isImgbbPageUrl(src: string): boolean {
  try {
    const u = new URL(src);
    const host = u.hostname.toLowerCase();
    // Direkt görsel: i.ibb.co — sayfa: ibb.co / imgbb.com
    if (host === "i.ibb.co" || host.endsWith(".ibb.co") && host.startsWith("i.")) {
      return false;
    }
    return host === "ibb.co" || host === "www.ibb.co" || host === "imgbb.com" || host === "www.imgbb.com";
  } catch {
    return false;
  }
}

export function isOneDriveShareContentUrlClient(src: string): boolean {
  try {
    const u = new URL(src);
    return (
      (u.hostname === "api.onedrive.com" ||
        u.hostname.endsWith("onedrive.live.com")) &&
      u.pathname.includes("/shares/") &&
      u.pathname.includes("/content")
    );
  } catch {
    return false;
  }
}

/** Tarayıcıda doğrudan açılmayan URL’leri site proxy’sine çevir */
export function toDisplayImageSrc(src: string): string {
  if (!src) return src;
  if (isOneDriveShareContentUrlClient(src) || isImgbbPageUrl(src)) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  }
  return src;
}

export function extractOgImage(html: string): string | null {
  const patterns = [
    /property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+name=["']twitter:image["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}
