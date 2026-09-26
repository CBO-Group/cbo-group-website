import { NAV_ITEMS } from "../../constants/nav";
import type { Page } from "../../types";

export function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer
      style={{
        background: "#211E1C",
        padding: "48px 24px 28px",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <img
                src="/images/CBO-logo.png"
                alt="CBO Group"
                style={{ height: 28, width: "auto" }}
              />
              <span
                style={{
                  fontFamily: "'Source Serif 4',serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#FFFFFF",
                }}
              >
                CBO Group
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#9C9691", margin: 0 }}>
              Bookkeeping · Business Performance · Operations Advisory
            </p>
          </div>
          <nav
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: 13,
                  color: "#9C9691",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ borderTop: "1px solid #3A3532", paddingTop: 20 }}>
          <p style={{ fontSize: 12, color: "#7A756F", margin: 0 }}>
            © {new Date().getFullYear()} CBO Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
