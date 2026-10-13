import type { RiskLevel } from "@/data/dfmea";
import { severityTone } from "@/lib/severity";
import { ToneBadge } from "@/components/ui/primitives";
import { toneText } from "@/components/ui/tone-styles";

export function badgeForRpn(rpn: number, s?: number): RiskLevel {
  if (rpn >= 200 || (s && s >= 9 && rpn >= 100)) return "Critical";
  if (rpn >= 100) return "High";
  if (rpn >= 50) return "Medium";
  return "Low";
}

// Critical is error, High is warning, Medium is info, Low is neutral.
export function RiskBadge({ level, className = "" }: { level: RiskLevel; className?: string }) {
  return (
    <ToneBadge tone={severityTone[level]} className={className}>
      {level}
    </ToneBadge>
  );
}

export function RpnCell({ rpn, s }: { rpn: number; s?: number }) {
  const tone = severityTone[badgeForRpn(rpn, s)];
  const color = tone === "neutral" ? "text-secondary-foreground" : toneText[tone];
  return <span className={`tabular font-medium ${color}`}>{rpn}</span>;
}
