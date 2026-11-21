import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { az, serif } from "./palette";
import { Reveal } from "./Motion";
import { Tile, pat } from "./Tile";

const LiveConciergePanel = lazy(() => import("./LiveConcierge"));

/** Same look as the live panel while the voice SDK loads in the browser. */
export function ConciergePanelSlot({ compact = false }: { compact?: boolean }) {
  const placeholder = (
    <div className="flex min-h-[380px] items-center justify-center rounded-sm border" style={{ borderColor: `${az.wash}22`, backgroundColor: `${az.navySoft}cc`, color: `${az.wash}99` }}>
      <span className="text-sm">waking the concierge…</span>
    </div>
  );
  return (
    <ClientOnly fallback={placeholder}>
      <Suspense fallback={placeholder}>
        <LiveConciergePanel compact={compact} />
      </Suspense>
    </ClientOnly>
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
            talk to the <em style={{ color: az.wash }}>concierge.</em>
          </h2>
          <p className="mt-4 max-w-md text-lg" style={{ color: `${az.wash}cc` }}>
            Rooms, prices, the city. Any language. We'll leave it with the team for the morning.
          </p>
        </Reveal>
        <div className="mt-10">
          <ConciergePanelSlot />
        </div>
      </div>
    </section>
  );
}
