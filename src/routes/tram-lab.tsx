import { createFileRoute } from "@tanstack/react-router";
import { TramLab } from "@/features/guest/tram3d/TramLab";

export const Route = createFileRoute("/tram-lab")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Tram Lab · Casa Lisboa" },
      { name: "description", content: "Prototype 3D Lisbon tram for the Casa Lisboa website." },
      { property: "og:title", content: "Tram Lab · Casa Lisboa" },
      { property: "og:description", content: "Prototype 3D Lisbon tram for the Casa Lisboa website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TramLab,
});
