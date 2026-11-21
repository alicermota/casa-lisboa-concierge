import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { TramModel, type TramHandles } from "./TramModel";

type Ctl = { yaw: number; pitch: number; spinning: boolean; wave: number; look: number };

function Rig({ ctl }: { ctl: Ctl }) {
  const tram = useRef<TramHandles>(null);
  const holder = useRef<import("three").Group>(null);
  const waveStart = useRef(-10);
  const lastWave = useRef(0);
  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    if (holder.current) { holder.current.rotation.y = ctl.yaw; holder.current.rotation.x = ctl.pitch; }
    const h = tram.current;
    if (!h) return;
    if (ctl.spinning) h.wheels.forEach((w) => (w.rotation.z -= Math.min(dt, 0.05) * 4));
    if (h.head) h.head.rotation.y = ctl.look;
    if (ctl.wave !== lastWave.current) { lastWave.current = ctl.wave; waveStart.current = t; }
    const p = (t - waveStart.current) / 2;
    if (h.waveArm) h.waveArm.rotation.z = p >= 0 && p < 1 ? -1.1 + Math.sin(p * Math.PI) * 3.6 + Math.sin(p * Math.PI * 8) * 0.25 * Math.sin(p * Math.PI) : -1.1;
  });
  return <group ref={holder} position={[0, -1.5, 0]}><TramModel ref={tram} /></group>;
}

export function TramLab() {
  const [ctl, setCtl] = useState<Ctl>({ yaw: -0.6, pitch: 0, spinning: false, wave: 0, look: 0 });
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#F4E6D0", color: "#2A1A24" }}>
      <div className="flex flex-wrap items-center gap-6 border-b px-6 py-4 text-sm" style={{ borderColor: "#5B2A3E22" }}>
        <strong style={{ fontFamily: "Fraunces, serif" }}>Tram lab · prototype model</strong>
        <label className="flex items-center gap-2">Turn
          <input aria-label="Turn tram" type="range" min={-Math.PI} max={Math.PI} step={0.01} value={ctl.yaw} onChange={(e) => setCtl({ ...ctl, yaw: +e.target.value })} />
        </label>
        <label className="flex items-center gap-2">Tilt
          <input aria-label="Tilt tram" type="range" min={-0.6} max={0.9} step={0.01} value={ctl.pitch} onChange={(e) => setCtl({ ...ctl, pitch: +e.target.value })} />
        </label>
        <label className="flex items-center gap-2">Driver looks
          <input aria-label="Driver head" type="range" min={-1} max={1} step={0.01} value={ctl.look} onChange={(e) => setCtl({ ...ctl, look: +e.target.value })} />
        </label>
        <button className="rounded-full border px-4 py-1" onClick={() => setCtl({ ...ctl, spinning: !ctl.spinning })}>{ctl.spinning ? "Stop wheels" : "Spin wheels"}</button>
        <button className="rounded-full border px-4 py-1" onClick={() => setCtl({ ...ctl, wave: ctl.wave + 1 })}>Wave</button>
        <span className="opacity-60">Drag to orbit · scroll to zoom</span>
      </div>
      <div className="relative h-[calc(100vh-64px)] min-h-[480px]" data-testid="tram-canvas">
        <Canvas camera={{ position: [9, 4, 9], fov: 35 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[6, 10, 6]} intensity={1.6} />
          <Environment>
            <Lightformer intensity={1.5} position={[0, 5, 0]} scale={[10, 10, 1]} />
            <Lightformer intensity={0.8} color="#F5A524" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          </Environment>
          <Suspense fallback={null}><Rig ctl={ctl} /></Suspense>
          <ContactShadows position={[0, -1.5, 0]} opacity={0.35} scale={16} blur={2.5} far={4} />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}
