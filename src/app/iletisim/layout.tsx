import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Alçıpan & Asma Tavan Teklifi Ankara",
  description:
    "DNZ İnşaat Gölbaşı Ankara: alçıpan, profil, clip-in asma tavan, taşyünü ve bölme duvar için teklif alın. Tel: 0533 611 06 15",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
