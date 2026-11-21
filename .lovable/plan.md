# 3D Lisbon Tram, Esperanto-style (Phase 1: Audit and Plan)

Note: the Esperanto screen recording didn't come through. I only received the written brief, so this plan follows its description of the movement. Please re-attach the video if you want me to match it more closely.

## Audit: what exists today

**Current tram (flat, 2D)**
- Built from flat painted layers: an AI-painted interior, the driver cutout clipped into the cab window, your side panel on top, wheel images, and a pole drawn in code. All in `src/features/guest/tram/`.
- It only has one viewpoint (the side). It cannot rotate: turning around is a mirror flip. This is the "no rear view" problem you described, and it can't be fixed with these images.

**Current scrolling**
- `TramJourney.tsx`: on screens 1024px and wider, one tram sits in a fixed overlay and GSAP ScrollTrigger moves it from the hero down a left lane. Movement is flat (position and size only).
- On phones, a small tram drives across a rail strip above each section (`TramBand`).
- Sections are wrapped in `.tram-lane`, which reserves 300px on the left on wide screens.

**Page structure (kept as is)**
- Menu, hero (headline, greeting bubble, one "Talk to our concierge" button that scrolls to `#concierge`), Rooms & Suites (`#rooms`), The Hotel (`#hotel`), Lisbon placeholder (`#lisbon`), Concierge (`#concierge`, call placeholder + "Your stay"), footer.
- No voice/ElevenLabs code exists in this project yet. The concierge section is a placeholder, and I won't touch it beyond the scroll target.

**Libraries**
- Installed: GSAP + ScrollTrigger. Not installed: three.js, React Three Fiber, Drei.

**Reusable assets**
- The 2D tram images can't be used as a 3D model. They remain useful as the colour and style reference, and as the reduced-motion / no-WebGL fallback.
- No 3D tram model (GLB) exists in the project, and I found no free (CC0) model of a Lisbon tram with a driver and separately named parts.

## What needs to change

1. Replace the flat tram with one 3D tram in a single fixed, click-through canvas over the page.
2. Replace the flat lane movement with a 3D path tied to scroll: position, rotation on all axes, scale, lean, and wheels turning with distance travelled.
3. Remove the 300px left lane. The tram moves into open space around content instead; each section's layout leaves a deliberate empty area where the tram passes.
4. Keep the 2D tram only as the fallback (reduced motion, no WebGL, or the 3D failing to load).

## The model question (your decision)

- **Prototype (Phases 2-3):** I build a simplified tram in code. It has a complete front, back, sides, roof and underside, rounded ends, curved roof, cream window frames, burgundy and yellow panels, doors, separate wheel sets, headlights, pole, destination sign, simple seats and a simple placeholder driver. It's in your colours, with painterly flat shading. It is a test model to prove the movement, not the final tram.
- **Production (Phase 4):** a hand-made GLB is needed. Ask a 3D artist (Blender) for a stylised elétrico with separately named parts: body, front and rear details, front and rear wheel sets, doors, pole, headlights, interior, driver body, head, left arm and right arm. Hand-painted textures, under about 50k triangles, in GLB format. Once it arrives, I swap it in without changing the movement.
- I can't produce a convincing detailed moustached driver in code. If no GLB is supplied, the final driver stays simplified.

## Phases (approval before each)

**Phase 2: 3D tram prototype, on its own test page (`/tram-lab`)**
- Install three, @react-three/fiber, @react-three/drei.
- The test page shows the prototype tram with a slider to turn it through every angle, plus wheel and driver test controls.
- The live site isn't changed in this phase.

**Phase 3: scroll movement on the real page**
- Choreographed path, matching your brief:
  - **A. Hero:** large, centre-right, three-quarter front view, driver visible.
  - **B. Into Rooms:** moves down-left, turns, gets a little smaller, leans into the turn.
  - **C. Rooms:** side view in open space beside the cards.
  - **D. The Hotel:** moves diagonally across, shows the other three-quarter view, slightly larger.
  - **E. Lisbon:** briefly shows its rear while turning.
  - **F. Concierge:** turns to face you, slows to a stop, driver turns to the camera.
- Positions are calculated from where each section actually is on screen, so the path adapts to screen size.
- Scrolling scrubs the path in both directions with slight smoothing. Wheels turn with distance travelled and reverse when you scroll up.
- I'll check it moves across the screen by screenshotting at several scroll points.

**Phase 4: final tram and driver**
- Swap in the GLB model if one is supplied; otherwise refine the code model.
- Driver: head turn, wave, back to the controls, idle breathing. Gestures play once per arrival and don't replay erratically when scrolling back.

**Phase 5: hero greeting**
- About a second after load, the driver turns and waves.
- The "Olá! Looking for somewhere special to stay?" bubble is regular text placed next to the cab, so it stays sharp. It fades as you start scrolling.
- The single "Talk to our concierge" button keeps scrolling to the concierge section.

**Phase 6: phone, tablet, accessibility, performance**
- **Tablet:** shorter path with gentler turns.
- **Phone:** smaller tram with a simpler path through the gaps between sections; the 3D work is lightened (lower pixel density, render only when it moves).
- Reduced motion and no-WebGL get the still tram.
- The canvas never catches clicks or keyboard focus.
- Then a full check on desktop and phone.

## Technical details
- `src/features/guest/tram3d/`: `TramModel.tsx` (procedural geometry, named groups), `TramScene.tsx` (one fixed `<Canvas>`, `pointer-events: none`), `path.ts` (keyframes built from section rects → projected into the camera's view; position via a Catmull-Rom spline, rotation via quaternion slerp), `useScrollPath.ts` (ScrollTrigger progress, distance-based wheel angle).
- The canvas only loads in the browser (lazy import behind a client-only gate), so server rendering is unaffected.
- Error boundary + WebGL check fall back to the current 2D `LayeredTram`.
- The flag in `tram/config.ts` continues to turn the whole experience off.
- Kept: page content, prices, menu, concierge section. Removed in Phase 3: `TramJourney`/`TramBand` and the `.tram-lane` padding (replaced, not deleted, until Phase 3 is approved).
