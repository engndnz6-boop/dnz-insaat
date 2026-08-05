"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProducts } from "@/lib/products-context";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getById, upsertProduct, ready } = useProducts();
  const product = getById(id);

  if (!ready) {
    return <p className="text-brand-mist">Yükleniyor…</p>;
  }

  if (!product) {
    return (
      <div>
        <h1 className="section-title">Ürün bulunamadı</h1>
        <Link href="/admin/urunler" className="btn-primary mt-6">
          Listeye Dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-bone">Ürünü Düzenle</h1>
      <p className="mt-2 text-sm text-brand-mist">{product.name}</p>
      <div className="mt-8">
        <ProductForm
          initial={product}
          onSave={async (next) => {
            await upsertProduct(next);
            router.push("/admin/urunler");
          }}
        />
      </div>
    </div>
  );
}
