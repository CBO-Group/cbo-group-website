import type { AgChartOptions } from "ag-charts-community";

export const chartOptions = {
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
