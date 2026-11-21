import { useEffect, useState } from "react";
import { guestTheme as t } from "./theme";
import { TramGreeting } from "./TramGreeting";
import { ConciergeMicButton } from "./ConciergeMicButton";
import { useConciergeEntry } from "./useConciergeEntry";
import { SiteNav } from "./SiteNav";
import { Rooms, DiscoverHotel, LisbonRecommendations } from "./Sections";
import { LayeredTram } from "./tram/LayeredTram";
import { TramBand } from "./tram/TramJourney";
import { Tram3DGate } from "./tram3d/Tram3DGate";

const serif = { fontFamily: "Fraunces, serif" } as const;

export function GuestPage() {
  const { isActive } = useConciergeEntry();
  const [waveKey, setWaveKey] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const first = setTimeout(() => setWaveKey(1), 1200);
    const id = setInterval(() => setWaveKey((k) => k + 1), 9000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);

  return (
    <div style={{ backgroundColor: t.bg, color: t.ink, fontFamily: "Inter, sans-serif" }}>
      <SiteNav />

      <header id="hero" className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-20 pt-12 md:px-12 lg:overflow-visible lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-[55%] h-[45%]" aria-hidden
          style={{ background: `radial-gradient(60% 70% at 70% 30%, ${t.amber}22, transparent 70%)` }} />
        <div className="relative grid items-end lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-5 lg:pb-24">
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${t.ink}88` }}>
              Boutique hotel · Central Lisbon
            </p>
            <h1 className="mt-6 text-6xl font-light leading-[0.95] md:text-8xl lg:-mr-24" style={{ ...serif, color: t.plum }}>
              Casa<br />Lisboa
            </h1>
            <p className="mt-6 max-w-sm text-lg italic" style={{ ...serif, color: `${t.ink}bb` }}>
              Lisbon never closes. Neither do we.
            </p>
            <div className="mt-10">
              <ConciergeMicButton />
              <p className="mt-3 text-xs" style={{ color: `${t.ink}77` }}>Day or night, even at 3am.</p>
            </div>
          </div>

          <div className="relative mt-16 lg:col-span-7 lg:mt-0 lg:-mr-16">
            <div className="absolute -top-4 right-[8%] z-20 lg:-top-10">
              <TramGreeting />
            </div>
            <div className="relative pt-20">
              <div id="tram-slot" className="tram-slot-static">
                <LayeredTram sign={isActive ? "YOUR STAY" : "LISBOA"} glow={isActive} waveKey={waveKey} />
              </div>
              <div aria-hidden className="relative -mt-[3%] mx-[-4%]">
                <div className="h-[3px] rounded-full" style={{ backgroundColor: `${t.ink}cc` }} />
                <div className="mt-1 h-2" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${t.ink}33 0 4px, transparent 4px 22px)` }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <TramBand label="Rooms" />
      <div className="tram-lane"><Rooms /></div>
      <TramBand label="The Hotel" />
      <div className="tram-lane tram-lane-r"><DiscoverHotel /></div>
      <TramBand label="Lisbon" />
      <div className="tram-lane"><LisbonRecommendations /></div>
      <TramBand label="Concierge" />

      <div className="tram-lane tram-lane-r"><section id="concierge" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 md:px-12">
        <h2 className="text-4xl font-light md:text-5xl" style={{ ...serif, color: t.plum }}>It's late. We're still here.</h2>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl p-10" style={{ backgroundColor: t.card }}>
            <h3 className="text-2xl font-light" style={{ ...serif, color: t.plum }}>Concierge call</h3>
            <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed text-sm"
              style={{ borderColor: `${t.plum}33`, color: `${t.ink}88` }}>
              The call will live here.
            </div>
          </div>
          <div className="rounded-2xl border p-10" style={{ borderColor: `${t.plum}1a` }}>
            <h3 className="text-2xl font-light" style={{ ...serif, color: t.plum }}>Your stay</h3>
            <div className="mt-8 flex min-h-[300px] items-center justify-center text-center">
              <p className="text-lg italic" style={{ ...serif, color: `${t.ink}88` }}>Your stay will take shape here.</p>
            </div>
          </div>
        </div>
      </section></div>

      <footer className="border-t px-6 py-10 text-center text-xs tracking-wide" style={{ color: `${t.ink}88`, borderColor: `${t.plum}1a` }}>
        Illustration by [artist], used with permission · Fictional hotel, hackathon prototype
      </footer>
      <Tram3DGate />
    </div>
  );
}
