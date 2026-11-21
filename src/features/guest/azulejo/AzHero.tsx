import { useEffect, useRef, useState, type ReactNode } from "react";
import { az, display, scrollToId } from "./palette";
import { Tile, pat, rotOf, seeded } from "./Tile";
import { useConciergeEntry } from "../useConciergeEntry";

const LINKS = [["rooms", "rooms"], ["rooftop", "rooftop"], ["extras", "extras"], ["lisbon", "lisbon"]] as const;

function Mark({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-block overflow-hidden rounded-[4px]" style={{ width: size, height: size }}>
      <Tile pattern="estrela" className="h-full w-full" />
    </span>
  );
}

/** Live Lisbon time with a green "awake" dot. */
function NavClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" }).format(new Date()));
    f();
    const id = setInterval(f, 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="hidden items-center gap-1.5 text-xs sm:flex" style={{ color: az.muted, fontVariantNumeric: "tabular-nums" }}>
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      lisboa {t}
    </span>
  );
}

/** Slim floating pill nav. */
export function AzNav() {
  return (
    <nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="flex w-full max-w-3xl items-center justify-between gap-4 rounded-2xl border px-3 py-2 backdrop-blur-md"
        style={{ backgroundColor: "#ffffffd9", borderColor: az.rule, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.18)" }}
      >
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 pl-1 text-xl" style={{ ...display, color: az.cobalt }}>
          <Mark />
          casa lisboa.
        </button>
        <div className="hidden items-center gap-6 text-sm md:flex" style={{ color: az.ink }}>
          {LINKS.map(([l, id]) => (
            <button key={id} onClick={() => scrollToId(id)} className="transition-colors hover:text-[#0B3BF0]">
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <NavClock />
          <button onClick={() => scrollToId("concierge")} className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: az.cobalt, color: "#fff" }}>
            let's talk
          </button>
        </div>
      </div>
    </nav>
  );
}

/** Splits a line into words that rise in one by one. */
function Words({ children, start = 0 }: { children: (string | ReactNode)[]; start?: number }) {
  let i = start;
  return (
    <>
      {children.map((part, k) =>
        typeof part === "string" ? (
          part
            .split(" ")
            .filter(Boolean)
            .map((w) => (
              <span key={`${k}-${w}-${i}`} className="az-word mr-[0.22em]" style={{ animationDelay: `${i++ * 70}ms` }}>
                {w}
              </span>
            ))
        ) : (
          <span key={k} className="az-word mr-[0.22em]" style={{ animationDelay: `${i++ * 70}ms` }}>
            {part}
          </span>
        ),
      )}
    </>
  );
}

/** Tiles bleeding in from the right, drifting apart at different speeds as you scroll. */
function TileCollage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => el.style.setProperty("--sy", String(window.scrollY)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cols = 5;
  const rows = 7;
  const density = [0.25, 0.55, 0.85, 1, 1];
  return (
    <div ref={ref} className="pointer-events-none absolute -right-[6vw] top-0 hidden h-full w-[52vw] md:block" aria-hidden>
      <div className="grid h-full content-center" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const isTram = r === 2 && c === 3;
          const keep = isTram || seeded(i + 3) < (density[c] ?? 1);
          if (!keep) return <div key={i} className="aspect-square" />;
          const speed = (seeded(i + 11) - 0.5) * 0.35; // parallax factor
          const tilt = (seeded(i + 21) - 0.5) * 10;
          return (
            <div key={i} className="aspect-square" style={{ transform: `translate3d(0, calc(var(--sy, 0) * ${speed.toFixed(3)}px), 0) rotate(calc(${tilt.toFixed(1)}deg + var(--sy, 0) * ${(speed * 0.04).toFixed(4)}deg))` }}>
              <div className="az-tile-in pointer-events-auto h-full w-full" style={{ animationDelay: `${300 + (cols - c) * 90 + r * 60}ms` }}>
                <Tile
                  pattern={isTram ? "tram" : pat(seeded(i + 99) * 7)}
                  rotate={isTram ? 0 : rotOf(seeded(i) * 4)}
                  className="az-turn h-full w-full shadow-[0_10px_30px_-18px_rgba(0,26,115,0.5)]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AzHero() {
  const { isActive, activate } = useConciergeEntry();
  const talk = () => {
    if (!isActive) activate();
    scrollToId("concierge");
  };
  return (
    <header id="hero" className="relative flex min-h-[88svh] items-center overflow-hidden" style={{ backgroundColor: az.glaze }}>
      <TileCollage />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 md:px-12">
        <p className="az-word text-sm" style={{ color: az.cobalt, display: "block" }}>
          casa lisboa · boutique hotel · baixa, lisbon
        </p>
        <h1 className="mt-5 max-w-2xl text-5xl leading-[1.02] md:text-7xl" style={{ ...display, color: az.ink, fontWeight: 400 }}>
          <Words start={2}>{["24 rooms in lisbon.", "a concierge that", <em key="e" style={{ color: az.cobalt }}>never</em>, "sleeps."]}</Words>
        </h1>
        <p className="az-word mt-6 max-w-md text-lg" style={{ animationDelay: "900ms", color: az.muted, display: "block" }}>
          Ask about rooms, prices or the city. Out loud, in your language, at any hour.
        </p>
        <div className="az-word mt-9 flex flex-wrap items-center gap-5" style={{ animationDelay: "1100ms", display: "flex" }}>
          <button
            onClick={talk}
            className="group flex items-center gap-3 rounded-full py-2 pl-2 pr-6 text-base font-medium transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: az.cobalt, color: "#fff", boxShadow: "0 14px 30px -12px rgba(11,59,240,0.6)" }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
              </svg>
            </span>
            talk to the concierge
          </button>
          <button onClick={() => scrollToId("rooms")} className="group inline-flex items-center gap-2 text-base" style={{ color: az.ink }}>
            see the rooms <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
        <div className="az-word mt-14 flex gap-10 text-sm" style={{ animationDelay: "1300ms", display: "flex", color: az.muted, fontVariantNumeric: "tabular-nums" }}>
          <span><b style={{ color: az.ink }}>24</b> rooms</span>
          <span><b style={{ color: az.ink }}>1</b> rooftop bar</span>
          <span><b style={{ color: az.ink }}>40+</b> countries</span>
          <span>from <b style={{ color: az.ink }}>€140</b></span>
        </div>
      </div>
    </header>
  );
}
