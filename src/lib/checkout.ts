import { checkoutConfig } from "@/lib/brand";

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
}

export function calcOrderTotals(subtotal: number): OrderTotals {
  const shipping =
    subtotal >= checkoutConfig.freeShippingThreshold
      ? 0
      : checkoutConfig.shippingFlat;
  const vat = Math.round(subtotal * checkoutConfig.vatRate);
  const total = subtotal + shipping + vat;
  return { subtotal, shipping, vat, total };
}

export type PaymentMethod = "card" | "transfer" | "whatsapp";

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export interface StoredOrder {
  id: string;
  createdAt: string;
  customer: Omit<
    CheckoutFormData,
    "cardName" | "cardNumber" | "cardExpiry" | "cardCvc"
  >;
  items: { productId: string; name: string; price: number; quantity: number }[];
  totals: OrderTotals;
  status: "paid" | "pending_transfer" | "whatsapp";
}

export function createOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `DNZ-${n}`;
}

/** Mock ödeme — gerçek kart işlenmez, 1.2s gecikme simüle edilir */
export async function processMockPayment(
  method: PaymentMethod,
  cardNumber: string
): Promise<{ ok: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 1200));

  if (method === "card") {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 15) {
      return { ok: false, message: "Geçersiz kart numarası." };
    }
    // Test: 4000000000000002 = başarısız
    if (digits.endsWith("0002")) {
      return { ok: false, message: "Ödeme reddedildi (test kartı)." };
    }
    return { ok: true, message: "Ödeme başarılı." };
  }

  return { ok: true, message: "Sipariş kaydedildi." };
}
