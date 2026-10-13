import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClass } from "./button-styles";
import { useOverlayDismiss } from "@/hooks/use-overlay-dismiss";

/**
 * Chronus modal: page/70 scrim, rounded-xl, strong hairline, no shadow, Michroma title,
 * footer slot. Presentational only: open state and actions stay with the caller.
 */
export function ModalShell({
  title,
  subtitle,
  icon,
  titleExtra,
  children,
  footer,
  onClose,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  titleExtra?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const titleId = useId();
  useOverlayDismiss(true, onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-foreground">
      <div className="absolute inset-0 bg-page/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-strong bg-container",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-hairline px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {icon && (
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-action text-tertiary">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h2
                id={titleId}
                className="type-display-lg flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground"
              >
                {title}
                {titleExtra}
              </h2>
              {subtitle && <p className="type-body-sm mt-1 text-tertiary">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className={buttonClass("icon", { className: "size-7 shrink-0" })}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
