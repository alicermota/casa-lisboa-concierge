import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { az, serif } from "./palette";
import { Tile, pat, rotOf, seeded, type TilePattern } from "./Tile";

/** Adds "is-in" once the element scrolls into view. */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`az-reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Image that is revealed by a cobalt glaze wiping away. */
export function GlazeImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`az-glaze-wipe ${inView ? "is-in" : ""} ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-105" />
    </div>
  );
}

/** A thin row of small tiles used as a section divider. */
export function TileStrip({ count = 24, size = 44, offset = 0 }: { count?: number; size?: number; offset?: number }) {
  return (
    <div className="flex w-full overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shrink-0" style={{ width: size, height: size }}>
          <Tile pattern={(i + offset) % 2 === 0 ? "flor" : "rosa"} className="az-turn h-full w-full" />
        </div>
      ))}
    </div>
  );
}

/** Looping multilingual welcome, tile.pt-style marquee. */
const WELCOMES = ["bem-vindo", "welcome", "bienvenue", "willkommen", "benvenuto", "bienvenido", "welkom", "välkommen", "witamy", "ようこそ", "환영합니다", "hoş geldiniz"];
export function WelcomeMarquee() {
  const items = [...WELCOMES, ...WELCOMES];
  return (
    <div className="az-marquee overflow-hidden border-y py-5" style={{ borderColor: az.rule, backgroundColor: az.paper }}>
      <div className="az-marquee-track">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 text-2xl italic md:text-3xl" style={{ ...serif, color: az.cobalt }}>
            {w}
            <span className="inline-block h-6 w-6 shrink-0">
              <Tile pattern={pat(i)} className="h-full w-full" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** The hero wall: tiles flip into place one by one, slowly drifting. One of them is the tram. */
export function TileWall({ cols = 10, rows = 6, style }: { cols?: number; rows?: number; style?: CSSProperties }) {
  const total = cols * rows;
  const tramIndex = cols * 1 + (cols - 2); // easter egg, top right area
  return (
    <div className="az-drift absolute inset-[-4%] grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, ...style }} aria-hidden>
      {Array.from({ length: total }).map((_, i) => {
        const r = seeded(i);
        const pattern: TilePattern = i === tramIndex ? "tram" : pat(seeded(i + 99) * 7);
        const rot = rotOf(r * 4);
        const delay = ((i % cols) + Math.floor(i / cols)) * 55 + r * 120;
        return (
          <div key={i} className="az-tile-in aspect-square" style={{ animationDelay: `${delay}ms` }}>
            <Tile pattern={pattern} rotate={pattern === "tram" ? 0 : rot} className="az-turn h-full w-full" />
          </div>
        );
      })}
    </div>
  );
}
