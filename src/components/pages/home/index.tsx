import { useState } from "react";
import { AgCharts } from "ag-charts-react";
import { Reveal } from "../../ui/Reveal";
import { GoldLink } from "../../ui/GoldLink";
import { ServiceHomeCard } from "./ServiceHomeCard";
import { PerformanceSection } from "./PerformanceSection";
import { HOME_COPY } from "../../../constants/home";
import { chartOptions } from "../../../constants/chart";
import { formatMetric } from "../../../utils/format";
import type { Page } from "../../../types";

function BookkeepingIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8A6D3F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h9l5 5v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M15 3v5h5" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function PerformanceIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8A6D3F"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="20" x2="5" y2="12" />
      <line x1="12" y1="20" x2="12" y2="6" />
      <line x1="19" y1="20" x2="19" y2="15" />
    </svg>
  );
}

function OperationsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8A6D3F"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0A1.65 1.65 0 009 4.09V4a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

const SERVICE_ICONS = [<BookkeepingIcon />, <PerformanceIcon />, <OperationsIcon />];

export function HomePage({
  navigate,
  animProgress,
  chartVisible,
  onPerfInView,
}: {
  navigate: (p: Page) => void;
  animProgress: number;
  chartVisible: boolean;
  onPerfInView: () => void;
}) {
  const [heroBtn, setHeroBtn] = useState(false);
  const [darkBtn, setDarkBtn] = useState(false);
  const { hero, positioning, serviceCards, performance, whyCBO, closingCTA } =
    HOME_COPY;

  const goServices = () => {
    const el = document.getElementById("services");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div data-screen-label="Home">
      {/* Hero */}
      <section
        style={{
          background: "#FAF7F4",
          padding: "150px 24px 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/images/CBO-logo-brown.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "10%",
            top: "70%",
            transform: "translateY(-50%)",
            height: "80%",
            maxHeight: 520,
            width: "auto",
            opacity: 0.06,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          <p
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontStyle: "italic",
              fontSize: 16,
              color: "#8A6D3F",
              margin: "0 0 22px",
            }}
          >
            {hero.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontSize: 48,
              lineHeight: 1.2,
              fontWeight: 500,
              color: "#262321",
              margin: "0 0 22px",
            }}
          >
            {hero.headlinePart1}{" "}
            <span style={{ fontStyle: "italic" }}>{hero.headlinePart2}</span>
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "#5A5654",
              margin: "0 0 34px",
              maxWidth: 560,
            }}
          >
            {hero.subhead}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => navigate("contact")}
              onMouseEnter={() => setHeroBtn(true)}
              onMouseLeave={() => setHeroBtn(false)}
              style={{
                background: heroBtn ? "#3A3532" : "#262321",
                color: "#FFFFFF",
                border: "none",
                padding: "15px 30px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              {hero.ctaPrimary}
            </button>
            <GoldLink onClick={goServices}>{hero.ctaSecondary}</GoldLink>
          </div>
          <p style={{ fontSize: 13, color: "#8F8A85", margin: 0 }}>
            {hero.caption}
          </p>
        </div>
      </section>

      {/* Positioning Statement */}
      <Reveal style={{ background: "#FFFFFF" }}>
        <section style={{ padding: "88px 24px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontSize: 30,
                fontWeight: 500,
                color: "#262321",
                margin: "0 0 20px",
              }}
            >
              {positioning.heading}
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                color: "#5A5654",
                margin: 0,
              }}
            >
              {positioning.body}
            </p>
          </div>
        </section>
      </Reveal>

      {/* Three Services */}
      <Reveal style={{ background: "#FAF7F4" }}>
        <section id="services" style={{ padding: "60px 24px 130px" }}>
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
              gap: 28,
            }}
          >
            {serviceCards.map((card, i) => (
              <ServiceHomeCard
                key={card.title}
                icon={SERVICE_ICONS[i]}
                title={card.title}
                sub={card.sub}
                desc={card.desc}
                tags={card.tags}
                linkLabel={card.linkLabel}
                page={card.page}
                navigate={navigate}
              />
            ))}
          </div>
        </section>
      </Reveal>

      {/* Business Performance Preview */}
      <PerformanceSection onVisible={onPerfInView}>
        <section style={{ padding: "100px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#8A6D3F",
                margin: "0 0 12px",
                textAlign: "center",
              }}
            >
              {performance.eyebrow}
            </p>
            <h2
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontSize: 32,
                fontWeight: 500,
                color: "#262321",
                margin: "0 0 56px",
                textAlign: "center",
              }}
            >
              {performance.heading}
            </h2>
            <div
              style={{
                display: "flex",
                gap: 56,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: "1 1 220px",
                  minWidth: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: 26,
                }}
              >
                {performance.metrics.map((m) => (
                  <div
                    key={m.label}
                    style={{ borderTop: "1px solid #E4DED7", paddingTop: 14 }}
                  >
                    <p
                      style={{
                        fontFamily: "'Source Serif 4',serif",
                        fontSize: 26,
                        fontWeight: 500,
                        color: "#262321",
                        margin: "0 0 4px",
                      }}
                    >
                      {formatMetric(m.target, m.type, animProgress)}
                    </p>
                    <p style={{ fontSize: 12, color: "#8F8A85", margin: 0 }}>
                      {m.label}&nbsp;·&nbsp;{m.detail}
                    </p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  flex: "2 1 460px",
                  minWidth: 300,
                  background: "#FFFFFF",
                  boxShadow: "0 8px 28px rgba(38,35,33,0.06)",
                  padding: 26,
                }}
              >
                <p
                  style={{ fontSize: 13, color: "#8F8A85", margin: "0 0 12px" }}
                >
                  {performance.chartLabel}
                </p>
                {chartVisible && (
                  <div style={{ width: "100%", height: 240 }}>
                    <AgCharts options={{ ...chartOptions, height: 240 }} />
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <GoldLink onClick={() => navigate("business-performance")}>
                {performance.ctaLink}
              </GoldLink>
            </div>
          </div>
        </section>
      </PerformanceSection>

      {/* Why CBO / Chase */}
      <Reveal style={{ background: "#FAF7F4" }}>
        <section style={{ padding: "100px 24px" }}>
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 56,
              flexWrap: "wrap",
            }}
          >
            <img
              src="/images/PFP.jpg"
              alt={whyCBO.photoAlt}
              style={{
                width: 260,
                height: 320,
                objectFit: "cover",
                flexShrink: 0,
                borderRadius: 10,
              }}
            />
            <div style={{ flex: "1 1 380px", minWidth: 280 }}>
              <p
                style={{
                  fontFamily: "'Source Serif 4',serif",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "#8A6D3F",
                  margin: "0 0 14px",
                }}
              >
                {whyCBO.eyebrow}
              </p>
              <h2
                style={{
                  fontFamily: "'Source Serif 4',serif",
                  fontSize: 28,
                  fontWeight: 500,
                  color: "#262321",
                  margin: "0 0 20px",
                  lineHeight: 1.3,
                }}
              >
                {whyCBO.heading}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 12px",
                }}
              >
                {whyCBO.body1}
              </p>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 18px",
                }}
              >
                {whyCBO.body2}
              </p>
              <p
                style={{
                  fontFamily: "'Source Serif 4',serif",
                  fontStyle: "italic",
                  fontSize: 17,
                  lineHeight: 1.5,
                  color: "#262321",
                  margin: "0 0 22px",
                }}
              >
                {whyCBO.quote}
              </p>
              <GoldLink onClick={() => navigate("about")}>
                {whyCBO.ctaLink}
              </GoldLink>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Closing CTA */}
      <Reveal>
        <section
          style={{
            background: "#211E1C",
            padding: "100px 24px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontSize: 30,
              fontWeight: 500,
              color: "#FFFFFF",
              margin: "0 0 16px",
            }}
          >
            {closingCTA.heading}
          </h2>
          <p style={{ fontSize: 15, color: "#B8B2AD", margin: "0 0 32px" }}>
            {closingCTA.subtext}
          </p>
          <button
            onClick={() => navigate("contact")}
            onMouseEnter={() => setDarkBtn(true)}
            onMouseLeave={() => setDarkBtn(false)}
            style={{
              background: darkBtn ? "#EAC896" : "#D8B984",
              color: "#262321",
              border: "none",
              padding: "15px 32px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            {closingCTA.button}
          </button>
        </section>
      </Reveal>
    </div>
  );
}
