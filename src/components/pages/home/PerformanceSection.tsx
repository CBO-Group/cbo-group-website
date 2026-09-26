import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";

export function PerformanceSection({
  children,
  onVisible,
}: {
  children: ReactNode;
  onVisible: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          setVisible(true);
          onVisible();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={ref}
      style={{
        background: "#FFFFFF",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {children}
    </div>
  );
}
