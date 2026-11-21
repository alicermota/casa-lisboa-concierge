import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const AgentDebug = lazy(() => import("@/features/agent/AgentDebug").then((m) => ({ default: m.AgentDebug })));

export const Route = createFileRoute("/agent-debug")({
  head: () => ({
    meta: [
      { title: "Agent debug · Casa Lisboa" },
      { name: "description", content: "Test the Casa Lisboa voice concierge and watch its tools fire." },
      { property: "og:title", content: "Agent debug · Casa Lisboa" },
      { property: "og:description", content: "Test the Casa Lisboa voice concierge and watch its tools fire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <main className="min-h-screen bg-azul-soft px-6 py-10">
      <h1 className="mb-6 font-display text-3xl text-azul-deep">Agent debug</h1>
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <AgentDebug />
        </Suspense>
      </ClientOnly>
    </main>
  ),
});
