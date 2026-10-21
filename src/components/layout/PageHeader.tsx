import type { ReactNode } from "react";
import type { AppIconComponent } from "@/components/icons/iconMap";

/** Page title block: page icon, Michroma title, one-line description, right-aligned actions. */
export function PageHeader({
  title,
  subtitle,
  actions,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** The page's icon: the same one its sidebar item shows, drawn at 44px. */
  icon?: AppIconComponent;
}) {
  return (
    <header className="shrink-0 border-b border-hairline px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && <Icon size={44} />}
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
