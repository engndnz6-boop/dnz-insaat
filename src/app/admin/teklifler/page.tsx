"use client";

import { useEffect, useState } from "react";
import { MapPin, MessageCircle, Phone, Trash2 } from "lucide-react";
import { QUOTE_STATUS_LABEL, type QuoteRequest, type QuoteStatus } from "@/lib/quotes";

const STATUS_STYLE: Record<QuoteStatus, string> = {
  yeni: "bg-amber-100 text-amber-900",
  arandi: "bg-sky-100 text-sky-900",
  "teklif-verildi": "bg-indigo-100 text-indigo-900",
  kapandi: "bg-emerald-100 text-emerald-900",
};

const waLink = (phone: string) => {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "9" + d;
  else if (d.length === 10) d = "90" + d;
  return `https://wa.me/${d}`;
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[] | null>(null);
  const [warning, setWarning] = useState("");
  const [filter, setFilter] = useState<QuoteStatus | "">("");

  useEffect(() => {
    fetch("/api/admin/quotes", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setQuotes(d.quotes || []);
        setWarning(d.warning || "");
      })
      .catch(() => setQuotes([]));
  }, []);

  const update = async (id: string, patch: { status?: QuoteStatus; note?: string; remove?: boolean }) => {
    const r = await fetch("/api/admin/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.quotes) setQuotes(d.quotes);
    else setWarning(d.error || "Güncellenemedi.");
  };

  const list = (quotes || []).filter((q) => !filter || q.status === filter);
  const counts = (quotes || []).reduce<Record<string, number>>((a, q) => ((a[q.status] = (a[q.status] || 0) + 1), a), {});

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-bone">Teklif talepleri</h1>
      <p className="mt-2 text-sm text-brand-mist">
        Sitedeki teklif formundan gelen talepler. Müşteriyi arayıp durumu güncelleyin.
      </p>
      {warning ? <p className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{warning}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter("")} className={`px-3 py-1.5 text-sm ${filter === "" ? "bg-brand-navy text-white" : "border border-black/10 bg-white"}`}>
          Tümü ({quotes?.length || 0})
        </button>
        {(Object.keys(QUOTE_STATUS_LABEL) as QuoteStatus[]).map((s) => (
          <button key={s} type="button" onClick={() => setFilter(s)} className={`px-3 py-1.5 text-sm ${filter === s ? "bg-brand-navy text-white" : "border border-black/10 bg-white"}`}>
            {QUOTE_STATUS_LABEL[s]} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {quotes === null ? (
        <p className="mt-8 text-brand-mist">Yükleniyor…</p>
      ) : list.length === 0 ? (
        <p className="mt-8 border border-dashed border-black/15 bg-white p-8 text-center text-brand-mist">
          {quotes.length ? "Bu durumda talep yok." : "Henüz teklif talebi gelmedi. Sitedeki formdan gelen talepler burada listelenir."}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((q) => (
            <li key={q.id} className="border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-bone">{q.name}</p>
                  <p className="text-xs text-brand-mist">{new Date(q.createdAt).toLocaleString("tr-TR")}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[q.status]}`}>{QUOTE_STATUS_LABEL[q.status]}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-brand-navy">{q.topic}</p>
              {q.location ? (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-mist"><MapPin className="h-3.5 w-3.5" />{q.location}</p>
              ) : null}
              <p className="mt-2 whitespace-pre-line text-sm text-brand-bone/85">{q.message}</p>
              {q.email ? <p className="mt-1 text-xs text-brand-mist">{q.email}</p> : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={`tel:${q.phone.replace(/\s/g, "")}`} className="btn-navy px-3 py-2 text-xs"><Phone className="h-3.5 w-3.5" />{q.phone}</a>
                <a href={waLink(q.phone)} target="_blank" rel="noopener noreferrer" className="btn-light px-3 py-2 text-xs"><MessageCircle className="h-3.5 w-3.5" />WhatsApp</a>
                <select
                  value={q.status}
                  onChange={(e) => update(q.id, { status: e.target.value as QuoteStatus })}
                  className="input-field w-auto py-2 text-xs"
                  aria-label="Durum"
                >
                  {(Object.keys(QUOTE_STATUS_LABEL) as QuoteStatus[]).map((s) => (
                    <option key={s} value={s}>{QUOTE_STATUS_LABEL[s]}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => window.confirm("Talep silinsin mi?") && update(q.id, { remove: true })}
                  className="ml-auto p-2 text-brand-mist hover:text-red-600"
                  aria-label="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                className="input-field mt-3 py-2 text-sm"
                placeholder="Not (örn. pazartesi keşif)"
                defaultValue={q.note || ""}
                onBlur={(e) => e.target.value !== (q.note || "") && update(q.id, { note: e.target.value })}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
