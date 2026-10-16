"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { deletePdfBlob } from "@/lib/pdf-storage";
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
  /** onedrive: herkes aynı listeyi görür; local/seed: henüz OneDrive’a kaydedilmedi */
  source: "onedrive" | "local" | "seed";
  /** Son OneDrive kaydı hata verdiyse mesajı */
  syncError: string;
  syncing: boolean;
  /** Mevcut listeyi OneDrive’a elle kaydet */
  syncNow: () => Promise<boolean>;
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
  const [source, setSource] = useState<"onedrive" | "local" | "seed">("seed");
  const [syncError, setSyncError] = useState("");
  const [syncing, setSyncing] = useState(false);
  /** Admin bir değişiklik yaptıysa true — sadece o zaman OneDrive’a yazılır */
  const dirty = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const readLocalPdfs = (): PdfCatalog[] => {
      try {
        const p = localStorage.getItem(PDF_KEY);
        const parsed = p ? (JSON.parse(p) as PdfCatalog[]) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    (async () => {
      // 1) OneDrive — tüm ziyaretçiler için ortak liste
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        const data = (await res.json()) as {
          source?: string;
          categories?: Category[];
          pdfCatalogs?: PdfCatalog[];
        };
        if (
          !cancelled &&
          data.source === "onedrive" &&
          Array.isArray(data.categories) &&
          data.categories.length
        ) {
          setCategories(data.categories.map(normalizeCategory));
          const remote = Array.isArray(data.pdfCatalogs) ? data.pdfCatalogs : [];
          // Bu tarayıcıda kalmış eski (yalnız yerel) PDF’ler admin’e görünmeye devam etsin
          const ids = new Set(remote.map((x) => x.id));
          const localOnly = readLocalPdfs().filter(
            (x) => x.storageKey && !x.url && !ids.has(x.id)
          );
          setPdfCatalogs([...remote, ...localOnly]);
          setSource("onedrive");
          setReady(true);
          return;
        }
      } catch {
        /* yerel kayda düş */
      }
      if (cancelled) return;

      // 2) Bu tarayıcıdaki eski kayıt
      let src: "local" | "seed" = "seed";
      try {
        const c =
          localStorage.getItem(CAT_KEY) ||
          localStorage.getItem("dnz-insaat-categories");
        if (c) {
          const parsed = JSON.parse(c) as Category[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized = parsed.map(normalizeCategory);
            // Seed'de olup yerel kayıtta olmayan kategorileri ekle
            const ids = new Set(normalized.map((x) => x.id));
            const missing = seedCategories.filter((s) => !ids.has(s.id));
            setCategories([...normalized, ...missing.map(normalizeCategory)]);
            src = "local";
          }
        }
        const localPdfs = readLocalPdfs();
        if (localPdfs.length) setPdfCatalogs(localPdfs);
      } catch {
        /* ignore */
      }
      if (!cancelled) {
        setSource(src);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const pushToOneDrive = useCallback(
    async (cats: Category[], pdfs: PdfCatalog[]) => {
      setSyncing(true);
      try {
        const res = await fetch("/api/catalog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories: cats, pdfCatalogs: pdfs }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setSyncError(data.error || "OneDrive’a kaydedilemedi.");
          return false;
        }
        setSyncError("");
        setSource("onedrive");
        return true;
      } catch {
        setSyncError("OneDrive’a bağlanılamadı.");
        return false;
      } finally {
        setSyncing(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CAT_KEY, JSON.stringify(categories));
      localStorage.setItem(PDF_KEY, JSON.stringify(pdfCatalogs));
    } catch {
      /* ignore */
    }
    if (dirty.current) {
      dirty.current = false;
      void pushToOneDrive(categories, pdfCatalogs);
    }
  }, [categories, pdfCatalogs, ready, pushToOneDrive]);

  const syncNow = useCallback(
    () => pushToOneDrive(categories, pdfCatalogs),
    [pushToOneDrive, categories, pdfCatalogs]
  );

  const addCategory = useCallback(
    (name: string, description?: string, parentId: string | null = null) => {
      const cat = createCategory(name, description, parentId);
      dirty.current = true;
      setCategories((prev) => [...prev, cat]);
      return cat;
    },
    []
  );

  const updateCategory = useCallback((category: Category) => {
    dirty.current = true;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? normalizeCategory(category) : c
      )
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    dirty.current = true;
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
      const storageKey: string | undefined = undefined;
      let fileName = "katalog.pdf";
      let url = input.url?.trim() || undefined;

      if (input.file) {
        if (input.file.size > 4 * 1024 * 1024) {
          throw new Error("PDF en fazla 4 MB olabilir.");
        }
        fileName = input.file.name;
        // PDF OneDrive’a yüklenir ki tüm ziyaretçiler indirebilsin
        const form = new FormData();
        form.append("file", input.file);
        form.append("kind", "pdf");
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });
        const data = (await res.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };
        if (!res.ok || !data.url) {
          throw new Error(data.error || "PDF OneDrive’a yüklenemedi.");
        }
        url = data.url;
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
      dirty.current = true;
      setPdfCatalogs((prev) => [catalog, ...prev]);
      return catalog;
    },
    []
  );

  const deletePdfCatalog = useCallback(async (id: string) => {
    dirty.current = true;
    setPdfCatalogs((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.storageKey) {
        void deletePdfBlob(item.storageKey);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const updatePdfCatalog = useCallback((catalog: PdfCatalog) => {
    dirty.current = true;
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
      source,
      syncError,
      syncing,
      syncNow,
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
      source,
      syncError,
      syncing,
      syncNow,
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
