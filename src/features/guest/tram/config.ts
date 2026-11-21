/** Master switch for the scroll journey. Page content never depends on it. */
export const TRAM_COMPANION_ENABLED = true;

/** Journey only runs at this width and up (needs a side lane next to content). */
export const TRAM_JOURNEY_MIN_WIDTH = 1024;

/** Stops in page order; the tram rides in a left lane beside content. */
export const TRAM_STOPS = [
  { id: "rooms", label: "Rooms" },
  { id: "hotel", label: "The Hotel" },
  { id: "lisbon", label: "Lisbon" },
  { id: "concierge", label: "Concierge" },
] as const;

/** Width of the left lane reserved next to content on wide screens (px). */
export const TRAM_LANE = 300;
