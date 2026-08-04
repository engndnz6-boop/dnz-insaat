"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Logo } from "@/components/brand/Logo";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/katalog", label: "Katalog" },
  { href: "/kataloglar", label: "PDF Kataloglar" },
  { href: "/#projeler", label: "Projeler" },
  { href: "/iletisim", label: "Teklif Al" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-brand-anthracite/95 backdrop-blur-md shadow-sm">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="group transition hover:opacity-90">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("#")[0]) &&
                  link.href !== "/";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition ${
                  active
                    ? "text-brand-gold"
                    : "text-brand-bone/75 hover:text-brand-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/sepet"
            className="relative inline-flex h-10 w-10 items-center justify-center text-brand-bone transition hover:text-brand-gold"
            aria-label="Sepet"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-brand-gold px-1 text-[10px] font-bold text-[#151920]">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-brand-bone md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-brand-anthracite md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-sm font-medium text-brand-bone/90 hover:text-brand-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
