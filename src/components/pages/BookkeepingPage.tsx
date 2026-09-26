import { Reveal } from "../ui/Reveal";
import { GoldLink } from "../ui/GoldLink";
import { DarkCTA } from "../ui/DarkCTA";
import { ServiceCard } from "../ui/ServiceCard";
import { bookkeepingServices } from "../../constants/services";
import { BOOKKEEPING_COPY } from "../../constants/bookkeeping";
import type { Page } from "../../types";

export function BookkeepingPage({ navigate }: { navigate: (p: Page) => void }) {
  const { hero, feature, closingCTA } = BOOKKEEPING_COPY;

  return (
    <div data-screen-label="Bookkeeping">
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
              margin: 0,
            }}
          >
            {hero.body}
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
            {bookkeepingServices.map((svc) => (
              <ServiceCard key={svc.num} {...svc} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal style={{ background: "#FAF7F4" }}>
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
                src="/images/Home-Page-Secondary.jpg"
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
