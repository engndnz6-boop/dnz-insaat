export type CalculatorId = string;

export type MaterialLine = {
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
};

/** Admin’de düzenlenen satır: m² başına sarfiyat */
export type CalculatorMaterial = {
  id: string;
  name: string;
  unit: string;
  /** 1 m² alan için miktar katsayısı (örn. 0.85) */
  ratePerM2: number;
  unitPrice: number;
  /** Yuvarlama: round = 2 hane, ceil = yukarı tam sayı, piece = ebat katlarına */
  roundMode: "round" | "ceil" | "piece";
  /** Plaka / panel eni (cm) — örn. 120 */
  pieceWidthCm?: number;
  /** Plaka / panel boyu (cm) — örn. 250 */
  pieceHeightCm?: number;
  /** Profil vb. tek boy (metre) — örn. 3 → miktar 3’ün katına tamamlanır */
  pieceLengthM?: number;
};

export type CalculatorSystem = {
  id: CalculatorId;
  title: string;
  description: string;
  materials: CalculatorMaterial[];
};

function round(n: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

/** Ebat cm → tek parça alanı m² */
export function pieceAreaM2(widthCm?: number, heightCm?: number): number {
  const w = Number(widthCm) || 0;
  const h = Number(heightCm) || 0;
  if (w <= 0 || h <= 0) return 0;
  return (w / 100) * (h / 100);
}

function isLinearUnit(unit: string) {
  const u = unit.toLowerCase().trim();
  return u === "mt" || u === "m" || u === "metre" || u === "m.";
}

/**
 * Profil boyu (metre).
 * pieceLengthM varsa onu kullan.
 * Yoksa: birim mt ve sadece “boy cm” dolu + küçük sayı (≤12) → metre kabul et
 * (admin’de yanlışlıkla boy=3 yazılan eski kayıtlar).
 */
export function resolvePieceLengthM(m: CalculatorMaterial): number {
  if (m.pieceLengthM && m.pieceLengthM > 0) return Number(m.pieceLengthM);
  if (
    isLinearUnit(m.unit) &&
    !m.pieceWidthCm &&
    m.pieceHeightCm &&
    m.pieceHeightCm > 0 &&
    m.pieceHeightCm <= 12
  ) {
    return Number(m.pieceHeightCm);
  }
  return 0;
}

export function computeLines(
  system: CalculatorSystem,
  m2: number,
  ebatOverride?: { widthCm?: number; heightCm?: number; lengthM?: number }
): MaterialLine[] {
  return system.materials.map((m) => {
    const raw = m2 * m.ratePerM2;
    const widthCm = ebatOverride?.widthCm || m.pieceWidthCm;
    const heightCm = ebatOverride?.heightCm || m.pieceHeightCm;
    const area = pieceAreaM2(widthCm, heightCm);
    const lengthM =
      ebatOverride?.lengthM || resolvePieceLengthM({ ...m, pieceWidthCm: widthCm, pieceHeightCm: heightCm });

    // 1) Plaka: en × boy (cm) → adet
    if (area > 0 && (widthCm || 0) > 0 && (heightCm || 0) > 0) {
      const pieces = Math.max(1, Math.ceil(raw / area - 1e-9));
      return {
        name: `${m.name} (${widthCm}×${heightCm} cm)`,
        unit: m.unit === "m²" ? "adet" : m.unit || "adet",
        qty: pieces,
        unitPrice: m.unitPrice,
      };
    }

    // 2) Profil: boy (m) → metre miktarını boyun katına tamamla
    if (lengthM > 0) {
      const pieces = Math.max(1, Math.ceil(raw / lengthM - 1e-9));
      const qtyMeters = round(pieces * lengthM, 2);
      return {
        name: `${m.name} (${lengthM} m boy)`,
        unit: isLinearUnit(m.unit) ? m.unit : "mt",
        qty: qtyMeters,
        unitPrice: m.unitPrice,
      };
    }

    const qty = m.roundMode === "ceil" ? Math.ceil(raw) : round(raw);
    return {
      name: m.name,
      unit: m.unit,
      qty,
      unitPrice: m.unitPrice,
    };
  });
}

export function sumLines(lines: MaterialLine[]) {
  return lines.reduce((acc, line) => acc + line.qty * line.unitPrice, 0);
}

export function createMaterialId() {
  return `mat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createSystemId(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  return `sys-${slug || "yeni"}-${Date.now().toString(36)}`;
}

/** Varsayılan sistemler — admin’den değiştirilebilir */
export const seedCalculators: CalculatorSystem[] = [
  {
    id: "alcipan-tavan",
    title: "Alçıpan Asma Tavan",
    description:
      "Standart alçıpan asma tavan için malzeme metrajı ve maliyet.",
    materials: [
      {
        id: "alc-plaka",
        name: "Alçı plaka",
        unit: "adet",
        ratePerM2: 1,
        unitPrice: 280,
        roundMode: "piece",
        pieceWidthCm: 120,
        pieceHeightCm: 250,
      },
      {
        id: "alc-cd",
        name: "Tavan C profil (CD)",
        unit: "mt",
        ratePerM2: 0.85,
        unitPrice: 42,
        roundMode: "piece",
        pieceLengthM: 3,
      },
      {
        id: "alc-aski",
        name: "Askı teli / askı",
        unit: "adet",
        ratePerM2: 1.1,
        unitPrice: 8,
        roundMode: "ceil",
      },
      {
        id: "alc-vida",
        name: "Vida & dübel seti",
        unit: "paket",
        ratePerM2: 1 / 15,
        unitPrice: 95,
        roundMode: "ceil",
      },
      {
        id: "alc-macun",
        name: "Derz bandı + macun",
        unit: "set",
        ratePerM2: 1 / 20,
        unitPrice: 120,
        roundMode: "ceil",
      },
    ],
  },
  {
    id: "isik-bandi",
    title: "Alçıpan Işık Bandı",
    description: "Gizli aydınlatma / ışık bandı detayı için metraj.",
    materials: [
      {
        id: "ib-profil",
        name: "Işık bandı profil / sac",
        unit: "mt",
        ratePerM2: 1.15,
        unitPrice: 95,
        roundMode: "piece",
        pieceLengthM: 3,
      },
      {
        id: "ib-plaka",
        name: "Alçıpan (detay)",
        unit: "adet",
        ratePerM2: 0.45,
        unitPrice: 280,
        roundMode: "piece",
        pieceWidthCm: 120,
        pieceHeightCm: 250,
      },
      {
        id: "ib-led",
        name: "LED şerit (opsiyonel)",
        unit: "mt",
        ratePerM2: 1.1,
        unitPrice: 75,
        roundMode: "round",
      },
      {
        id: "ib-macun",
        name: "Macun & boya hazırlık",
        unit: "set",
        ratePerM2: 1 / 12,
        unitPrice: 110,
        roundMode: "ceil",
      },
    ],
  },
  {
    id: "tasyunu",
    title: "Taşyünü Asma Tavan",
    description: "60x60 taşyünü panel + ızgara sistemi.",
    materials: [
      {
        id: "ty-panel",
        name: "Taşyünü panel 60x60",
        unit: "m²",
        ratePerM2: 1.05,
        unitPrice: 220,
        roundMode: "round",
      },
      {
        id: "ty-ana",
        name: "Ana taşıyıcı ızgara",
        unit: "mt",
        ratePerM2: 1.4,
        unitPrice: 55,
        roundMode: "round",
      },
      {
        id: "ty-tali",
        name: "Tali taşıyıcı",
        unit: "mt",
        ratePerM2: 2.8,
        unitPrice: 38,
        roundMode: "round",
      },
      {
        id: "ty-aski",
        name: "Askı & klips",
        unit: "adet",
        ratePerM2: 1.2,
        unitPrice: 12,
        roundMode: "ceil",
      },
    ],
  },
  {
    id: "karolam",
    title: "Karolam Asma Tavan",
    description: "Karolam panel ve taşıyıcı sistem.",
    materials: [
      {
        id: "kr-panel",
        name: "Karolam panel",
        unit: "m²",
        ratePerM2: 1.05,
        unitPrice: 260,
        roundMode: "round",
      },
      {
        id: "kr-profil",
        name: "Taşıyıcı profil",
        unit: "mt",
        ratePerM2: 3.0,
        unitPrice: 48,
        roundMode: "round",
      },
      {
        id: "kr-aski",
        name: "Askı elemanları",
        unit: "adet",
        ratePerM2: 1.15,
        unitPrice: 14,
        roundMode: "ceil",
      },
    ],
  },
  {
    id: "clipin",
    title: "Clip-in Asma Tavan",
    description: "Clip-in metal tavan panelleri.",
    materials: [
      {
        id: "cl-panel",
        name: "Clip-in panel",
        unit: "m²",
        ratePerM2: 1.05,
        unitPrice: 340,
        roundMode: "round",
      },
      {
        id: "cl-ray",
        name: "Taşıyıcı ray",
        unit: "mt",
        ratePerM2: 2.5,
        unitPrice: 65,
        roundMode: "round",
      },
      {
        id: "cl-aski",
        name: "Askı & aksesuar",
        unit: "adet",
        ratePerM2: 1.2,
        unitPrice: 18,
        roundMode: "ceil",
      },
    ],
  },
  {
    id: "bolme-duvar",
    title: "Alçıpan Bölme Duvar",
    description: "Tek sıra alçıpan bölme duvar.",
    materials: [
      {
        id: "bd-plaka",
        name: "Alçıpan plaka (çift yüz)",
        unit: "adet",
        ratePerM2: 2.1,
        unitPrice: 280,
        roundMode: "piece",
        pieceWidthCm: 120,
        pieceHeightCm: 250,
      },
      {
        id: "bd-profil",
        name: "UW / CW profil",
        unit: "mt",
        ratePerM2: 3.5,
        unitPrice: 45,
        roundMode: "round",
      },
      {
        id: "bd-yunu",
        name: "Taşyünü dolgu (opsiyonel)",
        unit: "m²",
        ratePerM2: 1.0,
        unitPrice: 95,
        roundMode: "round",
      },
      {
        id: "bd-set",
        name: "Vida, bant, macun",
        unit: "set",
        ratePerM2: 1 / 12,
        unitPrice: 130,
        roundMode: "ceil",
      },
    ],
  },
];
