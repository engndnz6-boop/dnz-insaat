"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { brand } from "@/lib/brand";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-white/5 bg-brand-anthracite">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-brand-mist">
            {brand.description}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Keşfet
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-mist">
            <li>
              <Link href="/katalog" className="hover:text-brand-gold">
                Ürün Kataloğu
              </Link>
            </li>
            <li>
              <Link href="/kataloglar" className="hover:text-brand-gold">
                PDF Kataloglar
              </Link>
            </li>
            <li>
              <Link href="/#projeler" className="hover:text-brand-gold">
                Tamamlanan Projeler
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-brand-gold">
                Teklif Al
              </Link>
            </li>
            <li>
              <Link href="/sepet" className="hover:text-brand-gold">
                Sepet
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            İletişim
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-mist">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              {brand.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-gold" />
              {brand.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
              {brand.email}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Çalışma Saatleri
          </h3>
          <p className="mt-4 text-sm text-brand-mist">{brand.hours}</p>
          <Link href="/iletisim" className="btn-secondary mt-6 text-xs">
            Proje Teklifi İste
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-brand-mist/70">
        © {new Date().getFullYear()} {brand.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
