import { useState } from "react";

export function ServiceCard({
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: 10,
        boxShadow: hovered
          ? "0 14px 28px rgba(38,35,33,0.11)"
          : "0 6px 20px rgba(38,35,33,0.06)",
        padding: "26px",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#262321",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5654", margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}
