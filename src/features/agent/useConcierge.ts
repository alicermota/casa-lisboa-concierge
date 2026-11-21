// AGENT TEAM · the bridge between ElevenLabs and the rest of the app.
import { useCallback, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import type { ConciergeStatus, InquiryInput, ShowEvent, TranscriptLine } from "@/shared/types";
import { getQuote } from "@/shared/pricing";

export const AGENT_ID = "agent_5301m7z8s23vfnft23qxcsa832ya";

export interface Concierge {
  status: ConciergeStatus;
  isSpeaking: boolean;
  transcript: TranscriptLine[];
  events: ShowEvent[];
  confirmed: boolean;
  start: () => Promise<void>;
  end: () => Promise<void>;
}

export function useConcierge(opts: { onInquiry: (input: InquiryInput) => Promise<unknown> | void }): Concierge {
  const [status, setStatus] = useState<ConciergeStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [events, setEvents] = useState<ShowEvent[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const show = (e: Omit<ShowEvent, "at">) => setEvents((p) => [...p, { ...e, at: Date.now() }]);

  const conversation = useConversation({
    onConnect: () => setStatus("listening"),
    onDisconnect: () => setStatus("idle"),
    onMessage: (m: any) => {
      const isAgent = m.source === "ai" || m.role === "agent";
      setTranscript((t) => [...t, { role: isAgent ? "agent" : "guest", text: m.message, at: Date.now() }]);
    },
    onModeChange: (m: any) => setStatus(m.mode === "speaking" ? "speaking" : "listening"),
    onError: (e: any) => console.error("ElevenLabs error", e),
    clientTools: {
      get_quote: async (p: any) => {
        console.log("TOOL get_quote", p);
        try {
          const q = getQuote(p);
          if (q.nights < 1) return "Error: check_out must be after check_in (YYYY-MM-DD). Ask the guest for the dates.";
          return JSON.stringify(q);
        } catch {
          return "Error: need a valid room_id, check_in and check_out (YYYY-MM-DD). Ask the guest.";
        }
      },
      show_on_screen: async (p: any) => {
        console.log("TOOL show_on_screen", p);
        show(p);
        return "shown";
      },
      save_inquiry: async (p: any) => {
        console.log("TOOL save_inquiry", p);
        try {
          await optsRef.current.onInquiry({ ...p, adults: Number(p.adults ?? 1), children: Number(p.children ?? 0) });
          setConfirmed(true);
          show({ kind: "confirmation" });
          return "saved";
        } catch (e) {
          console.error(e);
          return "Error saving. Tell the guest the team will still follow up.";
        }
      },
    },
  } as any);

  const start = useCallback(async () => {
    setTranscript([]); setEvents([]); setConfirmed(false); setStatus("connecting");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      try {
        await conversation.startSession({ agentId: AGENT_ID, connectionType: "webrtc" } as any);
      } catch (e) {
        console.warn("webrtc failed, trying websocket", e);
        await conversation.startSession({ agentId: AGENT_ID, connectionType: "websocket" } as any);
      }
    } catch (e) {
      console.error("Could not start call", e);
      setStatus("idle");
    }
  }, [conversation]);

  const end = useCallback(async () => {
    await conversation.endSession();
    setStatus("idle");
  }, [conversation]);

  return { status, isSpeaking: status === "speaking", transcript, events, confirmed, start, end };
}
