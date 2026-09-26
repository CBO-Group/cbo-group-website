import { Reveal } from "./Reveal";
import { DarkCTABtn } from "./DarkCTABtn";

export function DarkCTA({
  heading,
  button,
  onClick,
}: {
  heading: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <Reveal>
      <section
        style={{
          background: "#211E1C",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Source Serif 4',serif",
            fontSize: 28,
            fontWeight: 500,
            color: "#FFFFFF",
            margin: "0 0 26px",
          }}
        >
          {heading}
        </h2>
        <DarkCTABtn onClick={onClick}>{button}</DarkCTABtn>
      </section>
    </Reveal>
  );
}
