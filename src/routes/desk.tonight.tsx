import { createFileRoute } from "@tanstack/react-router";
import { DeskPreview } from "@/features/desk/DeskPreview";
/** Live inquiries from tonight's concierge calls (in-app store), inside the Night Desk shell. */
export const Route = createFileRoute("/desk/tonight")({ ssr: false, component: DeskPreview });
