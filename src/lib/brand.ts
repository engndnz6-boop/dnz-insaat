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
    ink: "#EEF1F4",
    anthracite: "#FFFFFF",
    slate: "#D5DBE3",
    mist: "#5E6874",
    bone: "#151920",
    gold: "#B8923F",
    goldLight: "#C9A14A",
    navy: "#1E3348",
  },
} as const;

export const checkoutConfig = {
  vatRate: 0.2,
  shippingFlat: 250,
  freeShippingThreshold: 15000,
  currency: "TRY" as const,
};
