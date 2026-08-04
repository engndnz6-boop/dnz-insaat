import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asma Tavan & Bölme Duvar Maliyet Hesaplama",
  description:
    "Alçıpan asma tavan, clip-in, taşyünü, karolam ve bölme duvar için m² bazlı malzeme metrajı ve maliyet hesaplama. DNZ İnşaat.",
  keywords: [
    "alçıpan metraj hesaplama",
    "asma tavan maliyet",
    "bölme duvar hesaplama",
    "clipin metraj",
  ],
  alternates: { canonical: "/hesaplama" },
};

export default function HesaplamaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
