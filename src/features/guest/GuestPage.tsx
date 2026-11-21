import { guestTheme as t } from "./theme";

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// Placeholder until the eléctrico illustration is uploaded.
const HERO_IMAGE: string | null = null;

export function GuestPage() {
  const scrollToConcierge = () =>
    document.getElementById("concierge")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ backgroundColor: t.bg, color: t.ink, fontFamily: "Inter, sans-serif" }}>
      <section
        className="relative flex min-h-screen items-end overflow-hidden"
        style={{
          background: HERO_IMAGE
            ? `center / cover no-repeat url(${HERO_IMAGE})`
            : `linear-gradient(160deg, ${t.amber} 0%, ${t.sunset} 35%, ${t.plum} 75%, ${t.plumDeep} 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(to top, ${t.plumDeep}e6 0%, ${t.plumDeep}66 40%, transparent 75%)` }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" style={{ backgroundImage: grain }} />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
          <h1
            className="text-6xl leading-none tracking-tight md:text-8xl lg:text-9xl"
            style={{ fontFamily: "Fraunces, serif", color: t.card, fontWeight: 500 }}
          >
            Casa Lisboa
          </h1>
          <p className="mt-6 max-w-xl text-xl md:text-2xl" style={{ color: t.card, opacity: 0.9 }}>
            Lisbon never closes. Neither do we.
          </p>
          <button
            onClick={scrollToConcierge}
            className="mt-10 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: t.amber, color: t.plumDeep }}
          >
            Talk to us, even at 3am
          </button>
        </div>
      </section>

      <section id="concierge" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-24 md:px-12 md:py-32">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl p-10 shadow-sm" style={{ backgroundColor: t.card }}>
            <h2 className="text-3xl" style={{ fontFamily: "Fraunces, serif", color: t.plum }}>
              Concierge call
            </h2>
            <div
              className="mt-8 flex min-h-[320px] items-center justify-center rounded-2xl border-2 border-dashed text-sm"
              style={{ borderColor: `${t.plum}33`, color: `${t.ink}99` }}
            >
              The call will live here.
            </div>
          </div>
          <div className="rounded-2xl p-10" style={{ backgroundColor: `${t.card}99` }}>
            <h2 className="text-3xl" style={{ fontFamily: "Fraunces, serif", color: t.plum }}>
              Your stay
            </h2>
            <div className="mt-8 flex min-h-[320px] items-center justify-center text-center">
              <p className="text-lg italic" style={{ fontFamily: "Fraunces, serif", color: `${t.ink}aa` }}>
                Your stay will take shape here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm" style={{ color: `${t.ink}99` }}>
        Illustration by [artist], used with permission · Fictional hotel, hackathon prototype
      </footer>
    </div>
  );
}
