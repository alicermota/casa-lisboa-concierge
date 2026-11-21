# Casa Lisboa — Step 1: guest page skeleton

Only the guest page skeleton at `/`. No database, backend, login, payments, dashboard, agent or animations.

## What you'll see
1. **Hero (full screen)** — the eléctrico illustration edge to edge, a soft plum gradient at the bottom so the text stays readable, and a subtle grain texture (hero only). "Casa Lisboa" in large Fraunces, "Lisbon never closes. Neither do we." below it, and an amber button "Talk to us, even at 3am" that smoothly scrolls down to the concierge section.
2. **Concierge section** (`id="concierge"`) — two columns on desktop, stacked on mobile:
   - Left: "Concierge call" placeholder card (paper card, rounded, dashed hint for where the call widget will go).
   - Right: "Your stay" area with the empty state "Your stay will take shape here."
3. **Footer** — "Illustration by [artist], used with permission · Fictional hotel, hackathon prototype".

## Illustration
No image came with this message (only the context file). Until you upload it, the hero shows a warm plum-to-amber placeholder gradient; when the image arrives it's uploaded to the CDN and swapped in.

## Style
Background #F4E6D0, cards #FBF6EE, text #2A1A24, primary #5B2A3E, accent #F5A524. Fraunces for headings, Inter for text. rounded-2xl, generous spacing.

## Technical details
- All code in `src/features/guest/` (`GuestPage.tsx`, `theme.ts`, `NOTES.md`), mounted from `src/routes/index.tsx`, per the merge rules (no reliance on global CSS for theming; hex values kept in the feature's theme file).
- Fonts loaded via `<link>` in `__root.tsx`; replace placeholder "Lovable App" metadata; index gets its own head().
- Smooth scroll via `scrollIntoView({ behavior: "smooth" })`.
- Grain: inline SVG noise as a low-opacity overlay on the hero.
