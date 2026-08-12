import { products as seedProducts } from "@/lib/data/products";
import { isOneDriveConfigured, readJsonFromOneDrive } from "@/lib/onedrive";
import type { Product } from "@/lib/types";

const FILE = "products.json";

type ProductsFile = { products: Product[]; updatedAt?: string };

export async function getProducts(): Promise<Product[]> {
  try {
    if (isOneDriveConfigured()) {
      const data = await readJsonFromOneDrive<ProductsFile>(FILE);
      if (data?.products?.length) return data.products;
    }
  } catch {
    /* seed fallback */
  }
  return seedProducts;
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.slug);
}
