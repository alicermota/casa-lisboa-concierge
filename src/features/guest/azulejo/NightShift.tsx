import { useEffect, useState } from "react";
import { az, display } from "./palette";
import { useInView } from "./Motion";
import { Tile, pat } from "./Tile";

/** Live Lisbon time, ticking. */
function useLisbonTime() {
  const [t, setT] = useState<string>("03:10");
  useEffect(() => {
    const fmt = () =>
      setT(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" }).format(new Date()));
    fmt();
    const id = setInterval(fmt, 15_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** Blue takeover with the live Lisbon clock: the moment the page turns to night. */
export function NightShift() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const time = useLisbonTime();
  const hour = Number(time.slice(0, 2));
  const closed = hour >= 18 || hour < 9;
  return (
    <section ref={ref} className="relative flex min-h-[60svh] items-center justify-center overflow-hidden py-20" style={{ backgroundColor: az.cobalt }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute h-24 w-24 md:h-36 md:w-36"
          style={{
            left: i % 2 ? undefined : `${[-2, 6][i / 2]}%`,
            right: i % 2 ? `${[-3, 5][(i - 1) / 2]}%` : undefined,
            top: `${[10, 18, 62, 58][i]}%`,
            transition: "all 1400ms cubic-bezier(0.2,0.8,0.2,1)",
            transitionDelay: `${i * 100}ms`,
            transform: inView ? `rotate(${(i - 1.5) * 8}deg)` : `translateY(60px) rotate(${(i - 1.5) * 20}deg)`,
            opacity: inView ? 0.9 : 0,
          }}
        >
          <Tile pattern={pat(i + 2)} className="h-full w-full rounded-sm" />
        </div>
      ))}
      <div className="relative z-10 text-center" style={{ color: "#fff" }}>
        <p className="text-sm" style={{ opacity: inView ? 0.8 : 0, transition: "opacity 800ms" }}>lisboa, right now</p>
        <p
          className="mt-2 text-8xl leading-none md:text-[11rem]"
          style={{ ...display, fontWeight: 600, fontVariantNumeric: "tabular-nums", transition: "all 1000ms cubic-bezier(0.2,0.8,0.2,1)", opacity: inView ? 1 : 0, filter: inView ? "none" : "blur(12px)" }}
        >
          {time}
        </p>
        <p className="mt-4 text-lg md:text-2xl" style={{ ...display, opacity: inView ? 1 : 0, transition: "opacity 900ms 300ms" }}>
          {closed ? (
            <>reception's asleep. <em>we're not.</em></>
          ) : (
            <>reception closes at 18:00. <em>we don't.</em></>
          )}
        </p>
      </div>
    </section>
  );
}
