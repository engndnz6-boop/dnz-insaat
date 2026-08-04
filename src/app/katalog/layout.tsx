import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alçıpan, Profil, Clip-in & Asma Tavan Ürün Kataloğu",
  description:
    "Alçıpan, galvaniz profil, clip-in / klipin asma tavan, taşyünü tavan, metal tavan, plastik tavan, karolam ve bölme duvar malzemeleri. DNZ İnşaat katalog.",
  keywords: [
    "alçıpan satışı",
    "galvaniz profil",
    "clipin asma tavan",
    "klipin",
    "taşyünü tavan",
    "metal tavan",
    "plastik tavan",
    "bölme duvar malzemeleri",
  ],
  alternates: { canonical: "/katalog" },
};

export default function KatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
