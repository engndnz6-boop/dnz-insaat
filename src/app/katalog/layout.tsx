import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alçıpan, Profil, Asma Tavan, Seramik & Malzeme Kataloğu",
  description:
    "Alçıpan, alçı, boya, galvaniz ve kutu profil, ABS, UMS, clip-in / petek / karolam / taşyünü / vinil asma tavan, plastik lambiri, bölme duvar, seramik, parke, yedek parça. DNZ İnşaat katalog.",
  keywords: [
    "alçıpan satışı",
    "galvaniz profil",
    "kutu profil",
    "clipin asma tavan",
    "petek asma tavan",
    "karolam tavan",
    "taşyünü asma tavan",
    "vinil asma tavan",
    "plastik lambiri",
    "bölme duvar malzemeleri",
    "alçıpan giydirme duvar",
    "seramik",
    "parke",
    "kombi parçası",
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
