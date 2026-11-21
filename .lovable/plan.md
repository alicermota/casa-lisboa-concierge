# Tram Companion That Travels Down the Website

## What changes, in short
The page stays a normal, calm hotel website. A layered, hand-painted tram with a moustached driver introduces the hotel in the hero, then becomes a small companion that rides down a thin rail beside the content as you scroll, and back up when you scroll up. No city tour, no pinned full-screen scenes.

## Current state (checked)
- The scrolling Lisbon-tour section was already removed in the last change; there is no pinned scene or GSAP left. Nothing extra to undo there.
- Today's page: sticky menu, hero (framed eléctrico illustration + speech bubble + "Talk to our concierge"), Intro, Rooms, Rooftop, Extras, Good to know, Concierge (id="concierge"), footer.
- The hero button currently only flips the tram sign; it does not scroll.

## Sections (new order)
1. **Hero / Welcome** - title, tagline, the layered tram with the driver and the bubble "Olá! Looking for somewhere special to stay?", and exactly one button: "Talk to our concierge".
2. **Rooms & Suites** - existing four room cards, plus a quiet "Enquire" text link per card that scrolls to the concierge (no booking system exists yet, so nothing to preserve there).
3. **Discover the Hotel** - groups the existing Intro, Rooftop, Little extras and Good to know under one heading. Content unchanged.
4. **Lisbon Recommendations** - new placeholder: 3 categories (See, Eat, Experience), 2 cards each, clearly marked "Placeholder - to be curated", no invented real places or prices.
5. **Voice Concierge** - existing section, unchanged.
- Menu links become: Rooms, The Hotel, Lisbon, Concierge (the "Talk to us" menu button stays).
- Prices stay as they are: they come from the hotel facts you provided, not invented.

## The concierge button
Clicking "Talk to our concierge" smoothly scrolls the page to the Voice Concierge section, stopping so the call area sits fully in view below the menu. It also keeps the sign flip and the existing empty hook for the future voice agent. No new chat window or voice interface.

## How the tram moves
- **Hero:** large, beside the title, parked on a short track.
- **Scrolling:** the tram shrinks into a small companion (about 140-180px wide) that rides down a thin painted rail in the right margin, following scroll position. Wheels turn, body sways slightly, and it pauses at each section (a tiny station sign shows the section name).
- **Driver:** visible through the front window; blinks/smiles now and then, waves when you reach a new section and when you arrive at the concierge.
- **Never covers content:** on wide screens it lives in the side margin; on tablets and phones it docks as a small tram at the bottom corner with only gentle sway and an occasional wave, and hides while you're inside the concierge section.
- **Reduced motion:** the tram stays still in the hero, no companion movement.
- One switch turns the whole companion off without touching the page content.

## Using your tram assets
- **Back layer:** the full painted tram with interior (watercolor cutout).
- **Driver:** cut from the asset sheet (body at the wheel, plus the alternate heads and the waving arm), placed between the layers.
- **Front layer:** the side panel with transparent windows, on top, so the driver shows through the front window.
- **Wheels:** the two bogies from the sheet, animated separately.
- Also from the sheet: headlight glow, trolley pole, destination box.
- The current eléctrico painting is retired from the hero (still credited in the footer). Tell me if you'd rather keep it somewhere, e.g. as a soft background in the concierge section.

## Technical details
- Crop asset-sheet parts with a one-off script into separate transparent PNGs, upload each as CDN assets; no binaries in the repo.
- New `features/guest/tram/` module: `LayeredTram` (layers + wheel/sway/driver states), `TramCompanion` (fixed overlay, `pointer-events: none`), `useScrollProgress` (rAF-throttled scroll listener + IntersectionObserver for the current section). Plain CSS transforms; no GSAP, no pinning.
- Feature flag `TRAM_COMPANION_ENABLED` in one config file.
- Sections get ids: `rooms`, `hotel`, `lisbon`, `concierge`; concierge scroll uses `scrollIntoView` with `scroll-margin` for the sticky menu.
- `prefers-reduced-motion` respected in both hero and companion.
