import { useEffect, useState } from "react";
import { guestTheme as t } from "./theme";
import { TramGreeting } from "./TramGreeting";
import { ConciergeMicButton } from "./ConciergeMicButton";
import { useConciergeEntry } from "./useConciergeEntry";
import { SiteNav } from "./SiteNav";
import { Rooms, DiscoverHotel, LisbonRecommendations } from "./Sections";
import { LayeredTram } from "./tram/LayeredTram";
import { TramCompanion } from "./tram/TramCompanion";

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

      <header id="hero" className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-[5fr_6fr] md:px-12 md:pt-24">
        <div>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${t.ink}88` }}>
            Boutique hotel · Central Lisbon
          </p>
          <h1 className="mt-6 text-5xl font-light leading-[1.05] md:text-7xl" style={{ ...serif, color: t.plum }}>
            Casa Lisboa
          </h1>
          <p className="mt-6 max-w-sm text-lg italic" style={{ ...serif, color: `${t.ink}bb` }}>
            Lisbon never closes. Neither do we.
          </p>
          <div className="mt-10">
            <ConciergeMicButton />
            <p className="mt-3 text-xs" style={{ color: `${t.ink}77` }}>Day or night, even at 3am.</p>
          </div>
        </div>

        <div className="relative pt-24">
          <div className="absolute left-0 top-0 md:-left-6">
            <TramGreeting />
          </div>
          <LayeredTram sign={isActive ? "YOUR STAY" : "LISBOA"} glow={isActive} waveKey={waveKey} />
          <div className="mx-[4%] -mt-[2%] h-1 rounded-full" style={{ backgroundColor: t.ink, opacity: 0.8 }} />
        </div>
      </header>

      <Rooms />
      <DiscoverHotel />
      <LisbonRecommendations />

      <section id="concierge" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 md:px-12">
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
      </section>

      <footer className="border-t px-6 py-10 text-center text-xs tracking-wide" style={{ color: `${t.ink}88`, borderColor: `${t.plum}1a` }}>
        Illustration by [artist], used with permission · Fictional hotel, hackathon prototype
      </footer>
      <TramCompanion />
    </div>
  );
}
