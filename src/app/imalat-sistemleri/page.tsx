"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, MessageCircle, Printer } from "lucide-react";
import { computeImalat, sumImalat, type ImalatLine } from "@/lib/imalat/engine";
import { useImalat } from "@/lib/imalat/context";
import { dimLabels } from "@/lib/imalat/systems";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { brand, checkoutConfig } from "@/lib/brand";

const num = (v: string) => Number(String(v).replace(",", ".")) || 0;

const qtyFmt = (n: number) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(n);

type Analysis = {
  systemTitle: string;
  measure: number;
  measureUnit: string;
  en: number;
  boy: number;
  isWall: boolean;
  project: string;
  note?: string;
  lines: ImalatLine[];
};

export default function HesaplamaPage() {
  const { systems, ready } = useImalat();

  const [activeId, setActiveId] = useState("");
  const [enM, setEnM] = useState("");
  const [boyM, setBoyM] = useState("");
  const [m2, setM2] = useState("");
  const [project, setProject] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [autoCalc, setAutoCalc] = useState(false);

  const resolvedId = activeId || systems[0]?.id || "";
  const active = useMemo(
    () => systems.find((s) => s.id === resolvedId) || systems[0],
    [systems, resolvedId]
  );

  const roomArea = useMemo(() => {
    const e = num(enM);
    const b = num(boyM);
    return e > 0 && b > 0 ? Math.round(e * b * 100) / 100 : 0;
  }, [enM, boyM]);

  const area = roomArea || num(m2);

  // Ana sayfadaki hızlı metraj çubuğundan gelen ?sistem=…&m2=…
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    const sistem = params.get("sistem");
    const alan = params.get("m2");
    if (sistem && systems.some((s) => s.id === sistem)) setActiveId(sistem);
    if (alan && num(alan) > 0) {
      setM2(alan);
      setAutoCalc(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const isWall = active?.kind === "wall";
  const dl = dimLabels(active?.kind || "alcipan");

  const build = () => {
    if (!active || area <= 0) return;
    if (isWall && !roomArea) {
      setError("Bölme duvar için duvar uzunluğunu ve yüksekliğini girin.");
      setAnalysis(null);
      return;
    }
    const r = computeImalat(active, roomArea ? { L: num(enM), K: num(boyM) } : { area });
    if ("err" in r) {
      setError(r.err);
      setAnalysis(null);
      return;
    }
    setError("");
    setAnalysis({
      systemTitle: active.title,
      measure: r.measure,
      measureUnit: r.measureUnit,
      en: roomArea ? num(enM) : 0,
      boy: roomArea ? num(boyM) : 0,
      isWall: !!isWall,
      project: project.trim(),
      note: r.note,
      lines: r.lines,
    });
  };

  // Girdi değişince eski analiz ekranda kalmasın
  useEffect(() => {
    setAnalysis(null);
    setError("");
  }, [resolvedId]);

  useEffect(() => {
    if (!autoCalc || !active) return;
    setAutoCalc(false);
    build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCalc, active]);

  if (!ready) {
    return <div className="container-page py-20 text-brand-mist">Yükleniyor…</div>;
  }

  if (!systems.length || !active) {
    return (
      <div className="container-page py-20">
        <h1 className="section-title">İmalat sistemleri</h1>
        <p className="section-subtitle">Henüz tanımlı sistem yok.</p>
      </div>
    );
  }

  const subtotal = analysis ? sumImalat(analysis.lines) : 0;
  const vat = subtotal * checkoutConfig.vatRate;
  const grand = subtotal + vat;

  const waMessage = analysis
    ? `Merhaba, malzeme analizi için teklif istiyorum.\n` +
      `Sistem: ${analysis.systemTitle}\nÖlçü: ${qtyFmt(analysis.measure)} ${analysis.measureUnit}` +
      (analysis.en ? ` (${qtyFmt(analysis.en)} × ${qtyFmt(analysis.boy)} m)` : "") +
      (analysis.project ? `\nProje: ${analysis.project}` : "") +
      `\nTahmini tutar (KDV dahil): ${formatPrice(grand)}`
    : "";

  return (
    <div className="bg-brand-ink pb-8 print:bg-white print:pb-0">
      {/* Giriş */}
      <div className="container-page max-w-5xl pt-10 sm:pt-14 print:hidden">
        <h1 className="type-wide text-3xl font-bold text-brand-bone sm:text-4xl">
          İmalat sistemleri
        </h1>
        <p className="mt-2 max-w-xl text-brand-mist">
          Sistemi seçin, ölçüyü girin. Profil, askı, plaka ve vida miktarları
          hat hat hesaplanıp malzeme analizi olarak hazırlansın.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            build();
          }}
          className="mt-8 border border-black/10 bg-white p-5 sm:p-7"
        >
          <fieldset>
            <legend className="text-sm font-semibold text-brand-bone">Sistem</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {systems.map((s) => {
                const on = s.id === resolvedId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    aria-pressed={on}
                    className={`border px-4 py-2.5 text-sm font-medium transition ${
                      on
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-black/15 bg-white text-brand-bone hover:border-brand-navy/50"
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
            {active.description ? (
              <p className="mt-3 text-sm text-brand-mist">{active.description}</p>
            ) : null}
          </fieldset>

          <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-end">
            <label className="block">
              <span className="text-sm font-semibold text-brand-bone">{dl.a}</span>
              <input
                inputMode="decimal"
                className="input-field mt-2"
                placeholder={isWall ? "Örn. 5,4" : "Örn. 4"}
                value={enM}
                onChange={(e) => {
                  setEnM(e.target.value);
                  setM2("");
                }}
              />
            </label>
            <span className="hidden pb-3 text-brand-mist sm:block">×</span>
            <label className="block">
              <span className="text-sm font-semibold text-brand-bone">{dl.b}</span>
              <input
                inputMode="decimal"
                className="input-field mt-2"
                placeholder={isWall ? "Örn. 2,8" : "Örn. 5"}
                value={boyM}
                onChange={(e) => {
                  setBoyM(e.target.value);
                  setM2("");
                }}
              />
            </label>
            <span className="hidden pb-3 text-sm text-brand-mist sm:block">ya da</span>
            <label className="block">
              <span className="text-sm font-semibold text-brand-bone">{dl.area}</span>
              <input
                inputMode="decimal"
                className="input-field mt-2"
                placeholder={roomArea ? String(roomArea) : "Örn. 45"}
                value={roomArea ? "" : m2}
                onChange={(e) => {
                  setM2(e.target.value);
                  setEnM("");
                  setBoyM("");
                }}
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-brand-bone">
              Proje / müşteri adı{" "}
              <span className="font-normal text-brand-mist">(isteğe bağlı)</span>
            </span>
            <input
              className="input-field mt-2"
              placeholder="Örn. Gölbaşı ofis tadilatı"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </label>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn-primary" disabled={area <= 0}>
              <FileText className="h-4 w-4" />
              Analizi oluştur
            </button>
            {area > 0 ? (
              <span className="text-sm text-brand-mist">
                Toplam alan: <strong className="text-brand-bone">{qtyFmt(area)} m²</strong>
              </span>
            ) : null}
          </div>
          {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        </form>
      </div>

      {/* Analiz belgesi */}
      {analysis ? (
        <div className="container-page mt-8 max-w-5xl print:mt-0 print:max-w-none print:px-0">
          <div className="mb-4 flex flex-wrap gap-3 print:hidden">
            <button type="button" onClick={() => window.print()} className="btn-secondary">
              <Printer className="h-4 w-4" />
              Yazdır / PDF kaydet
            </button>
            <a
              href={buildWhatsAppUrl(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp’tan teklif iste
            </a>
          </div>

          <article className="border border-black/10 bg-white px-6 py-8 text-brand-bone sm:px-10 sm:py-10 print:border-0 print:p-0">
            <h2 className="type-wide border-b-2 border-brand-navy pb-4 text-xl font-bold text-brand-navy">
              Malzeme analizi
            </h2>

            {/* Proje bilgisi */}
            <dl className="grid gap-4 border-b border-black/10 py-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-brand-mist">Sistem</dt>
                <dd className="mt-0.5 font-semibold">{analysis.systemTitle}</dd>
              </div>
              <div>
                <dt className="text-brand-mist">
                  {analysis.measureUnit === "mt" ? "Bant uzunluğu" : analysis.isWall ? "Duvar alanı" : "Alan"}
                </dt>
                <dd className="mt-0.5 font-semibold tabular-nums">
                  {qtyFmt(analysis.measure)} {analysis.measureUnit}
                  {analysis.en ? (
                    <span className="font-normal text-brand-mist">
                      {" "}
                      ({qtyFmt(analysis.en)} × {qtyFmt(analysis.boy)} m)
                    </span>
                  ) : null}
                </dd>
              </div>
              {analysis.project ? (
                <div>
                  <dt className="text-brand-mist">Proje</dt>
                  <dd className="mt-0.5 font-semibold">{analysis.project}</dd>
                </div>
              ) : null}
            </dl>

            {/* Malzeme listesi — telefon */}
            <ol className="mt-2 divide-y divide-black/5 sm:hidden print:hidden">
              {analysis.lines.map((line, i) => (
                <li key={`${line.name}-${i}`} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p>{line.name}</p>
                    <p className="text-xs text-brand-mist">{line.why}</p>
                    <p className="mt-0.5 tabular-nums text-brand-mist">
                      {qtyFmt(line.qty)} {line.unit} × {formatPrice(line.unitPrice)}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold tabular-nums">
                    {formatPrice(line.qty * line.unitPrice)}
                  </p>
                </li>
              ))}
            </ol>

            {/* Malzeme tablosu — tablet, bilgisayar ve çıktı */}
            <div className="hidden overflow-x-auto sm:block print:block">
              <table className="mt-2 w-full text-sm">
                <thead>
                  <tr className="border-b border-black/15 text-left text-brand-mist">
                    <th className="w-10 py-3 pr-2 font-medium">#</th>
                    <th className="py-3 pr-4 font-medium">Malzeme</th>
                    <th className="py-3 pr-4 text-right font-medium">Miktar</th>
                    <th className="py-3 pr-4 font-medium">Birim</th>
                    <th className="py-3 pr-4 text-right font-medium">Birim fiyat</th>
                    <th className="py-3 text-right font-medium">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.lines.map((line, i) => (
                    <tr key={`${line.name}-${i}`} className="border-b border-black/5 align-top">
                      <td className="py-3 pr-2 tabular-nums text-brand-mist">{i + 1}</td>
                      <td className="py-3 pr-4">
                        {line.name}
                        <span className="mt-0.5 block text-xs text-brand-mist">{line.why}</span>
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">{qtyFmt(line.qty)}</td>
                      <td className="py-3 pr-4 text-brand-mist">{line.unit}</td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatPrice(line.unitPrice)}
                      </td>
                      <td className="py-3 text-right font-semibold tabular-nums">
                        {formatPrice(line.qty * line.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Toplamlar */}
            <div className="mt-6 flex justify-end">
              <dl className="w-full max-w-xs text-sm">
                <div className="flex justify-between py-1.5">
                  <dt className="text-brand-mist">Ara toplam</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-brand-mist">
                    KDV (%{Math.round(checkoutConfig.vatRate * 100)})
                  </dt>
                  <dd className="tabular-nums">{formatPrice(vat)}</dd>
                </div>
                <div className="mt-1 flex justify-between border-t-2 border-brand-navy pt-3">
                  <dt className="font-bold">Genel toplam</dt>
                  <dd className="type-wide text-lg font-bold tabular-nums text-brand-navy">
                    {formatPrice(grand)}
                  </dd>
                </div>
              </dl>
            </div>

            {analysis.note ? (
              <p className="mt-6 text-xs text-brand-mist">{analysis.note}</p>
            ) : null}
            <p className="mt-8 border-t border-black/10 pt-4 text-xs leading-relaxed text-brand-mist">
              Bu analiz girilen ölçüye göre hazırlanmış tahmini bir malzeme
              listesidir. İşçilik ve nakliye dahil değildir. Kesin fiyat için{" "}
              {brand.phone} numarasından ya da {brand.domainDisplay} üzerinden
              teklif isteyin.
            </p>
          </article>

          <p className="mt-4 text-sm text-brand-mist print:hidden">
            Uygulama da yaptırmak ister misiniz?{" "}
            <Link href="/iletisim" className="font-semibold text-brand-navy hover:text-brand-gold">
              Teklif formunu doldurun
            </Link>
          </p>
        </div>
      ) : null}
    </div>
  );
}
