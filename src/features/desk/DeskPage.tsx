import { useState } from "react";
import { DeskPreview } from "./DeskPreview";
import { BACK_OFFICE_URL } from "./backOffice";

const C = { ink: "#0A0A0A", muted: "#0A0A0A99", cobalt: "#0B3BF0", rule: "#0A0A0A14", bg: "#F5F6FA" };
const display = { fontFamily: '"Clash Display", "DM Sans", sans-serif' } as const;

/** Staff area: tonight's live desk (fed by the concierge) + the full back office (dashboard team's app). */
export function DeskPage() {
  const [tab, setTab] = useState<"tonight" | "office">("office");
  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: C.bg, fontFamily: '"DM Sans", sans-serif', color: C.ink }}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-3" style={{ borderColor: C.rule }}>
        <div className="flex items-center gap-4">
          <a href="/?intro=0" className="text-xl" style={{ ...display, color: C.cobalt }}>
            casa lisboa.
          </a>
          <span className="text-sm" style={{ color: C.muted }}>hotel team</span>
        </div>
        <nav className="flex rounded-lg border p-1 text-sm" style={{ borderColor: C.rule }}>
          {([
            ["office", "back office"],
            ["tonight", "tonight · live"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="rounded-md px-4 py-1.5 transition-colors"
              style={{ backgroundColor: tab === id ? C.cobalt : "transparent", color: tab === id ? "#fff" : C.ink }}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <a href={BACK_OFFICE_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: C.muted }}>
            open in new tab ↗
          </a>
          <a href="/?intro=0" className="underline underline-offset-4" style={{ color: C.muted }}>
            ← site
          </a>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        {tab === "office" ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm" style={{ color: C.muted }}>
              <div>
                loading the back office…
                <br />
                if it stays blank,{" "}
                <a href={BACK_OFFICE_URL} target="_blank" rel="noreferrer" className="underline" style={{ color: C.cobalt }}>
                  open it in a new tab
                </a>
              </div>
            </div>
            <iframe title="Night Desk back office" src={BACK_OFFICE_URL} className="relative h-full w-full border-0 bg-transparent" allow="clipboard-write" />
          </>
        ) : (
          <div className="h-full overflow-y-auto">
            <DeskPreview />
          </div>
        )}
      </main>
    </div>
  );
}
