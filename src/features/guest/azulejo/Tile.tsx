/**
 * Original hand-painted-style azulejo tiles, drawn in SVG.
 * Each pattern puts quarter motifs in the corners so neighbouring tiles join into a larger design.
 * A shared SVG filter (TileDefs) gives the lines a slightly wobbly, brush-painted feel.
 */
import { az } from "./palette";

export type TilePattern = "flor" | "estrela" | "folha" | "losango" | "rosa" | "cruz" | "onda" | "tram";
export const PATTERNS: TilePattern[] = ["flor", "estrela", "folha", "losango", "rosa", "cruz", "onda"];

/** Render once per page (GuestPage does it). */
export function TileDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <filter id="az-brush" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
        </filter>
        <filter id="az-wash">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="3" />
          <feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.27  0 0 0 0 0.71  0 0 0 0.10 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

function Corners({ c }: { c: string }) {
  // quarter circles in each corner: they form full rosettes where 4 tiles meet
  return (
    <g fill="none" stroke={c} strokeWidth="2.2">
      {[
        [0, 0],
        [100, 0],
        [0, 100],
        [100, 100],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="16" fill={c} fillOpacity="0.9" stroke="none" />
          <circle cx={x} cy={y} r="24" />
        </g>
      ))}
    </g>
  );
}

function Motif({ p, c }: { p: TilePattern; c: string }) {
  switch (p) {
    case "flor":
      return (
        <g>
          <Corners c={c} />
          {[0, 90, 180, 270].map((r) => (
            <path key={r} transform={`rotate(${r} 50 50)`} d="M50 50 C42 38 42 24 50 16 C58 24 58 38 50 50Z" fill={c} fillOpacity="0.85" />
          ))}
          {[45, 135, 225, 315].map((r) => (
            <path key={r} transform={`rotate(${r} 50 50)`} d="M50 50 C46 42 46 34 50 28 C54 34 54 42 50 50Z" fill={c} fillOpacity="0.45" />
          ))}
          <circle cx="50" cy="50" r="5" fill={az.glaze} stroke={c} strokeWidth="2" />
        </g>
      );
    case "estrela":
      return (
        <g>
          <Corners c={c} />
          <polygon
            points="50,18 57,38 78,32 64,48 78,66 57,61 50,82 43,61 22,66 36,48 22,32 43,38"
            fill={c}
            fillOpacity="0.85"
          />
          <circle cx="50" cy="50" r="9" fill={az.glaze} />
          <circle cx="50" cy="50" r="4" fill={c} />
        </g>
      );
    case "folha":
      return (
        <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
          <path d="M0 50 C25 50 25 25 50 25 C75 25 75 50 100 50" />
          <path d="M0 50 C25 50 25 75 50 75 C75 75 75 50 100 50" />
          <path d="M50 0 C50 20 38 30 30 30 M50 100 C50 80 62 70 70 70" />
          {[25, 75].map((x) => (
            <path key={x} d={`M${x} 50 c-6 -8 -6 -16 0 -22 c6 6 6 14 0 22z`} fill={c} fillOpacity="0.8" stroke="none" />
          ))}
          <circle cx="50" cy="50" r="6" fill={c} stroke="none" />
        </g>
      );
    case "losango":
      return (
        <g>
          <rect x="0" y="0" width="100" height="100" fill={az.wash} fillOpacity="0.6" />
          <polygon points="50,6 94,50 50,94 6,50" fill="none" stroke={c} strokeWidth="2.6" />
          <polygon points="50,22 78,50 50,78 22,50" fill={c} fillOpacity="0.85" />
          <polygon points="50,36 64,50 50,64 36,50" fill={az.glaze} />
          {[
            [0, 0],
            [100, 0],
            [0, 100],
            [100, 100],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="10" fill={c} />
          ))}
        </g>
      );
    case "rosa":
      return (
        <g fill="none" stroke={c} strokeWidth="2">
          <circle cx="50" cy="50" r="34" />
          <circle cx="50" cy="50" r="26" strokeDasharray="4 5" />
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} cx="50" cy="32" rx="6" ry="12" transform={`rotate(${i * 45} 50 50)`} fill={c} fillOpacity="0.55" stroke="none" />
          ))}
          <circle cx="50" cy="50" r="7" fill={c} stroke="none" />
          <path d="M0 0 L14 14 M100 0 L86 14 M0 100 L14 86 M100 100 L86 86" strokeWidth="3" />
        </g>
      );
    case "cruz":
      return (
        <g>
          <Corners c={c} />
          <path d="M44 14 h12 v30 h30 v12 h-30 v30 h-12 v-30 h-30 v-12 h30z" fill={c} fillOpacity="0.85" />
          {[0, 90, 180, 270].map((r) => (
            <path key={r} transform={`rotate(${r} 50 50)`} d="M50 8 c-6 0 -8 6 -4 8 M50 8 c6 0 8 6 4 8" fill="none" stroke={c} strokeWidth="2" />
          ))}
          <rect x="45" y="45" width="10" height="10" fill={az.glaze} transform="rotate(45 50 50)" />
        </g>
      );
    case "onda":
      return (
        <g fill="none" stroke={c} strokeWidth="2.4">
          {[20, 40, 60, 80].map((y) => (
            <path key={y} d={`M0 ${y} q12.5 -10 25 0 t25 0 t25 0 t25 0`} />
          ))}
          <circle cx="50" cy="50" r="12" fill={az.glaze} />
          <circle cx="50" cy="50" r="6" fill={c} stroke="none" />
        </g>
      );
    case "tram":
      // the easter egg: Lisbon's eléctrico painted as a tile
      return (
        <g fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
          <path d="M50 12 L62 30" />
          <path d="M20 30 h60 l4 6 v30 h-68 v-30z" fill={c} fillOpacity="0.15" />
          <path d="M18 66 h64" strokeWidth="3" />
          {[24, 36, 48, 60].map((x) => (
            <rect key={x} x={x} y="40" width="9" height="11" rx="1.5" fill={c} fillOpacity="0.7" stroke="none" />
          ))}
          <rect x="71" y="40" width="9" height="20" rx="1.5" />
          <rect x="34" y="31" width="32" height="5" fill={c} stroke="none" />
          <circle cx="32" cy="70" r="5" fill={c} />
          <circle cx="68" cy="70" r="5" fill={c} />
          <path d="M6 78 h88 M6 84 h88" strokeWidth="1.5" />
          <text x="50" y="94" textAnchor="middle" fontSize="7" fill={c} stroke="none" style={{ letterSpacing: 2 }}>
            28
          </text>
        </g>
      );
  }
}

export function Tile({
  pattern,
  color = az.cobalt,
  className = "",
  rotate = 0,
}: {
  pattern: TilePattern;
  color?: string;
  className?: string;
  rotate?: 0 | 90 | 180 | 270;
}) {
  return (
    <svg viewBox="0 0 100 100" className={`block ${className}`} aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="100" height="100" fill={az.glaze} />
      <rect width="100" height="100" fill={az.glaze} filter="url(#az-wash)" />
      <g filter="url(#az-brush)" transform={rotate ? `rotate(${rotate} 50 50)` : undefined}>
        <Motif p={pattern} c={color} />
      </g>
      <rect x="0.5" y="0.5" width="99" height="99" fill="none" stroke={color} strokeOpacity="0.18" />
    </svg>
  );
}

/** Deterministic pseudo-random so server and client render the same wall. */
export function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** Safe pattern / rotation pickers by index. */
export const pat = (i: number): TilePattern => PATTERNS[((Math.floor(i) % PATTERNS.length) + PATTERNS.length) % PATTERNS.length] as TilePattern;
export const rotOf = (i: number): 0 | 90 | 180 | 270 => ([0, 90, 180, 270] as const)[((Math.floor(i) % 4) + 4) % 4] as 0 | 90 | 180 | 270;
