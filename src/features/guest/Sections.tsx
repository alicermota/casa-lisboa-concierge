import { Baby, Bike, CalendarCheck, Car, Clock, Coffee, DoorOpen, KeyRound, Moon, ParkingSquare, Wine, type LucideIcon } from "lucide-react";
import { guestTheme as t } from "./theme";
import { EXTRAS_DISPLAY, GOOD_TO_KNOW, ROOFTOP_IMAGE, ROOMS_DISPLAY } from "./siteContent";

const ICONS: Record<string, LucideIcon> = { Baby, Bike, CalendarCheck, Car, Clock, Coffee, DoorOpen, KeyRound, Moon, ParkingSquare, Wine };
const serif = { fontFamily: "Fraunces, serif" } as const;
const num = { fontVariantNumeric: "tabular-nums" } as const;

function Eyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "#C9573A" }}>{children}</p>;
}

export function Intro() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
      <Eyebrow>Welcome</Eyebrow>
      <h2 className="text-4xl md:text-6xl" style={{ ...serif, color: t.plum }}>A home in the rhythm of the city</h2>
      <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed md:text-xl" style={{ color: `${t.ink}cc` }}>
        Behind a tiled 19th-century façade in central Lisbon, we restored an old family house into 24 rooms with
        high ceilings, wooden floors and windows that open onto the trams below. Since then, guests from more than
        40 countries have made it their Lisbon address.
      </p>
      <div className="mt-12 flex justify-center gap-12" style={num}>
        {[["24", "rooms"], ["40+", "countries"], ["1890s", "building"]].map(([n, l]) => (
          <div key={l}>
            <p className="text-4xl" style={{ ...serif, color: t.plum }}>{n}</p>
            <p className="mt-1 text-sm" style={{ color: `${t.ink}99` }}>{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Rooms() {
  return (
    <section id="rooms" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:px-12">
      <Eyebrow>Rooms</Eyebrow>
      <h2 className="text-4xl md:text-5xl" style={{ ...serif, color: t.plum }}>Four ways to stay</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ROOMS_DISPLAY.map((r) => (
          <article key={r.name} className="overflow-hidden rounded-2xl shadow-sm" style={{ backgroundColor: t.card }}>
            <img src={r.image} alt={r.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="p-6">
              <h3 className="text-2xl" style={{ ...serif, color: t.plum }}>{r.name}</h3>
              <p className="mt-2 text-sm" style={{ color: `${t.ink}99`, ...num }}>{r.size} m² · {r.feature}</p>
              <p className="mt-5 text-sm" style={{ color: `${t.ink}99` }}>
                from <span className="text-2xl font-semibold" style={{ color: t.ink, ...num }}>€{r.from}</span> / night
              </p>
              <p className="mt-1 text-xs" style={{ color: "#3F6212" }}>Breakfast included</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm" style={{ color: `${t.ink}88` }}>Prices from November to March. April to October +20%.</p>
    </section>
  );
}

export function Rooftop() {
  return (
    <section id="rooftop" className="scroll-mt-20 px-6 py-12 md:px-12">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl">
        <img src={ROOFTOP_IMAGE} alt="Rooftop bar at sunset" loading="lazy" className="h-[520px] w-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${t.plumDeep}f0 0%, ${t.plumDeep}99 45%, transparent 80%)` }} />
        <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16" style={{ color: t.card }}>
          <Eyebrow>The rooftop</Eyebrow>
          <h2 className="max-w-md text-4xl md:text-5xl" style={serif}>Sunset over the Tagus</h2>
          <p className="mt-6 max-w-md text-lg opacity-90">Our rooftop bar looks out over the river and the red roofs of the old town.</p>
          <p className="mt-4 text-lg font-semibold" style={{ color: t.amber, ...num }}>Open daily 17:00–24:00</p>
          <p className="mt-6 inline-block max-w-max rounded-2xl px-5 py-3 text-sm font-semibold" style={{ backgroundColor: t.amber, color: t.plumDeep }}>
            Book direct and your welcome drink is on us
          </p>
        </div>
      </div>
    </section>
  );
}

export function Extras() {
  return (
    <section id="extras" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:px-12">
      <Eyebrow>Little extras</Eyebrow>
      <h2 className="text-4xl md:text-5xl" style={{ ...serif, color: t.plum }}>Make it yours</h2>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {EXTRAS_DISPLAY.map((e) => {
          const Icon = ICONS[e.icon] ?? Wine;
          return (
            <div key={e.name} className="rounded-2xl p-6" style={{ backgroundColor: t.card }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: `${t.amber}33`, color: t.plum }}>
                <Icon size={22} />
              </span>
              <h3 className="mt-5 text-lg font-semibold" style={{ color: t.ink }}>{e.name}</h3>
              <p className="mt-1 text-sm" style={{ color: `${t.ink}99` }}>{e.note}</p>
              <p className="mt-4 text-xl" style={{ ...serif, color: t.plum, ...num }}>{e.price}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function GoodToKnow() {
  return (
    <section id="good-to-know" className="scroll-mt-20 px-6 py-24 md:px-12" style={{ backgroundColor: `${t.card}aa` }}>
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Good to know</Eyebrow>
        <h2 className="text-4xl md:text-5xl" style={{ ...serif, color: t.plum }}>The practical bits</h2>
        <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {GOOD_TO_KNOW.map((g) => {
            const Icon = ICONS[g.icon] ?? Clock;
            return (
              <div key={g.label} className="flex gap-4">
                <Icon size={22} className="mt-1 shrink-0" style={{ color: t.plum }} />
                <div>
                  <dt className="font-semibold" style={{ color: t.ink }}>{g.label}</dt>
                  <dd className="mt-1" style={{ color: `${t.ink}aa`, ...num }}>{g.value}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
