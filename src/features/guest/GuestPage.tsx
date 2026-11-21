import "./azulejo/azulejo.css";
import { az } from "./azulejo/palette";
import { TileDefs } from "./azulejo/Tile";
import { WelcomeMarquee } from "./azulejo/Motion";
import { AzHero, AzNav } from "./azulejo/AzHero";
import { AzConcierge } from "./azulejo/AzConcierge";
import { Extras, Footer, GoodToKnow, Intro, LisbonRecommendations, Rooftop, Rooms } from "./azulejo/AzSections";

/**
 * Guest page, azulejo edition.
 * The previous tram journey still lives in ./tram and ./tram3d (and /tram-lab) but is no longer mounted here.
 */
export function GuestPage() {
  return (
    <div style={{ backgroundColor: az.glaze, color: az.ink, fontFamily: "Inter, sans-serif" }}>
      <TileDefs />
      <AzNav />
      <AzHero />
      <WelcomeMarquee />
      <Intro />
      <Rooms />
      <Rooftop />
      <Extras />
      <LisbonRecommendations />
      <GoodToKnow />
      <AzConcierge />
      <Footer />
    </div>
  );
}
