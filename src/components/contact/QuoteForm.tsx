"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { buildWhatsAppUrl, quoteInquiryMessage } from "@/lib/whatsapp";

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

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: PROJECT_TYPES[0],
    message: "",
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // İlk etapta mock: formu WhatsApp mesajına da yönlendirebiliriz
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-brand-gold/30 bg-brand-anthracite p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-gold" />
        <h3 className="mt-4 font-display text-2xl text-brand-bone">
          Talebiniz alındı
        </h3>
        <p className="mt-2 text-sm text-brand-mist">
          En kısa sürede sizinle iletişime geçeceğiz. Acil durumlar için
          WhatsApp üzerinden de yazabilirsiniz.
        </p>
        <a
          href={buildWhatsAppUrl(
            `${quoteInquiryMessage()}\n\nAd: ${form.name}\nProje: ${form.projectType}\n${form.message}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6"
        >
          WhatsApp&apos;tan Devam Et
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-white/5 bg-brand-anthracite/40 p-6 sm:p-8">
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

      <button type="submit" className="btn-primary w-full sm:w-auto">
        <Send className="h-4 w-4" />
        Teklif Talebi Gönder
      </button>
    </form>
  );
}
