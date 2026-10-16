"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Logo } from "@/components/brand/Logo";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/katalog", label: "Ürünler" },
  { href: "/imalat-sistemleri", label: "İmalat Sistemleri" },
  { href: "/kataloglar", label: "Dokümanlar" },
  { href: "/#projeler", label: "Projeler" },
  { href: "/iletisim", label: "İletişim" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur print:hidden">
      <div className="container-page flex h-16 items-center justify-between sm:h-[72px]">
        <Link href="/" className="group transition hover:opacity-90">
          <Logo tone="dark" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : !link.href.includes("#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium tracking-wide transition ${
                  active
                    ? "text-brand-navy font-semibold"
                    : "text-brand-bone/70 hover:text-brand-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/iletisim" className="bg-brand-gold px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-gold-light">
            Teklif Al
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/sepet"
            className="relative inline-flex h-10 w-10 items-center justify-center text-brand-navy transition hover:text-brand-gold"
            aria-label="Sepet"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-brand-gold px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-brand-navy md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-sm font-medium text-brand-bone hover:text-brand-navy"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/iletisim"
              onClick={() => setOpen(false)}
              className="mt-2 bg-brand-gold px-3 py-3 text-center text-sm font-semibold text-white"
            >
              Teklif Al
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
