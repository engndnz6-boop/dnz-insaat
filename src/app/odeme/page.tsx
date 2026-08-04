"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { CreditCard, Landmark, MessageCircle, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { brand, checkoutConfig } from "@/lib/brand";
import {
  calcOrderTotals,
  createOrderId,
  processMockPayment,
  type CheckoutFormData,
  type PaymentMethod,
  type StoredOrder,
} from "@/lib/checkout";
import { buildWhatsAppUrl, cartInquiryMessage } from "@/lib/whatsapp";

const initial: CheckoutFormData = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  note: "",
  paymentMethod: "card",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

export default function OdemePage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutFormData>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totals = useMemo(() => calcOrderTotals(totalPrice), [totalPrice]);

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="section-title">Ödeme</h1>
        <p className="section-subtitle mx-auto">Sepetiniz boş.</p>
        <Link href="/katalog" className="btn-primary mt-8">
          Kataloğa Git
        </Link>
      </div>
    );
  }

  const set = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await processMockPayment(
      form.paymentMethod,
      form.cardNumber
    );

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    const orderId = createOrderId();
    const order: StoredOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        address: form.address,
        note: form.note,
        paymentMethod: form.paymentMethod,
      },
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totals,
      status:
        form.paymentMethod === "card"
          ? "paid"
          : form.paymentMethod === "transfer"
            ? "pending_transfer"
            : "whatsapp",
    };

    try {
      const prev = JSON.parse(
        localStorage.getItem("dnz-insaat-orders") || "[]"
      ) as StoredOrder[];
      localStorage.setItem(
        "dnz-insaat-orders",
        JSON.stringify([order, ...prev])
      );
      sessionStorage.setItem("dnz-last-order", JSON.stringify(order));
    } catch {
      /* ignore */
    }

    if (form.paymentMethod === "whatsapp") {
      const href = buildWhatsAppUrl(
        cartInquiryMessage(
          items.map((i) => ({ name: i.product.name, quantity: i.quantity }))
        ) + `\n\nSipariş No: ${orderId}\nToplam: ${formatPrice(totals.total)}`
      );
      clearCart();
      window.open(href, "_blank");
      router.push(`/odeme/basarili?order=${orderId}`);
      return;
    }

    clearCart();
    setLoading(false);
    router.push(`/odeme/basarili?order=${orderId}`);
  };

  const methods: {
    id: PaymentMethod;
    label: string;
    desc: string;
    icon: typeof CreditCard;
  }[] = [
    {
      id: "card",
      label: "Kredi / Banka Kartı",
      desc: "Mock ödeme — gerçek çekim yapılmaz",
      icon: CreditCard,
    },
    {
      id: "transfer",
      label: "Havale / EFT",
      desc: "Sipariş sonrası IBAN bilgisi",
      icon: Landmark,
    },
    {
      id: "whatsapp",
      label: "WhatsApp ile Onay",
      desc: "Siparişi WhatsApp’tan tamamla",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <h1 className="section-title">Ödeme</h1>
      <p className="section-subtitle">
        Teslimat bilgilerinizi girin ve ödeme yöntemini seçin.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]"
      >
        <div className="space-y-8">
          <section className="border border-black/5 bg-brand-anthracite/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Teslimat
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Ad Soyad *" id="fullName">
                <input
                  id="fullName"
                  required
                  className="input-field"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                />
              </Field>
              <Field label="Telefon *" id="phone">
                <input
                  id="phone"
                  type="tel"
                  required
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field label="E-posta *" id="email">
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field label="Şehir *" id="city">
                <input
                  id="city"
                  required
                  className="input-field"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Adres *" id="address">
                  <textarea
                    id="address"
                    required
                    rows={3}
                    className="input-field resize-y"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Sipariş notu" id="note">
                  <input
                    id="note"
                    className="input-field"
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="border border-black/5 bg-brand-anthracite/40 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Ödeme Yöntemi
            </h2>
            <div className="mt-5 grid gap-3">
              {methods.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                    form.paymentMethod === m.id
                      ? "border-brand-gold bg-brand-gold/5"
                      : "border-black/10 hover:border-black/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="mt-1 accent-[#C9A14A]"
                    checked={form.paymentMethod === m.id}
                    onChange={() => set("paymentMethod", m.id)}
                  />
                  <m.icon className="mt-0.5 h-4 w-4 text-brand-gold" />
                  <span>
                    <span className="block text-sm font-medium text-brand-bone">
                      {m.label}
                    </span>
                    <span className="text-xs text-brand-mist">{m.desc}</span>
                  </span>
                </label>
              ))}
            </div>

            {form.paymentMethod === "card" && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Kart üzerindeki isim *" id="cardName">
                    <input
                      id="cardName"
                      required
                      className="input-field"
                      value={form.cardName}
                      onChange={(e) => set("cardName", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Kart numarası *" id="cardNumber">
                    <input
                      id="cardNumber"
                      required
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      className="input-field"
                      value={form.cardNumber}
                      onChange={(e) =>
                        set(
                          "cardNumber",
                          e.target.value
                            .replace(/[^\d]/g, "")
                            .slice(0, 16)
                            .replace(/(\d{4})(?=\d)/g, "$1 ")
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Son kullanma *" id="cardExpiry">
                  <input
                    id="cardExpiry"
                    required
                    placeholder="AA/YY"
                    className="input-field"
                    value={form.cardExpiry}
                    onChange={(e) => set("cardExpiry", e.target.value)}
                  />
                </Field>
                <Field label="CVC *" id="cardCvc">
                  <input
                    id="cardCvc"
                    required
                    inputMode="numeric"
                    maxLength={4}
                    className="input-field"
                    value={form.cardCvc}
                    onChange={(e) =>
                      set("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </Field>
                <p className="sm:col-span-2 text-xs text-brand-mist">
                  Test: herhangi bir 16 haneli numara başarılı olur.
                  `…0002` ile bitenler reddedilir. Gerçek ödeme gateway’i
                  (iyzico / PayTR) sonra bağlanabilir.
                </p>
              </div>
            )}

            {form.paymentMethod === "transfer" && (
              <div className="mt-6 border border-black/10 bg-brand-ink/40 p-4 text-sm text-brand-mist">
                <p className="font-medium text-brand-bone">Havale bilgileri</p>
                <p className="mt-2">
                  {brand.name}
                  <br />
                  IBAN: TR00 0000 0000 0000 0000 0000 00
                  <br />
                  Açıklama: Sipariş numaranız
                </p>
              </div>
            )}
          </section>

          {error && (
            <p className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        <aside className="h-fit border border-black/5 bg-brand-anthracite p-6 lg:sticky lg:top-28">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Sipariş Özeti
          </h2>
          <ul className="mt-4 space-y-2 border-b border-black/10 pb-4 text-sm">
            {items.map((i) => (
              <li key={i.product.id} className="flex justify-between gap-3">
                <span className="text-brand-mist">
                  {i.product.name} × {i.quantity}
                </span>
                <span className="shrink-0 text-brand-bone">
                  {formatPrice(i.product.price * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-mist">Ara toplam</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-mist">
                KDV (%{checkoutConfig.vatRate * 100})
              </dt>
              <dd>{formatPrice(totals.vat)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-mist">Kargo</dt>
              <dd>
                {totals.shipping === 0
                  ? "Ücretsiz"
                  : formatPrice(totals.shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-3 text-base font-semibold">
              <dt>Toplam</dt>
              <dd className="text-brand-gold">{formatPrice(totals.total)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                İşleniyor…
              </>
            ) : (
              "Siparişi Tamamla"
            )}
          </button>
          <Link href="/sepet" className="btn-ghost mt-2 w-full text-xs">
            Sepete Dön
          </Link>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label-field">
        {label}
      </label>
      {children}
    </div>
  );
}
