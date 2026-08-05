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
    name: "Galvaniz, Kutu, ABS & UMS Profil",
    slug: "galvaniz-kutu-abs-ums-profil",
    description: "Galvaniz profil, kutu profil, ABS ve UMS profil",
    order: 12,
    parentId: "cat-alcipan-tavan",
  },
  {
    id: "sub-alcipan-giydirme",
    name: "Alçıpan Giydirme Duvar",
    slug: "alcipan-giydirme-duvar",
    description: "Alçıpan giydirme duvar malzemeleri",
    order: 13,
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
    name: "Clip-in / Petek Asma Tavan",
    slug: "clipin-petek-asma-tavan",
    description: "Clip-in, klipin ve petek asma tavan panelleri",
    order: 5,
    parentId: null,
  },
  {
    id: "cat-vinil-lambiri",
    name: "Vinil Asma Tavan & Plastik Lambiri",
    slug: "vinil-asma-tavan-plastik-lambiri",
    description: "Vinil asma tavan ve plastik lambiri",
    order: 6,
    parentId: null,
  },
  {
    id: "cat-bolme",
    name: "Bölme Duvar Malzemeleri",
    slug: "bolme-duvar-malzemeleri",
    description: "Alçıpan bölme duvar sistemleri",
    order: 7,
    parentId: null,
  },
  {
    id: "cat-boya-alci",
    name: "Alçı, Boya & Malzeme",
    slug: "alci-boya-malzeme",
    description: "Alçı, boya ve genel inşaat malzemesi",
    order: 8,
    parentId: null,
  },
  {
    id: "cat-seramik-parke",
    name: "Seramik & Parke",
    slug: "seramik-parke",
    description: "Seramik, parke ve zemin kaplama",
    order: 9,
    parentId: null,
  },
  {
    id: "cat-su",
    name: "Su Tesisatı & Kombi Yedek Parça",
    slug: "su-tesisati-kombi-yedek-parca",
    description: "Su tamiratı, boru, fittings, kombi yedek parça",
    order: 10,
    parentId: null,
  },
  {
    id: "sub-su-boru",
    name: "Boru & Fittings",
    slug: "boru-fittings",
    order: 101,
    parentId: "cat-su",
  },
  {
    id: "sub-su-kombi",
    name: "Kombi Parçası & Yedek Parça",
    slug: "kombi-parcasi-yedek-parca",
    order: 102,
    parentId: "cat-su",
  },
  {
    id: "cat-elektrik",
    name: "Elektrik Malzemeleri & Tamirat",
    slug: "elektrik-malzemeleri-tamirat",
    description: "Elektrik kablo, priz, aydınlatma ve elektrik tamiratı",
    order: 11,
    parentId: null,
  },
  {
    id: "sub-elektrik-anahtar-priz",
    name: "Anahtar Prizler",
    slug: "anahtar-prizler",
    description: "Anahtar, priz ve çerçeve grupları",
    order: 111,
    parentId: "cat-elektrik",
  },
  {
    id: "sub-elektrik-kablo",
    name: "Kablolar",
    slug: "kablolar",
    order: 112,
    parentId: "cat-elektrik",
  },
  {
    id: "sub-elektrik-aydinlatma",
    name: "Aydınlatma",
    slug: "aydinlatma",
    order: 113,
    parentId: "cat-elektrik",
  },
  {
    id: "cat-tadilat",
    name: "Ev, Okul & Ofis Tadilatı",
    slug: "ev-okul-ofis-tadilati",
    description: "Anahtar teslim ev, okul ve ofis tadilatı",
    order: 12,
    parentId: null,
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
    boya: "cat-boya-alci",
    seramik: "cat-seramik-parke",
    parke: "cat-seramik-parke",
    vinil: "cat-vinil-lambiri",
    lambiri: "cat-vinil-lambiri",
    tadilat: "cat-tadilat",
  };
  return map[material] || "cat-alcipan-tavan";
}

export function isRootCategory(c: Category): boolean {
  return !c.parentId;
}
