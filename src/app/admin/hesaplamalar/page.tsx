"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useCalculators } from "@/lib/calculators-context";
import type { CalculatorSystem } from "@/lib/calculators";

export default function AdminHesaplamalarPage() {
  const {
    systems,
    ready,
    addSystem,
    updateSystem,
    deleteSystem,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    resetToSeed,
  } = useCalculators();
  const [activeId, setActiveId] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");

  const active =
    systems.find((s) => s.id === (activeId || systems[0]?.id)) || null;

  if (!ready) {
    return <p className="text-brand-mist">Yükleniyor…</p>;
  }

  const saveActive = (next: CalculatorSystem) => {
    updateSystem(next);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-bone">
            Hesaplama Sistemleri
          </h1>
          <p className="mt-2 text-sm text-brand-mist">
            Sarfiyat katsayıları (m² başına), plaka ebatı ve birim fiyatları
            buradan düzenlenir. Ebat girince miktar ebatın katlarına (adet)
            tamamlanır.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => {
              if (confirm("Tüm hesaplamalar varsayılana sıfırlansın mı?")) {
                resetToSeed();
                setActiveId("");
              }
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Sıfırla
          </button>
          <Link href="/hesaplama" className="btn-secondary text-xs" target="_blank">
            Site hesaplamayı aç
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3">
          <div className="border border-black/10 bg-brand-anthracite/40 p-3">
            <p className="label-field">Sistemler</p>
            <nav className="mt-2 flex flex-col gap-1">
              {systems.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={`px-3 py-2 text-left text-sm ${
                    active?.id === s.id
                      ? "bg-brand-navy text-white"
                      : "border border-black/10 text-brand-bone hover:border-brand-navy/30"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="border border-black/10 bg-brand-anthracite/40 p-3">
            <p className="label-field">Yeni sistem ekle</p>
            <input
              className="input-field mt-1"
              placeholder="Örn. 60x60 Taşyünü"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary mt-2 w-full text-xs"
              onClick={() => {
                if (!newTitle.trim()) return;
                const created = addSystem(newTitle.trim());
                setNewTitle("");
                setActiveId(created.id);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Sistem Ekle
            </button>
          </div>
        </aside>

        {active ? (
          <section className="space-y-5 border border-black/10 bg-brand-anthracite/40 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label-field">Sistem adı</span>
                <input
                  className="input-field"
                  value={active.title}
                  onChange={(e) =>
                    saveActive({ ...active, title: e.target.value })
                  }
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="label-field">Açıklama</span>
                <textarea
                  className="input-field min-h-[72px]"
                  value={active.description}
                  onChange={(e) =>
                    saveActive({ ...active, description: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-3">
              <h2 className="font-sans text-lg font-bold text-brand-bone">
                Malzemeler & sarfiyat
              </h2>
              <button
                type="button"
                className="btn-secondary text-xs"
                onClick={() => addMaterial(active.id)}
              >
                <Plus className="h-3.5 w-3.5" />
                Malzeme ekle
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-brand-navy text-xs uppercase tracking-wider text-white/80">
                  <tr>
                    <th className="px-3 py-2 font-medium">Malzeme</th>
                    <th className="px-3 py-2 font-medium">Birim</th>
                    <th className="px-3 py-2 font-medium">Sarfiyat / m²</th>
                    <th className="px-3 py-2 font-medium">Ebat en cm</th>
                    <th className="px-3 py-2 font-medium">Ebat boy cm</th>
                    <th className="px-3 py-2 font-medium">Birim fiyat ₺</th>
                    <th className="px-3 py-2 font-medium">Yuvarlama</th>
                    <th className="px-3 py-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {active.materials.map((m) => (
                    <tr key={m.id} className="border-t border-black/5">
                      <td className="px-2 py-2">
                        <input
                          className="input-field py-2"
                          value={m.name}
                          onChange={(e) =>
                            updateMaterial(active.id, m.id, {
                              name: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className="input-field py-2"
                          value={m.unit}
                          onChange={(e) =>
                            updateMaterial(active.id, m.id, {
                              unit: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="input-field py-2"
                          value={m.ratePerM2}
                          onChange={(e) =>
                            updateMaterial(active.id, m.id, {
                              ratePerM2: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          className="input-field py-2"
                          placeholder="120"
                          value={m.pieceWidthCm ?? ""}
                          onChange={(e) =>
                            updateMaterial(active.id, m.id, {
                              pieceWidthCm: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          className="input-field py-2"
                          placeholder="250"
                          value={m.pieceHeightCm ?? ""}
                          onChange={(e) =>
                            updateMaterial(active.id, m.id, {
                              pieceHeightCm: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="input-field py-2"
                          value={m.unitPrice}
                          onChange={(e) =>
                            updateMaterial(active.id, m.id, {
                              unitPrice: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          className="input-field py-2"
                          value={m.roundMode}
                          onChange={(e) =>
                            updateMaterial(active.id, m.id, {
                              roundMode: e.target.value as
                                | "round"
                                | "ceil"
                                | "piece",
                            })
                          }
                        >
                          <option value="round">Ondalık</option>
                          <option value="ceil">Yukarı tam</option>
                          <option value="piece">Ebat katı (adet)</option>
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          className="btn-ghost text-xs text-red-600"
                          onClick={() => {
                            if (confirm("Bu malzeme silinsin mi?")) {
                              deleteMaterial(active.id, m.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-brand-mist">
              Ebat örneği: alçı plaka 120×250 cm → alan ebatın katlarına göre
              adet tamamlanır (örn. 50 m² ≈ 17 plaka). Yuvarlama ={" "}
              <strong>Ebat katı</strong> seçin; birim fiyatı plaka başına yazın.
            </p>

            <button
              type="button"
              className="btn-ghost text-xs text-red-600"
              onClick={() => {
                if (confirm(`"${active.title}" silinsin mi?`)) {
                  deleteSystem(active.id);
                  setActiveId("");
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Bu sistemi sil
            </button>
          </section>
        ) : (
          <p className="text-sm text-brand-mist">Sistem seçin veya yeni ekleyin.</p>
        )}
      </div>
    </div>
  );
}
