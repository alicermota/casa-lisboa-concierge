// DASHBOARD TEAM · fictional guests, real prices. Shown with a "Sample Data" label.
import type { InquiryInput } from "@/shared/types";

export const SAMPLE_INQUIRIES: InquiryInput[] = [
  {
    guest_name: "Daniel & Sofia Reyes", contact: "daniel.reyes@example.com", language: "en",
    check_in: "2027-05-14", check_out: "2027-05-17", adults: 2, children: 0, arrival_time: "16:00",
    occasion: "Anniversary", room_id: "superior_balcony", extra_id: "celebration_package",
    mood: "celebration", hesitation: "view",
    summary: "Anniversary trip from New York, wants a balcony and a little surprise.",
  },
  {
    guest_name: "Família Costa", contact: "+351 900 000 001", language: "pt",
    check_in: "2026-12-27", check_out: "2026-12-30", adults: 2, children: 2, arrival_time: "13:00",
    occasion: "Family holiday", room_id: "family_suite", extra_id: "airport_transfer",
    mood: "exploratory", hesitation: "price",
    summary: "Family of four with a baby, needs a cot and an airport transfer.",
  },
  {
    guest_name: "Henrik Lindqvist", contact: "henrik.l@example.com", language: "en",
    check_in: "2026-11-24", check_out: "2026-11-25", adults: 1, children: 0, arrival_time: "23:30",
    occasion: "Business", room_id: "classic_double", extra_id: "airport_transfer",
    mood: "late_practical", hesitation: "timing",
    summary: "Lands at 23:00, needs a desk, fast Wi-Fi and an invoice.",
  },
  {
    guest_name: "Lucía Martín", contact: "lucia.m@example.com", language: "es",
    check_in: "2027-01-10", check_out: "2027-01-13", adults: 2, children: 0,
    room_id: "classic_double", extra_id: "bike_rental",
    mood: "local_curious", hesitation: "area",
    summary: "Wants to explore the city by bike, unsure which neighbourhood suits her.",
  },
  {
    guest_name: "Tom Becker", contact: "tom.becker@example.com", language: "en",
    check_in: "2027-03-30", check_out: "2027-04-02", adults: 2, children: 0,
    room_id: "superior_balcony",
    mood: "exploratory", hesitation: "silence",
    summary: "Asked about balcony rooms over Easter, went quiet at the price.",
  },
];

