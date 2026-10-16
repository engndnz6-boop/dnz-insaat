"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { services } from "@/lib/services";

/** Ürün ya da hizmet seçimi: ürün grupları + uygulama hizmetleri */
export const QUOTE_TOPICS: { group: string; options: string[] }[] = [
  {
    group: "Ürün / malzeme",
    options: [
      "Alçıpan ve profil sistemleri",
      "Asma tavan malzemeleri",
      "Seramik ve fayans",
      "Boya ve alçı ürünleri",
      "Parke ve kapılar",
      "Elektrik ve su tesisatı ürünleri",
      "Toplu malzeme alımı",
    ],
  },
  { group: "Uygulama hizmeti", options: services.map((s) => s.title) },
  { group: "Diğer", options: ["Diğer"] },
];

type FormState = {
  name: string;
  phone: string;
  topic: string;
  location: string;
  message: string;
  email: string;
};

function whatsappText(f: FormState) {
  return [
    "Merhaba, siteden teklif talebi:",
    `Ad soyad: ${f.name}`,
    `Telefon: ${f.phone}`,
    f.email ? `E-posta: ${f.email}` : null,
    `Konu: ${f.topic}`,
    f.location ? `Proje konumu: ${f.location}` : null,
    "",
    f.message,
  ]
    .filter((x) => x !== null)
    .join("\n");
}

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    topic: QUOTE_TOPICS[0].options[0],
    location: "",
    message: "",
    email: "",
  });
  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    const waUrl = buildWhatsAppUrl(whatsappText(form));
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      /* WhatsApp yine açılsın */
    }
    window.location.href = waUrl;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-lg border border-black/5 bg-white p-6 shadow-red sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className="label-field">Ad soyad *</label>
          <input id="q-name" required autoComplete="name" className="input-field" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-phone" className="label-field">Telefon numarası *</label>
          <input id="q-phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" className="input-field" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-topic" className="label-field">Ürün veya hizmet *</label>
          <select id="q-topic" required className="input-field" value={form.topic} onChange={(e) => set("topic", e.target.value)}>
            {QUOTE_TOPICS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-loc" className="label-field">Proje konumu</label>
          <input id="q-loc" placeholder="Örn. Gölbaşı, İncek, Çankaya" className="input-field" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
      </div>

      <div>
        <label htmlFor="q-msg" className="label-field">Açıklama *</label>
        <textarea
          id="q-msg"
          required
          rows={compact ? 3 : 5}
          placeholder="Metrekare, malzeme ihtiyacı, yapılacak iş, istenen tarih…"
          className="input-field resize-y"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      {!compact ? (
        <div>
          <label htmlFor="q-mail" className="label-field">E-posta (isteğe bağlı)</label>
          <input id="q-mail" type="email" autoComplete="email" className="input-field" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-brand-mist">
        Gönderince talebiniz bize iletilir ve WhatsApp açılır. Fotoğraf eklemek
        isterseniz WhatsApp’ta mesajınıza ekleyebilirsiniz. Bilgileriniz yalnızca
        teklif hazırlamak için kullanılır,{" "}
        <Link href="/gizlilik" className="underline hover:text-brand-navy">gizlilik ve KVKK</Link>.
      </p>

      <button type="submit" disabled={sending} className="btn-gold w-full px-6 py-3.5 sm:w-auto">
        <Send className="h-4 w-4" />
        {sending ? "Gönderiliyor…" : "Teklif talebimi gönder"}
      </button>
    </form>
  );
}
