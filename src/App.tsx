import { useState, useEffect, useRef, useCallback } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";

type Page =
  | "home"
  | "about"
  | "bookkeeping"
  | "business-performance"
  | "operations-advisory"
  | "contact";

interface DemoState {
  revenue: number;
  expenses: number;
  laborPct: number;
}

interface ContactState {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  helpWith: string;
  message: string;
}

const NAV_ITEMS: { key: Page; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "bookkeeping", label: "Bookkeeping" },
  { key: "business-performance", label: "Business Performance" },
  { key: "operations-advisory", label: "Operations Advisory" },
];

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

function formatMetric(
  target: number,
  type: "currency" | "percent",
  progress: number
) {
  const val = target * progress;
  if (type === "currency") return "$" + Math.round(val).toLocaleString();
  return val.toFixed(1) + "%";
}

function numbered<T extends object>(arr: T[]) {
  return arr.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));
}

const bookkeepingServices = numbered([
  {
    title: "Monthly Bookkeeping",
    desc: "Keep your financial records current and organized with consistent monthly bookkeeping.",
  },
  {
    title: "Transaction Categorization",
    desc: "Accurately categorize income and expenses so your financial information is clear and useful.",
  },
  {
    title: "Bank & Credit Card Reconciliations",
    desc: "Reconcile accounts regularly to help ensure your records accurately reflect your business activity.",
  },
  {
    title: "Internal Management Reports",
    desc: "Receive clear internal management reports that provide an accurate view of your business's financial position.",
  },
  {
    title: "Profit & Loss Reporting",
    desc: "Understand your revenue, expenses, and profitability through organized monthly P&L reporting.",
  },
  {
    title: "Balance Sheets for Management",
    desc: "Track assets, liabilities, and equity to understand the overall financial position of your business.",
  },
  {
    title: "Cleanup & Catch-Up",
    desc: "Get disorganized or outdated books brought up to date so you can move forward with accurate financial information.",
  },
  {
    title: "Monthly Reporting",
    desc: "Receive consistent financial reporting that makes it easier to monitor your business and make informed decisions.",
  },
]);

const performanceServices = numbered([
  {
    title: "Revenue Analysis",
    desc: "Identify revenue trends, changes, and opportunities to understand what is driving your sales.",
  },
  {
    title: "Expense Analysis",
    desc: "Review spending patterns and identify areas where costs may be reduced or better managed.",
  },
  {
    title: "Profitability Analysis",
    desc: "Understand where your business is making money, where margins are being compressed, and what factors are affecting profitability.",
  },
  {
    title: "Labor Cost Analysis",
    desc: "Evaluate labor costs, productivity, and staffing efficiency in relation to business performance.",
  },
  {
    title: "KPI Reporting",
    desc: "Develop and track key performance indicators that provide a clearer picture of how your business is performing.",
  },
  {
    title: "Budget vs. Actual",
    desc: "Compare actual results against your budget to identify variances and understand what is driving them.",
  },
  {
    title: "Cash Flow Analysis",
    desc: "Monitor the movement of money through your business and identify potential cash flow concerns or opportunities.",
  },
  {
    title: "Internal Financial Reporting & Analysis",
    desc: "Turn financial information into practical insights that support better business decisions.",
  },
]);

const opsServices = numbered([
  {
    title: "Process Improvement",
    desc: "Review existing processes and identify opportunities to make work more efficient and consistent.",
  },
  {
    title: "Staffing & Productivity",
    desc: "Evaluate staffing needs, workload, and productivity to help businesses make more effective use of their teams.",
  },
  {
    title: "Workflow Optimization",
    desc: "Identify bottlenecks and improve workflows so work moves more efficiently from start to finish.",
  },
  {
    title: "Scheduling",
    desc: "Review scheduling practices and staffing patterns to better align resources with business demand.",
  },
  {
    title: "Cost Reduction",
    desc: "Identify unnecessary costs and operational inefficiencies that may be affecting profitability.",
  },
  {
    title: "Standard Operating Procedures",
    desc: "Develop and improve SOPs to create more consistent processes, accountability, and performance.",
  },
  {
    title: "Operational KPIs",
    desc: "Establish meaningful operational metrics to measure productivity, efficiency, and performance.",
  },
  {
    title: "Vendor & Operational Review",
    desc: "Review vendors, contracts, and operational processes to identify opportunities for improvement.",
  },
]);

const helpOptions = [
  "Bookkeeping",
  "Business Performance",
  "Operations Advisory",
  "Not sure yet / General inquiry",
];

// ─── Mobile hook ─────────────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mobile;
}

// ─── Reveal wrapper component ─────────────────────────────────────────────────
function Reveal({
  children,
  style: extra,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        ...extra,
      }}
    >
      {children}
    </div>
  );
}

// ─── Count-Up Hook ────────────────────────────────────────────────────────────
function useCountUp(active: boolean) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return progress;
}

// ─── Chart Options ────────────────────────────────────────────────────────────
const chartOptions = {
  data: [
    { category: "Revenue", budget: 400000, actual: 428600 },
    { category: "Operating Expenses", budget: 161000, actual: 156200 },
    { category: "Net Profit", budget: 80000, actual: 88450 },
  ],
  series: [
    {
      type: "bar",
      xKey: "category",
      yKey: "budget",
      yName: "Budget",
      fill: "#E4DED7",
      strokeWidth: 0,
    },
    {
      type: "bar",
      xKey: "category",
      yKey: "actual",
      yName: "Actual",
      fill: "#8A6D3F",
      strokeWidth: 0,
    },
  ],
  axes: [
    {
      type: "category",
      position: "bottom",
      label: { color: "#8F8A85", fontSize: 11 },
      gridLine: { enabled: false },
    },
    {
      type: "number",
      position: "left",
      label: {
        color: "#8F8A85",
        fontSize: 10,
        formatter: (p: { value: number }) =>
          "$" + Math.round(p.value / 1000) + "K",
      },
      gridLine: { style: [{ stroke: "#F1EEEA", lineDash: [0] }] },
    },
  ],
  legend: {
    position: "top",
    spacing: 20,
    item: { label: { fontSize: 11, color: "#8F8A85" } },
  },
  background: { visible: false },
} as unknown as AgChartOptions;

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({
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

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({
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
                      transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
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
                      transition: "transform 0.28s cubic-bezier(0.32,0.72,0,1)",
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
        {/* Nav items */}
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
                transform: mobileNavOpen ? "translateY(0)" : "translateY(-6px)",
                transition: `opacity 0.22s ease, transform 0.22s ease, background 0.15s ease`,
                transitionDelay: mobileNavOpen ? `${0.08 + i * 0.04}s` : "0s",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
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

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: active || hovered ? "#FFFFFF" : "none",
        border: "none",
        padding: "9px 16px",
        borderRadius: 999,
        fontFamily: "'Work Sans',sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: active || hovered ? "#262321" : "#3A3532",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

function CTAButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#8A6D3F" : "#262321",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 999,
        padding: "11px 22px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        transition: "background 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

function GoldLink({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        color: hovered ? "#262321" : "#8A6D3F",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        padding: 0,
        transition: "color 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

function DarkCTABtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#EAC896" : "#D8B984",
        color: "#262321",
        border: "none",
        padding: "14px 30px",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        transition: "background 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

function DarkCTA({
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

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ navigate }: { navigate: (p: Page) => void }) {
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

// ─── Home Page ────────────────────────────────────────────────────────────────
function ServiceHomeCard({
  icon,
  title,
  sub,
  desc,
  tags,
  linkLabel,
  navigate,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  desc: string;
  tags: string;
  linkLabel: string;
  navigate: (p: Page) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pageMap: Record<string, Page> = {
    "Explore Bookkeeping →": "bookkeeping",
    "Explore Business Performance →": "business-performance",
    "Explore Operations Advisory →": "operations-advisory",
  };
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
      <GoldLink onClick={() => navigate(pageMap[linkLabel])}>
        {linkLabel}
      </GoldLink>
    </div>
  );
}

// Wraps the performance preview section — single observer drives fade-in + count-up + chart together
function PerformanceSection({
  children,
  onVisible,
}: {
  children: React.ReactNode;
  onVisible: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          setVisible(true);
          onVisible();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={ref}
      style={{
        background: "#FFFFFF",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {children}
    </div>
  );
}

function HomePage({
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
            · A modern approach to business performance ·
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
            Understand your numbers.{" "}
            <span style={{ fontStyle: "italic" }}>Improve your business.</span>
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
            CBO Group helps small businesses organize their financials,
            understand what's driving performance, and find practical ways to
            improve profitability.
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
              Contact Us
            </button>
            <GoldLink onClick={goServices}>See Our Services →</GoldLink>
          </div>
          <p style={{ fontSize: 13, color: "#8F8A85", margin: 0 }}>
            No pressure — just a conversation about your numbers.
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
              CBO Group isn't just bookkeeping.
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                color: "#5A5654",
                margin: 0,
              }}
            >
              Bookkeeping tells you what happened. Performance analysis explains
              why. Operations advisory decides what to do next. CBO Group
              connects all three - Backed by a decade of managing complex
              business operations to drive sustainable profitability, we bridge
              the gap between traditional financial strategy and operational
              execution.
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
            <ServiceHomeCard
              icon={
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
              }
              title="Bookkeeping"
              sub="Know what happened."
              desc="Accurate, organized financial records — reconciled accounts, monthly reports, and reporting you can trust."
              tags="Monthly bookkeeping · Reconciliations · Internal financial reports"
              linkLabel="Explore Bookkeeping →"
              navigate={navigate}
            />
            <ServiceHomeCard
              icon={
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
              }
              title="Business Performance"
              sub="Understand why."
              desc="We turn your financial data into insight — what's driving results, and where the opportunities are."
              tags="Revenue & expense analysis · KPI reporting · Budget vs. actual"
              linkLabel="Explore Business Performance →"
              navigate={navigate}
            />
            <ServiceHomeCard
              icon={
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
              }
              title="Operations Advisory"
              sub="Decide what to do next."
              desc="Practical recommendations to improve the processes, people, and systems driving performance."
              tags="Process improvement · Staffing & productivity · SOP development"
              linkLabel="Explore Operations Advisory →"
              navigate={navigate}
            />
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
              Business Performance
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
              See what your numbers can tell you.
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
                {[
                  {
                    val: formatMetric(428600, "currency", animProgress),
                    label: "Revenue",
                    detail: "↑ 12.4% YoY",
                  },
                  {
                    val: formatMetric(54.2, "percent", animProgress),
                    label: "Gross Margin",
                    detail: "↑ 2.1 pts YoY",
                  },
                  {
                    val: formatMetric(88450, "currency", animProgress),
                    label: "Net Profit",
                    detail: "↑ 8.7% YoY",
                  },
                ].map((m) => (
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
                      {m.val}
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
                  Budget vs. Actual — illustrative example
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
                Explore Business Performance →
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
              alt="Chase Bronkhorst"
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
                Why CBO Group
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
                A decade of managing complex business operations to drive
                sustainable profitability.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 12px",
                }}
              >
                Chase Bronkhorst founded CBO Group after recognizing that
                traditional financial strategy and management often leave too
                many operational loose ends.
              </p>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 18px",
                }}
              >
                We bridge that gap. By aligning financial insight with strategic
                execution, we manage the budgets, forecasts, teams, and vendors
                required to scale your business seamlessly.
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
                "My approach goes beyond simply reporting numbers — I focus on
                understanding what's driving performance."
              </p>
              <GoldLink onClick={() => navigate("about")}>
                Meet Chase →
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
            Let's build a more profitable business.
          </h2>
          <p style={{ fontSize: 15, color: "#B8B2AD", margin: "0 0 32px" }}>
            Schedule a conversation to learn how CBO Group can help.
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
            Contact Us
          </button>
        </section>
      </Reveal>
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  const mobile = useIsMobile();
  return (
    <div data-screen-label="About">
      <section style={{ background: "#FAF7F4", padding: "132px 24px 60px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: mobile ? "center" : "center",
            flexDirection: mobile ? "column" : "row",
            gap: 56,
            flexWrap: "wrap",
          }}
        >
          <img
            src="/images/PFP.jpg"
            alt="Chase Bronkhorst"
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
              About CBO Group
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
              Chase Bronkhorst
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#8F8A85",
                fontWeight: 500,
                margin: "0 0 20px",
              }}
            >
              Founder & Principal
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "#5A5654",
                margin: "0 0 16px",
              }}
            >
              Before founding CBO Group, Chase spent a decade in the trenches
              managing, scaling, and directing senior startup operations from
              the ground up. He is an operator and growth strategist who looks
              at a business through the lens of performance and strategic
              execution.
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "#5A5654",
                margin: "0 0 20px",
              }}
            >
              Having spent nearly ten years overseeing corporate budgets,
              cross-functional teams, and major vendors, he built CBO Group to
              give founders the practical leadership required to eliminate
              operational loose ends and protect profitability.
            </p>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "#5A5654",
                margin: "0 0 12px",
              }}
            >
              Ready to see how a strategic partner can stabilize your growth?
            </p>
            <GoldLink onClick={() => navigate("contact")}>
              Let's Connect →
            </GoldLink>
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
            Expertise
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
            Practical experience across your key business areas.
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
            Budgeting & Forecasting · P&L Management · Revenue Optimization ·
            KPI Reporting & Analysis · Process Improvement · Workforce
            Management · Vendor & Contract Management · Internal Financial
            Reporting · Business Operations
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
            {[
              {
                num: "Background",
                text: "Nearly a decade managing business operations, financial performance, and teams across complex, high-volume environments.",
                desktopPad: "0 28px 0 0",
                bordered: false,
              },
              {
                num: "Approach",
                text: "Understanding what's driving business performance and identifying practical opportunities to improve efficiency and profitability.",
                desktopPad: "0 28px",
                bordered: true,
              },
              {
                num: "Philosophy",
                text: "Combining financial insight with real-world operational experience so businesses can make informed decisions.",
                desktopPad: "0 0 0 28px",
                bordered: true,
              },
            ].map((col) => (
              <div
                key={col.num}
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
                  {col.num}
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
            The foundation of CBO Group: combining financial insight with
            real-world operational experience to help businesses perform more
            effectively.
          </p>
          <DarkCTABtn onClick={() => navigate("contact")}>
            Contact CBO Group →
          </DarkCTABtn>
        </section>
      </Reveal>
    </div>
  );
}

// ─── Bookkeeping Page ─────────────────────────────────────────────────────────
function BookkeepingPage({ navigate }: { navigate: (p: Page) => void }) {
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
            Bookkeeping
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
            Bookkeeping that gives you{" "}
            <span style={{ fontStyle: "italic" }}>clarity.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "#5A5654",
              margin: 0,
            }}
          >
            Keeping accurate, organized financial records is the foundation of a
            well-run business. CBO Group provides reliable bookkeeping and
            internal financial reporting to help business owners stay organized
            and understand where their business stands.
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
                alt="Organized bookkeeping"
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
                Clean books, clear decisions.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 24px",
                }}
              >
                Consistent, accurate bookkeeping gives you a reliable foundation
                — so every report, budget, and business decision starts from
                numbers you can trust.
              </p>
              <GoldLink onClick={() => navigate("contact")}>
                Contact CBO Group to get started →
              </GoldLink>
            </div>
          </div>
        </section>
      </Reveal>

      <DarkCTA
        heading="Ready to get your books organized?"
        button="Contact CBO Group →"
        onClick={() => navigate("contact")}
      />
    </div>
  );
}

// ─── Business Performance Page ────────────────────────────────────────────────
function BusinessPerformancePage({
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
            Business Performance
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
            Go beyond the <span style={{ fontStyle: "italic" }}>numbers.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "#5A5654",
              margin: "0 0 12px",
            }}
          >
            Bookkeeping tells you what happened. Business performance analysis
            helps you understand why.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "#5A5654",
              margin: 0,
            }}
          >
            CBO Group analyzes your financial information to identify trends,
            understand what's driving your results, and uncover opportunities to
            improve profitability and performance.
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
              Try a Quick Estimate
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
              Adjust the inputs, see the impact.
            </h2>
            <p style={{ fontSize: 14, color: "#8F8A85", margin: "0 0 40px" }}>
              For illustration only — not a substitute for a full financial
              review.
            </p>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 320px", minWidth: 280 }}>
                {[
                  {
                    label: "Monthly Revenue",
                    val: fmt(demo.revenue),
                    min: 10000,
                    max: 200000,
                    step: 1000,
                    field: "revenue" as keyof DemoState,
                    dval: demo.revenue,
                  },
                  {
                    label: "Monthly Operating Expenses",
                    val: fmt(demo.expenses),
                    min: 0,
                    max: 150000,
                    step: 1000,
                    field: "expenses" as keyof DemoState,
                    dval: demo.expenses,
                  },
                  {
                    label: "Labor Cost %",
                    val: demo.laborPct + "%",
                    min: 0,
                    max: 60,
                    step: 1,
                    field: "laborPct" as keyof DemoState,
                    dval: demo.laborPct,
                  },
                ].map((sl) => (
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
                      <span>{sl.val}</span>
                    </div>
                    <input
                      type="range"
                      min={sl.min}
                      max={sl.max}
                      step={sl.step}
                      value={sl.dval}
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
                    Estimated Net Profit
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
                <div style={{ borderTop: "1px solid #E4DED7", paddingTop: 14 }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8F8A85",
                      margin: "0 0 6px",
                    }}
                  >
                    Gross Margin
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
                <div style={{ borderTop: "1px solid #E4DED7", paddingTop: 14 }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8F8A85",
                      margin: "0 0 6px",
                    }}
                  >
                    Estimated Labor Cost
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
                alt="Business performance analysis"
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
                From data to decisions.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 24px",
                }}
              >
                We translate financial data into practical insight — so you know
                not just what your numbers say, but what to do about it.
              </p>
              <GoldLink onClick={() => navigate("contact")}>
                Contact CBO Group to learn more →
              </GoldLink>
            </div>
          </div>
        </section>
      </Reveal>

      <DarkCTA
        heading="See what your numbers are really telling you."
        button="Contact CBO Group →"
        onClick={() => navigate("contact")}
      />
    </div>
  );
}

// ─── Operations Advisory Page ─────────────────────────────────────────────────
function OperationsAdvisoryPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div data-screen-label="Operations Advisory">
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
            Operations Advisory
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
            Improve how your business{" "}
            <span style={{ fontStyle: "italic" }}>operates.</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "#5A5654",
              margin: 0,
            }}
          >
            Strong financial performance starts with strong operations. CBO
            Group helps businesses identify operational inefficiencies and
            improve the processes, people, and systems that drive operational
            performance.
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
            {opsServices.map((svc) => (
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
                src="/images/Operations-Advisory-Secondary.jpg"
                alt="Operational analysis"
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
                From insight to action.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#5A5654",
                  margin: "0 0 24px",
                }}
              >
                CBO Group combines strategic insight with hands-on operational
                experience to help businesses understand what's happening,
                identify what can be improved, and take practical steps forward.
              </p>
              <GoldLink onClick={() => navigate("contact")}>
                Contact CBO Group to discuss your business →
              </GoldLink>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E4DED7",
  borderRadius: 2,
  fontSize: 15,
  fontFamily: "'Work Sans',sans-serif",
  background: "#FFFFFF",
};

function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
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

function ContactPage() {
  const [contact, setContact] = useState<ContactState>({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    helpWith: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const setField = (field: keyof ContactState, value: string) =>
    setContact((prev) => ({ ...prev, [field]: value }));

  return (
    <div
      style={{ maxWidth: 1060, margin: "0 auto", padding: "132px 24px 100px" }}
      data-screen-label="Contact"
    >
      <div style={{ maxWidth: 620, margin: "0 auto 56px" }}>
        <p
          style={{
            fontFamily: "'Source Serif 4',serif",
            fontStyle: "italic",
            fontSize: 15,
            color: "#8A6D3F",
            margin: "0 0 16px",
          }}
        >
          Contact
        </p>
        <h1
          style={{
            fontFamily: "'Source Serif 4',serif",
            fontSize: 34,
            fontWeight: 500,
            color: "#262321",
            margin: "0 0 18px",
          }}
        >
          Let's talk about your business.
        </h1>
        <p
          style={{ fontSize: 16, lineHeight: 1.7, color: "#5A5654", margin: 0 }}
        >
          Have a bookkeeping need, want a clearer understanding of your business
          performance, or looking for ways to improve your operations? Tell us a
          little about your business and how CBO Group can help.
        </p>
      </div>
      <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 480px", minWidth: 300 }}>
          {submitted ? (
            <div style={{ borderTop: "1px solid #E4DED7", paddingTop: 30 }}>
              <h3
                style={{
                  fontFamily: "'Source Serif 4',serif",
                  fontSize: 22,
                  color: "#262321",
                  margin: "0 0 10px",
                }}
              >
                Thank you.
              </h3>
              <p style={{ fontSize: 15, color: "#5A5654", margin: 0 }}>
                Your message has been received. CBO Group will be in touch soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setSubmitError(false);
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(contact),
                  });
                  if (!res.ok) throw new Error("Failed");
                  setSubmitted(true);
                } catch {
                  setSubmitError(true);
                } finally {
                  setSubmitting(false);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={contact.name}
                  onChange={(e) => setField("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  Business Name
                </label>
                <input
                  type="text"
                  value={contact.businessName}
                  onChange={(e) => setField("businessName", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#262321",
                      margin: "0 0 6px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setField("email", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#262321",
                      margin: "0 0 6px",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  What Can We Help With?
                </label>
                <select
                  value={contact.helpWith}
                  onChange={(e) => setField("helpWith", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select an option</option>
                  {helpOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#262321",
                    margin: "0 0 6px",
                  }}
                >
                  Message
                </label>
                <textarea
                  rows={5}
                  value={contact.message}
                  onChange={(e) => setField("message", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <SubmitButton disabled={submitting}>
                {submitting ? "Sending…" : "Contact CBO Group"}
              </SubmitButton>
              {submitError && (
                <p style={{ fontSize: 14, color: "#B94040", margin: 0 }}>
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          )}
        </div>
        <div style={{ flex: "1 1 260px", minWidth: 260, position: "relative" }}>
          <p
            style={{
              fontFamily: "'Source Serif 4',serif",
              fontSize: 16,
              color: "#262321",
              margin: "0 0 24px",
              borderTop: "1px solid #E4DED7",
              paddingTop: 20,
            }}
          >
            Contact Information
          </p>
          <p style={{ margin: "0 0 20px" }}>
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8A6D3F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Phone</span>
            <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 20, fontWeight: 500, color: "#262321" }}>612-477-7474</span>
          </p>
          <p style={{ margin: 0 }}>
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8A6D3F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Email</span>
            <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 17, fontWeight: 500, color: "#262321" }}>info@cbogroupco.com</span>
          </p>
          <img
            src="/images/CBO-logo-brown.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -180,
              right: -60,
              width: 420,
              height: "auto",
              opacity: 0.08,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const saved = sessionStorage.getItem("cbo-page") as Page | null;
    const valid: Page[] = [
      "home",
      "about",
      "bookkeeping",
      "business-performance",
      "operations-advisory",
      "contact",
    ];
    return saved && valid.includes(saved) ? saved : "home";
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1080);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [countUpActive, setCountUpActive] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);

  const animProgress = useCountUp(countUpActive);

  const onPerfInView = useCallback(() => {
    setCountUpActive(true);
    setChartVisible(true);
  }, []);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    sessionStorage.setItem("cbo-page", p);
    setMobileNavOpen(false);
    window.scrollTo(0, 0);
    if (p === "home") {
      setCountUpActive(false);
      setChartVisible(false);
    }
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1080);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      style={{
        background: "#FFFFFF",
        fontFamily: "'Work Sans',sans-serif",
        color: "#5A5654",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Header
        page={page}
        isMobile={isMobile}
        mobileNavOpen={mobileNavOpen}
        navigate={navigate}
        toggleMobileNav={() => setMobileNavOpen((v) => !v)}
        closeMobileNav={() => setMobileNavOpen(false)}
      />
      <main style={{ flex: 1 }}>
        {page === "home" && (
          <HomePage
            navigate={navigate}
            animProgress={animProgress}
            chartVisible={chartVisible}
            onPerfInView={onPerfInView}
          />
        )}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "bookkeeping" && <BookkeepingPage navigate={navigate} />}
        {page === "business-performance" && (
          <BusinessPerformancePage navigate={navigate} />
        )}
        {page === "operations-advisory" && (
          <OperationsAdvisoryPage navigate={navigate} />
        )}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
