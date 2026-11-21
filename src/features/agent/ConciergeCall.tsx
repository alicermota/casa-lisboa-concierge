// AGENT TEAM · the call widget. Azulejo português theme (cobalt on tile white).
// Reusable: the guest UI team embeds <ConciergeCall c={c} /> anywhere inside a ConciergeProvider.
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square, Loader2, MessageCircle, Settings2, X, Copy, Check, Captions, Type } from "lucide-react";
import type { Concierge } from "@/features/agent/useConcierge";

type MicState = "unknown" | "granted" | "denied" | "prompt";
const BARS = [38, 62, 30, 88, 100, 54, 74, 42, 92, 66, 34, 80, 50, 70, 28];

export function ConciergeCall({ c, defaultPanel = "none" }: { c: Concierge; defaultPanel?: "none" | "chat" | "options" }) {
  const [mic, setMic] = useState<MicState>("unknown");
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<"none" | "chat" | "options">(defaultPanel);
  const showChat = panel === "chat";
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [captions, setCaptions] = useState(true);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const txt = c.transcript.map((l) => `${l.role === "guest" ? "You" : "Concierge"}: ${l.text}`).join("\n");
    await navigator.clipboard?.writeText(txt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const textSize = size === "sm" ? "text-[13px]" : size === "lg" ? "text-base" : "text-sm";
  const [secs, setSecs] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const live = c.status === "listening" || c.status === "speaking";
  const busy = live || c.status === "connecting";

  useEffect(() => {
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((p) => {
        setMic(p.state as MicState);
        p.onchange = () => setMic(p.state as MicState);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!live) return;
    setSecs(0);
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [live]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [c.transcript.length, showChat]);

  // useConcierge.start() swallows failures and falls back to "idle", so the widget
  // checks the mic itself and watches for a connecting → idle drop (= connection failed).
  const prevStatus = useRef(c.status);
  useEffect(() => {
    if (prevStatus.current === "connecting" && c.status === "idle") {
      setError("Could not connect. Please try again.");
    }
    prevStatus.current = c.status;
  }, [c.status]);

  const start = async () => {
    setError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMic("granted");
    } catch {
      setMic("denied");
      setError("Microphone blocked. Allow it in your browser to talk.");
      return;
    }
    await c.start();
  };

  const lastGuest = [...c.transcript].reverse().find((l) => l.role === "guest");
  const lastAgent = [...c.transcript].reverse().find((l) => l.role !== "guest");
  const timer = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const status =
    c.status === "connecting" ? "Connecting…" : c.status === "speaking" ? "Speaking" : c.status === "listening" ? "Listening" : "Ready?";

  return (
    <section
      aria-label="Voice concierge"
      className="azulejo-pattern relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-3 shadow-sm ring-1 ring-azul/15"
    >
      <div className="relative flex min-h-[640px] flex-col rounded-[1.4rem] bg-tile">
        {/* faint tile grid behind the content */}
        <div aria-hidden className="azulejo-pattern pointer-events-none absolute inset-0 rounded-[1.4rem] opacity-[0.07]" />
        {/* soft blue wash from the bottom */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-[1.4rem] bg-gradient-to-t from-azul-soft to-transparent transition-opacity duration-700 ${live ? "opacity-100" : "opacity-50"}`}
        />

        <header className="relative flex items-center justify-between px-6 pt-6">
          <span className="font-display text-lg text-azul-deep">Casa Lisboa</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-azul/70">Concierge</span>
        </header>

        {/* ---- center text ---- */}
        <div className="relative flex flex-1 flex-col items-center px-7 pt-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-azul/40 bg-tile px-3 py-1 text-xs font-medium text-azul">
            <Mic className="h-3 w-3" aria-hidden /> {live ? (c.status === "speaking" ? "Concierge speaking" : "Say anything!") : "Say anything!"}
          </span>

          {!captions ? (
            <p className="mt-6 font-display text-3xl leading-snug text-azul-deep">{busy ? "Listening…" : "Tap the mic to begin."}</p>
          ) : (
            <div className="mt-6 space-y-6" aria-live="polite">
              {lastGuest && <p className="font-display text-2xl leading-snug text-azul/45">{lastGuest.text}</p>}
              <p className="font-display text-3xl leading-snug text-azul-deep">
                {lastAgent?.text ?? (busy ? "Olá! I'm listening…" : "Say anything to your Lisbon concierge.")}
                {live && <span className="ml-0.5 inline-block h-7 w-0.5 translate-y-1 bg-azul motion-safe:animate-pulse" />}
              </p>
            </div>
          )}

          {error && <p role="alert" className="mt-6 rounded-full bg-destructive/10 px-4 py-1.5 text-sm text-destructive">{error}</p>}
          {c.confirmed && <p className="mt-6 rounded-full bg-azul/10 px-4 py-1.5 text-sm font-medium text-azul">Sent to the team — reply after 09:00 Lisbon time</p>}
        </div>

        {/* ---- vertical line bars ---- */}
        <div aria-hidden className="pointer-events-none absolute inset-x-8 bottom-28 flex h-48 items-end justify-between">
          {BARS.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%`, animationDelay: `${i * 90}ms`, animationDuration: c.status === "speaking" ? "0.7s" : "1.3s" }}
              className={`w-px bg-gradient-to-t from-azul to-azul/0 transition-opacity duration-500 ${live ? "opacity-90 motion-safe:animate-azul-bar" : "opacity-0"}`}
            />
          ))}
        </div>


        {panel !== "none" && (
          <div className="absolute inset-x-0 bottom-0 top-16 z-10 flex flex-col rounded-[1.4rem] border-t border-azul/15 bg-tile shadow-[0_-20px_40px_-20px_color-mix(in_oklab,var(--azul-deep)_40%,transparent)] motion-safe:animate-in motion-safe:slide-in-from-bottom-8">
            <div className="flex items-center justify-between px-6 pb-3 pt-4">
              <h3 className="font-display text-xl text-azul-deep">{panel === "chat" ? "Conversation" : "Options"}</h3>
              <div className="flex items-center gap-1">
                {panel === "chat" && c.transcript.length > 0 && (
                  <button type="button" onClick={copy} aria-label="Copy conversation" className="flex h-9 w-9 items-center justify-center rounded-full text-azul hover:bg-azul/10">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
                <button type="button" onClick={() => setPanel("none")} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-azul-deep hover:bg-azul/10">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {panel === "chat" ? (
              <div ref={scroller} aria-live="polite" aria-label="Conversation transcript" className="flex-1 space-y-4 overflow-y-auto px-5 pb-28">
                {c.transcript.length === 0 ? (
                  <div className="mt-10 text-center">
                    <p className="font-display text-lg text-azul-deep">No messages yet</p>
                    <p className="mt-1 text-sm text-azul-deep/60">Start talking and the conversation appears here.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {["Room for two in May?", "Is breakfast included?", "Airport transfer", "Late check-out"].map((t) => (
                        <span key={t} className="rounded-full border border-azul/25 px-3 py-1.5 text-xs text-azul">Try: "{t}"</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  c.transcript.map((l, i) => {
                    const guest = l.role === "guest";
                    return (
                      <div key={i} className={`flex items-end gap-2 ${guest ? "flex-row-reverse" : ""}`}>
                        {!guest && (
                          <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-azul text-tile">
                            <Mic className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <div className={`max-w-[78%] ${guest ? "text-right" : ""}`}>
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-azul/60">{guest ? "You" : "Concierge"}</p>
                          <p className={`rounded-2xl px-4 py-2.5 leading-relaxed ${textSize} ${guest ? "rounded-br-sm bg-azul text-tile" : "rounded-bl-sm border border-azul/20 bg-azul-soft/40 text-azul-deep"}`}>{l.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                {c.status === "speaking" && (
                  <div className="flex items-center gap-2" aria-label="Concierge is speaking">
                    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-azul text-tile">
                      <Mic className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex gap-1 rounded-2xl border border-azul/20 bg-azul-soft/40 px-4 py-3">
                      {[0, 150, 300].map((d) => <span key={d} style={{ animationDelay: `${d}ms` }} className="h-1.5 w-1.5 rounded-full bg-azul motion-safe:animate-bounce" />)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-28">
                <div className="rounded-2xl border border-azul/15 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-azul-deep"><Type className="h-4 w-4 text-azul" /> Message text size</p>
                  <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup">
                    {(["sm", "md", "lg"] as const).map((v) => (
                      <button key={v} type="button" role="radio" aria-checked={size === v} onClick={() => setSize(v)} className={`rounded-full py-2 text-sm transition ${size === v ? "bg-azul text-tile" : "border border-azul/20 text-azul-deep hover:bg-azul/5"}`}>
                        {v === "sm" ? "Small" : v === "md" ? "Medium" : "Large"}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="button" role="switch" aria-checked={captions} onClick={() => setCaptions((v) => !v)} className="flex w-full items-center justify-between rounded-2xl border border-azul/15 p-4 text-left">
                  <span className="flex items-center gap-2 text-sm font-medium text-azul-deep"><Captions className="h-4 w-4 text-azul" /> Live captions on main screen</span>
                  <span className={`relative h-6 w-11 rounded-full transition ${captions ? "bg-azul" : "bg-azul/20"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-tile shadow transition-all ${captions ? "left-[22px]" : "left-0.5"}`} />
                  </span>
                </button>
                <div className="flex items-center justify-between rounded-2xl border border-azul/15 p-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-azul-deep">{mic === "denied" ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4 text-azul" />} Microphone</span>
                  <span className={`text-xs ${mic === "denied" ? "text-destructive" : "text-azul-deep/60"}`}>{mic === "denied" ? "Blocked in browser" : mic === "granted" ? "Allowed" : "Asked on first call"}</span>
                </div>
                <div className="rounded-2xl bg-azul-soft/40 p-4 text-xs leading-relaxed text-azul-deep/80">
                  Your concierge can quote prices, recommend a room and save your booking request. The team confirms availability after 09:00 Lisbon time.
                </div>
              </div>
            )}
          </div>
        )}
        {/* ---- controls ---- */}
        <div className="relative z-20 flex items-end justify-between px-6 pb-6">
          <button
            type="button"
            onClick={() => setPanel((v) => (v === "chat" ? "none" : "chat"))}
            aria-pressed={showChat}
            aria-label="Show transcript"
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-azul/15 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul ${showChat ? "bg-azul text-tile" : "bg-tile text-azul-deep"}`}
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
          </button>

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={busy ? () => c.end() : start}
              aria-label={busy ? "End call" : "Talk to the concierge"}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-tile shadow-[0_12px_30px_-8px_color-mix(in_oklab,var(--azul)_45%,transparent)] ring-1 ring-azul/15 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul ${c.status === "speaking" ? "scale-105" : ""}`}
            >
              {live && <span aria-hidden className="absolute inset-0 rounded-full border-2 border-azul/40 motion-safe:animate-ping" />}
              {c.status === "connecting" ? (
                <Loader2 className="h-7 w-7 animate-spin text-azul" aria-hidden />
              ) : live ? (
                <Square className="h-6 w-6 text-azul" aria-hidden />
              ) : mic === "denied" ? (
                <MicOff className="h-7 w-7 text-azul/60" aria-hidden />
              ) : (
                <Mic className="h-7 w-7 text-azul" aria-hidden />
              )}
            </button>
            <span role="status" className="text-xs font-medium tabular-nums text-azul-deep/80">
              {live ? timer : status}
            </span>
          </div>

          <button
            type="button"
            aria-label="Options"
            aria-pressed={panel === "options"}
            onClick={() => setPanel((v) => (v === "options" ? "none" : "options"))}
            title={mic === "denied" ? "Microphone is blocked in your browser settings." : mic === "granted" ? "Microphone ready." : "We'll ask to use your microphone."}
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-azul/15 shadow-sm transition ${panel === "options" ? "bg-azul text-tile" : "bg-tile text-azul-deep"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul`}
          >
            <Settings2 className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
