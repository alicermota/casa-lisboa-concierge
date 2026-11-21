# Interactive Lisbon Tram Opening — Plan

## What exists today (kept as is)
- Guest page: full-screen eléctrico hero, "Casa Lisboa" title, tagline, "Talk to us, even at 3am" button that scrolls to the concierge section.
- Concierge section (id="concierge"): "Concierge call" placeholder card + "Your stay" empty state.
- Footer credit line. Palette (cream, plum, amber) and Fraunces + Inter fonts.
- No booking, rooms, navigation, backend or integrations exist yet, so nothing of that kind is touched.

## What would change

### 1. Opening scene — tram greets you (modifies the hero)
- Keep the illustration, title, tagline and plum gradient.
- Add a hand-drawn style speech bubble near the tram: cream fill, burgundy outline, paper grain, soft pop-in, typewriter text: "Olá! Welcome to Lisbon. Looking for somewhere special to stay?"
- Add a prominent microphone button "Talk to our concierge", visible on first screen on desktop and mobile.
- The existing "Talk to us, even at 3am" button stays (still scrolls to #concierge).
- Small destination-sign label "LISBOA" over the tram that flips to "YOUR STAY" and a soft window glow when the mic is clicked.

### 2. Future voice agent entry point (no agent built)
- Clicking the mic only sets an "active" visual state and calls one empty, clearly named hook point for the future ElevenLabs agent. No audio, no microphone permission, no fake conversation.

### 3. Scroll-driven tram journey (new, between hero and concierge)
- A pinned section where scrolling moves the tram along tracks; background layers (façades, azulejos, cables, foreground lamp posts) move at different speeds for depth. Scrolling up reverses it.
- Layers built from the eléctrico illustration plus the second street-scene image you sent, cropped/layered with code; no new generated art unless you ask.
- Concierge section appears naturally at the journey's end.
- Library: GSAP ScrollTrigger.

### 4. Floating concierge control
- Small round mic button pinned bottom-right, appears once the hero scrolls out of view, same behaviour as the hero mic.

### 5. Accessibility and mobile
- "Skip animation" link in the hero jumps straight to #concierge.
- Reduced-motion users: no typewriter, no pinning — static scene and text.
- Mobile: shorter, simpler journey (fewer layers), greeting and mic stay above the fold.

## Not included
- ElevenLabs agent, dashboard, database, login, payments, new pages.

## Technical notes
- All new pieces live in the guest feature folder (e.g. TramGreeting, ConciergeMicButton, TramJourney, FloatingConcierge, useConciergeEntry hook stub).
- Add `gsap` dependency; register ScrollTrigger client-side only (inside effect) to stay SSR-safe.
- Images via existing CDN asset pointers; second image uploaded as a new pointer.
