import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LayeredTram } from "./LayeredTram";
import { TRAM_COMPANION_ENABLED, TRAM_JOURNEY_MIN_WIDTH, TRAM_LANE, TRAM_STOPS } from "./config";
import { useConciergeEntry } from "../useConciergeEntry";
import { guestTheme as t } from "../theme";

type Key = { s: number; x: number; y: number; w: number };
const ease = (p: number) => p * p * (3 - 2 * p);

/**
 * One tram for the whole page on wide screens: it starts exactly over the hero slot
 * (#tram-slot) and its position/size follow scroll, riding the left lane past each section.
 */
export function TramJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [moving, setMoving] = useState(false);
  const [flip, setFlip] = useState(false);
  const [stop, setStop] = useState("LISBOA");
  const [waveKey, setWaveKey] = useState(0);
  const { isActive } = useConciergeEntry();

  useEffect(() => {
    if (!TRAM_COMPANION_ENABLED) return;
    const mq = window.matchMedia(`(min-width: ${TRAM_JOURNEY_MIN_WIDTH}px) and (prefers-reduced-motion: no-preference)`);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!on) { delete root.dataset["tramJourney"]; return; }
    root.dataset["tramJourney"] = "on";
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current!;
    let keys: Key[] = [];
    let lastStop = "";
    let stopTimer: ReturnType<typeof setTimeout> | undefined;
    const qx = gsap.quickTo(el, "x", { duration: 0.35, ease: "power2.out" });
    const qy = gsap.quickTo(el, "y", { duration: 0.35, ease: "power2.out" });
    const qw = gsap.quickTo(el, "width", { duration: 0.35, ease: "power2.out" });

    const build = () => {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const slot = document.getElementById("tram-slot")!.getBoundingClientRect();
      const sy = window.scrollY;
      const w = Math.min(TRAM_LANE - 40, 280);
      keys = [{ s: 0, x: slot.left, y: slot.top + sy, w: slot.width }];
      TRAM_STOPS.forEach((st, i) => {
        const sec = document.getElementById(st.id);
        if (!sec) return;
        const top = sec.getBoundingClientRect().top + sy;
        const last = i === TRAM_STOPS.length - 1;
        const s = Math.min(max, last ? top - 80 : top - vh * 0.45);
        keys.push({ s, x: 20, y: last ? Math.max(100, top - s + 140) : i % 2 ? vh * 0.55 : vh * 0.28, w });
      });
      keys.sort((a, b) => a.s - b.s);
    };

    const place = (s: number, instant = false) => {
      let a = keys[0]!, b = keys[keys.length - 1]!;
      for (let i = 0; i < keys.length - 1; i++) if (s >= keys[i]!.s && s <= keys[i + 1]!.s) { a = keys[i]!; b = keys[i + 1]!; break; }
      if (s > b.s) a = b;
      const p = b.s === a.s ? 1 : ease(Math.min(1, Math.max(0, (s - a.s) / (b.s - a.s))));
      const x = a.x + (b.x - a.x) * p, y = a.y + (b.y - a.y) * p - (a.s === 0 && p < 1 ? s * (1 - p) : 0), w = a.w + (b.w - a.w) * p;
      if (instant) gsap.set(el, { x, y, width: w }); else { qx(x); qy(y); qw(w); }
      let label = "LISBOA";
      for (const st of TRAM_STOPS) { const sec = document.getElementById(st.id); if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.55) label = st.label.toUpperCase(); }
      if (label !== lastStop) { if (lastStop) setWaveKey((k) => k + 1); lastStop = label; setStop(label); }
    };

    build(); place(window.scrollY, true);
    const st = ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        place(self.scroll());
        if (Math.abs(self.getVelocity()) > 30) { setMoving(true); setFlip(self.direction < 0); }
        if (stopTimer) clearTimeout(stopTimer);
        stopTimer = setTimeout(() => setMoving(false), 180);
      },
      onRefresh: () => { build(); place(window.scrollY, true); },
    });
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);
    return () => { st.kill(); ro.disconnect(); if (stopTimer) clearTimeout(stopTimer); delete root.dataset["tramJourney"]; };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-30" style={{ willChange: "transform, width" }}>
      <LayeredTram moving={moving} flip={flip} waveKey={waveKey} glow={isActive} sign={isActive ? "YOUR STAY" : stop} />
    </div>
  );
}

/** Phones/tablets (and reduced motion): a small tram drives across a rail strip as the strip passes through view. */
export function TramBand({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ x: 50, moving: false, flip: false });
  useEffect(() => {
    if (!TRAM_COMPANION_ENABLED) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, lastY = window.scrollY, timer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      raf = 0;
      const r = ref.current?.getBoundingClientRect(); if (!r) return;
      const p = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (window.innerHeight + r.height)));
      const y = window.scrollY;
      setState({ x: 5 + p * 60, moving: true, flip: y < lastY });
      lastY = y;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setState((s) => ({ ...s, moving: false })), 180);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); if (timer) clearTimeout(timer); };
  }, []);
  if (!TRAM_COMPANION_ENABLED) return null;
  return (
    <div ref={ref} aria-hidden className="tram-band relative mx-auto max-w-6xl overflow-hidden px-6 pt-10 lg:hidden">
      <div className="relative h-32">
        <div className="absolute bottom-3 left-0 right-0 h-[3px] rounded-full" style={{ backgroundColor: `${t.ink}aa` }} />
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${t.ink}44 0 3px, transparent 3px 16px)` }} />
        <div className="absolute bottom-1 w-40" style={{ left: `${state.x}%`, transform: "translateX(-20%)" }}>
          <LayeredTram moving={state.moving} flip={state.flip} sign={label.toUpperCase()} />
        </div>
      </div>
    </div>
  );
}
