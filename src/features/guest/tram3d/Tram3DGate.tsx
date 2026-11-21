import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { TRAM_COMPANION_ENABLED, TRAM_JOURNEY_MIN_WIDTH } from "../tram/config";
import { TramJourney } from "../tram/TramJourney";

const TramScene3D = lazy(() => import("./TramScene3D"));

class Fallback extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

/** Wide screens with motion + WebGL get the 3D tram; otherwise the 2D tram journey stays. */
export function Tram3DGate() {
  const [mode, setMode] = useState<"none" | "3d" | "2d">("none");
  useEffect(() => {
    if (!TRAM_COMPANION_ENABLED) return;
    const mq = window.matchMedia(`(min-width: ${TRAM_JOURNEY_MIN_WIDTH}px) and (prefers-reduced-motion: no-preference)`);
    const sync = () => setMode(mq.matches && hasWebGL() ? "3d" : "2d");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "3d") root.dataset["tram3d"] = "on"; else delete root.dataset["tram3d"];
    return () => { delete root.dataset["tram3d"]; };
  }, [mode]);
  if (mode === "none") return null;
  if (mode === "2d") return <TramJourney />;
  return (
    <Fallback fallback={<TramJourney />}>
      <Suspense fallback={null}><TramScene3D /></Suspense>
    </Fallback>
  );
}
