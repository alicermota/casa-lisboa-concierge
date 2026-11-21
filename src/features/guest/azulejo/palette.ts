/** Azulejo palette: cobalt on glazed white, deep navy for the night, one warm accent. */
export const az = {
  glaze: "#F7F4EC", // glazed white, page background
  paper: "#FFFFFF",
  cobalt: "#1F45B5", // main azulejo blue
  cobaltSoft: "#5B7BD6",
  wash: "#DCE4F7", // pale blue wash
  ink: "#0F1B3D", // text
  navy: "#0A1433", // night sections
  navySoft: "#16224A",
  amber: "#E8A33D", // only for CTAs and money
  muted: "#0F1B3D99",
  rule: "#1F45B51f",
} as const;

export const serif = { fontFamily: "Fraunces, serif" } as const;
export const num = { fontVariantNumeric: "tabular-nums" } as const;

export const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
