"use client";

import { MessageCircle } from "lucide-react";
import {
  buildWhatsAppUrl,
  productInquiryMessage,
} from "@/lib/whatsapp";

export function WhatsAppInquiryButton({ productName }: { productName: string }) {
  const href = buildWhatsAppUrl(productInquiryMessage(productName));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary flex-1"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp ile Bilgi Al
    </a>
  );
}
