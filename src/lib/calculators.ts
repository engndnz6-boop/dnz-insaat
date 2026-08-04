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
  /** Yuvarlama: round = 2 hane, ceil = yukarı tam sayı */
  roundMode: "round" | "ceil";
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

export function computeLines(
  system: CalculatorSystem,
  m2: number
): MaterialLine[] {
  return system.materials.map((m) => {
    const raw = m2 * m.ratePerM2;
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
        unit: "m²",
        ratePerM2: 1,
        unitPrice: 185,
        roundMode: "round",
      },
      {
        id: "alc-cd",
        name: "Tavan C profil (CD)",
        unit: "mt",
        ratePerM2: 0.85,
        unitPrice: 42,
        roundMode: "round",
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
        roundMode: "round",
      },
      {
        id: "ib-plaka",
        name: "Alçıpan (detay)",
        unit: "m²",
        ratePerM2: 0.45,
        unitPrice: 185,
        roundMode: "round",
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
        unit: "m²",
        ratePerM2: 2.1,
        unitPrice: 185,
        roundMode: "round",
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
