import type { ReactNode } from "react";

/** Page title block: Michroma title, one-line description, right-aligned actions. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="shrink-0 border-b border-hairline px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="type-display-lg sm:type-display-xl text-foreground">{title}</h2>
          {subtitle && <p className="type-body-md mt-1 max-w-[70ch] text-tertiary">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/** Scrolling page body. The document never scrolls; this region does. */
export function PageBody({ children }: { children: ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>;
}
