// SHARED · turns what the agent collected into a full inquiry (value, priority, next step).
import type { Inquiry, InquiryInput, InquirySource } from "@/shared/types";
import { getQuote } from "@/shared/pricing";
import { computePriority, nextStep } from "@/shared/priority";

export function buildInquiry(input: InquiryInput, source: InquirySource): Inquiry {
  const q = getQuote({ room_id: input.room_id, check_in: input.check_in, check_out: input.check_out, extra_id: input.extra_id });
  const { priority, priority_reason } = computePriority({
    estimated_value_eur: q.total,
    check_in: input.check_in,
    occasion: input.occasion,
  });
  return {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    source,
    status: "new",
    nights: q.nights,
    estimated_value_eur: q.total,
    priority,
    priority_reason,
    next_step: nextStep(input.hesitation, input.arrival_time),
  };
}
