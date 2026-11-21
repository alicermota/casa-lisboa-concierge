import { useEffect, useState } from "react";
import { az, scrollToId, serif } from "./palette";
import { TileWall } from "./Motion";
import { Tile } from "./Tile";
import { useConciergeEntry } from "../useConciergeEntry";

const LINKS = [["rooms", "rooms"], ["the house", "hotel"], ["rooftop", "rooftop"], ["our lisbon", "lisbon"]] as const;

export function AzNav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{ backgroundColor: solid ? `${az.glaze}ee` : `${az.glaze}cc`, backdropFilter: "blur(10px)", borderBottom: `1px solid ${solid ? az.rule : "transparent"}` }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 md:px-12">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 text-2xl" style={{ ...serif, color: az.ink }}>
          <span className="inline-block h-6 w-6 overflow-hidden rounded-[3px]"><Tile pattern="estrela" className="h-full w-full" /></span>
          casa lisboa<span style={{ color: az.amber }}>.</span>
        </button>
        <div className="hidden items-center gap-8 text-sm md:flex" style={{ color: az.ink }}>
          {LINKS.map(([l, id]) => (
            <button key={id} onClick={() => scrollToId(id)} className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full">
              {l}
            </button>
          ))}
        </div>
        <button onClick={() => scrollToId("concierge")} className="rounded-full px-5 py-2 text-sm transition-transform hover:scale-[1.03]" style={{ backgroundColor: az.cobalt, color: az.glaze }}>
          let's talk +
        </button>
      </div>
    </nav>
  );
}

export function AzHero() {
  const { isActive, activate } = useConciergeEntry();
  const talk = () => {
    if (!isActive) activate();
    scrollToId("concierge");
  };
  return (
    <header id="hero" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden" style={{ backgroundColor: az.glaze }}>
      <TileWall cols={12} rows={8} />
      {/* soft vignette so the label reads */}
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(55% 50% at 50% 52%, ${az.glaze}f2 0%, ${az.glaze}99 45%, transparent 75%)` }} />

      <div className="az-label-in relative z-10 mx-6 max-w-2xl px-10 py-12 text-center shadow-[0_40px_80px_-30px_rgba(10,20,51,0.55)] md:px-16" style={{ backgroundColor: az.cobalt, color: az.glaze, animationDelay: "900ms" }}>
        <p className="text-xs tracking-[0.35em] opacity-80">boutique hotel · central lisbon</p>
        <h1 className="mt-5 text-6xl font-light leading-none md:text-8xl" style={serif}>
          casa lisboa<span style={{ color: az.amber }}>.</span>
        </h1>
        <p className="mt-6 text-lg italic opacity-90 md:text-xl" style={serif}>
          we never close. we just dim the lights.
        </p>
        <button onClick={talk} className="group mt-9 inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-6 text-sm font-medium transition-transform hover:scale-[1.03]" style={{ backgroundColor: az.glaze, color: az.cobalt }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: az.amber, color: az.navy }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
            </svg>
          </span>
          talk to us, even at 3am
        </button>
      </div>

      <button onClick={() => scrollToId("hotel")} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs tracking-[0.3em]" style={{ color: az.cobalt, backgroundColor: `${az.glaze}e6` }}>
        scroll ↓
      </button>
    </header>
  );
}
