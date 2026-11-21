import { createFileRoute } from "@tanstack/react-router";
import { OverviewPresentation } from "@/features/desk/night/presentation-views";
export const Route = createFileRoute("/desk/")({ component: OverviewPresentation });
