import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";

/** Palette taken from the painted tram reference. */
export const TRAM_COLORS = {
  burgundy: "#8E2A2E", cream: "#F3E3C3", yellow: "#F2A51F", roof: "#6E3346",
  ink: "#2A1A24", glass: "#F7C77A", wood: "#9A5A2E", brass: "#C99A3B", metal: "#3B2A2A",
};
const C = TRAM_COLORS;

export type TramHandles = {
  /** Wheel angle in radians (driven by distance travelled). */
  wheels: Group[];
  head: Group | null;
  waveArm: Group | null;
  body: Group | null;
};

// Dimensions (metres-ish): length along X (front = +X), width along Z.
const L = 8, W = 2.4;
const WIN_X = [-1.9, -0.85, 0.2, 1.25];
const CAB_X = 3.3, WIN_W = 0.9;
const GLASS = { color: "#F4C27A", emissive: "#F5A524", emissiveIntensity: 0.18, transparent: true, opacity: 0.22, depthWrite: false } as const;

function Toon({ color, emissive, intensity = 0 }: { color: string; emissive?: string; intensity?: number }) {
  return <meshToonMaterial color={color} emissive={emissive ?? "#000"} emissiveIntensity={intensity} />;
}

function pillarSegments(): [number, number][] {
  const edges = [...WIN_X, CAB_X].sort((a, b) => a - b).flatMap((x) => [x - WIN_W / 2, x + WIN_W / 2]);
  const pts = [-L / 2 + 0.3, ...edges, L / 2 - 0.3];
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length; i += 2) if (pts[i + 1]! > pts[i]!) out.push([pts[i]!, pts[i + 1]!]);
  return out;
}

function Side({ z }: { z: number }) {
  const s = Math.sign(z);
  return (
    <group position={[0, 0, z]}>
      {/* passenger windows */}
      {WIN_X.map((x) => (
        <mesh key={x} position={[x, 2.15, 0]}>
          <boxGeometry args={[0.9, 0.85, 0.04]} />
          <meshToonMaterial {...GLASS} />
        </mesh>
      ))}
      {/* cream pillars filling every gap between openings */}
      {pillarSegments().map(([a, b]) => (
        <mesh key={a} position={[(a + b) / 2, 2.3, 0]}><boxGeometry args={[b - a, 0.95, 0.08]} /><Toon color={C.cream} /></mesh>
      ))}
      {/* folding doors near both ends */}
      {[2.3, -3.0].map((x) => (
        <group key={x} position={[x, 1.35, 0.01 * s]}>
          <mesh><boxGeometry args={[0.8, 2.2, 0.05]} /><Toon color={C.yellow} /></mesh>
          {[-0.2, 0.2].map((dx) => (
            <mesh key={dx} position={[dx, 0.45, 0.03 * s]}>
              <boxGeometry args={[0.28, 0.9, 0.02]} />
              <meshToonMaterial {...GLASS} />
            </mesh>
          ))}
        </group>
      ))}
      {/* cab side window */}
      <mesh position={[CAB_X, 2.15, 0]}>
        <boxGeometry args={[0.9, 0.85, 0.04]} />
        <meshToonMaterial {...GLASS} />
      </mesh>
    </group>
  );
}

function End({ dir }: { dir: 1 | -1 }) {
  const x = dir * (L / 2 + 0.02);
  return (
    <group position={[x, 0, 0]} rotation={[0, dir === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      {/* windscreen */}
      <mesh position={[0, 2.15, 0]}>
        <boxGeometry args={[1.8, 0.9, 0.04]} />
        <meshToonMaterial {...GLASS} />
      </mesh>
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * 1.05, 2.3, -0.1]}><boxGeometry args={[0.3, 0.95, 0.2]} /><Toon color={C.cream} /></mesh>
      ))}
      {/* headlight */}
      <mesh position={[0, 1.0, 0.05]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshToonMaterial color="#FFF2C2" emissive="#FFD27A" emissiveIntensity={dir === 1 ? 1.2 : 0.3} />
      </mesh>
      {/* small lamps */}
      {[-0.8, 0.8].map((dx) => (
        <mesh key={dx} position={[dx, 0.7, 0.05]}><sphereGeometry args={[0.07, 10, 8]} /><Toon color="#D33" emissive="#A00" intensity={0.5} /></mesh>
      ))}
      {/* bumper */}
      <mesh position={[0, 0.62, 0.02]}><boxGeometry args={[2.1, 0.18, 0.16]} /><Toon color={C.yellow} /></mesh>
      {/* destination sign */}
      <mesh position={[0, 2.85, 0.02]}><boxGeometry args={[1.3, 0.3, 0.06]} /><Toon color={C.ink} /></mesh>
      <mesh position={[0, 2.85, 0.06]}><planeGeometry args={[1.1, 0.16]} /><Toon color={C.yellow} emissive={C.yellow} intensity={0.6} /></mesh>
    </group>
  );
}

function Bogie({ x, wheelRefs }: { x: number; wheelRefs: (g: Group | null) => void }) {
  return (
    <group position={[x, 0.42, 0]}>
      <mesh><boxGeometry args={[2.0, 0.25, W - 0.3]} /><Toon color={C.metal} /></mesh>
      {[-0.6, 0.6].map((dx) => (
        <group key={dx} position={[dx, -0.05, 0]} ref={wheelRefs}>
          {[-1, 1].map((s) => (
            <group key={s} position={[0, 0, s * (W / 2 - 0.25)]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.12, 20]} /><Toon color={C.metal} /></mesh>
              {/* spoke so rotation reads */}
              <mesh position={[0, 0, s * 0.07]}><boxGeometry args={[0.6, 0.08, 0.02]} /><Toon color={C.brass} /></mesh>
            </group>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, W - 0.4, 8]} /><Toon color={C.metal} /></mesh>
        </group>
      ))}
    </group>
  );
}

/** Placeholder driver: torso, head (cap + moustache), arm on controller, arm that waves. */
function Driver({ headRef, armRef, torsoRef }: { headRef: React.Ref<Group>; armRef: React.Ref<Group>; torsoRef: React.Ref<Group> }) {
  return (
    <group position={[3.3, 0.95, 0]} ref={torsoRef}>
      <mesh position={[0.24, 0.6, 0]}><boxGeometry args={[0.02, 0.35, 0.07]} /><Toon color={C.burgundy} /></mesh>
      <mesh position={[0, 0.55, 0]}><boxGeometry args={[0.45, 0.7, 0.6]} /><Toon color={C.cream} /></mesh>
      <mesh position={[0.02, 0.55, 0]}><boxGeometry args={[0.47, 0.6, 0.4]} /><Toon color="#4A2A2A" /></mesh>
      <group ref={headRef} position={[0, 1.15, 0]}>
        <mesh><sphereGeometry args={[0.24, 18, 14]} /><Toon color="#E3A57A" /></mesh>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.26, 0.26, 0.14, 18]} /><Toon color={C.ink} /></mesh>
        <mesh position={[0.12, 0.14, 0]}><boxGeometry args={[0.3, 0.03, 0.4]} /><Toon color={C.ink} /></mesh>
        {/* curled moustache: two arcs with little curls */}
        {[-1, 1].map((sz) => (
          <group key={sz} position={[0.235, -0.07, sz * 0.06]}>
            <mesh rotation={[sz * 0.3, Math.PI / 2, 0]}><torusGeometry args={[0.06, 0.028, 8, 14, Math.PI * 0.9]} /><Toon color="#2B1A12" /></mesh>
            <mesh position={[0, 0.04, sz * 0.07]}><torusGeometry args={[0.025, 0.012, 6, 10]} /><Toon color="#2B1A12" /></mesh>
          </group>
        ))}
        {/* eyes + nose */}
        {[-0.08, 0.08].map((z) => <mesh key={z} position={[0.21, 0.04, z]}><sphereGeometry args={[0.025, 8, 6]} /><Toon color={C.ink} /></mesh>)}
        <mesh position={[0.25, -0.01, 0]}><sphereGeometry args={[0.045, 8, 6]} /><Toon color="#D88E66" /></mesh>
      </group>
      {/* controller arm */}
      <group position={[0.15, 0.8, -0.3]} rotation={[0, 0, -1.1]}>
        <mesh position={[0, -0.25, 0]}><boxGeometry args={[0.12, 0.5, 0.12]} /><Toon color={C.cream} /></mesh>
      </group>
      {/* waving arm (pivot at shoulder) */}
      <group ref={armRef} position={[0.05, 0.85, 0.32]} rotation={[0, 0, -1.1]}>
        <mesh position={[0, -0.25, 0]}><boxGeometry args={[0.12, 0.5, 0.12]} /><Toon color={C.cream} /></mesh>
        <mesh position={[0, -0.52, 0]}><sphereGeometry args={[0.08, 10, 8]} /><Toon color="#E3A57A" /></mesh>
      </group>
      {/* controller */}
      <mesh position={[0.55, 0.25, -0.2]}><cylinderGeometry args={[0.12, 0.15, 0.6, 12]} /><Toon color={C.brass} /></mesh>
    </group>
  );
}

/**
 * Procedural PROTOTYPE elétrico: complete on every side, named animatable parts.
 * Test model to prove movement; to be replaced by a hand-made GLB with the same parts.
 */
export const TramModel = forwardRef<TramHandles, { idle?: boolean }>(function TramModel({ idle = true }, ref) {
  const wheels = useRef<Group[]>([]);
  const head = useRef<Group>(null);
  const arm = useRef<Group>(null);
  const body = useRef<Group>(null);
  const pole = useRef<Group>(null);
  const torso = useRef<Group>(null);
  useImperativeHandle(ref, () => ({ wheels: wheels.current, head: head.current, waveArm: arm.current, body: body.current }), []);
  const addWheel = (g: Group | null) => { if (g && !wheels.current.includes(g)) wheels.current.push(g); };

  useFrame(({ clock }) => {
    if (!idle) return;
    const t = clock.getElapsedTime();
    if (body.current) body.current.position.y = Math.sin(t * 1.6) * 0.01;
    if (pole.current) pole.current.rotation.z = 0.9 + Math.sin(t * 1.3) * 0.015;
    if (torso.current) torso.current.scale.y = 1 + Math.sin(t * 1.8) * 0.012; // breathing
  });

  return (
    <group>
      <Bogie x={-2.3} wheelRefs={addWheel} />
      <Bogie x={2.3} wheelRefs={addWheel} />
      <group ref={body}>
        {/* underside / chassis */}
        <mesh position={[0, 0.62, 0]}><boxGeometry args={[L - 0.4, 0.15, W - 0.2]} /><Toon color={C.ink} /></mesh>
        {/* lower burgundy body */}
        <RoundedBox args={[L, 1.1, W]} radius={0.35} smoothness={4} position={[0, 1.2, 0]}><Toon color={C.burgundy} /></RoundedBox>
        {/* yellow belt */}
        <RoundedBox args={[L + 0.04, 0.12, W + 0.04]} radius={0.06} smoothness={3} position={[0, 1.78, 0]}><Toon color={C.yellow} /></RoundedBox>
        {/* cream top rail (window band is open: pillars live in <Side/> and <End/>) */}
        <RoundedBox args={[L, 0.22, W]} radius={0.1} smoothness={3} position={[0, 2.86, 0]}><Toon color={C.cream} /></RoundedBox>
        {/* interior: floor, ceiling glow, benches, lamps, cab partition */}
        <mesh position={[0, 1.76, 0]}><boxGeometry args={[L - 0.5, 0.04, W - 0.2]} /><Toon color={C.wood} /></mesh>
        <mesh position={[0, 2.74, 0]}><boxGeometry args={[L - 0.5, 0.03, W - 0.2]} /><Toon color="#F7D9A8" emissive="#F5A524" intensity={0.35} /></mesh>
        {[-2.6, -1.4, -0.2, 1.0].map((x) => [-0.7, 0.7].map((z) => (
          <group key={`${x}${z}`} position={[x, 1.78, z]}>
            <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.5, 0.06, 0.7]} /><Toon color={C.wood} /></mesh>
            <mesh position={[-0.22, 0.45, 0]}><boxGeometry args={[0.06, 0.45, 0.7]} /><Toon color={C.wood} /></mesh>
          </group>
        )))}
        {[-2.4, -0.6, 1.2].map((x) => (
          <mesh key={x} position={[x, 2.68, 0]}><sphereGeometry args={[0.09, 10, 8]} /><Toon color="#FFE7B0" emissive="#FFC867" intensity={1} /></mesh>
        ))}
        <mesh position={[2.75, 2.25, 0.6]}><boxGeometry args={[0.06, 0.95, 0.9]} /><Toon color={C.wood} /></mesh>
        <mesh position={[2.75, 2.25, -0.6]}><boxGeometry args={[0.06, 0.95, 0.9]} /><Toon color={C.wood} /></mesh>
        <Side z={W / 2 + 0.01} />
        <Side z={-(W / 2 + 0.01)} />
        <End dir={1} />
        <End dir={-1} />
        {/* roof: curved */}
        <mesh position={[0, 2.95, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.3, 1, 1]}>
          <cylinderGeometry args={[W / 2 + 0.12, W / 2 + 0.12, L + 0.2, 28, 1, false, Math.PI, Math.PI]} />
          <Toon color={C.roof} />
        </mesh>
        <RoundedBox args={[L + 0.2, 0.12, W + 0.24]} radius={0.05} smoothness={3} position={[0, 2.95, 0]}><Toon color={C.roof} /></RoundedBox>
        {/* roof lantern */}
        <RoundedBox args={[4, 0.3, 1.0]} radius={0.1} smoothness={3} position={[-0.3, 3.38, 0]}><Toon color={C.roof} /></RoundedBox>
        {/* trolley pole */}
        <group ref={pole} position={[1.2, 3.5, 0]} rotation={[0, 0, 0.9]}>
          <mesh position={[0, 1.4, 0]}><cylinderGeometry args={[0.03, 0.03, 2.8, 6]} /><Toon color={C.ink} /></mesh>
          <mesh position={[0, 2.8, 0]}><sphereGeometry args={[0.07, 8, 6]} /><Toon color={C.ink} /></mesh>
        </group>
        <mesh position={[1.2, 3.5, 0]}><boxGeometry args={[0.4, 0.15, 0.4]} /><Toon color={C.ink} /></mesh>
        <Driver headRef={head} armRef={arm} torsoRef={torso} />
      </group>
    </group>
  );
});
