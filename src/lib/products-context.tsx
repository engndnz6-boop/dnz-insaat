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
import type { Product } from "@/lib/types";
import { products as seedProducts } from "@/lib/data/products";
import { categoryIdFromMaterial } from "@/lib/data/categories";
import { slugify } from "@/lib/utils";

const STORAGE_KEY = "dnz-insaat-products-v3";

interface ProductsContextValue {
  products: Product[];
  ready: boolean;
  getBySlug: (slug: string) => Product | undefined;
  getById: (id: string) => Product | undefined;
  getFeatured: () => Product[];
  getByCategory: (categoryId: string) => Product[];
  upsertProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetToSeed: () => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

function normalizeProduct(
  p: Product & { categoryId?: string; brand?: string; model?: string }
): Product {
  return {
    ...p,
    categoryId: p.categoryId || categoryIdFromMaterial(p.material),
    subcategoryId: p.subcategoryId || undefined,
    brand: p.brand || "",
    model: p.model || "",
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
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
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

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    seedProducts.map(normalizeProduct)
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("dnz-insaat-products-v2") ||
        localStorage.getItem("dnz-insaat-products");
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed.map(normalizeProduct));
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
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
    () => products.filter((p) => p.featured),
    [products]
  );

  const getByCategory = useCallback(
    (categoryId: string) => products.filter((p) => p.categoryId === categoryId),
    [products]
  );

  const upsertProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const normalized = normalizeProduct(product);
      const idx = prev.findIndex((p) => p.id === normalized.id);
      if (idx === -1) return [...prev, normalized];
      const next = [...prev];
      next[idx] = normalized;
      return next;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetToSeed = useCallback(() => {
    setProducts(seedProducts.map(normalizeProduct));
  }, []);

  const value = useMemo(
    () => ({
      products,
      ready,
      getBySlug,
      getById,
      getFeatured,
      getByCategory,
      upsertProduct,
      deleteProduct,
      resetToSeed,
    }),
    [
      products,
      ready,
      getBySlug,
      getById,
      getFeatured,
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
