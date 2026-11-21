# Make the Tram Immersive and Actually Travel Down the Page

## Answers to your six questions

**1. Why the tram doesn't visibly move today**
- The hero tram and the scrolling tram are two separate copies. The hero one never moves; it fades out and a second, small copy fades in.
- The small copy only rides a rail on screens 1440px and wider. On anything narrower (most laptops, and your 551px preview) it is parked in the bottom-right corner, so it just looks like a sticker.
- Even on the rail, it moves at most one screen height over the whole page, so it barely changes position.

**2. How real scroll-linked movement will work**
- One tram only. It starts large in the hero and the same tram travels down the page; no hand-off to a second copy.
- GSAP ScrollTrigger drives one timeline linked to scroll (scrub), split into stops: Hero, Rooms, The Hotel, Lisbon, Concierge.
- Path: in the hero it is large on the right, overlapping the headline a little. While you scroll into Rooms it moves down and over to the left gutter and shrinks to about 40% (still roughly 260-320px wide). It then follows a gentle S-curve that switches sides between sections, and slows into a stop beside the concierge card.
- Each section gets its own space for the tram (a side column where the tram rides next to the content, and the room grid narrows to 3 columns on wide screens), so it never covers text, buttons or room photos.
- Scroll speed sets wheel speed and bounce. Scrolling up turns the tram around. When scrolling stops, the wheels stop and only small idle movement plays.
- On phones the tram rides in a band between sections (it appears in the gap above each heading and drives across) instead of sitting in a corner.
- Reduced motion: one large, still tram in the hero and a still tram at the concierge, with no travelling.

**3. How the layers are assembled now**
- Front: the side-panel painting (its windows are see-through).
- Middle: the whole driver cutout (head and body in one piece), clipped to the front window, plus a closed-eyes head swapped on top for blinking and a hand that rises to wave.
- Back: no real interior. It is just a warm orange gradient.
- Wheels: the two bogies from the asset sheet are placed under the body. They are drawn at a different angle and scale from the side panel, which is why they look disconnected.

**4. What a complete rear/interior layer needs**
A painted interior that matches the side panel exactly in framing and perspective: back wall, wooden seats, the dashboard/controller in the driver's cab, and interior shadows, with nothing in the window areas except interior. None of your current assets has this.

**5. Files I'll change**
- `src/features/guest/tram/LayeredTram.tsx`: rebuilt with the new layers and separately moving parts.
- `src/features/guest/tram/TramCompanion.tsx`: replaced by a single `TramJourney.tsx` with the ScrollTrigger timeline.
- `src/features/guest/tram/tram.css` and `config.ts`.
- `src/features/guest/GuestPage.tsx`: hero layout only (bigger, layered composition where the headline overlaps the scene, plus a faint painted track and soft shadow for depth).
- `src/features/guest/Sections.tsx`: only adds the side space for the tram and small track details at Lisbon and Concierge. Content stays the same.
- Unchanged: room data, prices, nav, concierge area, the concierge button behaviour (it still scrolls to the voice section), and anything to do with voice/ElevenLabs.
- Adds the `gsap` package back.

**6. Additional assets needed**
Yes. To do this properly without visibly broken overlays:
- **Interior layer** matching the side panel: back wall, seats, cab dashboard. Missing.
- **Driver split into parts**: torso without head, head on its own (we have 3 head variants already), and the arm on the controller separately from the waving arm. Missing as a matched set; the current driver is one piece.
- **Wheels and trolley pole drawn side-on** at the same scale as the side panel. The sheet versions don't match the angle.
- Nice to have: a glass reflection overlay for the windows, and a soft ground shadow.

## Proposed way to get the assets
- **Option A (recommended):** I generate these four pieces with AI image editing, using your side panel as the template so the framing matches, in the same watercolour style. I'll show them to you before building with them.
- **Option B:** your illustrator supplies them. I'll build everything now using the current pieces as stand-ins and swap them in when they arrive.
- The headlight glow, pole sway, window reflection and shadow can be done in code either way.

## Build order after approval
1. Create or swap in the assets and check alignment in a single still layout.
2. Rebuild the layered tram with independent parts: wheels, suspension bounce, body sway, pole, driver head turn, wave, headlight.
3. Rebuild the hero composition.
4. Add the scroll journey and the side space in each section.
5. Phone and reduced-motion versions, then check desktop and phone in the browser.
