import type { Metadata } from "next";
import { brand, checkoutConfig, returnPolicy } from "@/lib/brand";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "İade ve Teslimat Koşulları",
  description: `${brand.name} kargo, teslimat ve iade koşulları.`,
  alternates: { canonical: "/iade-teslimat" },
};

export default function IadeTeslimatPage() {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="type-wide text-3xl font-bold text-brand-navy sm:text-4xl">İade ve teslimat koşulları</h1>
      <div className="mt-8 space-y-6 rounded-lg border border-black/5 bg-white p-6 leading-relaxed text-brand-bone/85 shadow-red sm:p-10">
        <section>
          <h2 className="text-lg font-bold text-brand-navy">Teslimat</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Siparişler Türkiye içine gönderilir. Ürünleri Gölbaşı’ndaki mağazamızdan da teslim alabilirsiniz.</li>
            <li>Kargo / nakliye ücreti {formatPrice(checkoutConfig.shippingFlat)}’dir.</li>
            <li>{formatPrice(checkoutConfig.freeShippingThreshold)} ve üzeri siparişlerde teslimat ücretsizdir.</li>
            <li>Büyük hacimli ve toplu siparişlerde teslim günü telefonla birlikte planlanır.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">İade</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Teslim aldığınız tarihten itibaren {returnPolicy.days} gün içinde iade edebilirsiniz.</li>
            <li>Ürün kullanılmamış, ambalajı ve parçaları eksiksiz olmalıdır.</li>
            <li>Mağazamıza getirilen iadeler ücretsizdir. Kargo ile iade için önce {brand.phone} numarasından bize ulaşın.</li>
            <li>Sizin ölçünüze göre kesilen, hazırlanan ya da uygulaması yapılmış ürünler iade kapsamı dışındadır.</li>
            <li>İade onaylandıktan sonra ödemeniz, ödeme yaptığınız yönteme geri yapılır.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">İletişim</h2>
          <p className="mt-2">
            {brand.name}, {brand.address}. Telefon: {brand.phone}. E-posta: {brand.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
