import { Reveal } from "../ui/Reveal";
import { GoldLink } from "../ui/GoldLink";
import { DarkCTABtn } from "../ui/DarkCTABtn";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ABOUT_COPY } from "../../constants/about";
import type { Page } from "../../types";

export function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  const mobile = useIsMobile();
  const { hero, expertise, pillars, closingCTA } = ABOUT_COPY;

  return (
    <div data-screen-label="About">
      <section style={{ background: "#FAF7F4", padding: "132px 24px 60px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            flexDirection: mobile ? "column" : "row",
            gap: 56,
            flexWrap: "wrap",
          }}
        >
          <img
            src="/images/PFP.jpg"
            alt={hero.photoAlt}
            style={{
              width: mobile ? "100%" : 230,
              maxWidth: 230,
              height: 290,
              objectFit: "cover",
              borderRadius: 8,
              flexShrink: 0,
              alignSelf: mobile ? "center" : undefined,
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
              {hero.eyebrow}
            </p>
            <h1
              style={{
                fontFamily: "'Source Serif 4',serif",
                fontSize: 34,
                fontWeight: 500,
                color: "#262321",
                margin: "0 0 4px",
              }}
            >
              {hero.name}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#8F8A85",
                fontWeight: 500,
                margin: "0 0 20px",
              }}
            >
              {hero.title}
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "#5A5654",
                margin: "0 0 16px",
              }}
            >
              {hero.bio1}
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "#5A5654",
                margin: "0 0 20px",
              }}
            >
              {hero.bio2}
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "#5A5654",
                margin: "0 0 12px",
              }}
            >
              {hero.bio3}
            </p>
            <GoldLink onClick={() => navigate("contact")}>{hero.ctaLink}</GoldLink>
          </div>
        </div>
      </section>

      <Reveal>
        <section
          style={{ maxWidth: 1000, margin: "0 auto", padding: "70px 24px" }}
        >
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
            {expertise.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontSize: 26,
              fontWeight: 500,
              color: "#262321",
              margin: "0 0 22px",
              textAlign: "center",
            }}
          >
            {expertise.heading}
          </h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.9,
              color: "#8F8A85",
              textAlign: "center",
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {expertise.list}
          </p>
        </section>
      </Reveal>

      <Reveal style={{ background: "#FAF7F4" }}>
        <section style={{ padding: "60px 24px" }}>
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
              gap: 0,
            }}
          >
            {pillars.map((col) => (
              <div
                key={col.label}
                style={{
                  padding: mobile ? "20px 0" : col.desktopPad,
                  borderLeft:
                    !mobile && col.bordered ? "1px solid #E4DED7" : "none",
                  borderTop:
                    mobile && col.bordered ? "1px solid #E4DED7" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Source Serif 4',serif",
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "#8A6D3F",
                    margin: "0 0 10px",
                  }}
                >
                  {col.label}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#5A5654",
                    margin: 0,
                  }}
                >
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          style={{
            background: "#211E1C",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              maxWidth: 680,
              margin: "0 auto 26px",
              fontFamily: "'Source Serif 4',serif",
              fontStyle: "italic",
              fontSize: 21,
              lineHeight: 1.5,
              fontWeight: 500,
              color: "#FFFFFF",
            }}
          >
            {closingCTA.quote}
          </p>
          <DarkCTABtn onClick={() => navigate("contact")}>
            {closingCTA.button}
          </DarkCTABtn>
        </section>
      </Reveal>
    </div>
  );
}
