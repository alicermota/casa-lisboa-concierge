/**
 * THE ONE PLACE where the guest page picks its concierge.
 * Default: the real ElevenLabs agent (agent team's hook). Add ?mock=1 to the URL for the scripted fake call.
 * Only import this from client-only code (see azulejo/LiveConcierge.tsx): the SDK touches the browser.
 */
import { useConcierge } from "@/features/agent/useConcierge";
import { useMockConcierge } from "./mockConcierge";

export const IS_MOCK = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mock") === "1";
export const useActiveConcierge = IS_MOCK ? useMockConcierge : useConcierge;
