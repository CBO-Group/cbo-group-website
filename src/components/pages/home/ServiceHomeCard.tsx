import { useState } from "react";
import type { ReactNode } from "react";
import { GoldLink } from "../../ui/GoldLink";
import type { Page } from "../../../types";

export function ServiceHomeCard({
  icon,
  title,
  sub,
  desc,
  tags,
  linkLabel,
  page,
  navigate,
}: {
  icon: ReactNode;
  title: string;
  sub: string;
  desc: string;
  tags: string;
  linkLabel: string;
  page: Page;
  navigate: (p: Page) => void;
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
          ? "0 16px 34px rgba(38,35,33,0.12)"
          : "0 8px 28px rgba(38,35,33,0.07)",
        padding: "34px 30px",
        transform: hovered ? "translateY(-5px)" : "none",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#FAF7F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Source Serif 4',serif",
          fontSize: 22,
          fontWeight: 500,
          color: "#262321",
          margin: "0 0 10px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#262321",
          margin: "0 0 12px",
        }}
      >
        {sub}
      </p>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: "#5A5654",
          margin: "0 0 16px",
        }}
      >
        {desc}
      </p>
      <p
        style={{
          fontSize: 12,
          lineHeight: 1.6,
          color: "#8F8A85",
          margin: "0 0 22px",
        }}
      >
        {tags}
      </p>
      <GoldLink onClick={() => navigate(page)}>{linkLabel}</GoldLink>
    </div>
  );
}
