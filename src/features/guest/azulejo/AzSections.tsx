import { Baby, Bike, CalendarCheck, Car, Clock, Coffee, DoorOpen, KeyRound, Moon, ParkingSquare, Wine, Music, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { az, num, scrollToId, serif } from "./palette";
import { GhostTitle, GlazeImage, Reveal, ScrollWords, TileStrip } from "./Motion";
import { Tile, pat, rotOf } from "./Tile";
import { EXTRAS_DISPLAY, GOOD_TO_KNOW, ROOFTOP_IMAGE, ROOMS_DISPLAY } from "../siteContent";

const ICONS: Record<string, LucideIcon> = { Baby, Bike, CalendarCheck, Car, Clock, Coffee, DoorOpen, KeyRound, Moon, ParkingSquare, Wine };

function Heading({ eyebrow, title, light = false, ghost }: { eyebrow: string; title: (string | ReactNode)[]; light?: boolean; ghost?: string }) {
  return (
    <div className="mb-14">
      {ghost && (
        <div className="relative left-1/2 mb-8 w-screen -translate-x-1/2">
          <GhostTitle text={ghost} />
        </div>
      )}
      <p className="text-sm" style={{ color: light ? `${az.wash}aa` : az.cobalt }}>
        {eyebrow}
      </p>
      <ScrollWords parts={title} className="mt-3 text-4xl leading-[1.05] md:text-6xl" style={{ ...serif, color: light ? az.glaze : az.ink }} />
    </div>
  );
}

export function Intro() {
  return (
    <section id="hotel" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 md:px-12">
      <div className="grid items-center gap-16 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Heading eyebrow="the house." title={["a home in the", <em key="e" style={{ color: az.cobalt }}>rhythm</em>, "of the city"]} />
          <Reveal delay={150}>
            <p className="-mt-4 max-w-lg text-lg leading-relaxed" style={{ color: az.muted }}>
              A restored 19th-century building in the heart of Lisbon, with high ceilings, wooden floors and tall windows. Twenty-four rooms,
              a rooftop above the river, and guests from more than forty countries who come back for the quiet in the middle of it all.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-12 flex max-w-md justify-between border-t pt-8" style={{ borderColor: az.rule, ...num }}>
              {[["24", "rooms"], ["40+", "countries"], ["1890s", "building"]].map(([n, l]) => (
                <div key={l}>
                  <p className="text-4xl font-light" style={{ ...serif, color: az.cobalt }}>{n}</p>
                  <p className="mt-1 text-xs tracking-[0.2em]" style={{ color: az.muted }}>{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        {/* a small tile panel, like a facade detail */}
        <Reveal delay={200}>
          <div className="grid grid-cols-3 overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(15,27,61,0.45)]">
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
    <section id="rooms" className="scroll-mt-20 py-24" style={{ backgroundColor: az.paper }}>
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Heading ghost="rooms" eyebrow="rooms & suites." title={["four ways to", <em key="e">stay</em>]} />
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {ROOMS_DISPLAY.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <article className="group">
                <div className="relative">
                  <GlazeImage src={r.image} alt={r.name} className="aspect-[3/4] w-full rounded-t-[999px]" />
                  <div className="absolute -bottom-5 left-1/2 h-10 w-10 -translate-x-1/2 overflow-hidden rounded-sm shadow-md transition-transform duration-500 group-hover:rotate-90">
                    <Tile pattern={pat(i + 1)} className="h-full w-full" />
                  </div>
                </div>
                <h3 className="mt-10 text-center text-2xl font-light" style={{ ...serif, color: az.ink }}>{r.name}</h3>
                <p className="mt-1 text-center text-sm" style={{ color: az.muted, ...num }}>{r.size} m² · {r.feature}</p>
                <div className="mt-5 flex items-baseline justify-between border-t pt-4" style={{ borderColor: az.rule }}>
                  <p className="text-sm" style={{ color: az.muted }}>
                    from <span className="text-xl" style={{ ...serif, color: az.cobalt, ...num }}>€{r.from}</span>
                  </p>
                  <button onClick={() => scrollToId("concierge")} className="text-sm underline decoration-1 underline-offset-4 hover:opacity-60" style={{ color: az.cobalt }}>
                    ask us
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-12 text-xs" style={{ color: az.muted }}>Per night, breakfast and Wi-Fi included. November to March; April to October +20%.</p>
      </div>
    </section>
  );
}

export function Rooftop() {
  return (
    <section id="rooftop" className="mx-auto grid max-w-6xl scroll-mt-20 items-center gap-14 px-6 py-28 md:grid-cols-2 md:px-12">
      <GlazeImage src={ROOFTOP_IMAGE} alt="The rooftop bar" className="aspect-[4/5] w-full rounded-sm" />
      <div>
        <Heading eyebrow="the rooftop." title={["evenings", <em key="e" style={{ color: az.cobalt }}>above</em>, "the river"]} />
        <Reveal delay={150}>
          <p className="-mt-4 text-lg leading-relaxed" style={{ color: az.muted }}>
            Our bar looks out over the Tagus and the roofs of the old town. Come up for the last light, stay for one more glass.
          </p>
          <dl className="mt-10 space-y-4 border-t pt-6 text-sm" style={{ borderColor: az.rule }}>
            <div className="flex justify-between"><dt style={{ color: az.muted }}>open daily</dt><dd style={num}>17:00 – 24:00</dd></div>
            <div className="flex justify-between"><dt style={{ color: az.muted }}>booking direct</dt><dd>a welcome drink on us</dd></div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function Extras() {
  return (
    <section id="extras" className="scroll-mt-20 py-24" style={{ backgroundColor: az.paper }}>
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Heading ghost="extras" eyebrow="little extras." title={["small touches,", <em key="e">big</em>, "memories"]} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {EXTRAS_DISPLAY.map((e, i) => {
            const Icon = ICONS[e.icon] ?? Wine;
            return (
              <Reveal key={e.name} delay={i * 90}>
                {/* each extra is a tile that flips to show its price */}
                <div className="group aspect-square [perspective:900px]">
                  <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-sm border [backface-visibility:hidden]" style={{ borderColor: az.rule, backgroundColor: az.glaze }}>
                      <Icon size={28} strokeWidth={1.3} style={{ color: az.cobalt }} />
                      <p className="px-3 text-center text-lg leading-tight" style={{ ...serif, color: az.ink }}>{e.name}</p>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-sm p-4 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ backgroundColor: az.cobalt, color: az.glaze }}>
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
  { group: "see", items: [["Miradouro de Santa Luzia", "tiles, bougainvillea and the river, best in the morning"], ["Alfama", "get lost on purpose in the oldest quarter"]] },
  { group: "eat", items: [["a neighbourhood tasca", "ask us for tonight's petiscos tip"], ["pastel de nata", "warm, with cinnamon, standing at the counter"]] },
  { group: "feel", items: [["fado at night", "small houses in Alfama, after dinner"], ["Sintra day trip", "palaces in the hills, 40 min by train"]] },
] as const;

export function LisbonRecommendations() {
  return (
    <section id="lisbon" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 md:px-12">
      <Heading ghost="our lisbon" eyebrow="our lisbon." title={["little city", <em key="e">rituals,</em>, "curated by the team"]} />
      <div className="grid gap-12 md:grid-cols-3">
        {LISBON.map((g, gi) => (
          <Reveal key={g.group} delay={gi * 120}>
            <p className="text-sm tracking-[0.25em]" style={{ color: az.cobalt }}>{g.group}.</p>
            <div className="mt-6 space-y-6">
              {g.items.map(([name, note]) => (
                <div key={name} className="border-t pt-5" style={{ borderColor: az.rule }}>
                  <p className="text-xl" style={{ ...serif, color: az.ink }}>{name}</p>
                  <p className="mt-1 text-sm" style={{ color: az.muted }}>{note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function GoodToKnow() {
  return (
    <section id="good-to-know" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-28 md:px-12">
      <Heading eyebrow="good to know." title={["the", <em key="e">practical</em>, "bits"]} />
      <dl className="grid gap-x-16 border-t sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: az.rule }}>
        {GOOD_TO_KNOW.map((g, i) => {
          const Icon = ICONS[g.icon] ?? Clock;
          return (
            <Reveal key={g.label} delay={i * 60}>
              <div className="flex gap-4 border-b py-6" style={{ borderColor: az.rule }}>
                <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: az.cobalt }} />
                <div>
                  <dt className="text-sm" style={{ color: az.ink }}>{g.label}</dt>
                  <dd className="mt-1 text-sm" style={{ color: az.muted, ...num }}>{g.value}</dd>
                </div>
              </div>
            </Reveal>
          );
        })}
      </dl>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: az.navy, color: `${az.glaze}cc` }}>
      <TileStrip count={40} size={36} />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:px-12">
        <div>
          <p className="text-3xl" style={{ ...serif, color: az.glaze }}>casa lisboa<span style={{ color: az.amber }}>.</span></p>
          <p className="mt-3 text-sm">24 rooms · central Lisbon · open all night</p>
        </div>
        <a href="https://open.spotify.com/search/fado" target="_blank" rel="noreferrer" className="group flex items-center gap-4 self-start">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border transition-transform group-hover:rotate-90" style={{ borderColor: `${az.glaze}44` }}>
            <Music size={18} />
          </span>
          <span>
            <span className="block text-lg" style={{ ...serif, color: az.glaze }}>play our lisbon night</span>
            <span className="text-xs">a little fado for your arrival</span>
          </span>
        </a>
        <p className="text-xs leading-relaxed md:text-right">
          Fictional hotel · hackathon prototype
          <br />
          Azulejo patterns drawn for Casa Lisboa
        </p>
      </div>
    </footer>
  );
}
