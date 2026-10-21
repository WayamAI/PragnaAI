import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import type { AppIconComponent } from "@/components/icons/iconMap";
import { cn } from "@/lib/utils";
import { icons } from "@/components/icons/iconMap";
import { inputClass, selectClass } from "./input-styles";
import type { Tone } from "@/lib/severity";
import { toneBadge, toneDot, toneText } from "./tone-styles";

// Chronus shared primitives (CHRONUS_DESIGN_SYSTEM.md section 4).
// Components use semantic tokens only: bg-container, border-hairline, text-quaternary...

export type { Tone };

/** Unit or percent sign beside a Michroma value: Geist, same colour, slightly smaller. */
export const Unit = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("ml-0.5 font-sans text-[0.7em] tracking-normal", className)}>{children}</span>
);

/** Content card: 8px radius, hairline border, no shadow, optional eyebrow header on a raised band. */
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
  /** Icon before the title, drawn at 20px. */
  icon?: AppIconComponent;
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
      <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-hairline bg-raised px-4">
        <h3 className="type-eyebrow flex min-w-0 items-center gap-2 text-quaternary">
          {Icon && <Icon size={20} />}
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

/**
 * KPI tile: icon puck and one-line label (truncated with the full text in the title; on a phone
 * the label sits under the icon and may take two lines), Michroma tabular
 * value, signed delta and hint. The header is a fixed height so values share a baseline in a row.
 */
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
  /** 28px icon on a soft brand-tint circle, top left. */
  icon?: AppIconComponent;
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
      <span className="flex flex-col items-start gap-2 sm:h-9 sm:flex-row sm:items-center sm:gap-2.5">
        {Icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint">
            <Icon size={28} />
          </span>
        )}
        <span
          className="type-eyebrow min-w-0 text-quaternary max-sm:line-clamp-2 max-sm:min-h-8 sm:truncate"
          title={label}
        >
          {label}
        </span>
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
    "flex min-w-0 flex-col gap-2 rounded-lg border border-hairline bg-container px-4 py-3.5 text-left";
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
    <icons.empty size={44} className="mb-1" />
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
      size={16}
      className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-quaternary"
    />
    <input {...props} className={inputClass("sm", cn("pl-9", className))} />
  </div>
);

/** Native select with our chevron: the browser arrow is hidden and the icon sits over it. */
export const SelectField = ({
  className,
  wrapperClassName,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string }) => (
  <span className={cn("relative inline-flex", wrapperClassName)}>
    <select {...props} className={cn(selectClass, "cursor-pointer appearance-none", className)}>
      {children}
    </select>
    <icons.chevronDown
      size={12}
      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
    />
  </span>
);

/** Checkbox or radio drawn by us: a bordered box with the check icon, or a ring with a dot. */
export const CheckInput = ({
  type = "checkbox",
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { type?: "checkbox" | "radio" }) => (
  <span className={cn("relative inline-flex size-4 shrink-0", className)}>
    <input
      {...props}
      type={type}
      className={cn(
        "peer size-4 cursor-pointer appearance-none border border-strong bg-action outline-none transition-colors focus-visible:ring-2 focus-visible:ring-active disabled:opacity-40",
        type === "checkbox"
          ? "rounded-[4px] checked:border-brand checked:bg-brand-tint"
          : "rounded-full checked:border-brand checked:bg-[radial-gradient(circle,var(--brand-500)_0_36%,transparent_42%)]",
      )}
    />
    {type === "checkbox" && (
      <icons.check
        size={12}
        className="pointer-events-none absolute inset-0 m-auto opacity-0 peer-checked:opacity-100"
      />
    )}
  </span>
);
