import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Aydınlatma Metni",
  alternates: { canonical: "/gizlilik" },
  robots: { index: true, follow: true },
};

/**
 * Taslak metindir. Yayında kalmadan önce firmanın mali müşaviri veya hukuk
 * danışmanı tarafından kontrol edilmesi önerilir.
 */
export default function GizlilikPage() {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="type-wide text-3xl font-bold text-brand-navy sm:text-4xl">Gizlilik ve KVKK aydınlatma metni</h1>
      <div className="mt-8 space-y-6 rounded-lg border border-black/5 bg-white p-6 leading-relaxed text-brand-bone/85 shadow-red sm:p-10">
        <section>
          <h2 className="text-lg font-bold text-brand-navy">Veri sorumlusu</h2>
          <p className="mt-2">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri
            sorumlusu {brand.name}’dir. Adres: {brand.address}. Telefon: {brand.phone}.
            E-posta: {brand.email}.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">İşlenen kişisel veriler</h2>
          <p className="mt-2">
            Teklif formu, sipariş ve iletişim kanalları aracılığıyla ilettiğiniz ad
            soyad, telefon numarası, e-posta adresi, proje konumu, teslimat adresi ve
            mesaj içeriğiniz işlenir.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">İşleme amaçları ve hukuki sebep</h2>
          <p className="mt-2">
            Verileriniz; teklif hazırlamak, sizinle iletişime geçmek, siparişinizi
            ve uygulama hizmetini yerine getirmek ve yasal yükümlülüklerimizi
            karşılamak amacıyla, KVKK madde 5/2 (c) sözleşmenin kurulması ve
            ifası, (ç) hukuki yükümlülük ve (f) meşru menfaat hukuki sebeplerine
            dayanılarak işlenir.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">Aktarım</h2>
          <p className="mt-2">
            Verileriniz pazarlama amacıyla üçüncü kişilerle paylaşılmaz. Hizmetin
            yürütülmesi için kullanılan e-posta, bulut depolama ve mesajlaşma
            hizmet sağlayıcılarına (yurt dışında bulunanlar dahil) ve kanunen
            yetkili kurumlara, gerekli olduğu ölçüde aktarılabilir.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">Saklama süresi</h2>
          <p className="mt-2">
            Verileriniz işleme amacının gerektirdiği süre ve ilgili mevzuatta
            öngörülen süreler boyunca saklanır, sonrasında silinir ya da anonim
            hale getirilir.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">Haklarınız</h2>
          <p className="mt-2">
            KVKK madde 11 kapsamında verilerinizin işlenip işlenmediğini öğrenme,
            düzeltilmesini veya silinmesini isteme ve itiraz etme haklarına
            sahipsiniz. Taleplerinizi {brand.email} adresine iletebilirsiniz.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-brand-navy">Çerezler</h2>
          <p className="mt-2">
            Sitemiz, sepet ve tercihlerinizi hatırlamak için tarayıcınızda yerel
            depolama kullanır. Reklam amaçlı çerez kullanılmaz.
          </p>
        </section>
      </div>
    </div>
  );
}
