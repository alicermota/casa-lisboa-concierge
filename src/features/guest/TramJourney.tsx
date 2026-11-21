import { useEffect, useRef } from "react";
import heroAsset from "@/assets/electrico-hero.png.asset.json";
import streetAsset from "@/assets/lisbon-street.png.asset.json";
import { guestTheme as t } from "./theme";


export function TramJourney() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const mobile = window.innerWidth < 768;
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: mobile ? "+=120%" : "+=250%", scrub: 0.8, pin: true },
        });
        tl.to("[data-layer=far]", { xPercent: -15, ease: "none" }, 0)
          .to("[data-layer=mid]", { xPercent: -35, ease: "none" }, 0)
          .to("[data-layer=near]", { xPercent: -80, ease: "none" }, 0)
          .fromTo("[data-layer=tram]", { x: "-30vw" }, { x: "70vw", ease: "none" }, 0)
          .to("[data-layer=tram]", { y: -6, repeat: 9, yoyo: true, ease: "sine.inOut", duration: 0.1 }, 0);
      }, root);
    })();
    return () => { cancelled = true; ctx?.revert(); };
  }, []);

  return (
    <section ref={root} aria-label="A tram journey through Lisbon" className="relative h-screen overflow-hidden" style={{ backgroundColor: t.plumDeep }}>
      <div data-layer="far" className="absolute inset-y-0 left-0 w-[130%] opacity-70"
        style={{ background: `center / cover url(${streetAsset.url})`, filter: "blur(2px) saturate(1.1)" }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${t.sunset}33, ${t.plumDeep}aa)` }} />
      <div data-layer="mid" className="absolute bottom-0 left-0 h-2/3 w-[160%] hidden md:block"
        style={{ background: `left bottom / auto 100% repeat-x url(${streetAsset.url})`, maskImage: "linear-gradient(to top, black 60%, transparent)", opacity: 0.85 }} />
      {/* cables */}
      <svg data-layer="near" aria-hidden className="absolute left-0 top-[18%] h-24 w-[300%]" preserveAspectRatio="none" viewBox="0 0 300 20">
        <path d="M0 4 Q75 14 150 4 T300 4" stroke={t.ink} strokeWidth="0.4" fill="none" />
        <path d="M0 9 Q75 19 150 9 T300 9" stroke={t.ink} strokeWidth="0.3" fill="none" />
      </svg>
      {/* tracks */}
      <div className="absolute bottom-[10%] left-0 right-0 h-1.5" style={{ backgroundColor: t.ink }} />
      <div className="absolute bottom-[8%] left-0 right-0 h-1.5" style={{ backgroundColor: t.ink, opacity: 0.7 }} />
      <div data-layer="tram" className="absolute bottom-[9%] left-0 w-[70vw] max-w-[620px] overflow-hidden rounded-2xl border-4 shadow-2xl md:w-[45vw]"
        style={{ borderColor: t.amber, aspectRatio: "16 / 10", background: `center / cover url(${heroAsset.url})` }} />
    </section>
  );
}
