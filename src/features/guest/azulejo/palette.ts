/** tile.pt-inspired azulejo palette: white, near-black, one electric cobalt, deep navy for the night. */
export const az = {
  glaze: "#FFFFFF", // page background
  paper: "#F5F6FA", // soft surfaces
  cobalt: "#0B3BF0", // electric azulejo blue
  cobaltSoft: "#5C7CFF",
  wash: "#DDE4FF",
  ink: "#0A0A0A",
  ghost: "#C9C9C9", // giant ghost titles
  navy: "#001A73", // night
  navySoft: "#0A2690",
  amber: "#F2A93B", // money / tiny accents only
  muted: "#0A0A0A99",
  rule: "#0A0A0A14",
} as const;

/** Headlines: Clash Display, lowercase, tight. */
export const serif = { fontFamily: '"Clash Display", "DM Sans", sans-serif', letterSpacing: "-0.02em" } as const;
export const display = serif;
/** The one emphasised word: PT Serif bold italic. */
export const emph = { fontFamily: '"PT Serif", serif', fontStyle: "italic", fontWeight: 700, letterSpacing: "-0.01em" } as const;
export const body = { fontFamily: '"DM Sans", sans-serif' } as const;
export const num = { fontVariantNumeric: "tabular-nums" } as const;

export const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
