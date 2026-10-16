/**
 * İmalat sistemi hesap motoru — DnzHesap’taki hesaplardan taşındı
 * (hsCalc · hgCalc · hgBand · hsSim · hsScrew · edgeEff · wPack).
 *
 * Tüm ölçüler içeride cm’dir. Malzeme miktarı m² başına sabit oranla değil,
 * hat sayısı, profil boyu, ek yeri, askı noktası, kesişim, vida hattı ve
 * kenar paneli tek tek sayılarak bulunur.
 */

export type ImalatKind = "alcipan" | "layin" | "clipin" | "band" | "wall";

export interface ImalatMaterial {
  /** Motorun tanıdığı kalem anahtarı (örn. "ana", "plaka") */
  key: string;
  name: string;
  unit: string;
  unitPrice: number;
}

export interface ImalatSystem {
  id: string;
  title: string;
  description: string;
  kind: ImalatKind;
  /** Aralık, boy, ebat… (cm) */
  params: Record<string, number>;
  /** Sadece listede olan kalemler analize girer; sıra korunur */
  materials: ImalatMaterial[];
}

export interface ImalatLine {
  key: string;
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
  /** Miktarın nasıl bulunduğu (DnzHesap’taki açıklama satırı) */
  why: string;
}

export interface ImalatResult {
  lines: ImalatLine[];
  /** Tavan/duvar alanı (m²) ya da ışık bandında bant uzunluğu (mt) */
  measure: number;
  measureUnit: "m²" | "mt";
  /** Hesapta kullanılan ölçü, metre */
  L: number;
  K: number;
  note?: string;
  warn: string[];
}

export type ImalatError = { err: string };
export const isImalatError = (x: unknown): x is ImalatError =>
  !!x && typeof (x as { err?: unknown }).err === "string";

const E = 1e-6;
const cl = (x: number) => Math.ceil(x - E);
const r2 = (x: number) => Math.round(x * 100) / 100;
export const fmtQ = (n: number) =>
  n.toLocaleString("tr-TR", { maximumFractionDigits: 3 });

/* ───────────── yardımcılar (DnzHesap ile birebir) ───────────── */

type Seg = { s: number; e: number; pid: number };

/** Profil kesim simülasyonu: her hat için profil adedi, ek noktası */
export function hsSim(lens: number[], boy: number, minA = 0, sas = false) {
  let rem = 0,
    remId = -1,
    prof = 0,
    joints = 0,
    total = 0;
  const lines: Seg[][] = [];
  lens.forEach((len) => {
    let need = len,
      pos = 0;
    const segs: Seg[] = [];
    total += len;
    if (sas && rem >= minA && need > E) {
      const u = Math.min(rem, need);
      segs.push({ s: pos, e: pos + u, pid: remId });
      pos += u;
      need -= u;
      rem -= u;
    }
    while (need > E) {
      prof++;
      const u = Math.min(boy, need);
      segs.push({ s: pos, e: pos + u, pid: prof - 1 });
      pos += u;
      need -= u;
      rem = boy - u;
      remId = prof - 1;
    }
    if (!sas || rem < minA) rem = 0;
    joints += Math.max(0, segs.length - 1);
    lines.push(segs);
  });
  return { prof, joints, total, lines };
}

/** Kenar panel kuralı: artan parça panelin yarısına kadarsa 0,5; yarıdan büyükse 1 */
export const edgeEff = (n: number) => {
  const fl = Math.floor(n + 1e-9),
    fr = n - fl;
  return fl + (fr > E ? (fr <= 0.5 + 1e-9 ? 0.5 : 1) : 0);
};

/** Duvar profilleri: 30 cm bindirmeli ekleme, artan parçalar birlikte kesilir */
function wPack(runs: number[], bo: number, ov: number) {
  let full = 0;
  const pc: number[] = [];
  runs.forEach((ln) => {
    let r = ln;
    while (r > bo + E) {
      full++;
      r = r - bo + (bo > ov ? ov : 0);
    }
    if (r > E) pc.push(r);
  });
  pc.sort((a, b) => b - a);
  const bins: number[] = [];
  pc.forEach((x) => {
    const b = bins.findIndex((v) => v + x <= bo + E);
    if (b < 0) bins.push(x);
    else bins[b] += x;
  });
  return { n: full + bins.length, cuts: pc.length };
}

type Ln = { x1: number; y1: number; x2: number; y2: number };

/** Vida noktaları: hat uçları dahil, kesişen noktalar bir kez sayılır */
function vPts(lines: Ln[], ar: number) {
  const seen = new Set<string>();
  let n = 0;
  lines.forEach((l) => {
    const d = Math.hypot(l.x2 - l.x1, l.y2 - l.y1),
      m = Math.max(1, cl(d / ar));
    for (let j = 0; j <= m; j++) {
      const t = j / m,
        x = l.x1 + (l.x2 - l.x1) * t,
        y = l.y1 + (l.y2 - l.y1) * t,
        key = Math.round(x * 10) + "_" + Math.round(y * 10);
      if (!seen.has(key)) {
        seen.add(key);
        n++;
      }
    }
  });
  return n;
}

/** Ölçü: uzun × kısa kenar (m) ya da yalnız alan → 3:2 dikdörtgen varsayımı */
export function resolveDims(input: { L?: number; K?: number; area?: number }):
  | { L: number; K: number; note?: string }
  | ImalatError {
  const L = input.L || 0,
    K = input.K || 0,
    T = input.area || 0;
  const r3 = (x: number) => Math.round(x * 1000) / 1000;
  if (L > 0 && K > 0) return { L, K };
  if (T > 0) {
    if (L > 0) return { L, K: r3(T / L) };
    if (K > 0) return { L: r3(T / K), K };
    const l = Math.sqrt(T * 1.5);
    return {
      L: r3(l),
      K: r3(T / l),
      note: "Yalnızca toplam alan girildi; ölçüler 3:2 oranlı dikdörtgen olarak varsayıldı.",
    };
  }
  return { err: "Ölçüleri girin: en ve boy ya da toplam alan." };
}

/* ───────────── sistem türleri ───────────── */

type Qty = { qty: number; why: string };
type Out = Record<string, Qty>;

function need(p: Record<string, number>, keys: [string, string][]) {
  for (const [k, label] of keys)
    if (!(p[k] > 0)) return `${label} sıfırdan büyük olmalı.`;
  return "";
}

/** Alçıpan / kutu profil asma tavan — DnzHesap hsCalc */
function calcAlcipan(L2: number, K2: number, p: Record<string, number>): Out | ImalatError {
  const err = need(p, [
    ["ana", "Ana taşıyıcı aralığı"],
    ["alt", "Alt taşıyıcı aralığı"],
    ["aski", "Askı aralığı"],
    ["boy", "Profil boyu"],
    ["kboy", "Kenar profil boyu"],
    ["kdub", "Kenar dübel aralığı"],
    ["pw", "Plaka eni"],
    ["pl", "Plaka boyu"],
    ["vida", "Plaka vida aralığı"],
  ]);
  if (err) return { err };
  const f = fmtQ,
    kat = Math.max(1, Math.round(p.kat || 1)),
    klipsAd = p.klips > 0 ? p.klips : 1;
  const nMain = Math.max(1, cl(L2 / p.ana) - 1),
    nAlt = Math.max(1, cl(K2 / p.alt) - 1);
  const main = hsSim(Array(nMain).fill(K2), p.boy),
    alt = hsSim(Array(nAlt).fill(L2), p.boy);
  const perMain = Math.max(1, cl(K2 / p.aski)),
    aski = nMain * perMain,
    cross = nMain * nAlt;
  const per = 2 * (L2 + K2),
    kenar = hsSim([L2, K2, L2, K2], p.kboy).prof,
    kdub = cl(per / p.kdub);

  // Plakalar uzun kenara paralel; vida alt taşıyıcı hatlarına ve kenar profile
  const along = L2,
    across = K2,
    rows = cl(across / p.pw),
    pls = hsSim(Array(rows).fill(along), p.pl),
    plates = cl((L2 * K2) / (p.pw * p.pl));
  const ins = 1.5;
  let len = 0;
  pls.lines.forEach((sg, i) => {
    const a0 = i * p.pw,
      wr = Math.min(p.pw, across - a0);
    sg.forEach((s) => {
      const x0 = s.s,
        x1 = s.e,
        y0 = a0,
        y1 = a0 + wr;
      const ys = new Set([y0 + ins, y1 - ins]);
      for (let j = 1; j * p.alt < K2 - E; j++) {
        const y = j * p.alt;
        if (y > y0 + ins + E && y < y1 - ins - E) ys.add(y);
      }
      ys.forEach(() => (len += Math.max(0, x1 - x0 - 2 * ins)));
      if (x0 <= E) len += Math.max(0, y1 - y0 - 2 * ins);
      if (x1 >= L2 - E) len += Math.max(0, y1 - y0 - 2 * ins);
    });
  });
  const vida = cl(len / p.vida) * kat;

  return {
    ana: { qty: main.prof, why: `${nMain} hat × ${f(K2 / 100)} m = ${f((nMain * K2) / 100)} m · ${f(p.boy / 100)} m'lik` },
    alt: { qty: alt.prof, why: `${nAlt} hat × ${f(L2 / 100)} m = ${f((nAlt * L2) / 100)} m · ${f(p.boy / 100)} m'lik` },
    ekA: { qty: main.joints, why: `her ${f(p.boy / 100)} m'de bir birleştirme` },
    ekB: { qty: alt.joints, why: `her ${f(p.boy / 100)} m'de bir birleştirme` },
    klips: { qty: Math.round(cross * klipsAd), why: `${cross} ana-alt kesişim × ${f(klipsAd)}` },
    aski: { qty: aski, why: `${nMain} ana taşıyıcı × ${perMain} askı (≈ her ${f(Math.round(K2 / perMain))} cm)` },
    dubel: { qty: aski, why: "her askıya 1" },
    masa: { qty: aski, why: "her askıya 1" },
    kenar: { qty: kenar, why: `çevre ${f(per / 100)} m · ${f(p.kboy / 100)} m'lik` },
    pdubel: { qty: kdub, why: `çevre ${f(per / 100)} m ÷ ${f(p.kdub)} cm` },
    pvida: { qty: kdub, why: "her plastik dübele 1" },
    plaka: {
      qty: plates * kat,
      why: `${f(r2((L2 * K2) / 1e4))} m² ÷ ${f(r2((p.pw * p.pl) / 1e4))} m² → ${plates} plaka (kenar parçaları birleştirilerek)${kat > 1 ? ` · ${kat} kat` : ""}`,
    },
    vida: { qty: vida, why: `alt taşıyıcı ve kenar profil üzerinde ${f(Math.round(len / 10) / 10)} m hat ÷ ${f(p.vida)} cm` },
  };
}

/** Panel adedi ve kenar paneli (DnzHesap panel tipi) */
function panelCount(along: number, across: number, w: number, l: number) {
  const nx = cl(along / l),
    ny = cl(across / w);
  const need = cl(edgeEff(across / w) * edgeEff(along / l));
  const edge = nx >= 2 && ny >= 2 ? 2 * nx + 2 * ny - 4 : nx * ny;
  return { need, edge, nx, ny };
}

/** Karolam / taşyünü (T24 gömme ızgara) — DnzHesap genel motor */
function calcLayin(L2: number, K2: number, p: Record<string, number>): Out | ImalatError {
  const err = need(p, [
    ["ana", "Ana taşıyıcı aralığı"],
    ["anaBoy", "Ana taşıyıcı boyu"],
    ["t120", "120'lik tali boyu"],
    ["t60", "60'lık tali boyu"],
    ["aski", "Askı aralığı"],
    ["kboy", "Kenar profil boyu"],
    ["kdub", "Kenar dübel aralığı"],
    ["pw", "Panel eni"],
    ["pl", "Panel boyu"],
  ]);
  if (err) return { err };
  const f = fmtQ;
  // Ana taşıyıcı kısa kenara paralel; uzun kenar boyunca her “ana” cm’de bir hat
  const anaPos: number[] = [];
  for (let x = p.ana; x < L2 - 1; x += p.ana) anaPos.push(x);
  if (!anaPos.length) anaPos.push(L2 / 2);
  const ana = hsSim(anaPos.map(() => K2), p.anaBoy);
  // 120'lik tali: ana taşıyıcıya dik, her panel eninde (60 cm) bir hat
  const t120Pos: number[] = [];
  for (let y = p.pw; y < K2 - 1; y += p.pw) t120Pos.push(y);
  const t120 = cl(t120Pos.length * edgeEff(L2 / p.t120));
  // 60'lık tali: ana taşıyıcılar arasında, onlara paralel
  const t60Pos: number[] = [];
  for (let x = p.pl; x < L2 - 1; x += p.ana) if (!anaPos.some((a) => Math.abs(a - x) < 1)) t60Pos.push(x);
  const t60 = cl(t60Pos.length * edgeEff(K2 / p.t60));
  // Askı: ana taşıyıcı boyunca 50 cm içeriden, aralıklı
  const pts: number[] = [];
  for (let x = 50; x < K2 - 1; x += p.aski) pts.push(x);
  const aski = Math.max(1, pts.length) * anaPos.length;
  const per = 2 * (L2 + K2),
    kenar = hsSim([L2, K2, L2, K2], p.kboy).prof,
    kdub = cl(per / p.kdub);
  const pn = panelCount(L2, K2, p.pw, p.pl);
  return {
    ana: { qty: ana.prof, why: `${anaPos.length} hat × ${f(K2 / 100)} m = ${f((anaPos.length * K2) / 100)} m · ${f(p.anaBoy / 100)} m'lik` },
    t120: { qty: t120, why: `${t120Pos.length} hat × ${f(L2 / 100)} m · ${f(p.t120 / 100)} m'lik (kenar parçası ½ sayılır)` },
    t60: { qty: t60, why: `${t60Pos.length} hat × ${f(K2 / 100)} m · ${f(p.t60 / 100)} m'lik (kenar parçası ½ sayılır)` },
    aski: { qty: aski, why: `${anaPos.length} ana taşıyıcı × ${Math.max(1, pts.length)} nokta (her ${f(p.aski)} cm)` },
    dubel: { qty: aski, why: "her askıya 1" },
    masa: { qty: aski, why: "her askıya 1" },
    kenar: { qty: kenar, why: `çevre ${f(per / 100)} m · ${f(p.kboy / 100)} m'lik` },
    pdubel: { qty: kdub, why: `çevre ${f(per / 100)} m ÷ ${f(p.kdub)} cm` },
    pvida: { qty: kdub, why: "her plastik dübele 1" },
    panel: {
      qty: pn.need,
      why: `${f(r2((L2 * K2) / 1e4))} m² · ${f(p.pw)}×${f(p.pl)} cm → ${pn.need} adet (kenarda yarıya kadar artan parça ½ sayılır)`,
    },
  };
}

/** Clip-in metal asma tavan — DnzHesap genel motor */
function calcClipin(L2: number, K2: number, p: Record<string, number>): Out | ImalatError {
  const err = need(p, [
    ["ana", "Ana taşıyıcı aralığı"],
    ["boy", "Ana taşıyıcı boyu"],
    ["clip", "Clip-in taşıyıcı aralığı"],
    ["clipBoy", "Clip-in taşıyıcı boyu"],
    ["aski", "Askı aralığı"],
    ["kboy", "Kenar profil boyu"],
    ["kdub", "Kenar dübel aralığı"],
    ["pw", "Panel eni"],
    ["pl", "Panel boyu"],
  ]);
  if (err) return { err };
  const f = fmtQ;
  const anaPos: number[] = [];
  for (let x = p.ana; x < L2 - 1; x += p.ana) anaPos.push(x);
  if (!anaPos.length) anaPos.push(L2 / 2);
  const ana = hsSim(anaPos.map(() => K2), p.boy);
  const clipPos: number[] = [];
  for (let y = p.clip; y < K2 - 1; y += p.clip) clipPos.push(y);
  if (!clipPos.length) clipPos.push(K2 / 2);
  const clip = hsSim(clipPos.map(() => L2), p.clipBoy);
  const pts: number[] = [];
  for (let x = 50; x < K2 - 1; x += p.aski) pts.push(x);
  const aski = Math.max(1, pts.length) * anaPos.length,
    cross = anaPos.length * clipPos.length;
  const per = 2 * (L2 + K2),
    kenar = hsSim([L2, K2, L2, K2], p.kboy).prof,
    kdub = cl(per / p.kdub);
  const pn = panelCount(L2, K2, p.pw, p.pl);
  return {
    ana: { qty: ana.prof, why: `${anaPos.length} hat × ${f(K2 / 100)} m = ${f((anaPos.length * K2) / 100)} m · ${f(p.boy / 100)} m'lik` },
    clip: { qty: clip.prof, why: `${clipPos.length} hat × ${f(L2 / 100)} m = ${f((clipPos.length * L2) / 100)} m · ${f(p.clipBoy / 100)} m'lik` },
    ekA: { qty: ana.joints, why: `ana taşıyıcıda ${ana.joints} ek noktası` },
    ekB: { qty: clip.joints, why: `clip-in taşıyıcıda ${clip.joints} ek noktası` },
    klips: { qty: cross, why: `${anaPos.length} × ${clipPos.length} kesişim` },
    aski: { qty: aski, why: `${anaPos.length} ana taşıyıcı × ${Math.max(1, pts.length)} nokta (her ${f(p.aski)} cm)` },
    dubel: { qty: aski, why: "her askıya 1" },
    masa: { qty: aski, why: "her askıya 1" },
    kenar: { qty: kenar, why: `çevre ${f(per / 100)} m · ${f(p.kboy / 100)} m'lik` },
    pdubel: { qty: kdub, why: `çevre ${f(per / 100)} m ÷ ${f(p.kdub)} cm` },
    pvida: { qty: kdub, why: "her plastik dübele 1" },
    takoz: { qty: pn.edge, why: `${pn.edge} kenar paneli × 1` },
    panel: {
      qty: pn.need,
      why: `${f(r2((L2 * K2) / 1e4))} m² · ${f(p.pw)}×${f(p.pl)} cm → ${pn.need} adet (kenarda yarıya kadar artan parça ½ sayılır)`,
    },
  };
}

/** Alçıpan ışık bandı — DnzHesap hgBand */
function calcBand(L2: number, K2: number, p: Record<string, number>): (Out & { _len: { qty: number; why: string } }) | ImalatError {
  const err = need(p, [
    ["bant", "Bant genişliği"],
    ["ust", "Üst şerit"],
    ["alin", "Alın yüksekliği"],
    ["pw", "Plaka eni"],
    ["pl", "Plaka boyu"],
    ["boy", "Profil boyu"],
    ["vida", "Vida aralığı"],
    ["kdub", "Dübel aralığı"],
  ]);
  if (err) return { err };
  const f = fmtQ,
    w = p.bant,
    ux = Math.max(0, p.uzat ?? 10),
    d = w - ux,
    a = p.ust,
    sl = p.alin;
  if (!(d > 0)) return { err: "Bant genişliği, alçıpan uzatma payından büyük olmalı." };
  if (2 * w >= K2) return { err: "Bant mahale sığmıyor: kısa kenar en az 2 × bant genişliği olmalı." };
  const loop = (t: number) => [L2 - 2 * t, K2 - 2 * t, L2 - 2 * t, K2 - 2 * t],
    perOf = (t: number) => 2 * (L2 - 2 * t + K2 - 2 * t),
    pw = perOf(0),
    pd = perOf(d),
    pwl = perOf(w);
  const ringA = L2 * K2 - (L2 - 2 * w) * (K2 - 2 * w),
    bandLen = ringA / w;
  // Plaka: şeritler plaka eninden kesilir
  const W = Math.min(p.pw, p.pl),
    Lg = Math.max(p.pw, p.pl);
  let tot = 0;
  const parts: string[] = [];
  for (const [sw, len, lab] of [
    [a, pd, `üst şerit ${f(a)} cm`],
    [w, bandLen, `bant ${f(w)} cm`],
    [sl, pwl, `alın ${f(sl)} cm`],
  ] as [number, number, string][]) {
    const lanes = Math.floor(W / sw + E);
    if (lanes < 1) return { err: `${f(sw)} cm şerit plaka enine sığmıyor.` };
    tot += len / (lanes * Lg);
    parts.push(`${lab}: ${f(r2(len / 100))} m ÷ ${lanes} şerit`);
  }
  const prof = (t: number) => hsSim(loop(t), p.boy).prof;
  const vlen = pw + 3 * pd + 2 * pwl;
  return {
    _len: { qty: r2(bandLen / 100), why: "" },
    plaka: { qty: cl(tot), why: parts.join(" · ") },
    duvar: { qty: prof(0), why: `duvar profili ${f(r2(pw / 100))} m · ${f(p.boy / 100)} m'lik` },
    tavan: { qty: prof(d), why: `tavan profili ${f(r2(pd / 100))} m · ${f(p.boy / 100)} m'lik` },
    altp: { qty: prof(d), why: `alçıpan altı profili ${f(r2(pd / 100))} m · ${f(p.boy / 100)} m'lik` },
    alinp: { qty: prof(w), why: `alın profili ${f(r2(pwl / 100))} m · ${f(p.boy / 100)} m'lik` },
    vida: { qty: cl(vlen / p.vida), why: `alçıpan vida hattı ${f(r2(vlen / 100))} m ÷ ${f(p.vida)} cm` },
    dubel: {
      qty: cl(pw / p.kdub) + cl(pd / p.kdub),
      why: `duvar profili ${f(r2(pw / 100))} m + tavan profili ${f(r2(pd / 100))} m ÷ ${f(p.kdub)} cm`,
    },
    pvida: {
      qty: cl(pw / p.kdub) + cl(pd / p.kdub),
      why: "her dübele 1",
    },
  };
}

/** Alçıpan bölme duvar — DnzHesap duvar hesabı (uzunluk × yükseklik) */
function calcWall(Wd: number, H: number, p: Record<string, number>): Out | ImalatError {
  const err = need(p, [
    ["dikme", "Dikme aralığı"],
    ["dBoy", "Dikme (C) profil boyu"],
    ["uBoy", "Taban/tavan (U) profil boyu"],
    ["pw", "Plaka eni"],
    ["pl", "Plaka boyu"],
    ["vida", "Vida aralığı"],
    ["kdub", "Dübel aralığı"],
  ]);
  if (err) return { err };
  const f = fmtQ,
    lay = Math.max(1, Math.round(p.kat || 1)),
    faces = 2,
    kat = faces * lay,
    ins = 1.5;
  // C dikmeler: duvar boyunca her “dikme” cm’de bir, yükseklik kadar
  const pos: number[] = [];
  for (let x = p.dikme; x < Wd - 1; x += p.dikme) pos.push(x);
  const dk = wPack(pos.map(() => H), p.dBoy, 30);
  // U profiller: taban, tavan ve iki yan
  const uk = wPack([Wd, H, Wd, H], p.uBoy, 0);
  // Plakalar dikey: boyu yüksekliğe paralel
  const across = Wd,
    along = H,
    w = p.pw,
    l = p.pl;
  let plates = cl((Wd * H) / (w * l)) * kat;
  {
    const fr = Math.floor(across / w + E),
      r = Math.max(0, across - fr * w),
      nf = Math.floor(along / l + E),
      q = Math.max(0, along - nf * l),
      ra = r > E,
      qa = q > E,
      sw = ra ? Math.max(1, Math.floor(w / r + E)) : 0,
      sl = qa ? Math.max(1, Math.floor(l / q + E)) : 0;
    const t2 =
      fr * nf * kat +
      (qa ? Math.ceil((fr * kat) / sl) : 0) +
      (ra ? Math.ceil((nf * kat) / sw) : 0) +
      (ra && qa ? Math.ceil(kat / (sw * sl)) : 0);
    if (t2 < plates) plates = t2;
  }
  // Vida: plakanın altındaki dikmeler + çevre (U) profil hatları, her yüz ve kat
  const cols = cl(across / w),
    sim = hsSim(Array(cols).fill(along), l);
  const lines: Ln[] = [];
  const addL = (x1: number, y1: number, x2: number, y2: number) => {
    if (Math.hypot(x2 - x1, y2 - y1) > E) lines.push({ x1, y1, x2, y2 });
  };
  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
  sim.lines.forEach((sg, i) => {
    const x0 = i * w,
      x1 = Math.min(x0 + w, across);
    sg.forEach((s) => {
      const y0 = s.s,
        y1 = s.e;
      pos.forEach((ps) => {
        if (ps >= x0 - E && ps <= x1 + E) {
          const x = clamp(ps, x0 + ins, x1 - ins);
          addL(x, y0 + ins, x, y1 - ins);
        }
      });
      if (y0 <= E) addL(x0 + ins, y0 + ins, x1 - ins, y0 + ins);
      if (y1 >= along - E) addL(x0 + ins, y1 - ins, x1 - ins, y1 - ins);
      if (x0 <= E) addL(x0 + ins, y0 + ins, x0 + ins, y1 - ins);
      if (x1 >= across - E) addL(x1 - ins, y0 + ins, x1 - ins, y1 - ins);
    });
  });
  const vida = vPts(lines, p.vida) * kat;
  const per = 2 * (Wd + H),
    dub = cl(per / p.kdub);
  const area = (Wd * H) / 1e4,
    yal = p.yEn > 0 && p.yBoy > 0 ? cl(area / ((p.yEn * p.yBoy) / 1e4)) : 0;
  return {
    dikme: {
      qty: dk.n,
      why: `${pos.length} dikme × ${f(H / 100)} m${H > p.dBoy + E ? " (ek: 30 cm bindirme)" : ""} · ${f(p.dBoy / 100)} m'lik`,
    },
    u: { qty: uk.n, why: `çevre ${f(per / 100)} m · ${f(p.uBoy / 100)} m'lik (artan parçalar birlikte kesilir)` },
    plaka: { qty: plates, why: `${f(r2(area))} m² × ${faces} yüz${lay > 1 ? ` × ${lay} kat` : ""} → ${plates} plaka (artan parçalar aynı plakadan kesilerek)` },
    vida: { qty: vida, why: `dikme ve U profil hatları ÷ ${f(p.vida)} cm · ${faces} yüz${lay > 1 ? ` × ${lay} kat` : ""}` },
    dubel: { qty: dub, why: `çevre ${f(per / 100)} m ÷ ${f(p.kdub)} cm` },
    pvida: { qty: dub, why: "her dübele 1" },
    yalitim: yal ? { qty: yal, why: `${f(r2(area))} m² ÷ ${f(r2((p.yEn * p.yBoy) / 1e4))} m² (${f(p.yEn)}×${f(p.yBoy)} cm)` } : { qty: 0, why: "" },
  };
}

/* ───────────── ana giriş ───────────── */

export function computeImalat(
  sys: ImalatSystem,
  input: { L?: number; K?: number; area?: number }
): ImalatResult | ImalatError {
  const dims = resolveDims(input);
  if (isImalatError(dims)) return dims;
  const p = sys.params || {};
  let L2 = dims.L * 100,
    K2 = dims.K * 100;
  let out: Out | ImalatError;
  let measure: number;
  let measureUnit: "m²" | "mt" = "m²";

  if (sys.kind === "wall") {
    // L = uzunluk, K = yükseklik (sıralama değişmez)
    out = calcWall(L2, K2, p);
    measure = r2((L2 * K2) / 1e4);
  } else {
    if (K2 > L2) [L2, K2] = [K2, L2];
    if (sys.kind === "band") {
      const b = calcBand(L2, K2, p);
      if (isImalatError(b)) return b;
      measure = b._len.qty;
      measureUnit = "mt";
      out = b;
    } else {
      out =
        sys.kind === "layin"
          ? calcLayin(L2, K2, p)
          : sys.kind === "clipin"
            ? calcClipin(L2, K2, p)
            : calcAlcipan(L2, K2, p);
      measure = r2((L2 * K2) / 1e4);
    }
  }
  if (isImalatError(out)) return out;
  const res = out as Out;

  const lines: ImalatLine[] = [];
  const warn: string[] = [];
  sys.materials.forEach((m) => {
    const q = res[m.key];
    if (!q) {
      warn.push(`${m.name}: bu sistem türünde hesaplanamıyor.`);
      return;
    }
    if (!(q.qty > 0)) return;
    lines.push({ key: m.key, name: m.name, unit: m.unit, unitPrice: m.unitPrice, qty: q.qty, why: q.why });
  });

  return {
    lines,
    measure,
    measureUnit,
    L: r2(L2 / 100),
    K: r2(K2 / 100),
    note: dims.note,
    warn,
  };
}

export const sumImalat = (lines: ImalatLine[]) =>
  lines.reduce((a, l) => a + l.qty * l.unitPrice, 0);
