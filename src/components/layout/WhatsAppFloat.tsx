"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { brand } from "@/lib/brand";

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const href = buildWhatsAppUrl(
    `Merhaba, ${brand.name} ürünleri / projeleri hakkında bilgi almak istiyorum.`
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.03] hover:bg-[#1ebe57] sm:bottom-6 sm:right-6"
      aria-label="WhatsApp Canlı Destek"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Canlı Destek</span>
    </a>
  );
}
