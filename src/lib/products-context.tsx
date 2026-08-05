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
import type { Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";
import { categoryIdFromMaterial } from "@/lib/data/categories";
import { slugify } from "@/lib/utils";

const STORAGE_KEY = "dnz-insaat-products-v3";

interface ProductsContextValue {
  products: Product[];
  ready: boolean;
  source: "onedrive" | "local" | "seed";
  getBySlug: (slug: string) => Product | undefined;
  getById: (id: string) => Product | undefined;
  getFeatured: () => Product[];
  getProjects: () => Product[];
  getSaleProducts: () => Product[];
  getByCategory: (categoryId: string) => Product[];
  upsertProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetToSeed: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

function normalizeProduct(
  p: Product & { categoryId?: string; brand?: string; model?: string }
): Product {
  return {
    ...p,
    kind: p.kind === "project" ? "project" : "sale",
    categoryId: p.categoryId || categoryIdFromMaterial(p.material),
    subcategoryId: p.subcategoryId || undefined,
    brand: p.brand || "",
    model: p.model || "",
    projectLocation: p.projectLocation || "",
    projectCategory: p.projectCategory || "",
  };
}

export function createEmptyProduct(categoryId?: string): Product {
  const id = `p-${Date.now()}`;
  return {
    id,
    slug: `yeni-urun-${id}`,
    name: "Yeni Ürün",
    shortDescription: "",
    description: "",
    price: 0,
    currency: "TRY",
    images: [],
    kind: "sale",
    projectLocation: "",
    projectCategory: "",
    categoryId: categoryId || "cat-alcipan-tavan",
    subcategoryId: undefined,
    brand: "",
    model: "",
    material: "alcipan",
    color: "beyaz",
    size: "m²",
    usageAreas: ["konut"],
    specs: {
      dimensions: "",
      material: "",
      weight: "",
      warranty: "",
    },
    pdfUrl: "",
    featured: false,
    inStock: true,
  };
}

export { slugify };

async function persistToOneDrive(products: Product[]): Promise<boolean> {
  try {
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    seedProducts.map(normalizeProduct)
  );
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"onedrive" | "local" | "seed">("seed");
  const productsRef = useRef(products);
  productsRef.current = products;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = (await res.json()) as {
          products?: Product[];
          source?: string;
        };
        if (
          !cancelled &&
          Array.isArray(data.products) &&
          data.products.length > 0 &&
          data.source === "onedrive"
        ) {
          setProducts(data.products.map(normalizeProduct));
          setSource("onedrive");
          setReady(true);
          return;
        }
      } catch {
        /* fall through to local */
      }

      if (cancelled) return;
      try {
        const raw =
          localStorage.getItem(STORAGE_KEY) ||
          localStorage.getItem("dnz-insaat-products-v2") ||
          localStorage.getItem("dnz-insaat-products");
        if (raw) {
          const parsed = JSON.parse(raw) as Product[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed.map(normalizeProduct));
            setSource("local");
            setReady(true);
            return;
          }
        }
      } catch {
        /* ignore */
      }
      if (!cancelled) {
        setSource("seed");
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, ready]);

  const getBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getFeatured = useCallback(
    () => products.filter((p) => p.featured && p.kind !== "project"),
    [products]
  );

  const getProjects = useCallback(
    () => products.filter((p) => p.kind === "project"),
    [products]
  );

  const getSaleProducts = useCallback(
    () => products.filter((p) => p.kind !== "project"),
    [products]
  );

  const getByCategory = useCallback(
    (categoryId: string) =>
      products.filter(
        (p) => p.kind !== "project" && p.categoryId === categoryId
      ),
    [products]
  );

  const upsertProduct = useCallback(async (product: Product) => {
    const normalized = normalizeProduct(product);
    const prev = productsRef.current;
    const idx = prev.findIndex((p) => p.id === normalized.id);
    const next =
      idx === -1
        ? [...prev, normalized]
        : prev.map((p, i) => (i === idx ? normalized : p));
    setProducts(next);
    const ok = await persistToOneDrive(next);
    if (ok) setSource("onedrive");
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const next = productsRef.current.filter((p) => p.id !== id);
    setProducts(next);
    const ok = await persistToOneDrive(next);
    if (ok) setSource("onedrive");
  }, []);

  const resetToSeed = useCallback(async () => {
    const next = seedProducts.map(normalizeProduct);
    setProducts(next);
    const ok = await persistToOneDrive(next);
    if (ok) setSource("onedrive");
    else setSource("seed");
  }, []);

  const value = useMemo(
    () => ({
      products,
      ready,
      source,
      getBySlug,
      getById,
      getFeatured,
      getProjects,
      getSaleProducts,
      getByCategory,
      upsertProduct,
      deleteProduct,
      resetToSeed,
    }),
    [
      products,
      ready,
      source,
      getBySlug,
      getById,
      getFeatured,
      getProjects,
      getSaleProducts,
      getByCategory,
      upsertProduct,
      deleteProduct,
      resetToSeed,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
