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
    <footer className="mt-16 bg-brand-navy pb-16 text-white md:pb-0 print:hidden">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 text-base font-semibold leading-snug text-white">
            {brand.slogan}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            {brand.description}
          </p>
          <Link href="/hakkimizda" className="mt-3 inline-block text-sm font-semibold text-brand-gold-light hover:text-white">
            Misyonumuz ve vizyonumuz
          </Link>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Keşfet
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/katalog" className="hover:text-white">
                Ürün Kataloğu
              </Link>
            </li>
            <li>
              <Link href="/imalat-sistemleri" className="hover:text-white">
                İmalat Sistemleri
              </Link>
            </li>
            <li>
              <Link href="/hizmetlerimiz" className="hover:text-white">
                Hizmetlerimiz
              </Link>
            </li>
            <li>
              <Link href="/projelerimiz" className="hover:text-white">
                Projelerimiz
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="hover:text-white">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/kataloglar" className="hover:text-white">
                PDF Kataloglar
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-white">
                İletişim
              </Link>
            </li>
            <li>
              <Link href="/gizlilik" className="hover:text-white">
                Gizlilik ve KVKK
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            İletişim
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-light" />
              {brand.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-gold-light" />
              {brand.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-gold-light" />
              {brand.email}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Çalışma Saatleri
          </h3>
          <p className="mt-4 text-sm text-white/75">{brand.hours}</p>
          <Link
            href="/iletisim"
            className="btn-gold mt-6 px-4 py-2 text-xs transition hover:bg-brand-gold-light"
          >
            Proje Teklifi İste
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {brand.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
