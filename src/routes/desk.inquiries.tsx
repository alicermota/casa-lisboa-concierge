import { createFileRoute } from "@tanstack/react-router";
import { InquiriesPresentation } from "@/features/desk/night/presentation-views";
export const Route = createFileRoute("/desk/inquiries")({ component: InquiriesPresentation });
