export type MaterialType =
  | "alcipan"
  | "tasyunu"
  | "karolam"
  | "clipin"
  | "bolme-duvar"
  | "aksesuar"
  | "su-tesisati"
  | "elektrik";

export type ColorOption =
  | "beyaz"
  | "gri"
  | "antrazit"
  | "siyah"
  | "bej"
  | "ral";

export type UsageArea =
  | "konut"
  | "ofis"
  | "magaza"
  | "otel"
  | "hastane"
  | "ticari";

export interface TechnicalSpecs {
  dimensions: string;
  material: string;
  weight: string;
  warranty: string;
  thickness?: string;
  finish?: string;
  fireResistance?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  /** Ana kategori id — yoksa ana kategori, varsa alt kategori */
  parentId?: string | null;
}

export interface PdfCatalog {
  id: string;
  title: string;
  description?: string;
  /** Bağlı kategori (opsiyonel) */
  categoryId?: string;
  /** Dosya adı */
  fileName: string;
  /** IndexedDB anahtarı veya harici URL */
  storageKey?: string;
  url?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: "TRY";
  images: string[];
  /** Ana kategori */
  categoryId: string;
  /** Alt kategori (opsiyonel) */
  subcategoryId?: string;
  /** Marka — örn. Viko */
  brand?: string;
  /** Model — örn. Novella */
  model?: string;
  material: MaterialType;
  color: ColorOption;
  size: string;
  usageAreas: UsageArea[];
  specs: TechnicalSpecs;
  pdfUrl: string;
  /** Ürün teknik PDF IndexedDB anahtarı */
  pdfStorageKey?: string;
  featured?: boolean;
  inStock: boolean;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  message: string;
}
