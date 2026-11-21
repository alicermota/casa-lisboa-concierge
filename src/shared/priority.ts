// SHARED · the dashboard team may tune the rules, then tells everyone.
import type { Hesitation, Priority } from "@/shared/types";

const SPECIAL = /anniv|birthday|honeymoon|proposal|wedding|aniver|lua de mel|cumple/i;

export function computePriority(
  input: { estimated_value_eur: number; check_in: string; occasion?: string | undefined },
  now = new Date(),
): { priority: Priority; priority_reason: string } {
  const days = Math.ceil((new Date(`${input.check_in}T12:00:00Z`).getTime() - now.getTime()) / 86_400_000);
  const special = SPECIAL.test(input.occasion ?? "");
  const value = input.estimated_value_eur;

  const reasons: string[] = [];
  if (special && input.occasion) reasons.push(input.occasion.toLowerCase());
  reasons.push(`€${value}`);
  reasons.push(days <= 0 ? "arriving now" : `arrives in ${days} day${days === 1 ? "" : "s"}`);

  let priority: Priority = "cold";
  if (special || value >= 700 || days <= 14) priority = "hot";
  else if (value >= 300 || days <= 60) priority = "warm";

  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  return { priority, priority_reason: `${label}: ${reasons.join(" + ")}` };
}

export function nextStep(hesitation: Hesitation, arrival_time?: string | undefined): string {
  switch (hesitation) {
    case "price":
      return "Call back by 10:00, lead with the free welcome drink and free cancellation";
    case "area":
      return "Send a short note on the neighbourhood and walking times";
    case "view":
      return "Send photos of the balcony and rooftop view";
    case "timing":
    case "hour":
      return "Confirm late check-in with the night porter, reply by 10:00";
    case "silence":
      return "Send a warm follow-up email with the quote by 10:00";
  }
  const hour = arrival_time ? parseInt(arrival_time.slice(0, 2), 10) : NaN;
  if (!Number.isNaN(hour) && (hour >= 22 || hour < 6)) return "Confirm late check-in with the night porter";
  return "Confirm availability and reply by 10:00";
}
