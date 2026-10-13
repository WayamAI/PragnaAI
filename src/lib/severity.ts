export type Tone = "success" | "info" | "warning" | "error" | "neutral";

export type Severity = "Critical" | "High" | "Medium" | "Low";

/** Chronus severity mapping: critical is error, high is warning, medium is info, low is neutral. */
export const severityTone: Record<Severity, Tone> = {
  Critical: "error",
  High: "warning",
  Medium: "info",
  Low: "neutral",
};
