import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { ProductsProvider } from "@/lib/products-context";
import { CatalogProvider } from "@/lib/catalog-context";
import { CalculatorsProvider } from "@/lib/calculators-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
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

export const metadata: Metadata = {
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  icons: {
    icon: "/favicon.png",
    apple: "/logo-dnz.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
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
