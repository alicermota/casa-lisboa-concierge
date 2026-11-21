import { guestTheme as t } from "./theme";
import { useConciergeEntry } from "./useConciergeEntry";

function MicIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
    </svg>
  );
}

export function ConciergeMicButton({ compact = false }: { compact?: boolean }) {
  const { isActive, activate } = useConciergeEntry();
  if (compact) {
    return (
      <button
        onClick={activate}
        aria-label="Talk to our concierge"
        aria-pressed={isActive}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-xl transition-transform hover:scale-105"
        style={{ backgroundColor: isActive ? t.amber : t.plum, color: isActive ? t.plumDeep : t.card, borderColor: t.card }}
      >
        <MicIcon />
      </button>
    );
  }
  return (
    <button
      onClick={activate}
      aria-pressed={isActive}
      className="group flex items-center gap-3 rounded-full border-2 py-3 pl-3 pr-6 text-lg font-semibold shadow-xl transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: t.card, color: t.plum, borderColor: t.plum }}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${isActive ? "animate-pulse" : ""}`}
        style={{ backgroundColor: isActive ? t.amber : t.plum, color: isActive ? t.plumDeep : t.card }}
      >
        <MicIcon />
      </span>
      {isActive ? "Concierge is getting ready…" : "Talk to our concierge"}
    </button>
  );
}
