import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "alcipan-asma-tavan-standart",
    name: "Alçıpan Asma Tavan Sistemi",
    shortDescription:
      "Standart alçıpan asma tavan uygulaması için plaka, profil ve bağlantı seti.",
    description:
      "Konut, ofis ve ticari mekânlarda kullanılan alçıpan asma tavan sistemi. Metal taşıyıcı profil, alçıpan plaka ve vida seti ile anahtar teslim veya malzeme satışı olarak sunulur. Düz yüzey, boyaya hazır bitiş.",
    price: 185,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    categoryId: "cat-alcipan-tavan",
    material: "alcipan",
    color: "beyaz",
    size: "m²",
    usageAreas: ["konut", "ofis", "ticari"],
    specs: {
      dimensions: "Plaka 120 × 250 cm (uygulama m²)",
      material: "Alçıpan + galvaniz C / U profil",
      weight: "Yaklaşık 9–11 kg / m²",
      warranty: "2 yıl işçilik / malzeme garantisi",
      thickness: "12.5 mm plaka",
      finish: "Boyaya hazır",
      fireResistance: "A2-s1,d0 (standart plaka)",
    },
    pdfUrl: "/docs/nero-marquina-teknik.pdf",
    featured: true,
    inStock: true,
  },
  {
    id: "2",
    slug: "alcipan-isik-bandi",
    name: "Alçıpan Işık Bandı (Gizli Aydınlatma)",
    shortDescription:
      "Tavan–duvar geçişinde LED gizli aydınlatma için alçıpan ışık bandı detayı.",
    description:
      "Salon, koridor ve otel lobilerinde sık kullanılan alçıpan ışık bandı uygulaması. LED şerit yuvası, korniş / niş detayı ve boya öncesi hazırlık dahil proje bazlı uygulama veya malzeme tedariki.",
    price: 420,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    ],
    categoryId: "cat-isik-bandi",
    material: "alcipan",
    color: "beyaz",
    size: "mt / m²",
    usageAreas: ["konut", "otel", "ofis"],
    specs: {
      dimensions: "Proje ölçüsüne göre",
      material: "Alçıpan + metal profil + LED yuvası",
      weight: "Uygulamaya göre değişir",
      warranty: "2 yıl",
      thickness: "12.5 mm",
      finish: "Sıva + boya hazır",
    },
    pdfUrl: "/docs/altin-led-sove-teknik.pdf",
    featured: true,
    inStock: true,
  },
  {
    id: "3",
    slug: "tasyunu-asma-tavan",
    name: "Taşyünü Asma Tavan Paneli",
    shortDescription:
      "Akustik ve yangın performanslı taşyünü asma tavan panelleri.",
    description:
      "Ofis, okul, hastane ve ticari alanlarda tercih edilen taşyünü asma tavan. Ses yutumu ve yangın dayanımı yüksek; T24 / T15 ızgara sistemleriyle uyumludur. Malzeme satışı ve montaj hizmeti.",
    price: 265,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
    ],
    categoryId: "cat-tasyunu",
    material: "tasyunu",
    color: "beyaz",
    size: "60×60 cm",
    usageAreas: ["ofis", "hastane", "ticari"],
    specs: {
      dimensions: "60 × 60 cm panel",
      material: "Taşyünü mineral panel",
      weight: "Yaklaşık 3–4 kg / m²",
      warranty: "5 yıl malzeme",
      thickness: "15–20 mm",
      finish: "Boyali / dokulu yüzey",
      fireResistance: "A1 / A2 sınıfı (ürüne göre)",
    },
    pdfUrl: "/docs/antrasit-seramik-teknik.pdf",
    featured: true,
    inStock: true,
  },
  {
    id: "4",
    slug: "karolam-asma-tavan",
    name: "Karolam Asma Tavan",
    shortDescription:
      "Modüler karolam asma tavan panelleri — hızlı montaj, temiz görünüm.",
    description:
      "Karolam (karo lam) asma tavan sistemleri; ofis ve mağaza projelerinde ekonomik ve hızlı çözüm sunar. Demonte edilebilir paneller bakım ve tesisat erişimi kolaylaştırır.",
    price: 195,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    ],
    categoryId: "cat-karolam",
    material: "karolam",
    color: "beyaz",
    size: "60×60 cm",
    usageAreas: ["ofis", "magaza", "ticari"],
    specs: {
      dimensions: "60 × 60 cm",
      material: "Mineral / PVC kaplı karolam panel",
      weight: "Yaklaşık 2.5–3.5 kg / m²",
      warranty: "3 yıl",
      thickness: "7–15 mm",
      finish: "Mat beyaz",
    },
    pdfUrl: "/docs/mese-laminat-teknik.pdf",
    featured: true,
    inStock: true,
  },
  {
    id: "5",
    slug: "clipin-asma-tavan",
    name: "Clip-in Asma Tavan",
    shortDescription:
      "Metal clip-in asma tavan — modern, dayanıklı ve demonte edilebilir.",
    description:
      "Clip-in (klipsli) metal asma tavan sistemleri; mağaza, otel, havalimanı ve kurumsal projelerde tercih edilir. Gizli taşıyıcı, düz veya delikli panel seçenekleri. RAL renk seçimi mümkün.",
    price: 480,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
    ],
    categoryId: "cat-clipin",
    material: "clipin",
    color: "ral",
    size: "30×30 / 60×60 cm",
    usageAreas: ["magaza", "otel", "ticari"],
    specs: {
      dimensions: "30×30 veya 60×60 cm panel",
      material: "Galvaniz / alüminyum clip-in panel",
      weight: "Yaklaşık 4–6 kg / m²",
      warranty: "5 yıl",
      thickness: "0.5–0.7 mm sac",
      finish: "Elektrostatik boya (RAL)",
      fireResistance: "A1 metal sistem",
    },
    pdfUrl: "/docs/kompozit-cephe-teknik.pdf",
    featured: true,
    inStock: true,
  },
  {
    id: "6",
    slug: "bolme-duvar-alcipan",
    name: "Alçıpan Bölme Duvar Sistemi",
    shortDescription:
      "Ofis ve konut içi alçıpan bölme duvar — ses yalıtımlı seçenekler.",
    description:
      "Tek / çift plaka alçıpan bölme duvar uygulamaları. Taşyünü dolgulu akustik çözümler, kapı boşlukları ve elektrik tesisat geçişleri ile anahtar teslim veya malzeme satışı.",
    price: 320,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    ],
    categoryId: "cat-bolme",
    material: "bolme-duvar",
    color: "beyaz",
    size: "m²",
    usageAreas: ["konut", "ofis", "hastane"],
    specs: {
      dimensions: "Proje ölçüsüne göre (standart yükseklik 270–300 cm)",
      material: "Alçıpan + CW/UW profil + taşyünü dolgu (opsiyonel)",
      weight: "Yaklaşık 25–40 kg / m²",
      warranty: "2 yıl",
      thickness: "7.5 / 10 / 12.5 cm duvar kalınlığı",
      finish: "Sıva + boya hazır",
      fireResistance: "EI 30–60 (detaya göre)",
    },
    pdfUrl: "/docs/frosted-cam-teknik.pdf",
    featured: true,
    inStock: true,
  },
  {
    id: "7",
    slug: "galvaniz-tavan-profili",
    name: "Galvaniz Asma Tavan Profil Seti",
    shortDescription:
      "C, U ve askı telleri — alçıpan asma tavan taşıyıcı malzeme.",
    description:
      "Alçıpan asma tavan ve ışık bandı uygulamaları için galvaniz profil, askı teli, dübel ve bağlantı elemanları. Metre / set bazlı satış.",
    price: 95,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    ],
    categoryId: "cat-alcipan-tavan",
    material: "aksesuar",
    color: "gri",
    size: "3 m profil",
    usageAreas: ["konut", "ofis", "ticari"],
    specs: {
      dimensions: "Standart 3 m boy",
      material: "Galvaniz sac profil",
      weight: "Profile göre değişir",
      warranty: "1 yıl",
      thickness: "0.40–0.60 mm",
      finish: "Galvaniz",
    },
    pdfUrl: "/docs/celik-korkuluk-teknik.pdf",
    inStock: true,
  },
  {
    id: "8",
    slug: "alcipan-plaka-125",
    name: "Alçıpan Plaka 12.5 mm",
    shortDescription:
      "Standart beyaz alçıpan plaka — tavan ve bölme duvar uygulamaları için.",
    description:
      "120×250 cm standart alçıpan plaka. Asma tavan, ışık bandı ve bölme duvar işlerinde kullanılır. Palet / adet satışı. Nemli mekân için yeşil (WR) plaka opsiyonu sorulabilir.",
    price: 280,
    currency: "TRY",
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80",
    ],
    categoryId: "cat-alcipan-tavan",
    material: "aksesuar",
    color: "beyaz",
    size: "120×250 cm",
    usageAreas: ["konut", "ofis", "ticari"],
    specs: {
      dimensions: "120 × 250 cm",
      material: "Alçı çekirdek + karton kaplama",
      weight: "Yaklaşık 9 kg / plaka",
      warranty: "Üretici garantisi",
      thickness: "12.5 mm",
      fireResistance: "A2-s1,d0",
    },
    pdfUrl: "/docs/carrara-tezgah-teknik.pdf",
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
