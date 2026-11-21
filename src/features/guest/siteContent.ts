// Guest-page marketing copy. Prices are Nov–Mar "from" rates per night, breakfast + Wi-Fi included.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;

export const ROOMS_DISPLAY = [
  { name: "Classic Double", size: 18, feature: "City view", from: 140, image: "/art/rooms/classic_double.jpg" },
  { name: "Superior Balcony", size: 24, feature: "Private balcony", from: 185, image: "/art/rooms/superior_balcony.jpg" },
  { name: "Family Suite", size: 38, feature: "Up to 4 guests", from: 260, image: "/art/rooms/family_suite.jpg" },
  { name: "Rooftop Suite", size: 45, feature: "Terrace and river view", from: 340, image: "/art/rooms/rooftop_suite.jpg" },
] as const;

export const ROOFTOP_IMAGE = `https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=75`;

export const EXTRAS_DISPLAY = [
  { name: "Celebration package", note: "Portuguese sparkling wine and flowers", price: "€45", icon: "Wine" },
  { name: "Airport transfer", note: "One way, 20–25 min", price: "€35", icon: "Car" },
  { name: "Late check-out", note: "Until 14:00, if available", price: "€30", icon: "Clock" },
  { name: "Bike rental", note: "Explore the hills", price: "€15 / day", icon: "Bike" },
  { name: "Baby cot", note: "On request", price: "Free", icon: "Baby" },
] as const;

export const GOOD_TO_KNOW = [
  { label: "Check-in", value: "from 15:00", icon: "KeyRound" },
  { label: "Check-out", value: "until 11:00", icon: "DoorOpen" },
  { label: "Breakfast", value: "07:30–10:30", icon: "Coffee" },
  { label: "Free cancellation", value: "up to 48 h before arrival", icon: "CalendarCheck" },
  { label: "Parking", value: "No on-site parking · public garage nearby (~€25/day)", icon: "ParkingSquare" },
  { label: "Night porter", value: "On site all night", icon: "Moon" },
] as const;
