import type { Category, PdfCatalog } from "@/lib/types";
import { slugify } from "@/lib/utils";

export const seedCategories: Category[] = [
  {
    id: "cat-alcipan-tavan",
    name: "Alçıpan Asma Tavan Malzemeleri",
    slug: "alcipan-asma-tavan-malzemeleri",
    description: "Alçıpan plaka, profil, askı ve tavan aksesuarları",
    order: 1,
    parentId: null,
  },
  {
    id: "sub-alcipan-plaka",
    name: "Alçıpan Plakalar",
    slug: "alcipan-plakalar",
    order: 11,
    parentId: "cat-alcipan-tavan",
  },
  {
    id: "sub-alcipan-profil",
    name: "Profiller & Askılar",
    slug: "profiller-askilar",
    order: 12,
    parentId: "cat-alcipan-tavan",
  },
  {
    id: "cat-isik-bandi",
    name: "Alçıpan Işık Bandı Malzemeleri",
    slug: "alcipan-isik-bandi-malzemeleri",
    description: "Işık bandı / gizli aydınlatma detay malzemeleri",
    order: 2,
    parentId: null,
  },
  {
    id: "cat-tasyunu",
    name: "Taşyünü Asma Tavan Malzemeleri",
    slug: "tasyunu-asma-tavan-malzemeleri",
    description: "Taşyünü panel ve ızgara sistemleri",
    order: 3,
    parentId: null,
  },
  {
    id: "cat-karolam",
    name: "Karolam Asma Tavan Malzemeleri",
    slug: "karolam-asma-tavan-malzemeleri",
    description: "Karolam panel ve taşıyıcı sistemler",
    order: 4,
    parentId: null,
  },
  {
    id: "cat-clipin",
    name: "Clip-in Asma Tavan Malzemeleri",
    slug: "clipin-asma-tavan-malzemeleri",
    description: "Clip-in metal tavan panelleri",
    order: 5,
    parentId: null,
  },
  {
    id: "cat-bolme",
    name: "Bölme Duvar Malzemeleri",
    slug: "bolme-duvar-malzemeleri",
    description: "Alçıpan bölme duvar sistemleri",
    order: 6,
    parentId: null,
  },
  {
    id: "cat-su",
    name: "Su Tesisatı Malzemeleri",
    slug: "su-tesisati-malzemeleri",
    description: "Su tesisatı boru, fittings ve aksesuarlar",
    order: 7,
    parentId: null,
  },
  {
    id: "sub-su-boru",
    name: "Boru & Fittings",
    slug: "boru-fittings",
    order: 71,
    parentId: "cat-su",
  },
  {
    id: "cat-elektrik",
    name: "Elektrik Malzemeleri",
    slug: "elektrik-malzemeleri",
    description: "Elektrik kablo, priz, aydınlatma malzemeleri",
    order: 8,
    parentId: null,
  },
  {
    id: "sub-elektrik-anahtar-priz",
    name: "Anahtar Prizler",
    slug: "anahtar-prizler",
    description: "Anahtar, priz ve çerçeve grupları",
    order: 81,
    parentId: "cat-elektrik",
  },
  {
    id: "sub-elektrik-kablo",
    name: "Kablolar",
    slug: "kablolar",
    order: 82,
    parentId: "cat-elektrik",
  },
  {
    id: "sub-elektrik-aydinlatma",
    name: "Aydınlatma",
    slug: "aydinlatma",
    order: 83,
    parentId: "cat-elektrik",
  },
];

export const seedPdfCatalogs: PdfCatalog[] = [];

export function createCategory(
  name: string,
  description = "",
  parentId: string | null = null
): Category {
  return {
    id: `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    slug: slugify(name),
    description,
    order: Date.now(),
    parentId,
  };
}

/** Eski ürünlerde material → kategori eşlemesi */
export function categoryIdFromMaterial(material: string): string {
  const map: Record<string, string> = {
    alcipan: "cat-alcipan-tavan",
    tasyunu: "cat-tasyunu",
    karolam: "cat-karolam",
    clipin: "cat-clipin",
    "bolme-duvar": "cat-bolme",
    aksesuar: "cat-alcipan-tavan",
    "su-tesisati": "cat-su",
    elektrik: "cat-elektrik",
  };
  return map[material] || "cat-alcipan-tavan";
}

export function isRootCategory(c: Category): boolean {
  return !c.parentId;
}
