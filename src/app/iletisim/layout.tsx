import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Alçıpan, Asma Tavan, Tadilat Teklifi Ankara",
  description:
    "DNZ İnşaat Gölbaşı: alçıpan, profil, asma tavan, bölme duvar, elektrik/su tamiratı, ev-okul-ofis tadilatı, anahtar teslim. Tel: 0533 611 06 15",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
