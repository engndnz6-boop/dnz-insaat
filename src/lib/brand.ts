/** Merkezi marka kimliği — tek yerden yönetilir */
export const brand = {
  name: "DNZ İnşaat",
  shortName: "DNZ",
  tagline: "Malzeme & Dekorasyon",
  description:
    "Alçıpan asma tavan, ışık bandı, taşyünü, karolam, clip-in asma tavan, bölme duvar uygulamaları ve bağlı malzeme satışı.",
  url: "https://dnzinsaat.com",
  email: "info@dnzinsaat.com",
  phone: "0533 611 06 15",
  phoneTel: "+905336110615",
  address: "Karşıyaka Mah. Şehit Ali Gaffar Okkan Cad. No: 42/A, Gölbaşı / Ankara",
  hours: "Pazartesi – Cumartesi · 09:00 – 18:00",
  services: [
    "Alçıpan asma tavan",
    "Alçıpan ışık bandı",
    "Taşyünü asma tavan",
    "Karolam asma tavan",
    "Clip-in asma tavan",
    "Bölme duvar",
    "Bağlı malzeme satışı",
  ],
  colors: {
    ink: "#F4F6F9",
    anthracite: "#FFFFFF",
    slate: "#E2E8F0",
    mist: "#64748B",
    bone: "#0F172A",
    gold: "#D97706",
    goldLight: "#F59E0B",
    navy: "#0B2C5E",
  },
} as const;

export const checkoutConfig = {
  vatRate: 0.2,
  shippingFlat: 250,
  freeShippingThreshold: 15000,
  currency: "TRY" as const,
};
