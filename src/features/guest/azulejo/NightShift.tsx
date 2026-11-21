import { az, display } from "./palette";
import { useInView } from "./Motion";
import { Tile, pat } from "./Tile";

/** Full-screen electric blue takeover before the concierge (tile.pt "meet tile." moment). */
export function NightShift() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  return (
    <section ref={ref} className="relative flex min-h-[90svh] items-center justify-center overflow-hidden" style={{ backgroundColor: az.cobalt }}>
      {/* white ink tiles drifting at the edges */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute h-32 w-32 opacity-90 transition-all duration-[1400ms] md:h-44 md:w-44"
          style={{
            left: i % 2 ? undefined : `${[-3, 8, 2][i / 2]}%`,
            right: i % 2 ? `${[-4, 6, 1][(i - 1) / 2]}%` : undefined,
            top: `${[8, 14, 42, 48, 72, 76][i]}%`,
            transform: inView ? `rotate(${(i - 2.5) * 6}deg)` : `translateY(80px) rotate(${(i - 2.5) * 18}deg)`,
            opacity: inView ? 0.9 : 0,
            transitionDelay: `${i * 90}ms`,
          }}
        >
          <Tile pattern={pat(i + 2)} color={az.cobalt} className="h-full w-full rounded-sm" />
        </div>
      ))}
      <div className="relative z-10 text-center" style={{ color: "#fff" }}>
        <p className="text-sm opacity-80" style={{ transition: "opacity 800ms", opacity: inView ? 0.8 : 0 }}>
          after 18:00, reservations closes. we don't.
        </p>
        <h2
          className="mt-4 text-7xl leading-none md:text-[10rem]"
          style={{ ...display, fontWeight: 600, transition: "all 1000ms cubic-bezier(0.2,0.8,0.2,1)", opacity: inView ? 1 : 0, transform: inView ? "none" : "scale(0.9)", filter: inView ? "none" : "blur(12px)" }}
        >
          the <em>night</em> shift.
        </h2>
      </div>
    </section>
  );
}
