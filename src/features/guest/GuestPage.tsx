import { guestTheme as t } from "./theme";
import { TramGreeting } from "./TramGreeting";
import { ConciergeMicButton } from "./ConciergeMicButton";
import { useConciergeEntry } from "./useConciergeEntry";
import { SiteNav } from "./SiteNav";
import { Intro, Rooms, Rooftop, Extras, GoodToKnow } from "./Sections";
import heroAsset from "@/assets/electrico-hero.png.asset.json";

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
const serif = { fontFamily: "Fraunces, serif" } as const;

export function GuestPage() {
  const { isActive } = useConciergeEntry();

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

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[5/6]">
            <img src={heroAsset.url} alt="Illustrated Lisbon eléctrico at golden hour" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: grain }} />
            <div
              aria-live="polite"
              className="absolute left-1/2 top-6 -translate-x-1/2 rounded px-3 py-0.5 text-[10px] font-semibold tracking-[0.35em] transition-shadow duration-500"
              style={{ backgroundColor: t.ink, color: t.amber, boxShadow: isActive ? `0 0 28px 8px ${t.amber}88` : "none" }}
            >
              {isActive ? "YOUR STAY" : "LISBOA"}
            </div>
          </div>
          <div className="absolute -bottom-8 -left-4 md:-left-16">
            <TramGreeting />
          </div>
        </div>
      </header>

      <Intro />
      <Rooms />
      <Rooftop />
      <Extras />
      <GoodToKnow />

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
    </div>
  );
}
