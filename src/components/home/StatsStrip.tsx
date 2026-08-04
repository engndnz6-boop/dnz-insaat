const stats = [
  { value: "10+", label: "Yıllık tecrübe" },
  { value: "500+", label: "Tamamlanan proje" },
  { value: "7", label: "Ürün grubu" },
  { value: "Ankara", label: "Merkez ofis" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-black/5 bg-white py-12 sm:py-14">
      <div className="container-page">
        <p className="section-kicker text-center">Sayılarla DNZ</p>
        <h2 className="mt-2 text-center section-title">Güvenilir üretim ve uygulama</h2>
        <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-sans text-3xl font-bold text-brand-navy sm:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm font-medium text-brand-mist">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
