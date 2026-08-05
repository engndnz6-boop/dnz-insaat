import { brand } from "@/lib/brand";

export type SiteSettings = {
  companyName: string;
  tagline: string;
  logoUrl: string;
  heroSubtitle: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "DNZ İnşaat Malzemeleri",
  tagline: brand.tagline,
  logoUrl: "/logo-dnz.png",
  heroSubtitle:
    "Alçıpan, profil, asma tavan ve tadilat — Ankara Gölbaşı.",
};

export function normalizeSiteSettings(
  input?: Partial<SiteSettings> | null
): SiteSettings {
  return {
    companyName: (input?.companyName || "").trim() || DEFAULT_SITE_SETTINGS.companyName,
    tagline: (input?.tagline || "").trim() || DEFAULT_SITE_SETTINGS.tagline,
    logoUrl: (input?.logoUrl || "").trim() || DEFAULT_SITE_SETTINGS.logoUrl,
    heroSubtitle:
      (input?.heroSubtitle || "").trim() || DEFAULT_SITE_SETTINGS.heroSubtitle,
  };
}
