"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Category, PdfCatalog } from "@/lib/types";
import {
  createCategory,
  isRootCategory,
  seedCategories,
  seedPdfCatalogs,
} from "@/lib/data/categories";
import { deletePdfBlob, savePdfBlob } from "@/lib/pdf-storage";
import { slugify } from "@/lib/utils";

const CAT_KEY = "dnz-insaat-categories-v2";
const PDF_KEY = "dnz-insaat-pdf-catalogs";

interface CatalogContextValue {
  categories: Category[];
  rootCategories: Category[];
  pdfCatalogs: PdfCatalog[];
  ready: boolean;
  addCategory: (
    name: string,
    description?: string,
    parentId?: string | null
  ) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
  getSubcategories: (parentId: string) => Category[];
  addPdfCatalog: (input: {
    title: string;
    description?: string;
    categoryId?: string;
    file?: File;
    url?: string;
  }) => Promise<PdfCatalog>;
  deletePdfCatalog: (id: string) => Promise<void>;
  updatePdfCatalog: (catalog: PdfCatalog) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function normalizeCategory(c: Category): Category {
  return { ...c, parentId: c.parentId ?? null };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(
    seedCategories.map(normalizeCategory)
  );
  const [pdfCatalogs, setPdfCatalogs] = useState<PdfCatalog[]>(seedPdfCatalogs);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const c =
        localStorage.getItem(CAT_KEY) ||
        localStorage.getItem("dnz-insaat-categories");
      if (c) {
        const parsed = JSON.parse(c) as Category[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeCategory);
          // Eski kayıtta alt kategori yoksa seed alt kategorilerini ekle
          const ids = new Set(normalized.map((x) => x.id));
          const missingSubs = seedCategories.filter(
            (s) => s.parentId && !ids.has(s.id)
          );
          setCategories([...normalized, ...missingSubs.map(normalizeCategory)]);
        }
      }
      const p = localStorage.getItem(PDF_KEY);
      if (p) {
        const parsed = JSON.parse(p) as PdfCatalog[];
        if (Array.isArray(parsed)) setPdfCatalogs(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CAT_KEY, JSON.stringify(categories));
  }, [categories, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(PDF_KEY, JSON.stringify(pdfCatalogs));
  }, [pdfCatalogs, ready]);

  const addCategory = useCallback(
    (name: string, description?: string, parentId: string | null = null) => {
      const cat = createCategory(name, description, parentId);
      setCategories((prev) => [...prev, cat]);
      return cat;
    },
    []
  );

  const updateCategory = useCallback((category: Category) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? normalizeCategory(category) : c
      )
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) =>
      prev.filter((c) => c.id !== id && c.parentId !== id)
    );
  }, []);

  const getCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const getSubcategories = useCallback(
    (parentId: string) =>
      categories
        .filter((c) => c.parentId === parentId)
        .sort((a, b) => a.order - b.order),
    [categories]
  );

  const addPdfCatalog = useCallback(
    async (input: {
      title: string;
      description?: string;
      categoryId?: string;
      file?: File;
      url?: string;
    }) => {
      const id = `pdf-${Date.now()}`;
      let storageKey: string | undefined;
      let fileName = "katalog.pdf";
      let url = input.url?.trim() || undefined;

      if (input.file) {
        if (input.file.size > 4 * 1024 * 1024) {
          throw new Error("PDF en fazla 4 MB olabilir.");
        }
        storageKey = id;
        fileName = input.file.name;
        await savePdfBlob(storageKey, input.file);
        url = undefined;
      }

      if (!storageKey && !url) {
        throw new Error("PDF dosyası veya link girin.");
      }

      const catalog: PdfCatalog = {
        id,
        title: input.title.trim(),
        description: input.description?.trim(),
        categoryId: input.categoryId || undefined,
        fileName,
        storageKey,
        url,
        createdAt: new Date().toISOString(),
      };
      setPdfCatalogs((prev) => [catalog, ...prev]);
      return catalog;
    },
    []
  );

  const deletePdfCatalog = useCallback(async (id: string) => {
    setPdfCatalogs((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.storageKey) {
        void deletePdfBlob(item.storageKey);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const updatePdfCatalog = useCallback((catalog: PdfCatalog) => {
    setPdfCatalogs((prev) =>
      prev.map((p) => (p.id === catalog.id ? catalog : p))
    );
  }, []);

  const rootCategories = useMemo(
    () =>
      categories
        .filter(isRootCategory)
        .sort((a, b) => a.order - b.order),
    [categories]
  );

  const value = useMemo(
    () => ({
      categories: [...categories].sort((a, b) => a.order - b.order),
      rootCategories,
      pdfCatalogs,
      ready,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategory,
      getSubcategories,
      addPdfCatalog,
      deletePdfCatalog,
      updatePdfCatalog,
    }),
    [
      categories,
      rootCategories,
      pdfCatalogs,
      ready,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategory,
      getSubcategories,
      addPdfCatalog,
      deletePdfCatalog,
      updatePdfCatalog,
    ]
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}

export function renameCategorySlug(name: string): string {
  return slugify(name);
}
