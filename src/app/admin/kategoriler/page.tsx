"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, CornerDownRight } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";
import { slugify } from "@/lib/utils";
import { useProducts } from "@/lib/products-context";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const {
    rootCategories,
    getSubcategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCatalog();
  const { products } = useProducts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory(name, description, parentId || null);
    setName("");
    setDescription("");
    setParentId("");
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
  };

  const saveEdit = (cat: Category) => {
    if (!editName.trim()) return;
    updateCategory({
      ...cat,
      name: editName.trim(),
      slug: slugify(editName),
      description: editDesc.trim(),
    });
    setEditingId(null);
  };

  const productCount = (id: string, mode: "root" | "sub") =>
    products.filter((p) =>
      mode === "root" ? p.categoryId === id : p.subcategoryId === id
    ).length;

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-bone">Kategoriler</h1>
      <p className="mt-2 text-sm text-brand-mist">
        Ana kategori ve alt kategori ekleyin. Örnek: Elektrik Malzemeleri →
        Anahtar Prizler. Ürünlerde ayrıca marka (Viko) ve model girilir.
      </p>

      <form
        onSubmit={onAdd}
        className="mt-8 grid gap-3 border border-white/5 bg-brand-anthracite/40 p-5 lg:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <input
          className="input-field"
          placeholder="Kategori / alt kategori adı *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="input-field"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">Ana kategori olarak ekle</option>
          {rootCategories.map((c) => (
            <option key={c.id} value={c.id}>
              Alt kategori → {c.name}
            </option>
          ))}
        </select>
        <input
          className="input-field"
          placeholder="Açıklama (opsiyonel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          <Plus className="h-4 w-4" />
          Ekle
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {rootCategories.map((cat) => {
          const subs = getSubcategories(cat.id);
          return (
            <li
              key={cat.id}
              className="border border-white/5 bg-brand-anthracite/50"
            >
              <Row
                cat={cat}
                count={productCount(cat.id, "root")}
                editing={editingId === cat.id}
                editName={editName}
                editDesc={editDesc}
                setEditName={setEditName}
                setEditDesc={setEditDesc}
                onEdit={() => startEdit(cat)}
                onSave={() => saveEdit(cat)}
                onCancel={() => setEditingId(null)}
                onAddSub={() => {
                  setParentId(cat.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onDelete={() => {
                  if (subs.length > 0) {
                    alert("Önce alt kategorileri silin.");
                    return;
                  }
                  if (productCount(cat.id, "root") > 0) {
                    alert("Bu kategoride ürün var.");
                    return;
                  }
                  if (confirm(`“${cat.name}” silinsin mi?`)) {
                    deleteCategory(cat.id);
                  }
                }}
              />
              {subs.map((sub) => (
                <div
                  key={sub.id}
                  className="border-t border-white/5 pl-4 sm:pl-8"
                >
                  <Row
                    cat={sub}
                    isSub
                    count={productCount(sub.id, "sub")}
                    editing={editingId === sub.id}
                    editName={editName}
                    editDesc={editDesc}
                    setEditName={setEditName}
                    setEditDesc={setEditDesc}
                    onEdit={() => startEdit(sub)}
                    onSave={() => saveEdit(sub)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => {
                      if (productCount(sub.id, "sub") > 0) {
                        alert("Bu alt kategoride ürün var.");
                        return;
                      }
                      if (confirm(`“${sub.name}” silinsin mi?`)) {
                        deleteCategory(sub.id);
                      }
                    }}
                  />
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Row({
  cat,
  count,
  isSub,
  editing,
  editName,
  editDesc,
  setEditName,
  setEditDesc,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAddSub,
}: {
  cat: Category;
  count: number;
  isSub?: boolean;
  editing: boolean;
  editName: string;
  editDesc: string;
  setEditName: (v: string) => void;
  setEditDesc: (v: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onAddSub?: () => void;
}) {
  if (editing) {
    return (
      <div className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]">
        <input
          className="input-field"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <input
          className="input-field"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="button" className="btn-primary text-xs" onClick={onSave}>
            Kaydet
          </button>
          <button type="button" className="btn-ghost text-xs" onClick={onCancel}>
            İptal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 p-4">
      <div className="flex items-start gap-2">
        {isSub && (
          <CornerDownRight className="mt-1 h-4 w-4 shrink-0 text-brand-gold" />
        )}
        <div>
          <p className={`font-medium text-brand-bone ${isSub ? "text-sm" : ""}`}>
            {cat.name}
          </p>
          {cat.description && (
            <p className="mt-1 text-xs text-brand-mist">{cat.description}</p>
          )}
          <p className="mt-2 text-xs text-brand-gold">
            {isSub ? "Alt kategori" : "Ana kategori"} · {count} ürün
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {onAddSub && (
          <button
            type="button"
            className="btn-secondary py-1.5 text-[10px]"
            onClick={onAddSub}
          >
            <Plus className="h-3 w-3" />
            Alt kategori
          </button>
        )}
        <button
          type="button"
          className="p-2 text-brand-mist hover:text-brand-gold"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 text-brand-mist hover:text-red-400"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
