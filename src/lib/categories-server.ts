import {
  isRootCategory,
  seedCategories,
} from "@/lib/data/categories";
import type { Category } from "@/lib/types";

export function getCategories(): Category[] {
  return seedCategories;
}

export function getRootCategories(): Category[] {
  return seedCategories
    .filter(isRootCategory)
    .sort((a, b) => a.order - b.order);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return seedCategories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return seedCategories.find((c) => c.id === id);
}

export function getSubcategories(parentId: string): Category[] {
  return seedCategories
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.order - b.order);
}
