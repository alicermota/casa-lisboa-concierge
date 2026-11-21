/**
 * Opening: walk up to the azulejo house and through its doors, then land on the site.
 * Illustration and motion idea by Alice. Scroll/swipe drives it (~1.5 screens), or one click plays it.
 * Plays once per browser session. Set ENTRY_ENABLED = false to switch it off.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { HOUSE_SVG } from "./house";
import { az, display } from "../azulejo/palette";

export const ENTRY_ENABLED = true;
const KEY = "casa-lisboa-entered";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
const range = (p: number, a: number, b: number) => smooth((p - a) / (b - a));

export function shouldShowEntry() {
  if (!ENTRY_ENABLED || typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

export function EntryGate({ onDone }: { onDone: () => void }) {
  const world = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const prompt = useRef<HTMLButtonElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(0);
  const auto = useRef(0);
  const [leaving, setLeaving] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setLeaving(true);
    setTimeout(onDone, 700);
  }, [onDone]);

  const draw = useCallback(
    (p: number) => {
      const w = world.current;
      if (!w) return;
      const zoom = range(p, 0.06, 0.97);
      const opening = range(p, 0.28, 0.62);
      const scale = Math.exp(zoom * Math.log(17));
      const ww = w.offsetWidth;
      const wh = w.offsetHeight;
      const offsetY = wh * (0.45 + range(p, 0, 0.6) * 0.32);
      w.style.transform = `translate(${-ww / 2}px, ${-offsetY}px) scale(${scale})`;
      const left = w.querySelector("#door-left");
      const right = w.querySelector("#door-right");
      left?.setAttribute("transform", `translate(735 753) matrix(${1 - opening * 0.94} ${opening * 0.24} 0 1 0 0) translate(-735 -753)`);
      right?.setAttribute("transform", `translate(865 753) matrix(${1 - opening * 0.94} ${-opening * 0.24} 0 1 0 0) translate(-865 -753)`);
      const fade = 1 - range(p, 0, 0.16);
      if (intro.current) {
        intro.current.style.opacity = String(fade);
        intro.current.style.transform = `translateY(${-range(p, 0, 0.2) * 26}px)`;
      }
      if (prompt.current) prompt.current.style.opacity = String(1 - range(p, 0.5, 0.7));
      if (shade.current) shade.current.style.opacity = String(range(p, 0.78, 0.95));
      if (p >= 0.995) finish();
    },
    [finish],
  );

  const tick = useCallback(() => {
    current.current += (target.current - current.current) * 0.12;
    if (Math.abs(target.current - current.current) < 0.0005) current.current = target.current;
    draw(current.current);
    raf.current = current.current !== target.current ? requestAnimationFrame(tick) : 0;
  }, [draw]);

  const push = useCallback(
    (v: number) => {
      target.current = clamp(v);
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  /** One click: play the whole walk-in in ~2.8s. */
  const play = useCallback(() => {
    cancelAnimationFrame(auto.current);
    const from = target.current;
    const start = performance.now();
    const step = (now: number) => {
      const t = clamp((now - start) / 2800);
      push(from + (1 - from) * smooth(t));
      if (t < 1) auto.current = requestAnimationFrame(step);
    };
    auto.current = requestAnimationFrame(step);
  }, [push]);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    draw(0);

    const per = () => window.innerHeight * 1.5; // the whole walk-in = 1.5 screens of scrolling
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnimationFrame(auto.current);
      push(target.current + e.deltaY / per());
    };
    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? lastY;
      push(target.current + (lastY - y) / per());
      lastY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) play();
      if (e.key === "Escape") finish();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf.current);
      cancelAnimationFrame(auto.current);
    };
  }, [draw, push, play, finish]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: "#F8FAF7", transition: "opacity 700ms ease", opacity: leaving ? 0 : 1, pointerEvents: leaving ? "none" : "auto" }}
      aria-label="Opening: walk through the door of Casa Lisboa"
    >
      <header className="absolute inset-x-6 top-6 z-20 flex items-center justify-between md:inset-x-10 md:top-8">
        <span className="text-2xl" style={{ ...display, color: az.cobalt }}>
          casa lisboa.
        </span>
        <button onClick={finish} className="border-b pb-1 text-sm" style={{ color: az.cobalt, borderColor: `${az.cobalt}55`, fontFamily: '"DM Sans", sans-serif' }}>
          skip
        </button>
      </header>

      <div ref={intro} className="pointer-events-none absolute inset-x-0 top-[11%] z-10 text-center">
        <p className="text-sm" style={{ color: az.cobalt, fontFamily: '"DM Sans", sans-serif' }}>boutique hotel · baixa, lisbon</p>
        <h1 className="mt-3 text-5xl md:text-7xl" style={{ ...display, color: az.ink }}>
          come a little <em style={{ fontFamily: '"PT Serif", serif', fontStyle: "italic", fontWeight: 700, color: az.cobalt }}>closer.</em>
        </h1>
      </div>

      <div
        ref={world}
        className="absolute left-1/2 top-1/2 z-[5]"
        style={{ width: "max(900px, min(100vw, 130svh))", maxWidth: 1800, aspectRatio: "1.6", transformOrigin: "50% 77%" }}
        dangerouslySetInnerHTML={{ __html: HOUSE_SVG }}
      />

      {/* the blue beyond the door, which becomes the site */}
      <div ref={shade} className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center opacity-0" style={{ backgroundColor: az.cobalt }}>
        <span className="text-6xl italic text-white md:text-8xl" style={{ fontFamily: '"PT Serif", serif', fontWeight: 700 }}>
          entre.
        </span>
      </div>

      <button
        ref={prompt}
        onClick={play}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-full px-6 py-3 text-sm font-medium"
        style={{ backgroundColor: az.cobalt, color: "#fff", fontFamily: '"DM Sans", sans-serif', boxShadow: "0 14px 30px -12px rgba(11,59,240,0.6)" }}
      >
        scroll or click to enter
      </button>
    </div>
  );
}
