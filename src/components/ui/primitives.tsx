import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/icons/Mark";
import { icons, marks } from "@/components/icons/iconMap";
import { inputClass } from "./input-styles";
import type { Tone } from "@/lib/severity";
import { toneBadge, toneDot, toneText } from "./tone-styles";

// Chronus shared primitives (CHRONUS_DESIGN_SYSTEM.md section 4).
// Components use semantic tokens only: bg-container, border-hairline, text-quaternary...

export type { Tone };

/** Unit or percent sign beside a Michroma value: Geist, same colour, slightly smaller. */
export const Unit = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("ml-0.5 font-sans text-[0.7em] tracking-normal", className)}>{children}</span>
);

/** Content card: 8px radius, hairline border, no shadow, optional eyebrow header. */
export const Panel = ({
  title,
  icon: Icon,
  action,
  padded = true,
  className,
  bodyClassName,
  children,
}: {
  title?: ReactNode;
  /** Greyscale 16px icon before the title. */
  icon?: LucideIcon;
  action?: ReactNode;
  padded?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) => (
  <section
    className={cn(
      "flex flex-col overflow-hidden rounded-lg border border-hairline bg-container",
      className,
    )}
  >
    {title && (
      <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-hairline px-4">
        <h3 className="type-eyebrow flex min-w-0 items-center gap-2 text-quaternary">
          {Icon && <Icon className="size-4 shrink-0 text-tertiary" aria-hidden="true" />}
          <span className="truncate">{title}</span>
        </h3>
        {action && <div className="shrink-0">{action}</div>}
      </header>
    )}
    <div className={cn("min-h-0 flex-1 overflow-auto", padded && "p-4", bodyClassName)}>
      {children}
    </div>
  </section>
);

/** KPI tile: eyebrow label, Michroma tabular value, signed delta and hint. */
export const KpiTile = ({
  label,
  icon: Icon,
  value,
  unit,
  delta,
  tone = "neutral",
  hint,
  onClick,
  className,
  valueClassName,
}: {
  label: string;
  /** Top-right 16px icon, tertiary. */
  icon?: LucideIcon;
  value: ReactNode;
  unit?: string;
  delta?: string;
  tone?: Tone;
  hint?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  className?: string;
  valueClassName?: string;
}) => {
  const body = (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className="type-eyebrow text-quaternary">{label}</span>
        {Icon && <Icon className="size-4 shrink-0 text-tertiary" aria-hidden="true" />}
      </span>
      <span
        className={cn(
          "type-display-xl sm:type-display-2xl tabular text-foreground",
          valueClassName,
        )}
      >
        {value}
        {unit && <Unit>{unit}</Unit>}
      </span>
      {(delta || hint) && (
        <span className="flex flex-wrap items-baseline gap-x-2">
          {delta && <span className={cn("type-body-sm tabular", toneText[tone])}>{delta}</span>}
          {hint && <span className="type-caption text-quaternary">{hint}</span>}
        </span>
      )}
    </>
  );
  const base =
    "flex min-w-0 flex-col gap-1.5 rounded-lg border border-hairline bg-container px-4 py-3.5 text-left";
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        base,
        "outline-none transition-colors duration-[150ms] hover:border-strong focus-visible:ring-2 focus-visible:ring-active",
        className,
      )}
    >
      {body}
    </button>
  ) : (
    <div className={cn(base, className)}>{body}</div>
  );
};

export const StatusDot = ({ tone = "neutral", className }: { tone?: Tone; className?: string }) => (
  <span
    aria-hidden
    className={cn("inline-block size-1.5 shrink-0 rounded-full", toneDot[tone], className)}
  />
);

/** Normal states are quiet: a status dot and plain text. Reserve solid badges for states that need attention. */
export const QuietStatus = ({
  tone = "success",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "type-body-sm inline-flex items-center gap-1.5 whitespace-nowrap text-tertiary",
      className,
    )}
  >
    <StatusDot tone={tone} />
    {children}
  </span>
);

/** Solid pill with white text, for states that need attention. */
export const ToneBadge = ({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "type-caption inline-flex items-center truncate rounded-full px-2.5 py-0.5 whitespace-nowrap text-badge",
      toneBadge[tone],
      className,
    )}
  >
    {children}
  </span>
);

/** Short statement under the empty mark, no call to action. */
export const EmptyState = ({
  title = "Nothing to show",
  detail,
  className,
}: {
  title?: string;
  detail?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex min-h-[160px] flex-col items-center justify-center gap-1.5 px-6 text-center",
      className,
    )}
  >
    <Mark id={marks.empty} size={72} className="mb-1" />
    <p className="type-body-md text-tertiary">{title}</p>
    {detail && <p className="type-body-sm text-quaternary">{detail}</p>}
  </div>
);

/** Toolbar search field: the pill input with a leading search icon. */
export const SearchInput = ({
  wrapperClassName,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { wrapperClassName?: string }) => (
  <div className={cn("relative", wrapperClassName)}>
    <icons.search
      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-quaternary"
      aria-hidden="true"
    />
    <input {...props} className={inputClass("sm", cn("pl-9", className))} />
  </div>
);
