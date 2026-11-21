/** Scroll-linked keyframes for the 3D tram, built from real section positions (no fixed pixel offsets). */
export type PathKey = {
  s: number;      // scroll position (px) at which this pose is reached
  sx: number;     // tram centre, viewport px
  sy: number;
  w: number;      // tram length on screen, px
  yaw: number;    // radians; 0 = side view facing right, -PI/2 = front faces visitor, +PI/2 = rear faces visitor
  pitch: number;
  look: number;   // driver head turn toward visitor (0..1)
};

export const LANE = 300;

const smooth = (p: number) => p * p * (3 - 2 * p);

export function buildPath(): PathKey[] {
  const vw = window.innerWidth, vh = window.innerHeight, y0 = window.scrollY;
  const max = document.documentElement.scrollHeight - vh;
  const top = (id: string) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + y0;
  const slot = document.getElementById("tram-slot")?.getBoundingClientRect();
  const laneL = LANE / 2, laneR = vw - LANE / 2, laneW = LANE - 30;

  const keys: PathKey[] = [];
  if (vw < 1024) return buildMobilePath(keys, slot, vw, vh, max, top);
  if (slot) keys.push({ s: 0, sx: slot.left + slot.width / 2, sy: slot.top + slot.height * 0.5, w: slot.width * 0.95, yaw: -0.65, pitch: 0.12, look: 1 });
  const clampS = (v: number) => Math.min(max, Math.max(1, v));
  const pose = (sx: number, sy: number, w: number, yaw: number, look = 0): Omit<PathKey, "s"> => ({ sx, sy, w, yaw, pitch: 0.16, look });
  // Side switches happen exactly on the whitespace between two sections (boundary at screen centre).
  const cross = (id: string, yaw: number) => keys.push({ s: clampS(top(id) - vh * 0.5), ...pose(vw * 0.5, vh * 0.5, laneW * 0.95, yaw) });
  const hold = (from: string, to: string | null, sx: number, yaw: number, w = laneW) => {
    // Enters the lane riding the section boundary, then rolls down the lane and rides the next boundary out.
    keys.push({ s: clampS(top(from) - vh * 0.3), ...pose(sx, vh * 0.3, w, yaw) });
    if (to) keys.push({ s: clampS(top(to) - vh * 0.8), ...pose(sx, vh * 0.8, w, yaw) });
  };
  cross("rooms", -2.0);                       // B: leaves hero, swings down-left, turning
  hold("rooms", "hotel", laneL, -Math.PI);    // C: side view beside the room cards
  cross("hotel", -4.0);                       // diagonal across
  hold("hotel", "lisbon", laneR, 0.55 - 2 * Math.PI, laneW * 1.1); // D: other three-quarter, a touch closer
  cross("lisbon", -1.5 * Math.PI);            // E: rear on show while turning
  hold("lisbon", "concierge", laneL, -Math.PI);
  cross("concierge", -2.4);
  const c = top("concierge");
  const sEnd = clampS(c - 60);
  keys.push({ s: sEnd, sx: laneR, sy: Math.max(160, c - sEnd + 280), w: laneW * 1.05, yaw: -Math.PI / 2, pitch: 0.1, look: 1 }); // F: faces visitor
  // keep scroll positions strictly increasing
  for (let i = 1; i < keys.length; i++) if (keys[i]!.s <= keys[i - 1]!.s) keys[i]!.s = keys[i - 1]!.s + 1;
  return keys;
}

export function sample(keys: PathKey[], s: number): PathKey {
  if (!keys.length) return { s, sx: 0, sy: 0, w: 0, yaw: 0, pitch: 0, look: 0 };
  if (s <= keys[0]!.s) return keys[0]!;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!, b = keys[i + 1]!;
    if (s <= b.s) {
      const p = smooth((s - a.s) / Math.max(1, b.s - a.s));
      const l = (k: keyof PathKey) => (a[k] as number) + ((b[k] as number) - (a[k] as number)) * p;
      // hero pose scrolls with the page until the tram starts travelling
      const drift = i === 0 ? (s - a.s) * (1 - p) : 0;
      return { s, sx: l("sx"), sy: l("sy") - drift, w: l("w"), yaw: l("yaw"), pitch: l("pitch"), look: l("look") };
    }
  }
  const last = keys[keys.length - 1]!;
  return { ...last, s, sy: last.sy - (s - last.s) }; // after the final stop the tram scrolls with the page
}

/**
 * Phones/tablets: no side lanes, so the tram only appears in the whitespace between sections.
 * At each boundary it drives in from one edge, crosses the gap and leaves by the other, alternating direction.
 */
function buildMobilePath(keys: PathKey[], slot: DOMRect | undefined, vw: number, vh: number, max: number,
  top: (id: string) => number): PathKey[] {
  const w = Math.min(230, vw * 0.55);
  const clampS = (v: number) => Math.min(max, Math.max(1, v));
  if (slot) keys.push({ s: 0, sx: slot.left + slot.width / 2, sy: slot.top + slot.height * 0.5, w: slot.width * 0.95, yaw: -0.5, pitch: 0.12, look: 1 });
  const ids = ["rooms", "hotel", "lisbon", "concierge"];
  ids.forEach((id, i) => {
    const t = top(id);
    const ltr = i % 2 === 0;
    const off = (left: boolean) => (left ? -w : vw + w);
    const base = { w, pitch: 0.14, look: 0 };
    const yaw = ltr ? -0.35 : -Math.PI + 0.35; // facing travel direction, angled toward the visitor
    keys.push({ s: clampS(t - vh * 0.85), sx: off(ltr), sy: vh * 0.85, yaw, ...base });
    keys.push({ s: clampS(t - vh * 0.5), sx: vw / 2, sy: vh * 0.5, yaw: (yaw + (ltr ? -0.25 : 0.25)), ...base });
    if (id !== "concierge") keys.push({ s: clampS(t - vh * 0.15), sx: off(!ltr), sy: vh * 0.15, yaw, ...base });
  });
  // last stop: parks just above the concierge heading, facing the visitor
  const c = top("concierge");
  const sEnd = clampS(c - vh * 0.3);
  // sits in the concierge section's top padding (scrolls away with it rather than covering the cards)
  keys.push({ s: sEnd, sx: vw / 2, sy: c - sEnd + 50, w: w * 0.9, yaw: -Math.PI / 2, pitch: 0.1, look: 1 });
  for (let i = 1; i < keys.length; i++) if (keys[i]!.s <= keys[i - 1]!.s) keys[i]!.s = keys[i - 1]!.s + 1;
  return keys;
}
