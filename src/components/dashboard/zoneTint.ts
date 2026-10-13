import { severityTone, type Severity } from "@/lib/severity";

/** Matrix zone tint for a band, from the same tone RiskBadge uses for that severity. */
export function zoneTint(band: Exclude<Severity, "Critical">) {
  const tone = severityTone[band];
  return {
    bg: `var(--feedback-${tone}-background)`,
    text: `var(--feedback-${tone}-content)`,
  };
}
