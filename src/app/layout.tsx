import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { ProductsProvider } from "@/lib/products-context";
import { CatalogProvider } from "@/lib/catalog-context";
import { CalculatorsProvider } from "@/lib/calculators-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { JsonLd } from "@/components/seo/JsonLd";
import { brand } from "@/lib/brand";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const titleDefault =
  "DNZ İnşaat | Alçıpan, Profil, Asma Tavan, Tadilat Ankara Gölbaşı";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: titleDefault,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: [...brand.keywords],
  authors: [{ name: brand.name }],
  creator: brand.name,
  publisher: brand.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: brand.url,
    siteName: brand.name,
    title: titleDefault,
    description: brand.description,
    images: [
      {
        url: "/logo-dnz.png",
        width: 512,
        height: 512,
        alt: "DNZ İnşaat Malzemeleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: brand.description,
    images: ["/logo-dnz.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/logo-dnz.png",
  },
  category: "construction materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <JsonLd />
        <ProductsProvider>
          <CatalogProvider>
            <CalculatorsProvider>
              <CartProvider>
                <Navbar />
                <main className="min-h-[70vh]">{children}</main>
                <Footer />
                <WhatsAppFloat />
              </CartProvider>
            </CalculatorsProvider>
          </CatalogProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
