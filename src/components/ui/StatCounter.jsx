import { useEffect, useRef, useState } from "react";

export default function StatCounter({ target, dur=1400 }) {
  const [v, setV] = useState("0");
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const num = parseInt(target.replace(/\D/g, ""));
    const suffix = target.replace(/[\d,]/g, "");
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const tick = (now) => {
          const p = Math.min((now - s) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(Math.floor(eased * num).toLocaleString() + suffix);
          if (p < 1) requestAnimationFrame(tick);
          else setV(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold:0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, dur]);

  return <span ref={ref}>{v}</span>;
}
