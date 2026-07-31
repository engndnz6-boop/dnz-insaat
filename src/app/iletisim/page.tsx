import type { Metadata } from "next";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { Mail, MapPin, Phone } from "lucide-react";
import { buildWhatsAppUrl, quoteInquiryMessage } from "@/lib/whatsapp";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "İletişim & Teklif Al",
  description: `Toplu alım ve projelendirme işleri için teklif formu. ${brand.name} ile iletişime geçin.`,
};

export default function IletisimPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
          İletişim
        </p>
        <h1 className="section-title mt-3">Teklif Al</h1>
        <p className="section-subtitle">
          Toplu alımlar, anahtar teslim uygulamalar ve mimari projeler için
          formu doldurun; ekibimiz size dönüş yapsın.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <QuoteForm />

        <aside className="space-y-6">
          <div className="border border-white/5 bg-brand-anthracite/50 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Direkt İletişim
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-brand-mist">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                {brand.address}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                {brand.phone}
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                {brand.email}
              </li>
            </ul>
            <a
              href={buildWhatsAppUrl(quoteInquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-6 w-full text-xs"
            >
              WhatsApp ile Yazın
            </a>
          </div>

          <div className="border border-white/5 p-6 text-sm leading-relaxed text-brand-mist">
            <p className="font-medium text-brand-bone">Uygulama alanlarımız</p>
            <p className="mt-2">
              Alçıpan asma tavan, ışık bandı, taşyünü / karolam / clip-in asma
              tavan, bölme duvar ve bağlı malzeme satışı.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
