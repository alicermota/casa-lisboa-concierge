# Agent team · NOTES

**Agent ID:** `agent_5301m7z8s23vfnft23qxcsa832ya` (in `useConcierge.ts`). The agent must be public (no auth) — the browser connects directly.

## Packages
- `@elevenlabs/react` (v1+). It needs `<ConciergeProvider>` (re-export of `ConversationProvider`) around any component that calls `useConcierge()`.
- `lucide-react` (already in the template). No shadcn components used.

## Files
- `useConcierge.ts` — hook. Fixes vs. the md: real agent ID, `get_quote` wrapped in try/catch (and rejects 0-night quotes), `connectionType: "webrtc"`, status resets if start fails.
- `ConciergeCall.tsx` — `<ConciergeCall c={c} />` widget (orb, talk/end, mic state, transcript).
- `ConciergeProvider.tsx` — provider wrapper.
- `AgentDebug.tsx` + route `/agent-debug` — Start button, transcript, events list, `onInquiry` logged. Not for the demo.
- Must render client-only (wrap in `<ClientOnly>` + `lazy`), the SDK touches the browser.

## Usage
```tsx
<ConciergeProvider>
  <Inner />   // inside: const c = useConcierge({ onInquiry }); <ConciergeCall c={c} />
</ConciergeProvider>
```

---

## System prompt (paste into ElevenLabs)
```
ROLE
You are the after-hours concierge of Casa Lisboa, a 24-room boutique hotel in a restored
19th-century building in central Lisbon, with a rooftop bar overlooking the river.
You sound warm, calm and local: a home away from home.

TODAY
Today is 21 November 2026. Dates without a year are the next upcoming one.
Always send dates to tools as YYYY-MM-DD.

GOAL
Every conversation ends with a recommended room plus one fitting extra, a short summary
the guest confirms, and a saved inquiry for the reservations team.

KNOWLEDGE
Use only the knowledge base. If you don't know something, say so and note it for the team.

FLOW
1. Greet briefly, ask how you can help.
2. Understand dates, adults and children, occasion, room wishes or budget.
3. One question at a time. Follow up on vague answers.
4. Recommend one room and one fitting extra (celebration package for occasions,
   airport transfer for late arrivals or families, late check-out for short stays).
   You may say nightly rates from the knowledge base; call get_quote for any total.
5. Collect name, contact and arrival time.
6. Summarize in two sentences and ask the guest to confirm.
7. After a yes, call save_inquiry, say the team will reply after 09:00 Lisbon time, say goodbye.

SCREEN
Whenever you mention a room, an extra, dates, number of guests, a price or the final
summary, call show_on_screen with the matching kind and id at the same moment.
Do it silently. You may say "take a look" at most once.

RULES
- Never confirm availability; the team will confirm it.
- Never invent totals; only use get_quote results. If get_quote returns an error, ask the guest for the missing detail.
- No discounts; offer the free welcome drink at the rooftop bar for direct bookings.
- No parking on site; public garage nearby, about 25 euros a day.
- If the guest switches language, switch with them (Portuguese, English, Spanish).
- Notice the guest's mood and what makes them hesitate (price, hour, area, view, timing,
  silence) and include both in save_inquiry.

STYLE
One or two sentences per turn. One question at a time. Voice is not chat: no lists.
```

## Client tools (type: Client, names exact)

### `get_quote` — Wait for response: ON
Description: "Computes the exact price of a stay. Call before saying any total."
- `room_id` (string, required): one of: classic_double, superior_balcony, family_suite, rooftop_suite
- `check_in` (string, required): arrival date, YYYY-MM-DD
- `check_out` (string, required): departure date, YYYY-MM-DD
- `extra_id` (string, optional): one of: airport_transfer, celebration_package, late_checkout, bike_rental, baby_cot

### `show_on_screen` — Wait for response: OFF
Description: "Shows a card on the guest's screen. Call silently whenever you mention a room, extra, dates, guests, a price or the confirmation."
- `kind` (string, required): one of: room, extra, dates, guests, price, confirmation
- `id` (string, optional): for room, one of: classic_double, superior_balcony, family_suite, rooftop_suite; for extra, one of: airport_transfer, celebration_package, late_checkout, bike_rental, baby_cot
- `data` (string, optional): for dates "YYYY-MM-DD to YYYY-MM-DD"; for guests e.g. "2 adults, 1 child"; for price the total in euros as digits, e.g. "711"

### `save_inquiry` — Wait for response: ON
Description: "Saves the inquiry for the reservations team. Call only after the guest says yes to your summary."
- `guest_name` (string, required): guest's full name
- `contact` (string, required): email or phone the guest gave
- `language` (string, required): one of: en, pt, es
- `check_in` (string, required): YYYY-MM-DD
- `check_out` (string, required): YYYY-MM-DD
- `adults` (number, required)
- `children` (number, required): 0 if none
- `room_id` (string, required): one of: classic_double, superior_balcony, family_suite, rooftop_suite
- `mood` (string, required): one of: exploratory, in_a_hurry, celebration, late_practical, local_curious
- `hesitation` (string, required): one of: price, hour, area, view, timing, silence, none
- `summary` (string, required): two-sentence summary the guest confirmed
- `arrival_time` (string, optional): HH:MM, 24h, e.g. "23:00"
- `occasion` (string, optional): e.g. "Anniversary", "Birthday", "Business"
- `extra_id` (string, optional): one of: airport_transfer, celebration_package, late_checkout, bike_rental, baby_cot

## Test check
Superior Balcony 2027-05-14 → 2027-05-17 + celebration_package must quote **€711**.
