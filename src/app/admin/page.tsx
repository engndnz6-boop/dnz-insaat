"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, ShoppingBag, Plus, Calculator } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { useCalculators } from "@/lib/calculators-context";
import type { StoredOrder } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";

export default function AdminHomePage() {
  const { products } = useProducts();
  const { systems } = useCalculators();
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dnz-insaat-orders");
      if (raw) setOrders(JSON.parse(raw) as StoredOrder[]);
    } catch {
      /* ignore */
    }
  }, []);

  const revenue = orders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + o.totals.total, 0);

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-bone">Özet</h1>
      <p className="mt-2 text-sm text-brand-mist">
        Ürün kataloğu, hesaplama sistemleri ve sipariş yönetimi.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Ürün"
          value={String(products.length)}
          icon={Package}
          href="/admin/urunler"
        />
        <Stat
          label="Hesaplama sistemi"
          value={String(systems.length)}
          icon={Calculator}
          href="/admin/hesaplamalar"
        />
        <Stat
          label="Sipariş"
          value={String(orders.length)}
          icon={ShoppingBag}
          href="/admin/siparisler"
        />
        <Stat
          label="Ödenen (mock)"
          value={formatPrice(revenue)}
          icon={ShoppingBag}
          href="/admin/siparisler"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/urunler/yeni" className="btn-primary">
          <Plus className="h-4 w-4" />
          Yeni Ürün
        </Link>
        <Link href="/admin/hesaplamalar" className="btn-secondary">
          <Calculator className="h-4 w-4" />
          Hesaplamaları Düzenle
        </Link>
        <Link href="/admin/urunler" className="btn-ghost">
          Ürünleri Yönet
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  icon: typeof Package;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border border-black/5 bg-brand-anthracite p-5 transition hover:border-brand-gold/30"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-brand-mist">{label}</p>
        <Icon className="h-4 w-4 text-brand-gold" />
      </div>
      <p className="mt-3 font-display text-2xl text-brand-bone">{value}</p>
    </Link>
  );
}
