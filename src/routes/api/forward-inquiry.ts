/**
 * Forwards a confirmed voice inquiry to the dashboard team's Night Desk app (separate Lovable project).
 * Their intake: POST {NIGHT_DESK_URL}/api/public/inquiries, signed with HMAC-SHA256 of "<timestamp>.<body>".
 * Needs two secrets in THIS Lovable project: NIGHT_DESK_URL and NIGHT_DESK_WEBHOOK_SECRET (same value as theirs).
 * Without them it answers 503 and the site keeps working with its own Desk.
 */
import { createFileRoute } from "@tanstack/react-router";
import { createHmac } from "node:crypto";
import type { Inquiry, TranscriptLine } from "@/shared/types";
import { extraById, roomById } from "@/shared/hotel";

const LANG: Record<string, string> = { en: "English", pt: "Portuguese", es: "Spanish" };

function holidayType(i: Inquiry) {
  const o = (i.occasion ?? "").toLowerCase();
  if (o.includes("business")) return "business";
  if (i.mood === "celebration" || /anniv|honeymoon|birthday|romant/.test(o)) return "romantic";
  if (i.children > 0 || o.includes("family")) return "family";
  return "leisure";
}

function toNightDesk(i: Inquiry, transcript: TranscriptLine[], startedAt: number) {
  const start = new Date(startedAt || Date.now() - 4 * 60_000);
  const end = new Date();
  const extra = extraById(i.extra_id)?.name;
  const t0 = transcript[0]?.at ?? start.getTime();
  return {
    id: i.id,
    guest_name: i.guest_name.slice(0, 120) || "Guest",
    contact: i.contact.length >= 3 ? i.contact : "not given",
    check_in: i.check_in,
    check_out: i.check_out,
    recommended_room: roomById(i.room_id)?.name ?? "Classic Double",
    ...(extra ? { recommended_extra: extra, extras_interested: [extra] } : {}),
    call_started_at: start.toISOString(),
    call_ended_at: end.toISOString(),
    language: LANG[i.language] ?? i.language ?? "English",
    type_of_holiday: holidayType(i),
    ...(i.occasion ? { reason_for_stay: i.occasion } : {}),
    adults: Math.min(4, Math.max(1, i.adults || 1)),
    children: Math.min(3, Math.max(0, i.children || 0)),
    ...(i.arrival_time && /^([01]\d|2[0-3]):[0-5]\d$/.test(i.arrival_time) ? { arrival_time: i.arrival_time } : {}),
    priority: i.priority,
    hesitation_reason: i.hesitation === "none" ? "No hesitation" : `Hesitant about ${i.hesitation}`,
    win_back_action: i.next_step,
    next_step: i.next_step,
    summary: i.summary,
    transcript: transcript.slice(-500).map((l) => {
      const s = Math.max(0, Math.round((l.at - t0) / 1000));
      return {
        speaker: l.role === "agent" ? "Agent" : "Guest",
        text: l.text.slice(0, 5000),
        timestamp: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`,
      };
    }),
  };
}

export const Route = createFileRoute("/api/forward-inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env["NIGHT_DESK_URL"];
        const secret = process.env["NIGHT_DESK_WEBHOOK_SECRET"];
        if (!url || !secret) return Response.json({ forwarded: false, reason: "not configured" }, { status: 503 });
        try {
          const { inquiry, transcript, startedAt } = (await request.json()) as {
            inquiry: Inquiry;
            transcript: TranscriptLine[];
            startedAt: number;
          };
          const body = JSON.stringify(toNightDesk(inquiry, transcript ?? [], startedAt));
          const ts = String(Math.floor(Date.now() / 1000));
          const sig = createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
          const res = await fetch(`${url.replace(/\/$/, "")}/api/public/inquiries`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-night-desk-timestamp": ts, "x-night-desk-signature": sig },
            body,
          });
          const out = await res.text();
          return Response.json({ forwarded: res.ok, status: res.status, response: out.slice(0, 300) }, { status: res.ok ? 200 : 502 });
        } catch (e) {
          return Response.json({ forwarded: false, error: String(e).slice(0, 200) }, { status: 500 });
        }
      },
    },
  },
});
