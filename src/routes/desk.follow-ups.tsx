import { createFileRoute } from "@tanstack/react-router";
import { FollowUpsPresentation } from "@/features/desk/night/presentation-views";
export const Route = createFileRoute("/desk/follow-ups")({
  validateSearch: (search: Record<string, unknown>): { call?: string } => (typeof search["call"] === "string" ? { call: search["call"] } : {}),
  component: FollowUpsPage,
});
function FollowUpsPage() {
  const { call } = Route.useSearch();
  return <FollowUpsPresentation selectedCall={call ?? ""} />;
}
