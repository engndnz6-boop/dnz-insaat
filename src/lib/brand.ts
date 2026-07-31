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
    ink: "#0B0D10",
    anthracite: "#161A20",
    slate: "#252B34",
    mist: "#8E96A1",
    bone: "#F2EEE6",
    gold: "#C9A14A",
    goldLight: "#E4C77A",
    navy: "#152536",
  },
} as const;

export const adminConfig = {
  /** Demo giriş — production'da sunucu tarafı auth kullanın */
  password: "dnz2026",
  sessionKey: "dnz-admin-auth",
};

export const checkoutConfig = {
  vatRate: 0.2,
  shippingFlat: 250,
  freeShippingThreshold: 15000,
  currency: "TRY" as const,
};
