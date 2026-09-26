import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import { GoldLink } from "../ui/GoldLink";
import { DarkCTA } from "../ui/DarkCTA";
import { ServiceCard } from "../ui/ServiceCard";
import { performanceServices } from "../../constants/services";
import { BUSINESS_PERFORMANCE_COPY } from "../../constants/businessPerformance";
import { fmt } from "../../utils/format";
import type { Page, DemoState } from "../../types";

export function BusinessPerformancePage({
  navigate,
}: {
  navigate: (p: Page) => void;
}) {
  const [demo, setDemo] = useState<DemoState>({
    revenue: 50000,
    expenses: 32000,
    laborPct: 28,
  });

  const laborCost = demo.revenue * (demo.laborPct / 100);
  const netProfit = demo.revenue - demo.expenses - laborCost;
  const grossMargin =
    demo.revenue > 0
      ? ((demo.revenue - demo.expenses) / demo.revenue) * 100
      : 0;

  const formatSliderValue = (field: keyof DemoState, val: number) =>
    field === "laborPct" ? val + "%" : fmt(val);

  const { hero, demo: demoCopy, feature, closingCTA } = BUSINESS_PERFORMANCE_COPY;

  return (
    <div data-screen-label="Business Performance">
      <section style={{ background: "#FAF7F4", padding: "132px 24px 70px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontStyle: "italic",
              fontSize: 15,
              color: "#8A6D3F",
              margin: "0 0 16px",
            }}
          >
            {hero.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontSize: 38,
              fontWeight: 500,
              color: "#262321",
              margin: "0 0 20px",
            }}
          >
            {hero.headlinePart1}{" "}
            <span style={{ fontStyle: "italic" }}>{hero.headlinePart2}</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "#5A5654",
              margin: "0 0 12px",
            }}
          >
            {hero.body1}
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "#5A5654",
              margin: 0,
            }}
          >
            {hero.body2}
          </p>
        </div>
      </section>

      <Reveal>
        <section
          style={{ maxWidth: 1100, margin: "0 auto", padding: "70px 24px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
              gap: 20,
            }}
          >
            {performanceServices.map((svc) => (
              <ServiceCard key={svc.num} {...svc} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* Interactive Demo */}
      <Reveal style={{ background: "#FAF7F4" }}>
        <section style={{ padding: "70px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "#8A6D3F",
                margin: "0 0 10px",
              }}
            >
              {demoCopy.eyebrow}
            </p>
            <h2
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontSize: 26,
                fontWeight: 500,
                color: "#262321",
                margin: "0 0 12px",
              }}
            >
              {demoCopy.heading}
            </h2>
            <p style={{ fontSize: 14, color: "#8F8A85", margin: "0 0 40px" }}>
              {demoCopy.disclaimer}
            </p>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 320px", minWidth: 280 }}>
                {demoCopy.sliders.map((sl) => (
                  <div
                    key={sl.field}
                    style={{
                      marginBottom: 26,
                      borderTop: "1px solid #E4DED7",
                      paddingTop: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#262321",
                        marginBottom: 10,
                      }}
                    >
                      <span>{sl.label}</span>
                      <span>{formatSliderValue(sl.field, demo[sl.field])}</span>
                    </div>
                    <input
                      type="range"
                      min={sl.min}
                      max={sl.max}
                      step={sl.step}
                      value={demo[sl.field]}
                      onChange={(e) =>
                        setDemo((prev) => ({
                          ...prev,
                          [sl.field]: Number(e.target.value),
                        }))
                      }
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>
              <div
                style={{
                  flex: "1 1 260px",
                  minWidth: 240,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                  justifyContent: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8F8A85",
                      margin: "0 0 6px",
                    }}
                  >
                    {demoCopy.results.netProfitLabel}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4',serif",
                      fontSize: 32,
                      fontWeight: 500,
                      color: "#262321",
                      margin: 0,
                    }}
                  >
                    {fmt(netProfit)}
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px solid #E4DED7", paddingTop: 14 }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8F8A85",
                      margin: "0 0 6px",
                    }}
                  >
                    {demoCopy.results.grossMarginLabel}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4',serif",
                      fontSize: 22,
                      fontWeight: 500,
                      color: "#262321",
                      margin: 0,
                    }}
                  >
                    {grossMargin.toFixed(1)}%
                  </p>
                </div>
                <div
                  style={{ borderTop: "1px solid #E4DED7", paddingTop: 14 }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8F8A85",
                      margin: "0 0 6px",
                    }}
                  >
                    {demoCopy.results.laborCostLabel}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Source Serif 4',serif",
                      fontSize: 22,
                      fontWeight: 500,
                      color: "#262321",
                      margin: 0,
                    }}
                  >
                    {fmt(laborCost)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal style={{ background: "#FFFFFF" }}>
        <section style={{ padding: "70px 24px" }}>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              gap: 48,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 420px", minWidth: 300 }}>
              <img
                src="/images/Business-Performance.jpg"
                alt={feature.imageAlt}
                style={{
                  width: "100%",
                  height: 320,
                  objectFit: "cover",
                  borderRadius: 8,
                  display: "block",
                }}
              />
            </div>
            <div style={{ flex: "1 1 380px", minWidth: 300 }}>
              <h2
                style={{
                  fontFamily: "'Source Serif 4',serif",
                  fontSize: 26,
                  fontWeight: 500,
                  color: "#262321",
                  margin: "0 0 18px",
                }}
              >
                {feature.heading}
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 24px",
                }}
              >
                {feature.body}
              </p>
              <GoldLink onClick={() => navigate("contact")}>
                {feature.ctaLink}
              </GoldLink>
            </div>
          </div>
        </section>
      </Reveal>

      <DarkCTA
        heading={closingCTA.heading}
        button={closingCTA.button}
        onClick={() => navigate("contact")}
      />
    </div>
  );
}
