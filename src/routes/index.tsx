import { createFileRoute } from "@tanstack/react-router";
import { GuestPage } from "@/features/guest/GuestPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Casa Lisboa — Boutique hotel in central Lisbon" },
      { name: "description", content: "Lisbon never closes. Neither do we. Talk to our concierge at any hour." },
      { property: "og:title", content: "Casa Lisboa — Boutique hotel in central Lisbon" },
      { property: "og:description", content: "Lisbon never closes. Neither do we. Talk to our concierge at any hour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuestPage,
});
