import { useEffect, useRef, useState } from "react";
import { LayeredTram } from "./LayeredTram";
import { TRAM_COMPANION_ENABLED, TRAM_STOPS } from "./config";
import { useConciergeEntry } from "../useConciergeEntry";
import { guestTheme as t } from "../theme";

const NAV_H = 56;

/** Small tram that rides a rail in the right margin (wide screens) or docks bottom-right (smaller screens). */
export function TramCompanion() {
  const [state, setState] = useState({ progress: 0, visible: false, moving: false, up: false, stop: "", wide: false, reduce: false });
  const [waveKey, setWaveKey] = useState(0);
  const { isActive } = useConciergeEntry();
  const last = useRef({ y: 0, stop: "" });

  useEffect(() => {
    if (!TRAM_COMPANION_ENABLED) return;
    let raf = 0, stopTimer: ReturnType<typeof setTimeout> | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      raf = 0;
      const hero = document.getElementById("hero");
      const concierge = document.getElementById("concierge");
      const y = window.scrollY, vh = window.innerHeight;
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
      const end = document.documentElement.scrollHeight - vh;
      const progress = Math.min(1, Math.max(0, (y - heroBottom * 0.6) / Math.max(1, end - heroBottom * 0.6)));
      let stop = "";
      for (const s of TRAM_STOPS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < vh * 0.5) stop = s.label;
      }
      const wide = window.innerWidth >= 1440;
      const inConcierge = concierge ? concierge.getBoundingClientRect().top < vh * 0.6 : false;
      const visible = y > heroBottom * 0.6 && !(inConcierge && !wide);
      if (stop && stop !== last.current.stop) setWaveKey((k) => k + 1);
      const up = y < last.current.y;
      last.current = { y, stop };
      setState({ progress, visible, moving: !reduce, up, stop, wide, reduce });
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = setTimeout(() => setState((s) => ({ ...s, moving: false })), 220);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); if (stopTimer) clearTimeout(stopTimer); };
  }, []);

  if (!TRAM_COMPANION_ENABLED || state.reduce) return null;
  const { progress, visible, moving, up, stop, wide } = state;
  const tramW = wide ? 170 : 104;
  const top = `calc(${NAV_H + 24}px + ${progress} * (100vh - ${NAV_H + 24 + tramW + 40}px))`;

  return (
    <div aria-hidden className="pointer-events-none fixed z-30 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0, right: wide ? 32 : 12, ...(wide ? { top: 0, bottom: 0, width: tramW } : { bottom: 12, width: tramW }) }}>
      {wide && <div className="absolute bottom-6 top-20 left-1/2 w-px" style={{ backgroundImage: `repeating-linear-gradient(to bottom, ${t.plum}55 0 6px, transparent 6px 12px)` }} />}
      <div className="absolute w-full" style={wide ? { top, transition: "top 120ms linear" } : { bottom: 0 }}>
        {stop && (
          <p className="mb-1 text-center text-[10px] uppercase tracking-[0.25em]" style={{ color: t.plum }}>
            <span className="rounded-sm px-2 py-0.5" style={{ backgroundColor: t.card, border: `1px solid ${t.plum}33` }}>{stop}</span>
          </p>
        )}
        <LayeredTram moving={moving} flip={up && moving} waveKey={waveKey} glow={isActive} />
      </div>
    </div>
  );
}
