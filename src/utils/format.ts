export function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

export function formatMetric(
  target: number,
  type: "currency" | "percent",
  progress: number
) {
  const val = target * progress;
  if (type === "currency") return "$" + Math.round(val).toLocaleString();
  return val.toFixed(1) + "%";
}

export function numbered<T extends object>(arr: T[]) {
  return arr.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));
}
