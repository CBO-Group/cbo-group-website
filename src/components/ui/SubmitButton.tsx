import { useState } from "react";
import type { ReactNode } from "react";

export function SubmitButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: disabled ? "#8A8684" : hov ? "#3A3532" : "#262321",
        color: "#FFFFFF",
        border: "none",
        padding: "14px 30px",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        alignSelf: "flex-start",
        transition: "background 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}
