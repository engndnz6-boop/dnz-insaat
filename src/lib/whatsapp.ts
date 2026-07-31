/** WhatsApp canlı destek numarası — kendi numaranızla değiştirin (ülke kodu ile, örn. 905xxxxxxxxx) */
export const WHATSAPP_NUMBER = "905336110615";

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function productInquiryMessage(productName: string): string {
  return `Merhaba, ${productName} ürünü hakkında bilgi almak istiyorum.`;
}

export function quoteInquiryMessage(): string {
  return "Merhaba, proje / toplu alım için teklif almak istiyorum.";
}

export function cartInquiryMessage(items: { name: string; quantity: number }[]): string {
  const lines = items.map((i) => `- ${i.name} (x${i.quantity})`).join("\n");
  return `Merhaba, sepetimdeki ürünler hakkında bilgi / sipariş almak istiyorum:\n${lines}`;
}
