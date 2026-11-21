import { Baby, Bike, Car, Clock, Wine, Music, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { az, num, serif } from "./palette";
import { GhostTitle, Reveal, ScrollWords, TileStrip } from "./Motion";
import { Tile, rotOf, pat } from "./Tile";
import { EXTRAS_DISPLAY, ROOFTOP_IMAGE, ROOMS_DISPLAY } from "../siteContent";

const ICONS: Record<string, LucideIcon> = { Baby, Bike, Car, Clock, Wine };

function Heading({ eyebrow, title, ghost }: { eyebrow: string; title: (string | ReactNode)[]; ghost?: string }) {
  return (
    <div className="mb-10">
      {ghost && (
        <div className="relative left-1/2 mb-4 w-screen -translate-x-1/2">
          <GhostTitle text={ghost} />
        </div>
      )}
      <p className="text-sm" style={{ color: az.cobalt }}>{eyebrow}</p>
      <ScrollWords parts={title} className="mt-2 text-4xl leading-[1.05] md:text-5xl" style={{ ...serif, color: az.ink }} />
    </div>
  );
}

export function Intro() {
  return (
    <section id="hotel" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:px-12">
      <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Heading eyebrow="the house" title={["built in 1890.", <em key="e" style={{ color: az.cobalt }}>restored</em>, "slowly."]} />
          <Reveal delay={100}>
            <p className="max-w-md text-lg leading-relaxed" style={{ color: az.muted }}>
              High ceilings, wooden floors, windows that open onto the street. Most guests come back.
            </p>
            <div className="mt-10 flex max-w-sm justify-between border-t pt-6" style={{ borderColor: az.rule, ...num }}>
              {[["24", "rooms"], ["40+", "countries"], ["1", "rooftop"]].map(([n, l]) => (
                <div key={l}>
                  <p className="text-3xl" style={{ ...serif, color: az.cobalt }}>{n}</p>
                  <p className="mt-1 text-xs" style={{ color: az.muted }}>{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <div className="mx-auto grid w-full max-w-sm grid-cols-3 overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(0,26,115,0.45)]">
            {Array.from({ length: 9 }).map((_, i) => (
              <Tile key={i} pattern={i === 4 ? "rosa" : "flor"} rotate={rotOf(i)} className="az-turn aspect-square w-full" />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Rooms() {
  return (
    <section id="rooms" className="scroll-mt-24 py-20" style={{ backgroundColor: az.paper }}>
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <Heading eyebrow="rooms" title={["four rooms.", "pick a", <em key="e">view.</em>]} />
          <p className="mb-10 text-sm" style={{ color: az.muted }}>per night, breakfast included · Apr–Oct +20%</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ROOMS_DISPLAY.map((r, i) => (
            <Reveal key={r.name} delay={i * 80}>
              <article className="group overflow-hidden rounded-xl bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(0,26,115,0.4)]">
                <div className="relative aspect-[3/2] overflow-hidden" style={{ backgroundColor: az.wash }}>
                  <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute right-2 top-2 h-7 w-7 overflow-hidden rounded-[4px] transition-transform duration-500 group-hover:rotate-90">
                    <Tile pattern={pat(i + 1)} className="h-full w-full" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-2 p-4">
                  <div>
                    <h3 className="text-lg leading-tight" style={{ ...serif, color: az.ink }}>{r.name}</h3>
                    <p className="text-xs" style={{ color: az.muted, ...num }}>{r.size} m² · {r.feature.toLowerCase()}</p>
                  </div>
                  <p className="text-right text-sm" style={{ color: az.muted, ...num }}>
                    <span className="text-lg" style={{ ...serif, color: az.cobalt }}>€{r.from}</span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Rooftop() {
  return (
    <section id="rooftop" className="mx-auto grid max-w-6xl scroll-mt-24 items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-12">
      <div className="aspect-[2/1] overflow-hidden rounded-xl" style={{ backgroundColor: az.wash }}>
        <img src={ROOFTOP_IMAGE} alt="The rooftop bar" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div>
        <Heading eyebrow="upstairs" title={["the", <em key="e" style={{ color: az.cobalt }}>rooftop.</em>]} />
        <p className="-mt-6 text-lg leading-relaxed" style={{ color: az.muted }}>
          River on one side, old town on the other. 17:00 to midnight. First drink's on us if you book direct.
        </p>
      </div>
    </section>
  );
}

export function Extras() {
  return (
    <section id="extras" className="scroll-mt-24 py-16" style={{ backgroundColor: az.paper }}>
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Heading eyebrow="extras" title={["the", <em key="e">little</em>, "things."]} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {EXTRAS_DISPLAY.map((e, i) => {
            const Icon = ICONS[e.icon] ?? Wine;
            return (
              <Reveal key={e.name} delay={i * 80}>
                <div className="group aspect-square [perspective:900px]">
                  <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-sm border bg-white [backface-visibility:hidden]" style={{ borderColor: az.rule }}>
                      <Icon size={26} strokeWidth={1.3} style={{ color: az.cobalt }} />
                      <p className="px-3 text-center text-base leading-tight" style={{ ...serif, color: az.ink }}>{e.name.toLowerCase()}</p>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-sm p-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ backgroundColor: az.cobalt, color: "#fff" }}>
                      <p className="text-3xl" style={{ ...serif, ...num }}>{e.price}</p>
                      <p className="text-xs opacity-80">{e.note}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const LISBON = [
  ["Miradouro de Santa Luzia", "go early, before the tour groups"],
  ["Alfama", "get lost on purpose"],
  ["a tasca nearby", "ask us which one tonight"],
  ["pastel de nata", "warm, at the counter"],
  ["fado", "after dinner, small rooms"],
  ["Sintra", "40 minutes by train"],
] as const;

export function LisbonRecommendations() {
  return (
    <section id="lisbon" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 md:px-12">
      <Heading ghost="lisboa" eyebrow="our lisbon" title={["where we'd", <em key="e">go.</em>]} />
      <div className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {LISBON.map(([name, note], i) => (
          <Reveal key={name} delay={i * 60}>
            <div className="flex items-baseline justify-between gap-4 border-t py-4" style={{ borderColor: az.rule }}>
              <p className="text-lg" style={{ ...serif, color: az.ink }}>{name}</p>
              <p className="text-right text-sm" style={{ color: az.muted }}>{note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Practical info as one quiet line instead of a whole section. */
export function GoodToKnow() {
  const items = ["check-in 15:00", "check-out 11:00", "breakfast 07:30–10:30", "free cancellation up to 48h", "no parking, garage nearby", "night porter"];
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 md:px-12">
      <p className="flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm" style={{ borderColor: az.rule, color: az.muted, ...num }}>
        {items.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </p>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: az.navy, color: `${az.wash}cc` }}>
      <TileStrip count={40} size={32} />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-12 md:px-12">
        <p className="text-2xl" style={{ ...serif, color: "#fff" }}>casa lisboa.</p>
        <a href="https://open.spotify.com/search/fado" target="_blank" rel="noreferrer" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border transition-transform group-hover:rotate-90" style={{ borderColor: `${az.wash}44` }}>
            <Music size={16} />
          </span>
          <span className="text-sm">fado for the road</span>
        </a>
        <p className="text-xs">fictional hotel · hackathon prototype</p>
      </div>
    </footer>
  );
}
