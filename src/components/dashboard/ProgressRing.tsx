import { useId } from "react";
import { Unit } from "@/components/ui/primitives";

/**
 * Progress ring: brand gradient arc on a quiet track, the value centred inside and the labels
 * below. Drawn as SVG so the gradient and round caps follow the theme tokens.
 */
export function ProgressRing({
  pct,
  label,
  detail,
}: {
  pct: number;
  label: string;
  detail: string;
}) {
  const id = useId();
  const r = 40;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative size-24"
        role="img"
        aria-label={`${label}: ${pct}% complete, ${detail}`}
      >
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#dc440c" />
              <stop offset="45%" stopColor="#f0731a" />
              <stop offset="75%" stopColor="#fa8d23" />
              <stop offset="100%" stopColor="#ffa12b" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--surface-raised-x2)"
            strokeWidth="9"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * c} ${c}`}
          />
        </svg>
        <div className="type-display-base tabular absolute inset-0 grid place-items-center text-foreground">
          <span>
            {pct}
            <Unit>%</Unit>
          </span>
        </div>
      </div>
      <div className="type-label-sm mt-2 text-secondary-foreground">{label}</div>
      <div className="type-caption tabular font-normal text-quaternary">{detail}</div>
    </div>
  );
}
