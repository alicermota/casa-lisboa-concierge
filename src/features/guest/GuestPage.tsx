import { useEffect, useState } from "react";
import { ENTRY_ENABLED, EntryGate, shouldShowEntry } from "./entry/EntryGate";
import Lenis from "lenis";
import "./azulejo/azulejo.css";
import { az } from "./azulejo/palette";
import { TileDefs } from "./azulejo/Tile";
import { Frieze, WelcomeMarquee } from "./azulejo/Motion";
import { AzHero, AzNav } from "./azulejo/AzHero";
import { AzConcierge } from "./azulejo/AzConcierge";
import { NightShift } from "./azulejo/NightShift";
import { Extras, Footer, GoodToKnow, LisbonRecommendations, Rooftop, Rooms } from "./azulejo/AzSections";

/**
 * Guest page, azulejo edition.
 * The previous tram journey still lives in ./tram and ./tram3d (and /tram-lab) but is no longer mounted here.
 */
export function GuestPage() {
  // opening animation (once per session); remounting the hero replays its entrance after the doors
  const [entry, setEntry] = useState(ENTRY_ENABLED);
  // hero entrance animations wait (paused) under the opening, then play as the doors fade: no remount, no twitch
  const [heroPaused, setHeroPaused] = useState(ENTRY_ENABLED);
  useEffect(() => {
    if (!shouldShowEntry()) {
      setEntry(false);
      setHeroPaused(false);
    }
  }, []);
  const replayIntro = () => {
    window.scrollTo(0, 0);
    setEntry(true);
  };

  // silky smooth scroll, like tile.pt
  useEffect(() => {
    if (entry || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [entry]);

  return (
    <div className={`az-page ${heroPaused ? "az-paused" : ""}`} style={{ backgroundColor: az.glaze, color: az.ink, fontFamily: '"DM Sans", sans-serif' }}>
      <TileDefs />
      <AzNav />
      {entry && <EntryGate onLeave={() => setHeroPaused(false)} onDone={() => setEntry(false)} />}
      <AzHero />
      <WelcomeMarquee />
      <Rooms />
      <Frieze />
      <Rooftop />
      <Extras />
      <Frieze reverse size={32} />
      <LisbonRecommendations />
      <GoodToKnow />
      <NightShift />
      <AzConcierge />
      <Footer onReplayIntro={replayIntro} />
    </div>
  );
}
