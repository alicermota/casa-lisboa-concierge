import { createFileRoute, Outlet } from "@tanstack/react-router";
import nightDeskCss from "@/features/desk/night/night-desk.css?url";
import { ThemeProvider } from "@/features/desk/night/theme-provider";
import { PresentationShell } from "@/features/desk/night/presentation-shell";

/** Night Desk: the dashboard team's UI (Martina & co.), mounted under /desk. Its stylesheet only loads here. */
export const Route = createFileRoute("/desk")({
  head: () => ({
    meta: [
      { title: "Night Desk · Casa Lisboa" },
      { name: "description", content: "Casa Lisboa's overnight guest inquiries, follow-ups and direct-booking results." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "stylesheet", href: nightDeskCss }],
  }),
  component: () => (
    <ThemeProvider>
      <PresentationShell>
        <Outlet />
      </PresentationShell>
    </ThemeProvider>
  ),
});
