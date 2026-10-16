"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, MessageCircle, Phone } from "lucide-react";
import { brand } from "@/lib/brand";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Telefonda ekranın altında sürekli duran iletişim çubuğu: Ara · WhatsApp · Teklif al */
export function MobileContactBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const wa = buildWhatsAppUrl(`Merhaba, ${brand.name} hakkında bilgi almak istiyorum.`);
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold";
  return (
    <nav
      aria-label="Hızlı iletişim"
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_20px_-12px_rgba(185,28,28,0.45)] backdrop-blur md:hidden print:hidden"
    >
      <a href={`tel:${brand.phoneTel}`} className={`${item} text-brand-navy`}>
        <Phone className="h-5 w-5" />
        Ara
      </a>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={`${item} text-[#1a9e4f]`}>
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
      <Link href="/iletisim" className={`${item} m-1.5 rounded-md bg-gradient-to-b from-[#f5a54c] to-[#cf6f08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]`}>
        <FileText className="h-5 w-5" />
        Teklif al
      </Link>
    </nav>
  );
}
