import { createFileRoute } from "@tanstack/react-router";
import "@/features/guest/azulejo/azulejo.css";
import { TileDefs } from "@/features/guest/azulejo/Tile";
import { ConciergePanelSlot } from "@/features/guest/azulejo/AzConcierge";
import { DeskPreview } from "@/features/desk/DeskPreview";

function Demo() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <TileDefs />
      <section className="overflow-y-auto p-6 md:p-10" style={{ backgroundColor: "#001A73" }}>
        <p className="text-sm" style={{ color: "#DCE4F7aa" }}>guest · 03:10</p>
        <h1 className="mb-8 mt-2 text-3xl font-light" style={{ fontFamily: '"Clash Display", "DM Sans", sans-serif', color: "#FFFFFF" }}>
          casa lisboa<span style={{ color: "#F2A93B" }}>.</span> concierge
        </h1>
        <ConciergePanelSlot compact />
      </section>
      <section className="overflow-y-auto border-l" style={{ borderColor: "#0A0A0A14" }}>
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
