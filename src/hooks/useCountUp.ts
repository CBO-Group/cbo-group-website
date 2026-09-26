import { useState, useEffect, useRef } from "react";

export function useCountUp(active: boolean) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return progress;
}
