// AGENT TEAM · debug panel: proves the tools fire. Not for the demo.
import { useConcierge } from "@/features/agent/useConcierge";
import { ConciergeCall } from "@/features/agent/ConciergeCall";
import { ConciergeProvider } from "@/features/agent/ConciergeProvider";
import { useState } from "react";
import type { InquiryInput } from "@/shared/types";

export function AgentDebug() {
  return (
    <div className="grid items-start gap-8 xl:grid-cols-3">
      <div className="space-y-3">
        <Label>Main panel · live</Label>
        <ConciergeProvider>
          <MainPanel />
        </ConciergeProvider>
      </div>
      <DemoPanel title="Chat panel" panel="chat" />
      <DemoPanel title="Options panel" panel="options" />
    </div>
  );
}

function MainPanel() {
  const [inquiry, setInquiry] = useState<InquiryInput | null>(null);
  const c = useConcierge({
    onInquiry: (input) => {
      console.log("[save_inquiry]", input);
      setInquiry(input);
    },
  });
  return (
    <div className="space-y-4">
      <ConciergeCall c={c} />
      <Panel title={`Status: ${c.status}`}>
        <p>confirmed: {String(c.confirmed)}</p>
      </Panel>
      <Panel title={`events (${c.events.length})`}>
        {c.events.length === 0 ? <p className="opacity-60">none yet</p> : c.events.map((e, i) => <pre key={i}>{JSON.stringify(e)}</pre>)}
      </Panel>
      <Panel title="onInquiry">
        <pre className="whitespace-pre-wrap">{inquiry ? JSON.stringify(inquiry, null, 2) : "not called yet"}</pre>
      </Panel>
    </div>
  );
}

function DemoPanel({ title, panel }: { title: string; panel: "chat" | "options" }) {
  return (
    <div className="space-y-3">
      <Label>{title}</Label>
      <ConciergeProvider>
        <DemoCall panel={panel} />
      </ConciergeProvider>
    </div>
  );
}

function DemoCall({ panel }: { panel: "chat" | "options" }) {
  const c = useConcierge({ onInquiry: () => {} });
  return <ConciergeCall c={c} defaultPanel={panel} />;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azul">{children}</p>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-azul/15 bg-tile p-4 font-mono text-xs text-azul-deep">
      <p className="mb-2 font-sans text-sm font-semibold text-azul">{title}</p>
      {children}
    </div>
  );
}
