"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  ExternalLink,
  Tags,
  FileText,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { adminConfig } from "@/lib/brand";

function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(adminConfig.sessionKey) === "1";
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(isAuthed());
    setChecked(true);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminConfig.password) {
      sessionStorage.setItem(adminConfig.sessionKey, "1");
      setAuthed(true);
      setError("");
    } else {
      setError("Hatalı şifre.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(adminConfig.sessionKey);
    setAuthed(false);
    router.push("/admin");
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ink text-brand-mist">
        Yükleniyor…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ink px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm border border-white/10 bg-brand-anthracite p-8"
        >
          <Logo variant="mark" />
          <h1 className="mt-6 font-display text-2xl text-brand-bone">
            Yönetim Paneli
          </h1>
          <p className="mt-2 text-sm text-brand-mist">
            Demo şifre: <code className="text-brand-gold">{adminConfig.password}</code>
          </p>
          <label htmlFor="admin-pass" className="label-field mt-6">
            Şifre
          </label>
          <input
            id="admin-pass"
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
          <button type="submit" className="btn-primary mt-6 w-full">
            Giriş Yap
          </button>
          <Link href="/" className="btn-ghost mt-3 w-full text-xs">
            Siteye Dön
          </Link>
        </form>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Özet", icon: LayoutDashboard },
    { href: "/admin/urunler", label: "Ürünler", icon: Package },
    { href: "/admin/kategoriler", label: "Kategoriler", icon: Tags },
    { href: "/admin/kataloglar", label: "PDF Katalog", icon: FileText },
    { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-brand-ink">
      <header className="border-b border-white/5 bg-brand-anthracite">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo variant="markCompact" />
            <nav className="hidden items-center gap-1 sm:flex">
              {nav.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm transition ${
                      active
                        ? "text-brand-gold"
                        : "text-brand-mist hover:text-brand-bone"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="btn-ghost text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Site
            </Link>
            <button type="button" onClick={logout} className="btn-ghost text-xs">
              <LogOut className="h-3.5 w-3.5" />
              Çıkış
            </button>
          </div>
        </div>
        <nav className="container-page flex gap-1 overflow-x-auto pb-3 sm:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-3 py-1.5 text-xs ${
                pathname.startsWith(item.href)
                  ? "bg-brand-gold text-brand-ink"
                  : "border border-white/10 text-brand-mist"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="container-page py-8">{children}</div>
    </div>
  );
}
