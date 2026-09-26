import { useState } from "react";
import type { ReactNode } from "react";

export function GoldLink({
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
        background: "none",
        border: "none",
        color: hovered ? "#262321" : "#8A6D3F",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        padding: 0,
        transition: "color 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}
