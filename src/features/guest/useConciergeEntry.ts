import { useCallback, useSyncExternalStore } from "react";

// Shared "concierge active" state. The future ElevenLabs voice agent plugs in at startConciergeSession().
let active = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Integration point for the future ElevenLabs agent. Intentionally empty: no audio, no mic permission. */
export function startConciergeSession(): void {}

export function useConciergeEntry() {
  const isActive = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => active,
    () => false,
  );
  const activate = useCallback(() => {
    active = !active;
    emit();
    if (active) startConciergeSession();
  }, []);
  return { isActive, activate };
}
