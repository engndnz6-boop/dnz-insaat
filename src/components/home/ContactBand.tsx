import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { brand } from "@/lib/brand";
import { buildWhatsAppUrl, quoteInquiryMessage } from "@/lib/whatsapp";

export function ContactBand() {
  return (
    <section className="bg-brand-ink pb-4 pt-20 sm:pt-24">
      <div className="container-page">
        <div className="grid gap-px overflow-hidden rounded-xl bg-black/10 shadow-red lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="bg-brand-navy px-6 py-12 text-white sm:px-12 sm:py-14">
            <h2 className="type-wide max-w-lg text-3xl font-bold leading-tight sm:text-[2.6rem]">
              Projenizi anlatın, metrajı ve fiyatı birlikte çıkaralım.
            </h2>
            <p className="mt-4 max-w-md text-white/75">
              Alçıpan, profil, asma tavan, bölme duvar, seramik, parke ya da
              anahtar teslim tadilat için teklif isteyin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/iletisim"
                className="btn-gold px-6 py-3.5"
              >
                Teklif formunu doldur
              </Link>
              <a
                href={buildWhatsAppUrl(quoteInquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light px-6 py-3.5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp’tan yaz
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-7 bg-white px-6 py-12 sm:px-12">
            <a href={`tel:${brand.phoneTel}`} className="group flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-brand-navy" />
              <span>
                <span className="block text-sm text-brand-mist">Telefon</span>
                <span className="type-wide block text-2xl font-bold tabular-nums text-brand-bone transition group-hover:text-brand-gold">
                  {brand.phone}
                </span>
              </span>
            </a>
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-navy" />
              <span>
                <span className="block text-sm text-brand-mist">Mağaza</span>
                <span className="block leading-relaxed text-brand-bone">
                  {brand.address}
                </span>
                <span className="mt-1 block text-sm text-brand-mist">
                  {brand.hours.replace(" · ", ", ")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
