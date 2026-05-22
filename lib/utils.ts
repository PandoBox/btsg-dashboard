export function fmt(n: number, decimals = 0): string {
  if (Math.abs(n) >= 1_000_000_000)
    return (n / 1_000_000_000).toFixed(1) + "B";
  if (Math.abs(n) >= 1_000_000)
    return (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000)
    return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(decimals);
}

export function fmtFull(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function deltaClass(v: number): string {
  return v > 0 ? "positive" : v < 0 ? "negative" : "text-white-60";
}

export function deltaSign(v: number): string {
  return v > 0 ? "+" : "";
}

/** Returns rolling 12-month start date (ISO string) */
export function rollingStart(months = 12): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().split("T")[0];
}

export const BU_COLORS: Record<string, string> = {
  BTSC:  "#818CF8",
  BTSG:  "#5EEAD4",
  VGI:   "#FCD34D",
  RBH:   "#FB7185",
  Other: "#94A3B8",
};

export function buColor(bu: string): string {
  return BU_COLORS[bu] ?? "#94A3B8";
}

export const CHART_COLORS = [
  "#5EEAD4", "#818CF8", "#FCD34D", "#FB7185",
  "#34D399", "#A78BFA", "#60A5FA", "#F472B6",
  "#FBBF24", "#4ADE80",
];
