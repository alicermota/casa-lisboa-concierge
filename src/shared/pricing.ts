// SHARED · tested (briefing example = €711). Do not edit without telling all teams.
import type { Quote, QuoteInput } from "@/shared/types";
import { HIGH_SEASON_MONTHS, HIGH_SEASON_MULTIPLIER, extraById, roomById } from "@/shared/hotel";

const DAY = 86_400_000;
const parse = (d: string) => new Date(`${d}T12:00:00Z`).getTime();

export function getQuote(input: QuoteInput): Quote {
  const room = roomById(input.room_id);
  if (!room) throw new Error(`Unknown room: ${input.room_id}`);

  const start = parse(input.check_in);
  const end = parse(input.check_out);
  const nightly: { date: string; rate: number }[] = [];

  // price every night separately, so stays crossing 31 Mar / 1 Apr are correct
  for (let t = start; t < end; t += DAY) {
    const d = new Date(t);
    const high = HIGH_SEASON_MONTHS.includes(d.getUTCMonth() + 1);
    nightly.push({
      date: d.toISOString().slice(0, 10),
      rate: Math.round(room.base_price * (high ? HIGH_SEASON_MULTIPLIER : 1)),
    });
  }

  const nights = nightly.length;
  const room_total = nightly.reduce((s, n) => s + n.rate, 0);

  const extra = extraById(input.extra_id);
  const qty = input.extra_qty ?? (extra?.per_day ? Math.max(nights, 1) : 1);
  const extra_total = extra ? extra.price * qty : 0;

  const highCount = nightly.filter((n) => n.rate !== room.base_price).length;
  const season = highCount === 0 ? "low" : highCount === nights ? "high" : "mixed";

  return { nights, nightly, room_total, extra_total, total: room_total + extra_total, season };
}

// Sanity check from the briefing: Superior Balcony 14–17 May + celebration = 3 × 222 + 45 = 711
