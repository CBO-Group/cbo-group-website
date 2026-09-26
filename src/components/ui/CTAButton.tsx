import { useState } from "react";
import type { ReactNode } from "react";

export function CTAButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#8A6D3F" : "#262321",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 999,
        padding: "11px 22px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        transition: "background 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}
