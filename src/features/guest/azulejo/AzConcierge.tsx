import { useEffect, useRef } from "react";
import { az, serif } from "./palette";
import { Reveal } from "./Motion";
import { Tile, pat } from "./Tile";
import { TileStage } from "./TileStage";
import { useConciergeEntry } from "../useConciergeEntry";
import { useActiveConcierge, IS_MOCK } from "../concierge";
import { saveInquiry } from "@/features/desk/data";

const STATUS: Record<string, string> = {
  idle: "tap to talk to the concierge",
  connecting: "connecting…",
  listening: "listening…",
  speaking: "the concierge is speaking",
};

/** The concierge block itself (call + your stay). Used on / and on /demo. */
export function ConciergePanel({ compact = false }: { compact?: boolean }) {
  const { isActive } = useConciergeEntry();
  const c = useActiveConcierge({ onInquiry: (i) => saveInquiry(i, IS_MOCK ? "sample_data" : "live_voice") });
  const started = useRef(false);
  const live = c.status !== "idle";

  // the hero CTA activates the concierge: start the call once the guest lands here
  useEffect(() => {
    if (isActive && !started.current) {
      started.current = true;
      const id = setTimeout(() => void c.start(), 900);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [isActive, c]);

  const lines = c.transcript.slice(compact ? -3 : -5);

  return (
    <div className={`grid gap-6 ${compact ? "" : "md:grid-cols-[0.9fr_1.1fr] md:gap-8"}`}>
      <div className="flex min-h-[380px] flex-col items-center rounded-sm border p-8 backdrop-blur-sm" style={{ borderColor: `${az.wash}22`, backgroundColor: `${az.navySoft}cc` }}>
        <button
          onClick={() => void (live ? c.end() : c.start())}
          aria-label={live ? "End call" : "Start call"}
          className={`mt-4 h-28 w-28 shrink-0 rounded-full transition-transform hover:scale-105 ${c.status === "speaking" ? "az-breathe" : ""} ${c.status === "listening" ? "az-listen" : ""}`}
          style={{ background: `radial-gradient(circle at 35% 35%, ${az.wash}, ${c.status === "listening" ? az.amber : az.cobalt} 62%, ${az.navy})`, boxShadow: `0 0 80px ${az.cobalt}88` }}
        />
        <p className="mt-6 text-sm" style={{ color: `${az.wash}bb` }}>
          {STATUS[c.status]}
          {IS_MOCK && <span className="ml-2 rounded-full px-2 py-0.5 text-[10px]" style={{ backgroundColor: `${az.amber}33`, color: az.amber }}>mock</span>}
        </p>
        <div className="mt-6 w-full space-y-2 text-sm">
          {lines.map((l) => (
            <p key={l.at} className={l.role === "agent" ? "" : "text-right"} style={{ color: l.role === "agent" ? az.glaze : `${az.wash}99` }}>
              {l.role === "agent" ? <span style={serif} className="italic">{l.text}</span> : l.text}
            </p>
          ))}
        </div>
        {live && (
          <button onClick={() => void c.end()} className="mt-auto pt-6 text-xs underline underline-offset-4" style={{ color: `${az.wash}88` }}>
            end call
          </button>
        )}
      </div>

      <div id="your-stay" className="rounded-sm p-6 md:p-8" style={{ backgroundColor: az.glaze }}>
        <p className="mb-5 text-sm" style={{ color: az.cobalt }}>your stay</p>
        <TileStage events={c.events} />
      </div>
    </div>
  );
}

/** The "after hours" moment: the page turns to night. */
export function AzConcierge() {
  return (
    <section id="concierge" className="relative scroll-mt-16 overflow-hidden" style={{ backgroundColor: az.navy }}>
      <div className="h-24" style={{ background: `linear-gradient(${az.cobalt}, ${az.navy})` }} />

      <div className="pointer-events-none absolute inset-0 top-24 grid content-start grid-cols-8 md:grid-cols-12" aria-hidden>
        {Array.from({ length: 96 }).map((_, i) => (
          <div key={i} className="az-glow aspect-square" style={{ animationDelay: `${(i * 377) % 6000}ms` }}>
            <Tile pattern={pat(i)} color={az.cobaltSoft} className="h-full w-full mix-blend-screen" />
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-4 md:px-12">
        <Reveal>
          <p className="text-sm" style={{ color: `${az.wash}aa` }}>concierge</p>
          <h2 className="mt-3 text-5xl leading-tight md:text-6xl" style={{ ...serif, color: az.glaze }}>
            <em style={{ color: az.wash }}>talk</em> to us.
          </h2>
          <p className="mt-4 max-w-md text-lg" style={{ color: `${az.wash}cc` }}>
            Rooms, prices, the city. Any language. We'll leave it with the team for the morning.
          </p>
        </Reveal>
        <div className="mt-10">
          <ConciergePanel />
        </div>
      </div>
    </section>
  );
}
