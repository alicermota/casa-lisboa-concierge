import { useEffect, useState } from "react";
import { guestTheme as t } from "./theme";

const MESSAGE = "Olá! Welcome to Lisbon. Looking for somewhere special to stay?";
const paper =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23p)' opacity='0.12'/></svg>\")";

export function TramGreeting() {
  const [shown, setShown] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVisible(true); setShown(MESSAGE); return; }
    const appear = setTimeout(() => setVisible(true), 500);
    let i = 0, iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => { i++; setShown(MESSAGE.slice(0, i)); if (i >= MESSAGE.length && iv) clearInterval(iv); }, 38);
    }, 900);
    return () => { clearTimeout(appear); clearTimeout(start); if (iv) clearInterval(iv); };
  }, []);

  return (
    <div
      role="status"
      aria-label={MESSAGE}
      className="relative max-w-[280px] rounded-2xl border px-5 py-4 shadow-lg transition-all duration-700"
      style={{
        backgroundColor: t.card, backgroundImage: paper, borderColor: t.plum, color: t.ink,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1) rotate(0deg)" : "translateY(12px) scale(0.9) rotate(0deg)",
      }}
    >
      <p aria-hidden className="min-h-[3rem] text-base leading-snug" style={{ fontFamily: "Fraunces, serif" }}>
        {shown}
        {shown.length < MESSAGE.length && visible && <span className="animate-pulse">|</span>}
      </p>
      <span
        aria-hidden
        className="absolute -bottom-[9px] left-10 h-4 w-4 rotate-45 border-b border-r"
        style={{ backgroundColor: t.card, borderColor: t.plum }}
      />
    </div>
  );
}
