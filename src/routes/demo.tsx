import { createFileRoute } from "@tanstack/react-router";
import "@/features/guest/azulejo/azulejo.css";
import { TileDefs } from "@/features/guest/azulejo/Tile";
import { ConciergePanel } from "@/features/guest/azulejo/AzConcierge";
import { DeskPreview } from "@/features/desk/DeskPreview";

function Demo() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2" style={{ fontFamily: "Inter, sans-serif" }}>
      <TileDefs />
      <section className="overflow-y-auto p-6 md:p-10" style={{ backgroundColor: "#0A1433" }}>
        <p className="text-xs tracking-[0.3em]" style={{ color: "#DCE4F7aa" }}>guest · 03:10</p>
        <h1 className="mb-8 mt-2 text-3xl font-light" style={{ fontFamily: "Fraunces, serif", color: "#F7F4EC" }}>
          casa lisboa<span style={{ color: "#E8A33D" }}>.</span> concierge
        </h1>
        <ConciergePanel compact />
      </section>
      <section className="overflow-y-auto border-l" style={{ borderColor: "#1F45B51f" }}>
        <DeskPreview />
      </section>
    </div>
  );
}

export const Route = createFileRoute("/demo")({
  ssr: false,
  head: () => ({ meta: [{ title: "Demo · Casa Lisboa" }, { name: "robots", content: "noindex" }] }),
  component: Demo,
});
