import { Baby, Bike, Car, Clock, Wine, Music, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { az, num, serif } from "./palette";
import { Frieze, GhostTitle, Reveal, ScrollWords, TileCorners, TileStrip } from "./Motion";
import { Tile, rotOf, pat } from "./Tile";
import { EXTRAS_DISPLAY, ROOFTOP_IMAGE, ROOMS_DISPLAY } from "../siteContent";
import { fadoTrack as fado } from "./fado";

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
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  // gently cycle through the rooms until someone points at one
  useEffect(() => {
    if (hovering) return;
    const id = setInterval(() => setActive((a) => (a + 1) % ROOMS_DISPLAY.length), 3500);
    return () => clearInterval(id);
  }, [hovering]);

  return (
    <section id="rooms" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Heading eyebrow="rooms" title={["four rooms.", "pick a", <em key="e">view.</em>]} />
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]" onMouseLeave={() => setHovering(false)}>
          <ol className="border-t" style={{ borderColor: az.rule }}>
            {ROOMS_DISPLAY.map((r, i) => {
              const on = i === active;
              return (
                <li key={r.name} className="border-b" style={{ borderColor: az.rule }}>
                  <button
                    onMouseEnter={() => {
                      setHovering(true);
                      setActive(i);
                    }}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group flex w-full items-center gap-4 py-5 text-left transition-[padding] duration-500"
                    style={{ paddingLeft: on ? 14 : 0 }}
                  >
                    <span className="h-7 w-7 shrink-0 overflow-hidden rounded-[4px] transition-transform duration-700" style={{ transform: on ? "rotate(90deg)" : "none", opacity: on ? 1 : 0.35 }}>
                      <Tile pattern={pat(i + 1)} className="h-full w-full" />
                    </span>
                    <span className="flex-1 text-2xl md:text-3xl" style={{ ...serif, color: on ? az.cobalt : az.ink, transition: "color 300ms" }}>
                      {r.name.toLowerCase()}
                    </span>
                    <span className="hidden text-sm sm:block" style={{ color: az.muted, ...num }}>
                      {r.size} m² · {r.feature.toLowerCase()}
                    </span>
                    <span className="w-16 text-right text-lg" style={{ ...serif, color: on ? az.cobalt : az.ink, ...num }}>
                      €{r.from}
                    </span>
                  </button>
                </li>
              );
            })}
            <li className="pt-4 text-xs" style={{ color: az.muted }}>per night, breakfast included · Apr–Oct +20%</li>
          </ol>

          {/* the view: photos crossfade, a tile marks the room */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ backgroundColor: az.wash }}>
            {ROOMS_DISPLAY.map((r, i) => (
              <img
                key={r.name}
                src={r.image}
                alt={r.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : "scale(1.06)",
                  transition: "opacity 700ms ease, transform 1400ms cubic-bezier(0.2,0.8,0.2,1)",
                }}
              />
            ))}
            <div className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs backdrop-blur-md" style={{ backgroundColor: "#ffffffcc", color: az.ink }}>
              {ROOMS_DISPLAY[active]?.name.toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Rooftop() {
  return (
    <section id="rooftop" className="mx-auto grid max-w-6xl scroll-mt-24 items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-12">
      <TileCorners>
        <div className="aspect-[2/1] overflow-hidden rounded-xl" style={{ backgroundColor: az.wash }}>
          <img src={ROOFTOP_IMAGE} alt="The rooftop bar" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </TileCorners>
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
                    <div className="absolute inset-0 overflow-hidden rounded-sm [backface-visibility:hidden]">
                      <Tile pattern={pat(i + 2)} rotate={rotOf(i)} className="absolute inset-0 h-full w-full opacity-30" />
                      <div className="relative flex h-full flex-col items-center justify-center gap-3">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                          <Icon size={24} strokeWidth={1.4} style={{ color: az.cobalt }} />
                        </span>
                        <p className="rounded-full bg-white/90 px-3 py-0.5 text-center text-sm leading-tight" style={{ ...serif, color: az.ink }}>{e.name.toLowerCase()}</p>
                      </div>
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
            <div className="group flex items-center justify-between gap-4 border-t py-4" style={{ borderColor: az.rule }}>
              <span className="h-6 w-6 shrink-0 overflow-hidden rounded-[3px] transition-transform duration-700 group-hover:rotate-180">
                <Tile pattern={pat(i)} className="h-full w-full" />
              </span>
              <p className="flex-1 text-lg" style={{ ...serif, color: az.ink }}>{name}</p>
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

export function Footer({ onReplayIntro }: { onReplayIntro?: () => void }) {
  return (
    <footer style={{ backgroundColor: az.navy, color: `${az.wash}cc` }}>
      <TileStrip count={80} size={32} />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-12 md:px-12">
        <p className="text-2xl" style={{ ...serif, color: "#fff" }}>casa lisboa.</p>
        <FadoButton />
        <p className="text-xs">
          <a href="/desk" className="underline underline-offset-4 hover:text-white">hotel team: night desk</a>
          {" · "}
          <a href="/demo" className="underline underline-offset-4 hover:text-white">demo view</a>
          {" · "}
          fictional hotel · hackathon prototype
          {onReplayIntro && (
            <>
              {" · "}
              <button onClick={onReplayIntro} className="underline underline-offset-4 hover:text-white">
                replay the entrance
              </button>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}

/** Plays an original, generated fado-style guitar loop (see fado.ts). */
function FadoButton() {
  const [on, setOn] = useState(false);
  useEffect(() => () => fado().stop(), []);
  const toggle = async () => {
    if (on) {
      fado().stop();
      setOn(false);
    } else {
      await fado().start();
      setOn(true);
    }
  };
  return (
    <button onClick={() => void toggle()} className="group flex items-center gap-3 text-left" aria-pressed={on}>
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full border transition-all group-hover:rotate-90"
        style={{ borderColor: on ? "#fff" : `${az.wash}44`, backgroundColor: on ? az.cobalt : "transparent" }}
      >
        {on ? (
          <span className="flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-[3px] rounded-sm bg-white animate-azul-bar" style={{ height: "100%", animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
        ) : (
          <Music size={16} />
        )}
      </span>
      <span>
        <span className="block text-sm" style={{ color: on ? "#fff" : undefined }}>{on ? "playing: fado for the road" : "fado for the road"}</span>
        <span className="text-xs opacity-70">{on ? "tap to pause" : "portuguese guitar, press play"}</span>
      </span>
    </button>
  );
}
