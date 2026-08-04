"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { StoredOrder } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";
import { LogoMark } from "@/components/brand/Logo";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dnz-last-order");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOrder;
        if (!orderId || parsed.id === orderId) setOrder(parsed);
      }
    } catch {
      /* ignore */
    }
  }, [orderId]);

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <LogoMark className="h-14 w-auto" />
      <CheckCircle2 className="mt-6 h-12 w-12 text-brand-gold" />
      <h1 className="section-title mt-4">Siparişiniz alındı</h1>
      <p className="section-subtitle mx-auto">
        {order
          ? `Sipariş numaranız: ${order.id}`
          : orderId
            ? `Sipariş numaranız: ${orderId}`
            : "Teşekkür ederiz."}
      </p>

      {order && (
        <div className="mt-8 w-full max-w-md border border-black/10 bg-brand-anthracite p-6 text-left text-sm">
          <p className="text-brand-mist">
            Ödeme:{" "}
            <span className="text-brand-bone">
              {order.status === "paid"
                ? "Kart ile ödendi (mock)"
                : order.status === "pending_transfer"
                  ? "Havale bekleniyor"
                  : "WhatsApp onayı"}
            </span>
          </p>
          <p className="mt-2 text-brand-mist">
            Toplam:{" "}
            <span className="font-semibold text-brand-gold">
              {formatPrice(order.totals.total)}
            </span>
          </p>
          {order.status === "pending_transfer" && (
            <p className="mt-3 text-xs text-brand-mist">
              Havale açıklamasına sipariş numaranızı yazmayı unutmayın.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/katalog" className="btn-primary">
          Alışverişe Devam
        </Link>
        <Link href="/" className="btn-secondary">
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}

export default function OdemeBasariliPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-20 text-center text-brand-mist">
          Yükleniyor…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
