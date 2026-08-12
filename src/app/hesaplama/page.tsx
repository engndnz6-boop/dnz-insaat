"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { computeLines, sumLines, type MaterialLine } from "@/lib/calculators";
import { useCalculators } from "@/lib/calculators-context";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { brand } from "@/lib/brand";

export default function HesaplamaPage() {
  const { systems, ready } = useCalculators();
  const [activeId, setActiveId] = useState<string>("");
  const [enM, setEnM] = useState<string>("");
  const [boyM, setBoyM] = useState<string>("");
  const [m2, setM2] = useState<string>("50");
  const [lines, setLines] = useState<MaterialLine[] | null>(null);

  const resolvedId = activeId || systems[0]?.id || "";
  const active = useMemo(
    () => systems.find((s) => s.id === resolvedId) || systems[0],
    [systems, resolvedId]
  );

  useEffect(() => {
    setLines(null);
  }, [active?.id]);

  const areaFromRoom = useMemo(() => {
    const e = Number(String(enM).replace(",", ".")) || 0;
    const b = Number(String(boyM).replace(",", ".")) || 0;
    if (e > 0 && b > 0) return Math.round(e * b * 100) / 100;
    return 0;
  }, [enM, boyM]);

  useEffect(() => {
    if (areaFromRoom > 0) setM2(String(areaFromRoom));
  }, [areaFromRoom]);

  const area = Number(String(m2).replace(",", ".")) || 0;
  const total = lines ? sumLines(lines) : 0;

  const onCalculate = () => {
    if (!active || area <= 0) {
      setLines(null);
      return;
    }
    // Ebat / katlara tamamlama admin’deki malzeme ayarlarından uygulanır
    setLines(computeLines(active, area));
  };

  const waMessage =
    lines && active
      ? `${active.title} için yaklaşık metraj talebi:\nAlan: ${area} m²` +
        (enM && boyM ? ` (${enM}×${boyM} m)` : "") +
        `\nTahmini malzeme tutarı: ${formatPrice(total)}\n\nDetaylı teklif istiyorum.`
      : `${active?.title || "Sistem"} için teklif istiyorum.`;

  if (!ready) {
    return (
      <div className="container-page py-20 text-brand-mist">Yükleniyor…</div>
    );
  }

  if (!systems.length || !active) {
    return (
      <div className="container-page py-20">
        <h1 className="section-title">Hesaplamalar</h1>
        <p className="section-subtitle">
          Henüz tanımlı sistem yok. Admin panelinden sistem ekleyin.
        </p>
        <Link href="/admin/hesaplamalar" className="btn-primary mt-6">
          Admin — Hesaplamalar
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-ink">
      <div className="bg-brand-navy px-4 py-10 sm:px-6 lg:px-8">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
            Analizler ve maliyet
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold text-white sm:text-4xl">
            Hesaplamalar
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            Oda en × boy veya m² girin; yaklaşık maliyet için teklif alın.
          </p>
        </div>
      </div>

      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit bg-brand-navy p-2">
            <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              Malzeme maliyetleri
            </p>
            <nav className="flex flex-col gap-1">
              {systems.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveId(c.id);
                    setLines(null);
                  }}
                  className={`px-3 py-3 text-left text-sm font-medium transition ${
                    resolvedId === c.id
                      ? "bg-brand-gold text-white"
                      : "bg-white/5 text-white/85 hover:bg-white/10"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </nav>
            <Link
              href="/katalog"
              className="mt-3 flex items-center gap-2 bg-white/10 px-3 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              <ShoppingBag className="h-4 w-4" />
              Malzeme satışına git
            </Link>
          </aside>

          <section className="border border-black/10 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="bg-brand-navy/10 p-2 text-brand-navy">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-sans text-2xl font-bold text-brand-bone">
                  {active.title}
                </h2>
                <p className="mt-1 text-sm text-brand-mist">
                  {active.description}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <p className="label-field">Oda ebatı (metre) veya alan</p>
                <div className="mt-2 flex flex-wrap items-end gap-3">
                  <label className="block">
                    <span className="text-xs text-brand-mist">En (m)</span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="input-field w-32"
                      placeholder="ör. 4"
                      value={enM}
                      onChange={(e) => setEnM(e.target.value)}
                    />
                  </label>
                  <span className="pb-3 text-brand-mist">×</span>
                  <label className="block">
                    <span className="text-xs text-brand-mist">Boy (m)</span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="input-field w-32"
                      placeholder="ör. 5"
                      value={boyM}
                      onChange={(e) => setBoyM(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-brand-mist">veya Alan (m²)</span>
                    <input
                      type="number"
                      min={1}
                      step={0.1}
                      className="input-field w-32"
                      value={m2}
                      onChange={(e) => {
                        setM2(e.target.value);
                        setEnM("");
                        setBoyM("");
                      }}
                    />
                  </label>
                </div>
                {areaFromRoom > 0 && (
                  <p className="mt-2 text-xs text-brand-navy">
                    Hesaplanan alan: <strong>{areaFromRoom} m²</strong>
                  </p>
                )}
              </div>

              <button type="button" onClick={onCalculate} className="btn-primary">
                Hesapla
              </button>
            </div>

            {lines && (
              <div className="mt-8 border border-black/10 bg-brand-ink/50 p-5">
                <p className="text-sm text-brand-mist">
                  Alan:{" "}
                  <strong className="text-brand-bone">
                    {area} m²
                    {enM && boyM ? ` (${enM}×${boyM} m)` : ""}
                  </strong>
                </p>
                <p className="mt-3 text-base font-semibold text-brand-bone">
                  Yaklaşık toplam (KDV hariç):{" "}
                  <span className="text-brand-navy">{formatPrice(total)}</span>
                </p>
                <p className="mt-2 text-xs text-brand-mist">
                  Detaylı malzeme listesi için WhatsApp ile teklif isteyin.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl(waMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp ile teklif iste
              </a>
              <Link href="/katalog" className="btn-secondary">
                Malzeme satışı / katalog
              </Link>
              <Link href="/iletisim" className="btn-ghost">
                {brand.phone}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
