// SHARED · identical copy in every team. Do not edit without telling all teams.

export type RoomId = "classic_double" | "superior_balcony" | "family_suite" | "rooftop_suite";
export type ExtraId = "airport_transfer" | "celebration_package" | "late_checkout" | "bike_rental" | "baby_cot";

export type Mood = "exploratory" | "in_a_hurry" | "celebration" | "late_practical" | "local_curious";
export type Hesitation = "price" | "hour" | "area" | "view" | "timing" | "silence" | "none";
export type Priority = "hot" | "warm" | "cold";
export type InquiryStatus = "new" | "follow_up_ready" | "confirmed";
export type InquirySource = "live_voice" | "sample_data";

/** What the agent sends with save_inquiry (no computed fields). */
export interface InquiryInput {
  guest_name: string;
  contact: string; // fictional only
  language: string; // "en" | "pt" | "es" ...
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  adults: number;
  children: number;
  arrival_time?: string | undefined; // "23:00"
  occasion?: string | undefined;
  room_id: RoomId;
  extra_id?: ExtraId | undefined;
  mood: Mood;
  hesitation: Hesitation;
  summary: string;
}

/** A full row in Supabase table `inquiries`. */
export interface Inquiry extends InquiryInput {
  id: string;
  created_at: string;
  source: InquirySource;
  status: InquiryStatus;
  nights: number;
  // computed by the app, never by the agent
  estimated_value_eur: number;
  priority: Priority;
  priority_reason: string;
  next_step: string;
}

export interface QuoteInput {
  room_id: RoomId;
  check_in: string;
  check_out: string;
  extra_id?: ExtraId | undefined;
  extra_qty?: number | undefined;
}

export interface Quote {
  nights: number;
  nightly: { date: string; rate: number }[];
  room_total: number;
  extra_total: number;
  total: number;
  season: "low" | "high" | "mixed";
}

// Events the agent fires to make the screen react (show_on_screen tool)
export type ShowKind = "room" | "extra" | "dates" | "guests" | "price" | "confirmation";
export interface ShowEvent {
  kind: ShowKind;
  id?: string | undefined; // RoomId / ExtraId when relevant
  data?: string | undefined; // e.g. "2027-05-14 to 2027-05-17", "2 adults, 1 child"
  at: number; // Date.now()
}

export type ConciergeStatus = "idle" | "connecting" | "listening" | "speaking";
export interface TranscriptLine {
  role: "agent" | "guest";
  text: string;
  at: number;
}
