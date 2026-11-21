import { useEffect, useState } from "react";
import { ConciergeMicButton } from "./ConciergeMicButton";

export function FloatingConcierge() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e?.isIntersecting), { threshold: 0.1 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <ConciergeMicButton compact />
    </div>
  );
}
