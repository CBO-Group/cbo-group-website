import { useState, useCallback } from "react";
import { useIsMobile } from "./hooks/useIsMobile";
import { useCountUp } from "./hooks/useCountUp";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./components/pages/home";
import { AboutPage } from "./components/pages/AboutPage";
import { BookkeepingPage } from "./components/pages/BookkeepingPage";
import { BusinessPerformancePage } from "./components/pages/BusinessPerformancePage";
import { OperationsAdvisoryPage } from "./components/pages/OperationsAdvisoryPage";
import { ContactPage } from "./components/pages/ContactPage";
import type { Page } from "./types";

const VALID_PAGES: Page[] = [
  "home",
  "about",
  "bookkeeping",
  "business-performance",
  "operations-advisory",
  "contact",
];

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const saved = sessionStorage.getItem("cbo-page") as Page | null;
    return saved && VALID_PAGES.includes(saved) ? saved : "home";
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [countUpActive, setCountUpActive] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);

  const isMobile = useIsMobile(1080);
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
