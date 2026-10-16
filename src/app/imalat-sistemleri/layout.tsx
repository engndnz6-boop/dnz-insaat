import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İmalat Sistemleri: Asma Tavan ve Bölme Duvar Malzeme Analizi",
  description:
    "Alçıpan asma tavan, clip-in, taşyünü, karolam ve bölme duvar için m² bazlı malzeme metrajı ve maliyet hesaplama. DNZ İnşaat.",
  keywords: [
    "alçıpan metraj hesaplama",
    "asma tavan maliyet",
    "bölme duvar hesaplama",
    "clipin metraj",
  ],
  alternates: { canonical: "/imalat-sistemleri" },
};

export default function HesaplamaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
