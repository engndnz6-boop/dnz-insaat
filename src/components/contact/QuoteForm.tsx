"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const PROJECT_TYPES = [
  "Alçıpan asma tavan",
  "Alçıpan ışık bandı",
  "Taşyünü asma tavan",
  "Karolam asma tavan",
  "Clip-in asma tavan",
  "Bölme duvar",
  "Toplu malzeme alımı",
  "Diğer",
];

function buildQuoteWhatsAppText(form: {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
}) {
  return [
    "Merhaba, siteden teklif talebi:",
    `Ad: ${form.name}`,
    `Telefon: ${form.phone}`,
    `E-posta: ${form.email}`,
    form.company ? `Firma: ${form.company}` : null,
    `Proje: ${form.projectType}`,
    "",
    form.message,
  ]
    .filter(Boolean)
    .join("\n");
}

export function QuoteForm() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: PROJECT_TYPES[0],
    message: "",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);

    const waUrl = buildWhatsAppUrl(buildQuoteWhatsAppText(form));

    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      /* WhatsApp yine açılsın */
    }

    // Otomatik WhatsApp yönlendirme
    window.location.href = waUrl;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 border border-black/5 bg-brand-anthracite/40 p-6 sm:p-8"
    >
      <p className="text-xs text-brand-mist">
        Gönderince talep{" "}
        <strong className="text-brand-bone">dnzyapimalzemeleri@gmail.com</strong>{" "}
        adresine iletilir ve WhatsApp’a yönlendirilirsiniz.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label-field">
            Ad Soyad *
          </label>
          <input
            id="name"
            required
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="phone" className="label-field">
            Telefon *
          </label>
          <input
            id="phone"
            type="tel"
            required
            className="input-field"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="label-field">
            E-posta *
          </label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="company" className="label-field">
            Firma / Ofis
          </label>
          <input
            id="company"
            className="input-field"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="label-field">
          Proje Türü *
        </label>
        <select
          id="projectType"
          required
          className="input-field"
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
        >
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="label-field">
          Proje Detayı *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="input-field resize-y"
          placeholder="Metrekare, malzeme ihtiyacı, teslim tarihi vb."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="btn-primary w-full sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {sending ? "Yönlendiriliyor…" : "Teklif Talebi Gönder"}
      </button>
    </form>
  );
}
