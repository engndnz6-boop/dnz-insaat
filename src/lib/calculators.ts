export type CalculatorId =
  | "alcipan-tavan"
  | "isik-bandi"
  | "tasyunu"
  | "karolam"
  | "clipin"
  | "bolme-duvar";

export type MaterialLine = {
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
};

export type CalculatorDef = {
  id: CalculatorId;
  title: string;
  description: string;
  /** m² başına yaklaşık malzeme listesi üretici */
  compute: (m2: number) => MaterialLine[];
};

function round(n: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

/** Demo birim fiyatlar — teklif için referans, kesin fiyat değildir */
export const calculators: CalculatorDef[] = [
  {
    id: "alcipan-tavan",
    title: "Alçıpan Asma Tavan",
    description:
      "Standart alçıpan asma tavan için yaklaşık malzeme metrajı ve maliyet.",
    compute: (m2) => [
      {
        name: "Alçıpan plaka (12.5 mm)",
        unit: "m²",
        qty: round(m2 * 1.05),
        unitPrice: 185,
      },
      {
        name: "Tavan profili (CD)",
        unit: "mt",
        qty: round(m2 * 3.2),
        unitPrice: 42,
      },
      {
        name: "Askı teli / askı",
        unit: "adet",
        qty: Math.ceil(m2 * 1.1),
        unitPrice: 8,
      },
      {
        name: "Vida & dübel seti",
        unit: "paket",
        qty: Math.ceil(m2 / 15),
        unitPrice: 95,
      },
      {
        name: "Derz bandı + macun",
        unit: "set",
        qty: Math.ceil(m2 / 20),
        unitPrice: 120,
      },
    ],
  },
  {
    id: "isik-bandi",
    title: "Alçıpan Işık Bandı",
    description: "Gizli aydınlatma / ışık bandı detayı için yaklaşık metraj.",
    compute: (m2) => [
      {
        name: "Işık bandı profil / sac",
        unit: "mt",
        qty: round(m2 * 1.15),
        unitPrice: 95,
      },
      {
        name: "Alçıpan (detay)",
        unit: "m²",
        qty: round(m2 * 0.45),
        unitPrice: 185,
      },
      {
        name: "LED şerit (opsiyonel)",
        unit: "mt",
        qty: round(m2 * 1.1),
        unitPrice: 75,
      },
      {
        name: "Macun & boya hazırlık",
        unit: "set",
        qty: Math.ceil(m2 / 12),
        unitPrice: 110,
      },
    ],
  },
  {
    id: "tasyunu",
    title: "Taşyünü Asma Tavan",
    description: "60x60 taşyünü panel + ızgara sistemi yaklaşık maliyeti.",
    compute: (m2) => [
      {
        name: "Taşyünü panel 60x60",
        unit: "m²",
        qty: round(m2 * 1.05),
        unitPrice: 220,
      },
      {
        name: "Ana taşıyıcı ızgara",
        unit: "mt",
        qty: round(m2 * 1.4),
        unitPrice: 55,
      },
      {
        name: "Tali taşıyıcı",
        unit: "mt",
        qty: round(m2 * 2.8),
        unitPrice: 38,
      },
      {
        name: "Askı & klips",
        unit: "adet",
        qty: Math.ceil(m2 * 1.2),
        unitPrice: 12,
      },
    ],
  },
  {
    id: "karolam",
    title: "Karolam Asma Tavan",
    description: "Karolam panel ve taşıyıcı sistem yaklaşık metrajı.",
    compute: (m2) => [
      {
        name: "Karolam panel",
        unit: "m²",
        qty: round(m2 * 1.05),
        unitPrice: 260,
      },
      {
        name: "Taşıyıcı profil",
        unit: "mt",
        qty: round(m2 * 3.0),
        unitPrice: 48,
      },
      {
        name: "Askı elemanları",
        unit: "adet",
        qty: Math.ceil(m2 * 1.15),
        unitPrice: 14,
      },
    ],
  },
  {
    id: "clipin",
    title: "Clip-in Asma Tavan",
    description: "Clip-in metal tavan panelleri için yaklaşık maliyet.",
    compute: (m2) => [
      {
        name: "Clip-in panel",
        unit: "m²",
        qty: round(m2 * 1.05),
        unitPrice: 340,
      },
      {
        name: "Taşıyıcı ray",
        unit: "mt",
        qty: round(m2 * 2.5),
        unitPrice: 65,
      },
      {
        name: "Askı & aksesuar",
        unit: "adet",
        qty: Math.ceil(m2 * 1.2),
        unitPrice: 18,
      },
    ],
  },
  {
    id: "bolme-duvar",
    title: "Alçıpan Bölme Duvar",
    description: "Tek sıra alçıpan bölme duvar için yaklaşık malzeme.",
    compute: (m2) => [
      {
        name: "Alçıpan plaka (çift yüz)",
        unit: "m²",
        qty: round(m2 * 2.1),
        unitPrice: 185,
      },
      {
        name: "UW / CW profil",
        unit: "mt",
        qty: round(m2 * 3.5),
        unitPrice: 45,
      },
      {
        name: "Taşyünü dolgu (opsiyonel)",
        unit: "m²",
        qty: round(m2 * 1.0),
        unitPrice: 95,
      },
      {
        name: "Vida, bant, macun",
        unit: "set",
        qty: Math.ceil(m2 / 12),
        unitPrice: 130,
      },
    ],
  },
];

export function getCalculator(id: CalculatorId) {
  return calculators.find((c) => c.id === id) || calculators[0];
}

export function sumLines(lines: MaterialLine[]) {
  return lines.reduce((acc, line) => acc + line.qty * line.unitPrice, 0);
}
