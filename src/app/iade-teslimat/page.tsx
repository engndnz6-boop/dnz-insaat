import type { Metadata } from "next";
import { brand } from "@/lib/brand";

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
            <li>Kargo ücreti alıcıya aittir ve teslimatta kargo firmasına ödenir.</li>
            <li>Büyük hacimli ve toplu siparişlerde teslim günü telefonla birlikte planlanır.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">İade</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Satılan ürünlerde iade kabul edilmemektedir.</li>
            <li>Siparişten önce ölçü, miktar ve ürün seçimini birlikte netleştiriyoruz; emin olmadığınız durumlarda {brand.phone} numarasından bize danışın.</li>
            <li>Teslimatta hasarlı ya da yanlış ürün gelirse teslim aldığınız gün bize bildirin; ürünü değiştiririz.</li>
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
