/** Uygulama hizmetleri — ana sayfa kartları ve Hizmetlerimiz sayfası tek yerden beslenir */
export type Service = {
  slug: string;
  title: string;
  short: string;
  long: string;
  items: string[];
  icon: "building" | "hammer" | "grid" | "zap" | "roller" | "door";
};

export const services: Service[] = [
  {
    slug: "sifirdan-insaat",
    title: "Sıfırdan inşaat ve proje işleri",
    short: "Projenin başından anahtar teslimine kadar malzeme ve uygulama.",
    long: "Yeni yapı ve ek bina projelerinde kaba ve ince işlerin planlanması, malzeme tedariki ve uygulamasını tek elden yürütüyoruz.",
    items: ["Proje ve metraj planlaması", "Malzeme tedariki", "Kaba ve ince işler", "Anahtar teslim"],
    icon: "building",
  },
  {
    slug: "tadilat-tamirat",
    title: "Komple tadilat ve tamirat",
    short: "Ev, okul ve ofis için komple ya da bölümsel yenileme.",
    long: "Ev, okul, ofis ve iş yerlerinde komple tadilat, bölümsel yenileme ve tamir işlerini keşiften teslime kadar üstleniyoruz.",
    items: ["Ev tadilatı", "Okul ve ofis tadilatı", "İş yeri yenileme", "Tamir ve bakım"],
    icon: "hammer",
  },
  {
    slug: "seramik-fayans",
    title: "Seramik ve fayans uygulaması",
    short: "Banyo, mutfak ve zeminlerde seramik ve fayans döşeme.",
    long: "Banyo, mutfak, balkon ve zeminlerde seramik ve fayans malzemesi ile döşeme uygulaması yapıyoruz.",
    items: ["Banyo ve mutfak", "Zemin seramiği", "Duvar fayansı", "Derz ve izolasyon"],
    icon: "grid",
  },
  {
    slug: "elektrik-su-tesisati",
    title: "Elektrik ve su tesisatı",
    short: "Tesisat yenileme, arıza ve kombi yedek parça.",
    long: "Elektrik ve su tesisatı yenileme, arıza giderme, kombi yedek parçası ve tesisat malzemesi temini.",
    items: ["Elektrik tamiratı", "Su tesisatı", "Kombi yedek parça", "Anahtar, priz ve aydınlatma"],
    icon: "zap",
  },
  {
    slug: "alci-boya-alcipan",
    title: "Alçı, boya, alçıpan ve asma tavan",
    short: "Alçıpan, asma tavan, ışık bandı, bölme duvar, alçı ve boya.",
    long: "Alçıpan asma tavan, ışık bandı, clip-in, karolam ve taşyünü tavan, bölme ve giydirme duvar, alçı ve boya uygulamaları.",
    items: ["Alçıpan asma tavan", "Işık bandı", "Bölme ve giydirme duvar", "Alçı ve boya"],
    icon: "roller",
  },
  {
    slug: "parke-kapi-dekorasyon",
    title: "Parke, kapı, pencere ve dekorasyon",
    short: "Parke döşeme, kapı ve pencere, iç mekân dekorasyonu.",
    long: "Parke döşeme, iç kapı ve pencere değişimi, lambiri ve iç mekân dekorasyon uygulamaları.",
    items: ["Parke döşeme", "Kapı ve pencere", "Lambiri", "Dekorasyon"],
    icon: "door",
  },
];
