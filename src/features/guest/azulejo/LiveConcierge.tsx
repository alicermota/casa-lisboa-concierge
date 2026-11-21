import { useEffect, useRef, useState } from "react";
import { az, serif } from "./palette";
import { TileStage } from "./TileStage";
import { useConciergeEntry } from "../useConciergeEntry";
import { useActiveConcierge, IS_MOCK } from "../concierge";
import { saveInquiry } from "@/features/desk/data";
import { ConciergeProvider } from "@/features/agent/ConciergeProvider";

const STATUS: Record<string, string> = {
  idle: "tap to talk to the concierge",
  connecting: "connecting…",
  listening: "listening…",
  speaking: "the concierge is speaking",
};

/** The concierge block itself (call + your stay). Used on / and on /demo. */
function ConciergePanel({ compact = false }: { compact?: boolean }) {
  const { isActive } = useConciergeEntry();
  const c = useActiveConcierge({ onInquiry: (i) => saveInquiry(i, IS_MOCK ? "sample_data" : "live_voice") });
  const started = useRef(false);
  const live = c.status !== "idle";
  const [error, setError] = useState<string | null>(null);
  const prev = useRef(c.status);
  useEffect(() => {
    if (prev.current === "connecting" && c.status === "idle") setError("Couldn't connect. Check the microphone permission and try again.");
    if (c.status !== "idle") setError(null);
    prev.current = c.status;
  }, [c.status]);

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
          {error && <span className="mt-2 block text-xs" style={{ color: az.amber }}>{error}</span>}
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


/** Client-only entry: provider + panel. Loaded lazily so the ElevenLabs SDK never runs on the server. */
export default function LiveConciergePanel({ compact = false }: { compact?: boolean }) {
  return (
    <ConciergeProvider>
      <ConciergePanel compact={compact} />
    </ConciergeProvider>
  );
}
