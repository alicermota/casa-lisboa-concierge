/**
 * THE ONE PLACE where the guest page picks its concierge.
 * Now: the mock call (development only, never in the demo).
 * At merge: swap to the agent team's hook, e.g.
 *   export { useConcierge as useActiveConcierge } from "@/features/agent/useConcierge";
 *   export const IS_MOCK = false;
 */
export { useMockConcierge as useActiveConcierge } from "./mockConcierge";
export const IS_MOCK = true;
