"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  createEmptyProduct,
  useProducts,
} from "@/lib/products-context";

export default function NewProductPage() {
  const router = useRouter();
  const { upsertProduct } = useProducts();
  const empty = useMemo(() => createEmptyProduct(), []);

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-bone">Yeni Ürün</h1>
      <div className="mt-8">
        <ProductForm
          initial={empty}
          onSave={async (product) => {
            await upsertProduct(product);
            router.push("/admin/urunler");
          }}
        />
      </div>
    </div>
  );
}
