import { Baby, Bike, CalendarCheck, Car, Clock, Coffee, DoorOpen, KeyRound, Moon, ParkingSquare, Wine, type LucideIcon } from "lucide-react";
import { guestTheme as t } from "./theme";
import { EXTRAS_DISPLAY, GOOD_TO_KNOW, ROOFTOP_IMAGE, ROOMS_DISPLAY } from "./siteContent";

const ICONS: Record<string, LucideIcon> = { Baby, Bike, CalendarCheck, Car, Clock, Coffee, DoorOpen, KeyRound, Moon, ParkingSquare, Wine };
const serif = { fontFamily: "Fraunces, serif" } as const;
const num = { fontVariantNumeric: "tabular-nums" } as const;
const muted = `${t.ink}99`;
const rule = `${t.plum}1f`;

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-14">
      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${t.ink}77` }}>{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-light md:text-5xl" style={{ ...serif, color: t.plum }}>{title}</h2>
    </div>
  );
}

export function Intro() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${t.ink}77` }}>The house</p>
      <h2 className="mt-4 text-4xl font-light md:text-5xl" style={{ ...serif, color: t.plum }}>A home in the rhythm of the city</h2>
      <p className="mx-auto mt-8 text-lg leading-relaxed" style={{ color: `${t.ink}bb` }}>
        A restored 19th-century building in the heart of Lisbon, with high ceilings, wooden floors and tall windows.
        Twenty-four rooms, and guests from more than forty countries who come back for the quiet in the middle of it all.
      </p>
      <div className="mx-auto mt-14 flex max-w-md justify-between border-t pt-8" style={{ borderColor: rule, ...num }}>
        {[["24", "Rooms"], ["40+", "Countries"], ["19th c.", "Building"]].map(([n, l]) => (
          <div key={l}>
            <p className="text-3xl font-light" style={{ ...serif, color: t.plum }}>{n}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em]" style={{ color: muted }}>{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Rooms() {
  return (
    <section id="rooms" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:px-12">
      <Heading eyebrow="Rooms" title="Four ways to stay" />
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {ROOMS_DISPLAY.map((r) => (
          <article key={r.name}>
            <img src={r.image} alt={r.name} loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <h3 className="mt-6 text-xl" style={{ ...serif, color: t.plum }}>{r.name}</h3>
            <p className="mt-1 text-sm" style={{ color: muted, ...num }}>{r.size} m² · {r.feature}</p>
            <div className="mt-4 flex items-baseline justify-between border-t pt-4" style={{ borderColor: rule }}>
              <p className="text-sm" style={{ color: muted }}>
                from <span className="text-lg" style={{ color: t.ink, ...num }}>€{r.from}</span>
              </p>
              <p className="text-xs" style={{ color: muted }}>Breakfast included</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-12 text-xs" style={{ color: `${t.ink}77` }}>Per night, November to March. April to October +20%.</p>
    </section>
  );
}

export function Rooftop() {
  return (
    <section id="rooftop" className="mx-auto grid max-w-6xl scroll-mt-20 items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-12">
      <img src={ROOFTOP_IMAGE} alt="The rooftop bar" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
      <div className="md:pl-8">
        <Heading eyebrow="The rooftop" title="Evenings above the river" />
        <p className="-mt-6 text-lg leading-relaxed" style={{ color: `${t.ink}bb` }}>
          Our bar looks out over the Tagus and the roofs of the old town. Come up for the last light, stay for one more glass.
        </p>
        <dl className="mt-10 space-y-4 border-t pt-6 text-sm" style={{ borderColor: rule }}>
          <div className="flex justify-between"><dt style={{ color: muted }}>Open daily</dt><dd style={num}>17:00 – 24:00</dd></div>
          <div className="flex justify-between"><dt style={{ color: muted }}>Booking direct</dt><dd>Welcome drink on us</dd></div>
        </dl>
      </div>
    </section>
  );
}

export function Extras() {
  return (
    <section id="extras" className="mx-auto max-w-4xl scroll-mt-20 px-6 py-24">
      <Heading eyebrow="Little extras" title="Small touches" />
      <ul className="border-t" style={{ borderColor: rule }}>
        {EXTRAS_DISPLAY.map((e) => {
          const Icon = ICONS[e.icon] ?? Wine;
          return (
            <li key={e.name} className="flex items-center gap-6 border-b py-6" style={{ borderColor: rule }}>
              <Icon size={20} strokeWidth={1.5} style={{ color: t.plum }} className="shrink-0" />
              <div className="flex-1">
                <p className="text-lg" style={{ ...serif, color: t.ink }}>{e.name}</p>
                <p className="text-sm" style={{ color: muted }}>{e.note}</p>
              </div>
              <p className="text-sm" style={{ color: t.ink, ...num }}>{e.price}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function GoodToKnow() {
  return (
    <section id="good-to-know" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 md:px-12">
      <Heading eyebrow="Good to know" title="The practical bits" />
      <dl className="grid gap-x-16 border-t sm:grid-cols-2 lg:grid-cols-3" style={{ borderColor: rule }}>
        {GOOD_TO_KNOW.map((g) => {
          const Icon = ICONS[g.icon] ?? Clock;
          return (
            <div key={g.label} className="flex gap-4 border-b py-6" style={{ borderColor: rule }}>
              <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: t.plum }} />
              <div>
                <dt className="text-sm" style={{ color: t.ink }}>{g.label}</dt>
                <dd className="mt-1 text-sm" style={{ color: muted, ...num }}>{g.value}</dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
