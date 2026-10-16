export function formatPrice(amount: number, currency: string = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const MATERIAL_LABELS: Record<string, string> = {
  alcipan: "Alçıpan",
  tasyunu: "Taşyünü",
  karolam: "Karolam",
  clipin: "Clip-in",
  "bolme-duvar": "Bölme Duvar",
  aksesuar: "Aksesuar / Malzeme",
  "su-tesisati": "Su Tesisatı",
  elektrik: "Elektrik",
};

export const COLOR_LABELS: Record<string, string> = {
  beyaz: "Beyaz",
  gri: "Gri",
  antrasit: "Antrasit",
  siyah: "Siyah",
  bej: "Bej",
  ral: "RAL / Özel",
};

export const USAGE_LABELS: Record<string, string> = {
  konut: "Konut",
  ofis: "Ofis",
  magaza: "Mağaza",
  otel: "Otel",
  hastane: "Hastane / Kurum",
  ticari: "Ticari",
};

/* ───── Ürün özellikleri: ad, fiyat, ebat (en × boy × kalınlık), kod, kullanım alanı, renk / desen ───── */
import type { Product } from "@/lib/types";

/** "120 cm × 250 cm × 12,5 mm"; yeni alanlar boşsa eski boyut bilgisine düşer */
export function productDimensions(p: Product): string {
  const parts = [p.en, p.boy, p.kalinlik].map((x) => (x || "").trim()).filter(Boolean);
  if (parts.length) return parts.join(" × ");
  return (p.specs?.dimensions || "").trim() || (p.size || "").trim();
}

export function productUsage(p: Product): string {
  if (p.usage?.trim()) return p.usage.trim();
  return (p.usageAreas || []).map((a) => USAGE_LABELS[a] || a).join(", ");
}

export function productPattern(p: Product): string {
  if (p.pattern?.trim()) return p.pattern.trim();
  return p.color ? COLOR_LABELS[p.color] || p.color : "";
}

export function productSpecRows(p: Product): { label: string; value: string }[] {
  return [
    { label: "Ürün kodu", value: (p.code || "").trim() },
    { label: "En", value: (p.en || "").trim() },
    { label: "Boy", value: (p.boy || "").trim() },
    { label: "Kalınlık", value: (p.kalinlik || "").trim() },
    ...(!p.en && !p.boy && !p.kalinlik ? [{ label: "Ebat", value: productDimensions(p) }] : []),
    { label: "Kullanım alanı", value: productUsage(p) },
    { label: "Renk / desen", value: productPattern(p) },
  ].filter((r) => r.value);
}

/** "/ adet · KDV hariç" */
export function priceSuffix(p: Product): string {
  return `/ ${(p.unit || "birim").trim()} · KDV ${p.vatIncluded ? "dahil" : "hariç"}`;
}
