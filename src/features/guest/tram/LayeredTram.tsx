import { useEffect, useState } from "react";
import interior from "@/assets/tram/interior.png.asset.json";
import front from "@/assets/tram/tram-front.png.asset.json";
import driver from "@/assets/tram/driver.png.asset.json";
import blink from "@/assets/tram/head-blink.png.asset.json";
import hand from "@/assets/tram/hand-wave.png.asset.json";
import bogie from "@/assets/tram/bogie.png.asset.json";
import { guestTheme as t } from "../theme";
import "./tram.css";

type Props = {
  moving?: boolean;   // wheels rattle, suspension bounces, body sways
  waveKey?: number;   // change to trigger one wave
  sign?: string;
  glow?: boolean;
  flip?: boolean;
  className?: string;
};

/**
 * Layers, back to front (all share the side-panel canvas, 1431×1015):
 * ground shadow → bogies → pole → painted interior → driver (in cab) → front panel → glass sheen, headlight glow, sign.
 */
export function LayeredTram({ moving = false, waveKey = 0, sign, glow = false, flip = false, className = "" }: Props) {
  const [blinking, setBlinking] = useState(false);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => { setBlinking(true); setTimeout(() => setBlinking(false), 1300); }, 7000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!waveKey) return;
    setWaving(true);
    const id = setTimeout(() => setWaving(false), 1900);
    return () => clearTimeout(id);
  }, [waveKey]);

  return (
    <div className={`tram-root relative ${moving ? "tram-moving" : ""} ${className}`}
      style={{ aspectRatio: "1431 / 1110", transform: flip ? "scaleX(-1)" : undefined, transition: "transform 400ms ease" }}>
      <div className="absolute left-[3%] right-[3%] top-[93%] h-[5%] rounded-[50%]" style={{ background: `radial-gradient(closest-side, ${t.ink}55, transparent)` }} />
      {[12, 60].map((left) => (
        <img key={left} src={bogie.url} alt="" aria-hidden className="tram-bogie absolute" style={{ left: `${left}%`, top: "78%", width: "24%" }} />
      ))}
      <div className="tram-body absolute inset-x-0 top-0" style={{ aspectRatio: "1431 / 1015", containerType: "inline-size" }}>
        {/* trolley pole */}
        <svg className="tram-pole absolute" viewBox="0 0 100 100" style={{ left: "38%", top: "-20%", width: "30%", height: "32%" }} aria-hidden>
          <line x1="96" y1="98" x2="6" y2="4" stroke={t.ink} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="6" cy="4" r="3" fill={t.ink} />
          <rect x="84" y="90" width="16" height="10" rx="2" fill={t.ink} />
        </svg>
        <img src={interior.url} alt="" aria-hidden className="absolute inset-0 w-full" />
        <div className="absolute overflow-hidden" style={{ left: "76.6%", top: "29.4%", width: "18.6%", height: "27.8%" }}>
          <div className="tram-driver absolute" style={{ left: "6%", top: "10%", width: "100%" }}>
            <img src={driver.url} alt="Tram driver with a moustache, at the controls" className="w-full" />
            <img src={blink.url} alt="" aria-hidden className="absolute transition-opacity duration-150"
              style={{ left: "17%", top: "-2%", width: "45%", opacity: blinking ? 1 : 0 }} />
          </div>
          <img src={hand.url} alt="" aria-hidden className={`tram-hand absolute ${waving ? "tram-waving" : ""}`}
            style={{ right: "4%", top: "100%", width: "36%" }} />
        </div>
        <img src={front.url} alt="Vintage Lisbon tram" className="relative w-full" />
        <div className="pointer-events-none absolute" style={{ left: "12%", top: "35%", width: "84%", height: "24%",
          background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 42%, transparent 50%)" }} />
        <div className="tram-headlight absolute rounded-full" style={{ left: "86.5%", top: "68%", width: "8%", aspectRatio: "1",
          background: `radial-gradient(circle, ${t.amber}cc, transparent 70%)`, opacity: glow ? 1 : 0.6 }} />
        {sign && (
          <div className="absolute flex items-center justify-center rounded-sm font-semibold tracking-[0.25em]"
            style={{ left: "75.5%", top: "9.5%", width: "15%", height: "6%", backgroundColor: t.ink, color: t.amber,
              fontSize: "1.9cqw", letterSpacing: "0.12em", boxShadow: glow ? `0 0 24px 6px ${t.amber}aa` : "none",
              transform: flip ? "scaleX(-1)" : undefined }}>
            {sign}
          </div>
        )}
      </div>
    </div>
  );
}
