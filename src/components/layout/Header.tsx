import { NAV_ITEMS } from "../../constants/nav";
import type { Page } from "../../types";
import { NavButton } from "../ui/NavButton";
import { CTAButton } from "../ui/CTAButton";

export function Header({
  page,
  isMobile,
  mobileNavOpen,
  navigate,
  toggleMobileNav,
  closeMobileNav,
}: {
  page: Page;
  isMobile: boolean;
  mobileNavOpen: boolean;
  navigate: (p: Page) => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}) {
  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: "transparent",
          padding: "18px 20px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            background: "rgba(255,255,255,0.62)",
            backdropFilter: "blur(16px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: 36,
            boxShadow: "0 8px 28px rgba(38,35,33,0.10)",
            padding: "12px 14px 12px 26px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            onClick={() => navigate("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              flexShrink: 0,
              justifySelf: "start",
            }}
          >
            <img
              src="/images/CBO-logo-brown.png"
              alt="CBO Group"
              style={{ height: 24, width: "auto", display: "block" }}
            />
            <span
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontSize: 16,
                fontWeight: 500,
                color: "#262321",
              }}
            >
              CBO Group
            </span>
          </div>

          {!isMobile && (
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                justifySelf: "center",
                background: "#F5F1EC",
                borderRadius: 999,
                padding: 6,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <NavButton
                  key={item.key}
                  label={item.label}
                  active={page === item.key}
                  onClick={() => navigate(item.key)}
                />
              ))}
            </nav>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
              justifySelf: "end",
            }}
          >
            {!isMobile && (
              <CTAButton onClick={() => navigate("contact")}>
                Contact Us
              </CTAButton>
            )}
            {isMobile && (
              <button
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                onClick={toggleMobileNav}
                style={{
                  background: "none",
                  border: "none",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 2,
                      background: "#262321",
                      display: "block",
                      borderRadius: 1,
                      transform: mobileNavOpen
                        ? "translateY(7px) rotate(45deg)"
                        : "none",
                      transition:
                        "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
                    }}
                  />
                  <span
                    style={{
                      width: 20,
                      height: 2,
                      background: "#262321",
                      display: "block",
                      borderRadius: 1,
                      opacity: mobileNavOpen ? 0 : 1,
                      transition: "opacity 0.18s ease",
                    }}
                  />
                  <span
                    style={{
                      width: 20,
                      height: 2,
                      background: "#262321",
                      display: "block",
                      borderRadius: 1,
                      transform: mobileNavOpen
                        ? "translateY(-7px) rotate(-45deg)"
                        : "none",
                      transition:
                        "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
                    }}
                  />
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav Backdrop */}
      <div
        onClick={closeMobileNav}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(38,35,33,0.18)",
          backdropFilter: mobileNavOpen ? "blur(4px)" : "blur(0px)",
          opacity: mobileNavOpen ? 1 : 0,
          pointerEvents: mobileNavOpen ? "auto" : "none",
          transition: "opacity 0.3s ease, backdrop-filter 0.3s ease",
        }}
      />

      {/* Mobile Nav Panel */}
      <div
        style={{
          position: "fixed",
          top: 18,
          left: 20,
          right: 20,
          zIndex: 51,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: 28,
          boxShadow:
            "0 20px 60px rgba(38,35,33,0.18), 0 4px 16px rgba(38,35,33,0.08)",
          opacity: mobileNavOpen ? 1 : 0,
          pointerEvents: mobileNavOpen ? "auto" : "none",
          transform: mobileNavOpen
            ? "translateY(0) scale(1)"
            : "translateY(-14px) scale(0.96)",
          transformOrigin: "top center",
          transition:
            "opacity 0.3s cubic-bezier(0.32,0.72,0,1), transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "8px 8px 0" }}>
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.key}
              onClick={() => {
                navigate(item.key);
                closeMobileNav();
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background:
                  page === item.key ? "rgba(138,109,63,0.08)" : "none",
                border: "none",
                borderRadius: 14,
                padding: "14px 20px",
                fontFamily: "'Work Sans',sans-serif",
                fontSize: 16,
                fontWeight: page === item.key ? 600 : 500,
                color: page === item.key ? "#8A6D3F" : "#3A3532",
                cursor: "pointer",
                opacity: mobileNavOpen ? 1 : 0,
                transform: mobileNavOpen
                  ? "translateY(0)"
                  : "translateY(-6px)",
                transition: `opacity 0.22s ease, transform 0.22s ease, background 0.15s ease`,
                transitionDelay: mobileNavOpen
                  ? `${0.08 + i * 0.04}s`
                  : "0s",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          style={{
            padding: "12px 16px 16px",
            opacity: mobileNavOpen ? 1 : 0,
            transform: mobileNavOpen ? "translateY(0)" : "translateY(-4px)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
            transitionDelay: mobileNavOpen
              ? `${0.08 + NAV_ITEMS.length * 0.04}s`
              : "0s",
          }}
        >
          <button
            onClick={() => {
              navigate("contact");
              closeMobileNav();
            }}
            style={{
              width: "100%",
              background: "#262321",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 14,
              padding: "15px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </>
  );
}
