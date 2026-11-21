import { useEffect } from "react";
import Lenis from "lenis";
import "./azulejo/azulejo.css";
import { az } from "./azulejo/palette";
import { TileDefs } from "./azulejo/Tile";
import { WelcomeMarquee } from "./azulejo/Motion";
import { AzHero, AzNav } from "./azulejo/AzHero";
import { AzConcierge } from "./azulejo/AzConcierge";
import { NightShift } from "./azulejo/NightShift";
import { Extras, Footer, GoodToKnow, LisbonRecommendations, Rooftop, Rooms } from "./azulejo/AzSections";

/**
 * Guest page, azulejo edition.
 * The previous tram journey still lives in ./tram and ./tram3d (and /tram-lab) but is no longer mounted here.
 */
export function GuestPage() {
  // silky smooth scroll, like tile.pt
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  }, []);

  return (
    <div className="az-page" style={{ backgroundColor: az.glaze, color: az.ink, fontFamily: '"DM Sans", sans-serif' }}>
      <TileDefs />
      <AzNav />
      <AzHero />
      <WelcomeMarquee />
      <Rooms />
      <Rooftop />
      <Extras />
      <LisbonRecommendations />
      <GoodToKnow />
      <NightShift />
      <AzConcierge />
      <Footer />
    </div>
  );
}
