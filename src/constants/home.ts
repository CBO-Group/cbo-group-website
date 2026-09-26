import type { Page } from "../types";

export const HOME_COPY = {
  hero: {
    eyebrow: "· A modern approach to business performance ·",
    headlinePart1: "Understand your numbers.",
    headlinePart2: "Improve your business.",
    subhead:
      "CBO Group helps small businesses organize their financials, understand what's driving performance, and find practical ways to improve profitability.",
    ctaPrimary: "Contact Us",
    ctaSecondary: "See Our Services →",
    caption: "No pressure — just a conversation about your numbers.",
  },
  positioning: {
    heading: "CBO Group isn't just bookkeeping.",
    body: "Bookkeeping tells you what happened. Performance analysis explains why. Operations advisory decides what to do next. CBO Group connects all three - Backed by a decade of managing complex business operations to drive sustainable profitability, we bridge the gap between traditional financial strategy and operational execution.",
  },
  serviceCards: [
    {
      title: "Bookkeeping",
      sub: "Know what happened.",
      desc: "Accurate, organized financial records — reconciled accounts, monthly reports, and reporting you can trust.",
      tags: "Monthly bookkeeping · Reconciliations · Internal financial reports",
      linkLabel: "Explore Bookkeeping →",
      page: "bookkeeping" as Page,
    },
    {
      title: "Business Performance",
      sub: "Understand why.",
      desc: "We turn your financial data into insight — what's driving results, and where the opportunities are.",
      tags: "Revenue & expense analysis · KPI reporting · Budget vs. actual",
      linkLabel: "Explore Business Performance →",
      page: "business-performance" as Page,
    },
    {
      title: "Operations Advisory",
      sub: "Decide what to do next.",
      desc: "Practical recommendations to improve the processes, people, and systems driving performance.",
      tags: "Process improvement · Staffing & productivity · SOP development",
      linkLabel: "Explore Operations Advisory →",
      page: "operations-advisory" as Page,
    },
  ],
  performance: {
    eyebrow: "Business Performance",
    heading: "See what your numbers can tell you.",
    chartLabel: "Budget vs. Actual — illustrative example",
    ctaLink: "Explore Business Performance →",
    metrics: [
      {
        target: 428600,
        type: "currency" as const,
        label: "Revenue",
        detail: "↑ 12.4% YoY",
      },
      {
        target: 54.2,
        type: "percent" as const,
        label: "Gross Margin",
        detail: "↑ 2.1 pts YoY",
      },
      {
        target: 88450,
        type: "currency" as const,
        label: "Net Profit",
        detail: "↑ 8.7% YoY",
      },
    ],
  },
  whyCBO: {
    eyebrow: "Why CBO Group",
    heading:
      "A decade of managing complex business operations to drive sustainable profitability.",
    body1:
      "Chase Bronkhorst founded CBO Group after recognizing that traditional financial strategy and management often leave too many operational loose ends.",
    body2:
      "We bridge that gap. By aligning financial insight with strategic execution, we manage the budgets, forecasts, teams, and vendors required to scale your business seamlessly.",
    quote:
      '"My approach goes beyond simply reporting numbers — I focus on understanding what\'s driving performance."',
    ctaLink: "Meet Chase →",
    photoAlt: "Chase Bronkhorst",
  },
  closingCTA: {
    heading: "Let's build a more profitable business.",
    subtext: "Schedule a conversation to learn how CBO Group can help.",
    button: "Contact Us",
  },
};
