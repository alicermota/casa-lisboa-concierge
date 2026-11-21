import { guestTheme as t } from "./theme";
import { TramGreeting } from "./TramGreeting";
import { ConciergeMicButton } from "./ConciergeMicButton";
import { TramJourney } from "./TramJourney";
import { FloatingConcierge } from "./FloatingConcierge";
import { useConciergeEntry } from "./useConciergeEntry";
import { SiteNav } from "./SiteNav";
import { Intro, Rooms, Rooftop, Extras, GoodToKnow } from "./Sections";
import heroAsset from "@/assets/electrico-hero.png.asset.json";

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const HERO_IMAGE: string = heroAsset.url;

export function GuestPage() {
  const scrollToConcierge = () =>
    document.getElementById("concierge")?.scrollIntoView({ behavior: "smooth" });
  const { isActive } = useConciergeEntry();

  return (
    <div style={{ backgroundColor: t.bg, color: t.ink, fontFamily: "Inter, sans-serif" }}>
      <section
        id="hero"
        className="relative flex min-h-screen items-end overflow-hidden"
        style={{
          background: HERO_IMAGE
            ? `center / cover no-repeat url(${HERO_IMAGE})`
            : `linear-gradient(160deg, ${t.amber} 0%, ${t.sunset} 35%, ${t.plum} 75%, ${t.plumDeep} 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(to top, ${t.plumDeep}e6 0%, ${t.plumDeep}66 40%, transparent 75%)` }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: grain }} />
        <a
          href="#concierge"
          className="absolute right-4 top-4 z-10 rounded-full px-4 py-2 text-sm font-medium backdrop-blur"
          style={{ backgroundColor: `${t.plumDeep}99`, color: t.card }}
        >
          Skip animation
        </a>
        <div
          aria-live="polite"
          className="absolute left-1/2 top-[14%] -translate-x-1/2 rounded-md border-2 px-4 py-1 text-sm font-bold tracking-[0.3em] transition-all duration-500 md:left-[58%]"
          style={{
            backgroundColor: t.ink, borderColor: t.amber, color: t.amber,
            boxShadow: isActive ? `0 0 40px 12px ${t.amber}aa` : "none",
          }}
        >
          {isActive ? "YOUR STAY" : "LISBOA"}
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 md:px-12 md:pb-20">
          <div className="mb-8 flex flex-col items-start gap-5">
            <TramGreeting />
            <ConciergeMicButton />
          </div>
          <h1
            className="text-5xl leading-none tracking-tight md:text-7xl lg:text-8xl"
            style={{ fontFamily: "Fraunces, serif", color: t.card, fontWeight: 500 }}
          >
            Casa Lisboa
          </h1>
          <p className="mt-6 max-w-xl text-xl md:text-2xl" style={{ color: t.card, opacity: 0.9 }}>
            Lisbon never closes. Neither do we.
          </p>
          <button
            onClick={scrollToConcierge}
            className="mt-10 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: t.amber, color: t.plumDeep }}
          >
            Talk to us, even at 3am
          </button>
        </div>
      </section>

      <SiteNav />
      <Intro />
      <TramJourney />
      <Rooms />
      <Rooftop />
      <Extras />
      <GoodToKnow />

      <section id="concierge" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:px-12 md:py-32">
        <h2 className="mb-12 text-4xl md:text-5xl" style={{ fontFamily: "Fraunces, serif", color: t.plum }}>
          It's late. We're still here.
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl p-10 shadow-sm" style={{ backgroundColor: t.card }}>
            <h2 className="text-3xl" style={{ fontFamily: "Fraunces, serif", color: t.plum }}>
              Concierge call
            </h2>
            <div
              className="mt-8 flex min-h-[320px] items-center justify-center rounded-2xl border-2 border-dashed text-sm"
              style={{ borderColor: `${t.plum}33`, color: `${t.ink}99` }}
            >
              The call will live here.
            </div>
          </div>
          <div className="rounded-2xl p-10" style={{ backgroundColor: `${t.card}99` }}>
            <h2 className="text-3xl" style={{ fontFamily: "Fraunces, serif", color: t.plum }}>
              Your stay
            </h2>
            <div className="mt-8 flex min-h-[320px] items-center justify-center text-center">
              <p className="text-lg italic" style={{ fontFamily: "Fraunces, serif", color: `${t.ink}aa` }}>
                Your stay will take shape here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm" style={{ color: `${t.ink}99` }}>
        Illustration by [artist], used with permission · Fictional hotel, hackathon prototype
      </footer>
      <FloatingConcierge />
    </div>
  );
}
