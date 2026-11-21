import { useEffect, useState } from "react";
import front from "@/assets/tram/tram-front.png.asset.json";
import driver from "@/assets/tram/driver.png.asset.json";
import blink from "@/assets/tram/head-blink.png.asset.json";
import hand from "@/assets/tram/hand-wave.png.asset.json";
import bogie from "@/assets/tram/bogie.png.asset.json";
import { guestTheme as t } from "../theme";
import "./tram.css";

type Props = {
  moving?: boolean;      // wheels turn + body sways
  waveKey?: number;      // change this number to trigger one wave
  sign?: string;
  glow?: boolean;
  flip?: boolean;
  className?: string;
};

/**
 * Layers, back to front: interior (warm fill) → driver → front panel with transparent windows.
 * Bogies sit under the body and rotate independently.
 */
export function LayeredTram({ moving = false, waveKey = 0, sign, glow = false, flip = false, className = "" }: Props) {
  const [blinking, setBlinking] = useState(false);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 1400);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!waveKey) return;
    setWaving(true);
    const id = setTimeout(() => setWaving(false), 1800);
    return () => clearTimeout(id);
  }, [waveKey]);

  return (
    <div className={`tram-root relative ${moving ? "tram-moving" : ""} ${className}`} style={{ aspectRatio: "1431 / 1080", transform: flip ? "scaleX(-1)" : undefined }}>
      {/* wheels */}
      {[14, 58].map((left) => (
        <img key={left} src={bogie.url} alt="" aria-hidden className="tram-bogie absolute" style={{ left: `${left}%`, top: "82%", width: "22%" }} />
      ))}
      <div className="tram-body absolute inset-x-0 top-0" style={{ aspectRatio: "1431 / 1015" }}>
        {/* front-window cabin: interior + driver, clipped to the window */}
        <div className="absolute overflow-hidden" style={{ left: "76.5%", top: "29.5%", width: "19%", height: "28%" }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, #F7D9A8 0%, #E9A86B 60%, ${t.sunset} 100%)`, boxShadow: glow ? `inset 0 0 40px ${t.amber}` : undefined }} />
          <div className="absolute" style={{ left: "-8%", top: "8%", width: "118%" }}>
            <img src={driver.url} alt="Tram driver with a moustache" className="w-full" />
            <img src={blink.url} alt="" aria-hidden className="absolute transition-opacity duration-150"
              style={{ left: "17%", top: "-2%", width: "45%", opacity: blinking ? 1 : 0 }} />
          </div>
          <img src={hand.url} alt="" aria-hidden className={`tram-hand absolute ${waving ? "tram-waving" : ""}`}
            style={{ right: "2%", top: "100%", width: "38%" }} />
        </div>
        <img src={front.url} alt="Vintage Lisbon tram" className="relative w-full" />
        {sign && (
          <div className="absolute flex items-center justify-center rounded-sm font-semibold tracking-[0.25em] transition-shadow duration-500"
            style={{ left: "73.5%", top: "10.5%", width: "15%", height: "6%", backgroundColor: t.ink, color: t.amber,
              fontSize: "clamp(6px, 0.9vw, 11px)", boxShadow: glow ? `0 0 24px 6px ${t.amber}aa` : "none",
              transform: flip ? "scaleX(-1)" : undefined }}>
            {sign}
          </div>
        )}
      </div>
    </div>
  );
}
