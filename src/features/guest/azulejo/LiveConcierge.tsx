import { useEffect, useRef, useState } from "react";
import { az, serif } from "./palette";
import { TileStage } from "./TileStage";
import { useConciergeEntry } from "../useConciergeEntry";
import { useActiveConcierge, IS_MOCK } from "../concierge";
import { saveInquiry } from "@/features/desk/data";
import { ConciergeProvider } from "@/features/agent/ConciergeProvider";
import { ConciergeCall } from "@/features/agent/ConciergeCall";
import type { TranscriptLine } from "@/shared/types";

const STATUS: Record<string, string> = {
  idle: "tap to talk to the concierge",
  connecting: "connecting…",
  listening: "listening…",
  speaking: "the concierge is speaking",
};

/** The concierge block itself (call + your stay). Used on / and on /demo. */
function ConciergePanel({ compact = false }: { compact?: boolean }) {
  const { isActive } = useConciergeEntry();
  // latest transcript + call start, so the confirmed inquiry can also go to the Night Desk app
  const transcriptRef = useRef<TranscriptLine[]>([]);
  const startedAt = useRef(0);
  const c = useActiveConcierge({
    onInquiry: async (i) => {
      const saved = await saveInquiry(i, IS_MOCK ? "sample_data" : "live_voice");
      if (!IS_MOCK) {
        void fetch("/api/forward-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inquiry: saved, transcript: transcriptRef.current, startedAt: startedAt.current }),
        })
          .then((r) => r.json())
          .then((r) => console.info("Night Desk forward", r))
          .catch(() => {});
      }
      return saved;
    },
  });
  transcriptRef.current = c.transcript;
  useEffect(() => {
    if (c.status === "connecting") startedAt.current = Date.now();
  }, [c.status]);
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
    <div className={`grid gap-6 ${compact ? "" : "md:grid-cols-[0.95fr_1.05fr] md:gap-8"}`}>
      <div>
        {/* agent team's widget: orb, mic states, live waveform, transcript, options */}
        <ConciergeCall c={c} />
        {IS_MOCK && (
          <p className="mt-2 text-center text-xs" style={{ color: az.amber }}>
            mock call (scripted)
          </p>
        )}
        {error && <p className="mt-2 text-center text-xs" style={{ color: az.amber }}>{error}</p>}
      </div>

      <div id="your-stay" className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: az.glaze }}>
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
