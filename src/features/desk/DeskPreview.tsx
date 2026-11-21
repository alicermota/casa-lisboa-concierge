/**
 * TEMPORARY Night Desk so /desk and /demo work end to end today.
 * The dashboard team's <NightDesk /> replaces this at merge (same data.ts functions).
 */
import { useEffect, useState } from "react";
import type { Inquiry } from "@/shared/types";
import { roomById, extraById } from "@/shared/hotel";
import { getInquiries, subscribeToNewInquiries } from "./data";

const C = { bg: "#F7F4EC", card: "#FFFFFF", ink: "#0F1B3D", muted: "#0F1B3D99", cobalt: "#1F45B5", amber: "#E8A33D", teal: "#4FB3BF", rule: "#1F45B51f" };
const PRIO: Record<string, string> = { hot: C.amber, warm: C.cobalt, cold: "#94A3B8" };

export function DeskPreview() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [fresh, setFresh] = useState<string | null>(null);

  useEffect(() => {
    void getInquiries().then(setItems);
    return subscribeToNewInquiries((i) => {
      setItems((p) => [i, ...p].sort((a, b) => b.estimated_value_eur - a.estimated_value_eur));
      setFresh(i.id);
    });
  }, []);

  const total = items.reduce((s, i) => s + i.estimated_value_eur, 0);
  const hot = items.filter((i) => i.priority === "hot").length;

  return (
    <div className="min-h-full p-6 md:p-10" style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "Inter, sans-serif" }}>
      <p className="text-xs tracking-[0.3em]" style={{ color: C.cobalt }}>night desk.</p>
      <h1 className="mt-2 text-4xl font-light" style={{ fontFamily: "Fraunces, serif" }}>good morning. here's your night.</h1>

      <div className="mt-8 grid grid-cols-3 gap-4" style={{ fontVariantNumeric: "tabular-nums" }}>
        {[["inquiries", String(items.length)], ["potential value", `€${total.toLocaleString("en")}`], ["hot", String(hot)]].map(([l, v]) => (
          <div key={l} className="rounded-sm border p-4" style={{ borderColor: C.rule, backgroundColor: C.card }}>
            <p className="text-xs" style={{ color: C.muted }}>{l}</p>
            <p className="mt-1 text-3xl" style={{ fontFamily: "Fraunces, serif", color: l === "potential value" ? C.cobalt : C.ink }}>{v}</p>
          </div>
        ))}
      </div>

      <ul className="mt-8 space-y-3">
        {items.map((i) => (
          <li
            key={i.id}
            className={`rounded-sm border p-4 transition-all duration-700 ${i.id === fresh ? "az-label-in" : ""}`}
            style={{ borderColor: i.id === fresh ? C.teal : C.rule, backgroundColor: C.card, boxShadow: i.id === fresh ? `0 0 0 3px ${C.teal}33` : "none" }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-lg" style={{ fontFamily: "Fraunces, serif" }}>
                {i.guest_name}
                <span className="ml-2 text-xs uppercase" style={{ color: C.muted }}>{i.language}</span>
              </p>
              <p className="text-xl" style={{ fontFamily: "Fraunces, serif", color: C.cobalt, fontVariantNumeric: "tabular-nums" }}>€{i.estimated_value_eur}</p>
            </div>
            <p className="mt-1 text-sm" style={{ color: C.muted }}>
              {roomById(i.room_id)?.name}
              {i.extra_id ? ` + ${extraById(i.extra_id)?.name}` : ""} · {i.check_in} → {i.check_out}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${PRIO[i.priority]}22`, color: PRIO[i.priority] }}>{i.priority_reason}</span>
              <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${C.cobalt}11`, color: C.cobalt }}>hesitation: {i.hesitation}</span>
              <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: i.source === "live_voice" ? `${C.teal}22` : "#0000000d", color: i.source === "live_voice" ? "#2B8A95" : C.muted }}>
                {i.source === "live_voice" ? "Live Voice" : "Sample Data"}
              </span>
            </div>
            <p className="mt-3 text-sm">→ {i.next_step}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
