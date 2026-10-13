import type { Tone } from "@/lib/severity";

export const toneText: Record<Tone, string> = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  error: "text-error",
  neutral: "text-tertiary",
};

export const toneDot: Record<Tone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  error: "bg-error",
  neutral: "bg-quaternary",
};

export const toneBadge: Record<Tone, string> = {
  success: "bg-success-badge",
  info: "bg-info-badge",
  warning: "bg-warning-badge",
  error: "bg-error-badge",
  neutral: "bg-neutral-badge",
};
