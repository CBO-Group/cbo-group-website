import { useState } from "react";
import type { ReactNode } from "react";

export function DarkCTABtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#EAC896" : "#D8B984",
        color: "#262321",
        border: "none",
        padding: "14px 30px",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        transition: "background 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}
