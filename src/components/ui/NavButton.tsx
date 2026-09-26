import { useState } from "react";

export function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: active || hovered ? "#FFFFFF" : "none",
        border: "none",
        padding: "9px 16px",
        borderRadius: 999,
        fontFamily: "'Work Sans',sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: active || hovered ? "#262321" : "#3A3532",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}
