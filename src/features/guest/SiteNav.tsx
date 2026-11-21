import { guestTheme as t } from "./theme";

const LINKS = [["Rooms", "rooms"], ["Rooftop", "rooftop"], ["Extras", "extras"], ["Good to know", "good-to-know"]] as const;
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 border-b backdrop-blur-md" style={{ backgroundColor: `${t.bg}e6`, borderColor: `${t.plum}1a` }}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6 md:px-12">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-xl" style={{ fontFamily: "Fraunces, serif", color: t.plum }}>
          Casa Lisboa
        </button>
        <div className="hidden items-center gap-7 text-sm md:flex" style={{ color: t.ink }}>
          {LINKS.map(([l, id]) => (
            <button key={id} onClick={() => go(id)} className="transition-opacity hover:opacity-60">{l}</button>
          ))}
        </div>
        <button onClick={() => go("concierge")} className="rounded-full border px-4 py-1.5 text-sm" style={{ borderColor: t.plum, color: t.plum }}>
          Talk to us
        </button>
      </div>
    </nav>
  );
}
