import type { DemoState } from "../types";

export const BUSINESS_PERFORMANCE_COPY = {
  hero: {
    eyebrow: "Business Performance",
    headlinePart1: "Go beyond the",
    headlinePart2: "numbers.",
    body1: "Bookkeeping tells you what happened. Business performance analysis helps you understand why.",
    body2: "CBO Group analyzes your financial information to identify trends, understand what's driving your results, and uncover opportunities to improve profitability and performance.",
  },
  demo: {
    eyebrow: "Try a Quick Estimate",
    heading: "Adjust the inputs, see the impact.",
    disclaimer:
      "For illustration only — not a substitute for a full financial review.",
    sliders: [
      {
        label: "Monthly Revenue",
        field: "revenue" as keyof DemoState,
        min: 10000,
        max: 200000,
        step: 1000,
      },
      {
        label: "Monthly Operating Expenses",
        field: "expenses" as keyof DemoState,
        min: 0,
        max: 150000,
        step: 1000,
      },
      {
        label: "Labor Cost %",
        field: "laborPct" as keyof DemoState,
        min: 0,
        max: 60,
        step: 1,
      },
    ],
    results: {
      netProfitLabel: "Estimated Net Profit",
      grossMarginLabel: "Gross Margin",
      laborCostLabel: "Estimated Labor Cost",
    },
  },
  feature: {
    imageAlt: "Business performance analysis",
    heading: "From data to decisions.",
    body: "We translate financial data into practical insight — so you know not just what your numbers say, but what to do about it.",
    ctaLink: "Contact CBO Group to learn more →",
  },
  closingCTA: {
    heading: "See what your numbers are really telling you.",
    button: "Contact CBO Group →",
  },
};
