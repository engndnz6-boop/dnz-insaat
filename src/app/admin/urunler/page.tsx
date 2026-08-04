"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, RotateCcw } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { useCatalog } from "@/lib/catalog-context";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const { products, deleteProduct, resetToSeed } = useProducts();
  const { getCategory } = useCatalog();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-bone">Ürünler</h1>
          <p className="mt-2 text-sm text-brand-mist">
            {products.length} ürün · değişiklikler tarayıcıda saklanır
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Tüm ürünler varsayılana sıfırlansın mı?")) {
                resetToSeed();
              }
            }}
            className="btn-ghost text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Sıfırla
          </button>
          <Link href="/admin/urunler/yeni" className="btn-primary text-xs">
            <Plus className="h-3.5 w-3.5" />
            Yeni Ürün
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-black/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-brand-anthracite text-xs uppercase tracking-wider text-brand-mist">
            <tr>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Marka / Model</th>
              <th className="px-4 py-3 font-medium">Fiyat</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-brand-slate">
                      <Image
                        src={p.images[0]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-brand-bone">{p.name}</p>
                      <p className="text-xs text-brand-mist">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-mist">
                  <span className="block">
                    {getCategory(p.categoryId)?.name || "—"}
                  </span>
                  {p.subcategoryId && (
                    <span className="text-xs text-brand-gold">
                      → {getCategory(p.subcategoryId)?.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-mist">
                  {[p.brand, p.model].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="px-4 py-3 text-brand-gold">
                  {formatPrice(p.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.inStock ? "text-brand-gold" : "text-red-300"
                    }
                  >
                    {p.inStock ? "Var" : "Yok"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/urunler/${p.id}`}
                      className="p-2 text-brand-mist hover:text-brand-gold"
                      aria-label="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      className="p-2 text-brand-mist hover:text-red-400"
                      aria-label="Sil"
                      onClick={() => {
                        if (confirm(`“${p.name}” silinsin mi?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
