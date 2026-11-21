/** Master switch for the scrolling tram companion. Page content never depends on it. */
export const TRAM_COMPANION_ENABLED = true;

/** Section ids the companion stops at, in page order, with their station-sign labels. */
export const TRAM_STOPS = [
  { id: "rooms", label: "Rooms" },
  { id: "hotel", label: "The Hotel" },
  { id: "lisbon", label: "Lisbon" },
  { id: "concierge", label: "Concierge" },
] as const;
