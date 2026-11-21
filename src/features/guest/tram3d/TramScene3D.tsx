import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { TramModel, type TramHandles } from "./TramModel";
import { buildPath, sample, type PathKey } from "./path";

const CAM_Z = 20, FOV = 30, TRAM_LEN = 8.6, TRAM_MID_Y = 1.9;

function Rig() {
  const holder = useRef<Group>(null);
  const tram = useRef<TramHandles>(null);
  const keys = useRef<PathKey[]>([]);
  const cur = useRef<PathKey | null>(null);
  const wave = useRef({ start: -10, lastArrive: "" });
  const { size } = useThree();

  useEffect(() => {
    const rebuild = () => { keys.current = buildPath(); };
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(document.body);
    window.addEventListener("resize", rebuild);
    const greet = setTimeout(() => (wave.current.start = performance.now() / 1000), 1200);
    return () => { ro.disconnect(); window.removeEventListener("resize", rebuild); clearTimeout(greet); };
  }, []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const target = sample(keys.current, window.scrollY);
    const c = (cur.current ??= { ...target });
    const k = 1 - Math.exp(-dt * 7);
    const prevSx = c.sx, prevSy = c.sy, prevYaw = c.yaw;
    (["sx", "sy", "w", "yaw", "pitch", "look"] as const).forEach((key) => { c[key] += (target[key] - c[key]) * k; });

    const vh = size.height, vw = size.width;
    const wpp = (2 * CAM_Z * Math.tan((FOV / 2) * Math.PI / 180)) / vh; // world units per px at z=0
    const scale = (c.w * wpp) / TRAM_LEN;
    const g = holder.current, h = tram.current;
    if (!g || !h) return;
    g.scale.setScalar(scale);
    g.position.set((c.sx - vw / 2) * wpp, -(c.sy - vh / 2) * wpp - TRAM_MID_Y * scale, 0);
    const yawVel = (c.yaw - prevYaw) / Math.max(dt, 1e-3);
    g.rotation.set(c.pitch, c.yaw, Math.max(-0.12, Math.min(0.12, -yawVel * 0.03)), "XYZ");

    // wheels follow distance travelled on screen; sign follows scroll direction
    const dist = Math.hypot(c.sx - prevSx, c.sy - prevSy) * wpp / Math.max(scale, 1e-3);
    const dir = target.s >= (c.s ?? 0) ? 1 : -1;
    c.s = target.s;
    h.wheels.forEach((w) => (w.rotation.z -= dir * dist / 0.36));
    if (h.body) h.body.position.y = Math.min(0.05, dist * 0.4) * Math.sin(performance.now() / 60);

    // driver: look toward visitor near hero/concierge; wave once on arrival
    if (h.head) h.head.rotation.y = c.look * 1.1;
    const atEnd = keys.current.length && Math.abs(target.s - keys.current[keys.current.length - 1]!.s) < 40 ? "end" : "";
    if (atEnd && wave.current.lastArrive !== atEnd) wave.current.start = performance.now() / 1000;
    wave.current.lastArrive = atEnd;
    const p = (performance.now() / 1000 - wave.current.start) / 2;
    if (h.waveArm) h.waveArm.rotation.z = p >= 0 && p < 1 ? -1.1 + Math.sin(p * Math.PI) * 3.6 + Math.sin(p * Math.PI * 8) * 0.25 * Math.sin(p * Math.PI) : -1.1;
  });

  return <group ref={holder}><TramModel ref={tram} /></group>;
}

/** One fixed, click-through canvas; the tram itself travels the scroll path. */
export default function TramScene3D() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30" data-testid="tram-3d">
      <Canvas camera={{ position: [0, 0, CAM_Z], fov: FOV }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[6, 10, 8]} intensity={1.5} />
        <Rig />
      </Canvas>
    </div>
  );
}
