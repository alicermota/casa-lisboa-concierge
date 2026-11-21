// DASHBOARD TEAM · the ONLY file the dashboard reads data from.
// Mock version (in memory). At merge time the main UI team replaces the inside of this file
// with the shared database version. Keep these 4 function names and signatures.
import type { Inquiry, InquiryInput, InquirySource } from "@/shared/types";
import { buildInquiry } from "@/shared/buildInquiry";
import { SAMPLE_INQUIRIES } from "@/features/desk/sampleInquiries";

let store: Inquiry[] = SAMPLE_INQUIRIES.map((s) => buildInquiry(s, "sample_data"));
const listeners = new Set<(i: Inquiry) => void>();

export async function getInquiries(): Promise<Inquiry[]> {
  return [...store].sort((a, b) => b.estimated_value_eur - a.estimated_value_eur);
}

export async function saveInquiry(input: InquiryInput, source: InquirySource = "live_voice"): Promise<Inquiry> {
  const inquiry = buildInquiry(input, source);
  store = [inquiry, ...store];
  listeners.forEach((fn) => fn(inquiry));
  return inquiry;
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]) {
  store = store.map((i) => (i.id === id ? { ...i, status } : i));
}

/** Calls onNew every time a new inquiry arrives. Returns an unsubscribe function. */
export function subscribeToNewInquiries(onNew: (i: Inquiry) => void) {
  listeners.add(onNew);
  return () => {
    listeners.delete(onNew);
  };
}
