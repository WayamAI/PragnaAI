import { cn } from "@/lib/utils";

const field =
  "w-full rounded-full border border-hairline bg-action text-foreground outline-none placeholder:text-quaternary focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-active disabled:opacity-40";

/** Text input pill. md is the 44px form field; sm is the 32px toolbar field. */
export function inputClass(size: "sm" | "md" = "md", className?: string) {
  return cn(field, size === "md" ? "type-body-md h-11 px-4" : "type-label-sm h-8 px-3", className);
}

/** Field label: eyebrow style above the field. */
export const labelClass = "type-eyebrow text-quaternary";

/** Native select pill, toolbar size. */
export const selectClass = inputClass("sm", "w-auto pr-8");
