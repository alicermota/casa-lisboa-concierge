import { az, serif } from "./palette";
import { Reveal } from "./Motion";
import { Tile, pat } from "./Tile";
import { useConciergeEntry } from "../useConciergeEntry";

/**
 * The "after hours" moment: the page turns to night.
 * Left: the agent team's call widget mounts here. Right: "your stay", where cards flip in during the call.
 */
export function AzConcierge() {
  const { isActive } = useConciergeEntry();
  return (
    <section id="concierge" className="relative scroll-mt-16 overflow-hidden" style={{ backgroundColor: az.navy }}>
      {/* dusk transition from the glazed page into the night */}
      <div className="h-40" style={{ background: `linear-gradient(${az.glaze}, ${az.navy})` }} />

      {/* faint glowing tiles in the dark */}
      <div className="pointer-events-none absolute inset-0 top-40 grid content-start grid-cols-8 md:grid-cols-12" aria-hidden>
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="az-glow aspect-square" style={{ animationDelay: `${(i * 377) % 6000}ms` }}>
            <Tile pattern={pat(i)} color={az.cobaltSoft} className="h-full w-full mix-blend-screen" />
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-8 md:px-12">
        <Reveal>
          <p className="text-xs tracking-[0.3em]" style={{ color: `${az.wash}aa` }}>the concierge.</p>
          <h2 className="mt-4 text-5xl font-light leading-tight md:text-7xl" style={{ ...serif, color: az.glaze }}>
            it's late.<br />
            <em className="italic" style={{ color: az.amber }}>we're still here.</em>
          </h2>
          <p className="mt-6 max-w-xl text-lg" style={{ color: `${az.wash}cc` }}>
            Ask about rooms, extras or the city, in your language. We'll shape your stay while we talk and pass it to the team for the morning.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={100}>
            <div id="concierge-call" className="flex min-h-[420px] flex-col items-center justify-center rounded-sm border p-10 backdrop-blur-sm" style={{ borderColor: `${az.wash}22`, backgroundColor: `${az.navySoft}cc` }}>
              {/* AGENT TEAM: <ConciergeCall /> replaces this placeholder */}
              <div className={`h-28 w-28 rounded-full ${isActive ? "animate-pulse" : ""}`} style={{ background: `radial-gradient(circle at 35% 35%, ${az.wash}, ${az.cobalt} 60%, ${az.navy})`, boxShadow: `0 0 80px ${az.cobalt}88` }} />
              <p className="mt-8 text-center text-sm" style={{ color: `${az.wash}99` }}>
                {isActive ? "connecting you to the concierge…" : "the concierge call lives here"}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div id="your-stay" className="min-h-[420px] rounded-sm p-8" style={{ backgroundColor: az.glaze }}>
              <p className="text-xs tracking-[0.3em]" style={{ color: az.cobalt }}>your stay.</p>
              {/* VISUAL STAGE: cards flip in here during the call */}
              <div className="mt-6 grid grid-cols-3 gap-3 opacity-60">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-sm border border-dashed" style={{ borderColor: az.rule }} />
                ))}
              </div>
              <p className="mt-8 text-center text-xl italic" style={{ ...serif, color: az.muted }}>your stay will take shape here, tile by tile.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
