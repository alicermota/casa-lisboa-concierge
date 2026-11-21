import { createFileRoute } from "@tanstack/react-router";
import { DeskPreview } from "@/features/desk/DeskPreview";

export const Route = createFileRoute("/desk")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Night Desk · Casa Lisboa" },
      { name: "description", content: "The hotel team's morning view of overnight inquiries." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DeskPreview,
});
