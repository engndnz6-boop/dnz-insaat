"use client";

import { useEffect, useState } from "react";
import type { StoredOrder } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";

const STATUS_LABEL: Record<StoredOrder["status"], string> = {
  paid: "Ödendi (kart)",
  pending_transfer: "Havale bekliyor",
  whatsapp: "WhatsApp",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dnz-insaat-orders");
      if (raw) setOrders(JSON.parse(raw) as StoredOrder[]);
    } catch {
      /* ignore */
    }
  }, []);

  const clear = () => {
    if (!confirm("Tüm sipariş kayıtları silinsin mi?")) return;
    localStorage.removeItem("dnz-insaat-orders");
    setOrders([]);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-bone">Siparişler</h1>
          <p className="mt-2 text-sm text-brand-mist">
            {orders.length} kayıt · tarayıcıda saklanır
          </p>
        </div>
        {orders.length > 0 && (
          <button type="button" onClick={clear} className="btn-ghost text-xs">
            Kayıtları Temizle
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 border border-dashed border-white/10 p-12 text-center text-sm text-brand-mist">
          Henüz sipariş yok. Site üzerinden bir ödeme tamamlayın.
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-white/5 bg-brand-anthracite/50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-brand-bone">{order.id}</p>
                  <p className="mt-1 text-xs text-brand-mist">
                    {new Date(order.createdAt).toLocaleString("tr-TR")} ·{" "}
                    {order.customer.fullName} · {order.customer.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-gold">
                    {formatPrice(order.totals.total)}
                  </p>
                  <p className="mt-1 text-xs text-brand-mist">
                    {STATUS_LABEL[order.status]}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-1 border-t border-white/5 pt-3 text-sm text-brand-mist">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} × {item.quantity} —{" "}
                    {formatPrice(item.price * item.quantity)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-brand-mist">
                {order.customer.address}, {order.customer.city}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
