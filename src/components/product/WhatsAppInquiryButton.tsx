"use client";

import { MessageCircle } from "lucide-react";
import {
  buildWhatsAppUrl,
  productInquiryMessage,
} from "@/lib/whatsapp";

export function WhatsAppInquiryButton({ productName, quote = false }: { productName: string; quote?: boolean }) {
  const href = buildWhatsAppUrl(
    quote
      ? `Merhaba, ${productName} için fiyat teklifi almak istiyorum.\nMiktar: \nProje konumu: `
      : productInquiryMessage(productName)
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${quote ? "btn-gold" : "btn-secondary"} flex-1`}
    >
      <MessageCircle className="h-4 w-4" />
      {quote ? "Fiyat teklifi al" : "WhatsApp ile Bilgi Al"}
    </a>
  );
}
