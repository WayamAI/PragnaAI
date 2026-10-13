import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "chip";

type Options = {
  /** lg is the 44px form button; sm is the 32px toolbar pill. */
  size?: "sm" | "md" | "lg";
  /** Chip only: the selected state (use with aria-pressed). */
  active?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full outline-none transition-colors duration-[180ms] ease-out focus-visible:ring-2 focus-visible:ring-active";

const variants: Record<ButtonVariant, string> = {
  primary:
    "type-label-sm bg-action-primary px-3 py-1.5 text-on-color hover:bg-action-primary-hover disabled:bg-action-primary-disabled",
  secondary:
    "type-label-sm border border-hairline bg-action px-3 py-1.5 text-secondary-foreground hover:border-strong hover:bg-raised-2 hover:text-foreground disabled:opacity-40",
  ghost: "type-label-sm px-3 py-1.5 text-tertiary hover:text-foreground disabled:opacity-40",
  icon: "size-8 bg-action text-tertiary hover:bg-raised-2 hover:text-secondary-foreground disabled:opacity-40",
  chip: "type-label-sm border px-2.5 py-1",
};

const chipIdle =
  "border-hairline bg-action text-tertiary hover:border-strong hover:bg-raised-2 hover:text-secondary-foreground";
const chipActive = "border-transparent bg-action-primary text-on-color";

/**
 * Chronus button classes, defined once. Use on a native <button> or a router <Link>:
 * className={buttonClass("primary")}. Only one solid primary per view.
 */
export function buttonClass(variant: ButtonVariant = "secondary", opts: Options = {}) {
  const { size, active, className } = opts;
  return cn(
    base,
    variants[variant],
    size === "sm" && variant !== "icon" && "h-8",
    size === "lg" && variant !== "icon" && "type-label-md h-11 px-5",
    variant === "chip" && (active ? chipActive : chipIdle),
    className,
  );
}
