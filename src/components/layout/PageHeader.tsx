import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Page title block: nav icon, Michroma title, one-line description, right-aligned actions. */
export function PageHeader({
  title,
  subtitle,
  actions,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** The sidebar icon of this page, drawn as the same puck the sidebar uses. */
  icon?: LucideIcon;
}) {
  return (
    <header className="shrink-0 border-b border-hairline px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline bg-container text-tertiary">
              <Icon className="size-[17px]" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="type-display-lg sm:type-display-xl text-foreground">{title}</h2>
            {subtitle && <p className="type-body-md mt-1 max-w-[70ch] text-tertiary">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/** Scrolling page body. The document never scrolls; this region does. */
export function PageBody({ children }: { children: ReactNode }) {
  return (
    <div
      data-scroll-restoration-id="page-body"
      className="min-h-0 flex-1 overflow-y-auto p-4 pb-20 sm:p-5 sm:pb-20"
    >
      {children}
    </div>
  );
}
