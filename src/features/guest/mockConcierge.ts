// MAIN UI TEAM · fake call with the same shape as the agent team's useConcierge().
// Lets you build the cards and the page before the agent is merged. Never used in the demo.
import { useCallback, useRef, useState } from "react";
import type { ConciergeStatus, InquiryInput, ShowEvent, TranscriptLine } from "@/shared/types";

export function useMockConcierge(opts: { onInquiry: (input: InquiryInput) => Promise<unknown> | void }) {
  const [status, setStatus] = useState<ConciergeStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [events, setEvents] = useState<ShowEvent[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const timers = useRef<number[]>([]);

  const say = (role: TranscriptLine["role"], text: string) => setTranscript((t) => [...t, { role, text, at: Date.now() }]);
  const show = (e: Omit<ShowEvent, "at">) => setEvents((p) => [...p, { ...e, at: Date.now() }]);

  const start = useCallback(async () => {
    setTranscript([]); setEvents([]); setConfirmed(false); setStatus("connecting");
    const steps: [number, () => void][] = [
      [500, () => { setStatus("speaking"); say("agent", "Good evening, Casa Lisboa. How can I help?"); }],
      [2000, () => { setStatus("listening"); say("guest", "Do you have a room with a balcony for our anniversary?"); }],
      [3500, () => { setStatus("speaking"); say("agent", "Our Superior Balcony would be lovely."); show({ kind: "room", id: "superior_balcony" }); }],
      [5000, () => show({ kind: "dates", data: "2027-05-14 to 2027-05-17" })],
      [6000, () => show({ kind: "guests", data: "2 adults" })],
      [7000, () => { say("agent", "I'd add our celebration package."); show({ kind: "extra", id: "celebration_package" }); }],
      [9000, () => { say("agent", "Three nights with the package is 711 euros."); show({ kind: "price", data: "711" }); }],
      [11000, () => { setStatus("listening"); say("guest", "Perfect, yes please."); }],
      [12000, () => {
        opts.onInquiry({
          guest_name: "Mock Guest", contact: "mock@example.com", language: "en",
          check_in: "2027-05-14", check_out: "2027-05-17", adults: 2, children: 0, arrival_time: "16:00",
          occasion: "Anniversary", room_id: "superior_balcony", extra_id: "celebration_package",
          mood: "celebration", hesitation: "view", summary: "MOCK call: anniversary, balcony, celebration package.",
        });
        setConfirmed(true); show({ kind: "confirmation" }); setStatus("speaking");
        say("agent", "Done. The team will confirm after nine. Happy anniversary!");
      }],
      [14500, () => setStatus("idle")],
    ];
    steps.forEach(([ms, fn]) => timers.current.push(window.setTimeout(fn, ms)));
  }, [opts]);

  const end = useCallback(async () => {
    timers.current.forEach(clearTimeout); timers.current = []; setStatus("idle");
  }, []);

  return { status, isSpeaking: status === "speaking", transcript, events, confirmed, start, end };
}
