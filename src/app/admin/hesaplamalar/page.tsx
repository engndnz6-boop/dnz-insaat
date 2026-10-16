"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useImalat } from "@/lib/imalat/context";
import {
  computeImalat,
  fmtQ,
  sumImalat,
  type ImalatKind,
  type ImalatSystem,
} from "@/lib/imalat/engine";
import {
  KIND_LABEL,
  MATERIAL_KEYS,
  PARAMS,
  dimLabels,
  seedImalat,
} from "@/lib/imalat/systems";
import { formatPrice } from "@/lib/utils";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const toNum = (v: string) => Number(String(v).replace(",", ".")) || 0;

export default function AdminImalatPage() {
  const { systems, ready, source, save } = useImalat();
  const [draft, setDraft] = useState<ImalatSystem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [testA, setTestA] = useState("6");
  const [testB, setTestB] = useState("4.5");
  /** Sayı kutuları yazılırken virgül kaybolmasın diye kontrolsüz; sıfırlamada yeniden çizilir */
  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (ready) setDraft(clone(systems));
  }, [ready, systems]);

  const active = draft.find((s) => s.id === activeId) || draft[0];

  const patch = (fn: (s: ImalatSystem) => void) => {
    if (!active) return;
    setDraft((prev) =>
      prev.map((s) => {
        if (s.id !== active.id) return s;
        const n = clone(s);
        fn(n);
        return n;
      })
    );
    setDirty(true);
    setMsg(null);
  };

  const preview = useMemo(() => {
    if (!active) return null;
    return computeImalat(active, { L: toNum(testA), K: toNum(testB) });
  }, [active, testA, testB]);

  const onSave = async () => {
    setSaving(true);
    const r = await save(draft);
    setSaving(false);
    if (r.ok) setDirty(false);
    setMsg(r.ok ? { ok: true, text: "Kaydedildi. Sitede hemen geçerli." } : { ok: false, text: r.error || "Kaydedilemedi." });
  };

  const addSystem = (kind: ImalatKind) => {
    const tpl = seedImalat.find((s) => s.kind === kind)!;
    const sys: ImalatSystem = { ...clone(tpl), id: `sys-${Date.now().toString(36)}`, title: `Yeni ${KIND_LABEL[kind].toLocaleLowerCase("tr")}` };
    setDraft((p) => [...p, sys]);
    setActiveId(sys.id);
    setDirty(true);
  };

  if (!ready || !active) return <p className="text-brand-mist">Yükleniyor…</p>;

  const seed = seedImalat.find((s) => s.id === active.id);
  const missingKeys = MATERIAL_KEYS[active.kind].filter(
    (k) => !active.materials.some((m) => m.key === k.key)
  );
  const dl = dimLabels(active.kind);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-brand-bone">İmalat sistemleri</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-mist">
            Malzeme miktarları DnzHesap’taki gibi hat, profil boyu, ek yeri, askı
            noktası ve vida hattı sayılarak hesaplanır. Burada aralıkları, ebatları,
            malzeme adlarını ve fiyatları düzenleyin.
          </p>
        </div>
        <button type="button" onClick={onSave} disabled={saving || (!dirty && source === "onedrive")} className="btn-primary">
          <Save className="h-4 w-4" />
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      {msg ? (
        <p className={`mt-4 border px-4 py-3 text-sm ${msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-800"}`}>
          {msg.text}
        </p>
      ) : source !== "onedrive" ? (
        <p className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Sitede şu an varsayılan sistemler görünüyor. Fiyatları kontrol edip
          <strong> Kaydet</strong>’e basın; kayıt OneDrive’a gider ve ziyaretçiler de görür.
        </p>
      ) : dirty ? (
        <p className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Kaydedilmemiş değişiklik var.
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="flex flex-col border border-black/10 bg-white">
            {draft.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={`border-b border-black/5 px-4 py-3 text-left text-sm last:border-b-0 ${
                  s.id === active.id ? "bg-brand-navy font-semibold text-white" : "text-brand-bone hover:bg-brand-ink"
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
          <label className="mt-4 block">
            <span className="label-field">Yeni sistem ekle</span>
            <select
              className="input-field"
              value=""
              onChange={(e) => e.target.value && addSystem(e.target.value as ImalatKind)}
            >
              <option value="">Türünü seçin…</option>
              {(Object.keys(KIND_LABEL) as ImalatKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <div className="min-w-0 space-y-6">
          <section className="border border-black/10 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label-field">Sistem adı</span>
                <input className="input-field" value={active.title} onChange={(e) => patch((s) => (s.title = e.target.value))} />
              </label>
              <label className="block">
                <span className="label-field">Hesap türü</span>
                <input className="input-field bg-brand-ink" value={KIND_LABEL[active.kind]} readOnly />
              </label>
              <label className="block sm:col-span-2">
                <span className="label-field">Açıklama</span>
                <input className="input-field" value={active.description} onChange={(e) => patch((s) => (s.description = e.target.value))} />
              </label>
            </div>
          </section>

          <section className="border border-black/10 bg-white p-5">
            <h2 className="font-semibold text-brand-bone">Ölçüler ve aralıklar</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PARAMS[active.kind].map((p) => (
                <label key={p.key} className="block">
                  <span className="text-xs text-brand-mist">
                    {p.label} ({p.unit})
                  </span>
                  <input
                    inputMode="decimal"
                    className="input-field mt-1"
                    key={`${active.id}-${p.key}-${rev}`}
                    defaultValue={String(active.params[p.key] ?? "").replace(".", ",")}
                    onChange={(e) => patch((s) => (s.params[p.key] = toNum(e.target.value)))}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="border border-black/10 bg-white p-5">
            <h2 className="font-semibold text-brand-bone">Malzemeler</h2>
            <p className="mt-1 text-xs text-brand-mist">
              Adı ve fiyatı değiştirebilirsiniz. Listeden çıkardığınız kalem analize girmez.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-xs text-brand-mist">
                    <th className="py-2 pr-3 font-medium">Kalem</th>
                    <th className="py-2 pr-3 font-medium">Malzeme adı</th>
                    <th className="w-24 py-2 pr-3 font-medium">Birim</th>
                    <th className="w-32 py-2 pr-3 font-medium">Birim fiyat (₺)</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {active.materials.map((m, i) => (
                    <tr key={m.key} className="border-b border-black/5">
                      <td className="py-2 pr-3 text-xs text-brand-mist">
                        {MATERIAL_KEYS[active.kind].find((k) => k.key === m.key)?.label || m.key}
                      </td>
                      <td className="py-2 pr-3">
                        <input className="input-field py-2" value={m.name} onChange={(e) => patch((s) => (s.materials[i].name = e.target.value))} />
                      </td>
                      <td className="py-2 pr-3">
                        <input className="input-field py-2" value={m.unit} onChange={(e) => patch((s) => (s.materials[i].unit = e.target.value))} />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          inputMode="decimal"
                          className="input-field py-2"
                          key={`${active.id}-${m.key}-${rev}`}
                          defaultValue={String(m.unitPrice).replace(".", ",")}
                          onChange={(e) => patch((s) => (s.materials[i].unitPrice = toNum(e.target.value)))}
                        />
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          aria-label="Kalemi çıkar"
                          onClick={() => patch((s) => s.materials.splice(i, 1))}
                          className="p-2 text-brand-mist hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {missingKeys.length ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-brand-mist">Kalem ekle:</span>
                {missingKeys.map((k) => (
                  <button
                    key={k.key}
                    type="button"
                    onClick={() => patch((s) => s.materials.push({ key: k.key, name: k.label, unit: "adet", unitPrice: 0 }))}
                    className="inline-flex items-center gap-1 border border-black/10 px-2.5 py-1 text-xs hover:border-brand-navy"
                  >
                    <Plus className="h-3 w-3" />
                    {k.label}
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="border border-black/10 bg-white p-5">
            <h2 className="font-semibold text-brand-bone">Deneme hesabı</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="block">
                <span className="text-xs text-brand-mist">{dl.a}</span>
                <input className="input-field mt-1 w-28" value={testA} onChange={(e) => setTestA(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-xs text-brand-mist">{dl.b}</span>
                <input className="input-field mt-1 w-28" value={testB} onChange={(e) => setTestB(e.target.value)} />
              </label>
            </div>
            {preview && "err" in preview ? (
              <p className="mt-3 text-sm text-red-700">{preview.err}</p>
            ) : preview ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <tbody>
                    {preview.lines.map((l) => (
                      <tr key={l.key} className="border-b border-black/5 align-top">
                        <td className="py-2 pr-3">
                          {l.name}
                          <span className="block text-xs text-brand-mist">{l.why}</span>
                        </td>
                        <td className="whitespace-nowrap py-2 pr-3 text-right tabular-nums">
                          {fmtQ(l.qty)} {l.unit}
                        </td>
                        <td className="whitespace-nowrap py-2 text-right tabular-nums">{formatPrice(l.qty * l.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="pt-3 font-semibold">
                        Toplam ({fmtQ(preview.measure)} {preview.measureUnit}, KDV hariç)
                      </td>
                      <td />
                      <td className="pt-3 text-right font-bold tabular-nums">{formatPrice(sumImalat(preview.lines))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : null}
          </section>

          <div className="flex flex-wrap gap-3">
            {seed ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  patch((s) => {
                    s.params = clone(seed.params);
                    s.materials = clone(seed.materials);
                    s.title = seed.title;
                    s.description = seed.description;
                  });
                  setRev((r) => r + 1);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Varsayılana döndür
              </button>
            ) : null}
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
              onClick={() => {
                if (draft.length <= 1) return;
                if (!window.confirm(`“${active.title}” silinsin mi?`)) return;
                setDraft((p) => p.filter((s) => s.id !== active.id));
                setActiveId("");
                setDirty(true);
                setRev((r) => r + 1);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Sistemi sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
