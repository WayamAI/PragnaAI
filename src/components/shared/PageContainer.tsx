import type { ReactNode } from "react";
import { PageHeader, PageBody } from "@/components/layout/PageHeader";

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
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      <PageBody>{children}</PageBody>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-hairline bg-card p-5 ${className}`}>{children}</div>
  );
}
