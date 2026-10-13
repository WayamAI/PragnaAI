import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/layout/PageHeader";
import { findNav } from "@/components/layout/nav";

/** Page wrapper: header (title, subtitle, actions) above a scrolling body. */
export function PageContainer({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  // The header shows the same icon as the page's sidebar item.
  const icon = findNav(pathname)?.item.icon;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title={title} subtitle={subtitle} actions={actions} icon={icon} />
      <PageBody>{children}</PageBody>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-hairline bg-card p-5 ${className}`}>{children}</div>
  );
}
