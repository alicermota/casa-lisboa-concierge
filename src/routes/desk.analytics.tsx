import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPresentation } from "@/features/desk/night/presentation-views";
export const Route = createFileRoute("/desk/analytics")({ component: AnalyticsPresentation });
