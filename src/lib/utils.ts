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
