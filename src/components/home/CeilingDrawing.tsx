/**
 * Hero çizimi: tek kaçış noktalı perspektifte bir oda.
 * Tavanda 60×60 asma tavan ızgarası ve LED paneller, solda gizli ışık bandı,
 * sağ duvarda yarısı plakayla kapatılmış alçıpan bölme duvar karkası.
 * Tamamen koddan üretilir; dış görsel gerektirmez.
 */

const VW = 640;
const VH = 520;
const VX = 320; // kaçış noktası x
const VY = 250; // kaçış noktası y (göz hizası)
const HALF_W = 320; // oda yarı genişliği (Z=1'de)
const UP = 250; // göz hizasından tavana
const DOWN = 270; // göz hizasından zemine
const Z_FRONT = 1;
const Z_BACK = 2.6;
const COLS = 12;
const ROWS = 12;

const r = (n: number) => Math.round(n * 10) / 10;

/** Tavandaki dünya noktasını (x: -1..1, z) ekrana yansıt */
function ceil(xNorm: number, z: number): [number, number] {
  return [r(VX + (xNorm * HALF_W) / z), r(VY - UP / z)];
}
function wallRight(z: number, yNorm: number): [number, number] {
  // yNorm: 0 = tavan, 1 = zemin
  const top = VY - UP / z;
  const bottom = VY + DOWN / z;
  return [r(VX + HALF_W / z), r(top + (bottom - top) * yNorm)];
}

const dz = (Z_BACK - Z_FRONT) / ROWS;
const zAt = (j: number) => Z_FRONT + j * dz;
const xAt = (i: number) => -1 + (2 * i) / COLS;

function tile(i: number, j: number) {
  const pts = [
    ceil(xAt(i), zAt(j)),
    ceil(xAt(i + 1), zAt(j)),
    ceil(xAt(i + 1), zAt(j + 1)),
    ceil(xAt(i), zAt(j + 1)),
  ];
  return pts.map((p) => p.join(",")).join(" ");
}

const ledTiles: [number, number][] = [
  [3, 2],
  [8, 2],
  [3, 6],
  [8, 6],
  [3, 10],
  [8, 10],
];

export function CeilingDrawing({ className = "" }: { className?: string }) {
  const back = {
    x1: r(VX - HALF_W / Z_BACK),
    x2: r(VX + HALF_W / Z_BACK),
    y1: r(VY - UP / Z_BACK),
    y2: r(VY + DOWN / Z_BACK),
  };

  // Bölme duvar dikmeleri (C profil) — her iki karo derinliğinde bir
  const studs = Array.from({ length: ROWS / 2 + 1 }, (_, k) => zAt(k * 2));
  // Arkadaki yarısı alçıpan plakayla kaplı
  const boardFrom = zAt(6);

  let delay = 0;
  const next = (step = 0.035) => {
    delay += step;
    return { animationDelay: `${delay.toFixed(2)}s` };
  };

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className={`hero-draw ${className}`}
      role="img"
      aria-label="Asma tavan ızgarası, LED paneller ve alçıpan bölme duvar karkası çizimi"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="fadeMask">
          <rect width={VW} height={VH} fill="url(#fade)" />
        </mask>
      </defs>

      <g mask="url(#fadeMask)">
        {/* Alçıpan plaka kaplı bölüm (sağ duvar, arka yarı) */}
        <polygon
          className="hero-panel"
          style={{ animationDelay: "1.5s" }}
          points={[
            wallRight(boardFrom, 0),
            wallRight(Z_BACK, 0),
            wallRight(Z_BACK, 1),
            wallRight(boardFrom, 1),
          ]
            .map((p) => p.join(","))
            .join(" ")}
          fill="#0B2C5E"
          fillOpacity="0.05"
        />

        {/* Oda kenarları */}
        <g stroke="#0B2C5E" strokeOpacity="0.45" strokeWidth="1.2" fill="none">
          <line pathLength={1} x1={0} y1={r(VY - UP)} x2={back.x1} y2={back.y1} style={next()} />
          <line pathLength={1} x1={VW} y1={r(VY - UP)} x2={back.x2} y2={back.y1} style={next()} />
          <line pathLength={1} x1={0} y1={r(VY + DOWN)} x2={back.x1} y2={back.y2} style={next()} />
          <line pathLength={1} x1={VW} y1={r(VY + DOWN)} x2={back.x2} y2={back.y2} style={next()} />
          <path
            pathLength={1}
            d={`M${back.x1},${back.y1}H${back.x2}V${back.y2}H${back.x1}Z`}
            style={next()}
          />
        </g>

        {/* Asma tavan ızgarası (T profiller) */}
        <g stroke="#0B2C5E" strokeOpacity="0.22" strokeWidth="1" fill="none">
          {Array.from({ length: COLS + 1 }, (_, i) => {
            const [x1, y1] = ceil(xAt(i), Z_FRONT);
            const [x2, y2] = ceil(xAt(i), Z_BACK);
            return (
              <line key={`c${i}`} pathLength={1} x1={x1} y1={y1} x2={x2} y2={y2} style={next(0.02)} />
            );
          })}
          {Array.from({ length: ROWS + 1 }, (_, j) => {
            const [x1, y] = ceil(-1, zAt(j));
            const [x2] = ceil(1, zAt(j));
            return (
              <line key={`r${j}`} pathLength={1} x1={x1} y1={y} x2={x2} y2={y} style={next(0.02)} />
            );
          })}
        </g>

        {/* Bölme duvar karkası (C dikmeler) */}
        <g stroke="#0B2C5E" strokeOpacity="0.4" strokeWidth="1.4" fill="none">
          {studs.map((z, k) => {
            const [x, y1] = wallRight(z, 0);
            const [, y2] = wallRight(z, 1);
            return (
              <line key={`s${k}`} pathLength={1} x1={x} y1={y1} x2={x} y2={y2} style={next(0.05)} />
            );
          })}
          {/* Yatay kayıt profili */}
          <line
            pathLength={1}
            x1={wallRight(Z_FRONT, 0.5)[0]}
            y1={wallRight(Z_FRONT, 0.5)[1]}
            x2={wallRight(Z_BACK, 0.5)[0]}
            y2={wallRight(Z_BACK, 0.5)[1]}
            style={next()}
          />
        </g>

        {/* LED paneller */}
        {ledTiles.map(([i, j], k) => (
          <polygon
            key={`led${k}`}
            className="hero-panel"
            style={{ animationDelay: `${1.6 + k * 0.08}s` }}
            points={tile(i, j)}
            fill="#FBBF24"
            fillOpacity="0.55"
          />
        ))}

        {/* Gizli ışık bandı — sol duvar ile tavan birleşimi */}
        <g className="hero-panel no-draw" style={{ animationDelay: "2.1s" }}>
          <line
            x1={0}
            y1={r(VY - UP + 14)}
            x2={back.x1}
            y2={r(back.y1 + 14 / Z_BACK)}
            stroke="#F59E0B"
            strokeWidth="10"
            filter="url(#glow)"
            opacity="0.6"
          />
          <line
            x1={0}
            y1={r(VY - UP + 14)}
            x2={back.x1}
            y2={r(back.y1 + 14 / Z_BACK)}
            stroke="#F59E0B"
            strokeWidth="1.6"
          />
        </g>
      </g>
    </svg>
  );
}
