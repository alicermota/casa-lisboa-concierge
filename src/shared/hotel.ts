// SHARED · identical copy in every team. Do not edit without telling all teams.
import type { ExtraId, RoomId } from "@/shared/types";

export const HIGH_SEASON_MONTHS = [4, 5, 6, 7, 8, 9, 10]; // Apr–Oct
export const HIGH_SEASON_MULTIPLIER = 1.2;

export interface Room {
  id: RoomId;
  name: string;
  size_m2: number;
  base_price: number; // per night, Nov–Mar, breakfast + Wi-Fi included
  max_guests: number;
  feature: string;
  image: string; // put the file in public/art/rooms/
}

export const ROOMS: Room[] = [
  { id: "classic_double", name: "Classic Double", size_m2: 18, base_price: 140, max_guests: 2, feature: "City view", image: "/art/rooms/classic_double.jpg" },
  { id: "superior_balcony", name: "Superior Balcony", size_m2: 24, base_price: 185, max_guests: 2, feature: "Private balcony", image: "/art/rooms/superior_balcony.jpg" },
  { id: "family_suite", name: "Family Suite", size_m2: 38, base_price: 260, max_guests: 4, feature: "Up to 4 guests", image: "/art/rooms/family_suite.jpg" },
  { id: "rooftop_suite", name: "Rooftop Suite", size_m2: 45, base_price: 340, max_guests: 2, feature: "Terrace, river view", image: "/art/rooms/rooftop_suite.jpg" },
];

export interface Extra {
  id: ExtraId;
  name: string;
  price: number;
  per_day?: boolean;
  note?: string;
  icon: string; // lucide-react icon name
}

export const EXTRAS: Extra[] = [
  { id: "airport_transfer", name: "Airport transfer", price: 35, note: "One way, 20–25 min", icon: "Car" },
  { id: "celebration_package", name: "Celebration package", price: 45, note: "Portuguese sparkling wine and flowers", icon: "Wine" },
  { id: "late_checkout", name: "Late check-out", price: 30, note: "Until 14:00, if available", icon: "Clock" },
  { id: "bike_rental", name: "Bike rental", price: 15, per_day: true, note: "Per day", icon: "Bike" },
  { id: "baby_cot", name: "Baby cot", price: 0, note: "On request", icon: "Baby" },
];

export const DIRECT_BOOKING_PERK = "Free welcome drink at the rooftop bar";

export const HOTEL = {
  name: "Casa Lisboa",
  rooms: 24,
  checkIn: "15:00",
  checkOut: "11:00",
  breakfast: "07:30–10:30",
  rooftopBar: "17:00–24:00",
  cancellation: "Free up to 48 h before arrival",
  parking: "No parking on site; public garage nearby, about €25 a day",
  reservationsHours: "09:00–18:00 Lisbon time; night porter on site",
};

export const roomById = (id?: string) => ROOMS.find((r) => r.id === id);
export const extraById = (id?: string) => EXTRAS.find((e) => e.id === id);
