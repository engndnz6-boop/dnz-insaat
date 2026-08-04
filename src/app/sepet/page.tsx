"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, MessageCircle, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  buildWhatsAppUrl,
  cartInquiryMessage,
} from "@/lib/whatsapp";
import { calcOrderTotals } from "@/lib/checkout";
import { checkoutConfig } from "@/lib/brand";

export default function SepetPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="section-title">Sepetiniz Boş</h1>
        <p className="section-subtitle mx-auto">
          Kataloğumuzdan ürün ekleyerek başlayabilirsiniz.
        </p>
        <Link href="/katalog" className="btn-primary mt-8">
          Kataloğa Git
        </Link>
      </div>
    );
  }

  const totals = calcOrderTotals(totalPrice);
  const waHref = buildWhatsAppUrl(
    cartInquiryMessage(
      items.map((i) => ({ name: i.product.name, quantity: i.quantity }))
    )
  );

  return (
    <div className="container-page py-12 sm:py-16">
      <h1 className="section-title">Sepet</h1>
      <p className="section-subtitle">{items.length} ürün</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-4">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex flex-col gap-4 border border-black/5 bg-brand-anthracite/40 p-4 sm:flex-row sm:items-center"
            >
              <Link
                href={`/urun/${product.slug}`}
                className="relative h-24 w-full shrink-0 overflow-hidden sm:h-20 sm:w-20"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/urun/${product.slug}`}
                  className="font-display text-lg text-brand-bone hover:text-brand-gold"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm text-brand-gold">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-black/10">
                  <button
                    type="button"
                    className="p-2 text-brand-mist hover:text-brand-gold"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label="Azalt"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    className="p-2 text-brand-mist hover:text-brand-gold"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label="Artır"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-brand-mist hover:text-red-400"
                  aria-label="Kaldır"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-black/5 bg-brand-anthracite p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Özet
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-mist">Ara toplam</dt>
              <dd className="text-brand-bone">{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-mist">KDV (%{checkoutConfig.vatRate * 100})</dt>
              <dd className="text-brand-bone">{formatPrice(totals.vat)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-mist">Kargo</dt>
              <dd className="text-brand-bone">
                {totals.shipping === 0 ? "Ücretsiz" : formatPrice(totals.shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-3 font-semibold">
              <dt className="text-brand-bone">Toplam</dt>
              <dd className="text-brand-gold">{formatPrice(totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-brand-mist">
            {checkoutConfig.freeShippingThreshold.toLocaleString("tr-TR")} ₺ ve
            üzeri siparişlerde kargo ücretsiz.
          </p>
          <Link href="/odeme" className="btn-primary mt-6 w-full">
            <CreditCard className="h-4 w-4" />
            Ödemeye Geç
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-3 w-full text-xs"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp ile Sipariş
          </a>
          <button
            type="button"
            onClick={clearCart}
            className="btn-ghost mt-2 w-full text-xs"
          >
            Sepeti Temizle
          </button>
        </aside>
      </div>
    </div>
  );
}
