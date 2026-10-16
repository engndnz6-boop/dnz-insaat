import { isRootCategory, seedCategories } from "@/lib/data/categories";
import type { Category, PdfCatalog } from "@/lib/types";
import { isOneDriveConfigured, readJsonFromOneDrive } from "@/lib/onedrive";

export const CATALOG_FILE = "catalog.json";

export type CatalogFile = {
  categories: Category[];
  pdfCatalogs: PdfCatalog[];
  updatedAt?: string;
};

/**
 * Admin’de düzenlenen kategoriler (OneDrive catalog.json).
 * Okunamazsa ya da henüz kayıt yoksa koddaki varsayılan kategoriler kullanılır.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    if (isOneDriveConfigured()) {
      const data = await readJsonFromOneDrive<CatalogFile>(CATALOG_FILE);
      if (data && Array.isArray(data.categories) && data.categories.length) {
        return data.categories.map((c) => ({ ...c, parentId: c.parentId ?? null }));
      }
    }
  } catch {
    /* varsayılana düş */
  }
  return seedCategories;
}

export async function getRootCategories(): Promise<Category[]> {
  return (await getCategories())
    .filter(isRootCategory)
    .sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getCategoryById(
  id: string
): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.id === id);
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  return (await getCategories())
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.order - b.order);
}
