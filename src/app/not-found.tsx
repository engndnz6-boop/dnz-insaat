import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">
        404
      </p>
      <h1 className="section-title mt-3">Sayfa bulunamadı</h1>
      <p className="section-subtitle mx-auto">
        Aradığınız ürün veya sayfa mevcut değil.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
