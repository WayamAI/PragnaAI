import type { RiskLevel } from "@/data/dfmea";

const styles: Record<RiskLevel, string> = {
  Critical: "bg-red-50 text-red-800 border border-red-300",
  High: "bg-amber-50 text-amber-800 border border-amber-300",
  Medium: "bg-yellow-50 text-yellow-900 border border-yellow-300",
  Low: "bg-emerald-50 text-emerald-800 border border-emerald-300",
};

export function badgeForRpn(rpn: number, s?: number): RiskLevel {
  if (rpn >= 200 || (s && s >= 9 && rpn >= 100)) return "Critical";
  if (rpn >= 100) return "High";
  if (rpn >= 50) return "Medium";
  return "Low";
}

export function RiskBadge({ level, className = "" }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${styles[level]} ${className}`}
    >
      {level}
    </span>
  );
}

export function RpnCell({ rpn, s }: { rpn: number; s?: number }) {
  const lvl = badgeForRpn(rpn, s);
  const color =
    lvl === "Critical" ? "text-red-700" :
    lvl === "High" ? "text-amber-700" :
    lvl === "Medium" ? "text-yellow-800" : "text-emerald-700";
  return <span className={`font-mono font-semibold ${color}`}>{rpn}</span>;
}