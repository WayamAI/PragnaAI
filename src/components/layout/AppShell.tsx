import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

/**
 * Fixed-viewport shell: the document never scrolls, the page body does.
 * The mobile drawer state lives in __root.tsx; the rail width is local here.
 */
export function AppShell({
  mobileOpen,
  onMobileClose,
  onMobileToggle,
  children,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
  onMobileToggle: () => void;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-page">
      <AppSidebar
        open={mobileOpen}
        onClose={onMobileClose}
        expanded={expanded}
        onToggleExpanded={() => setExpanded((v) => !v)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onMenuClick={onMobileToggle} />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
