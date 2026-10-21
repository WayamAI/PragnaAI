import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

const SIDEBAR_KEY = "pragnaai-sidebar-expanded";

/** Remembered for the browser session; first visit opens the labelled sidebar from lg. */
function readExpanded() {
  try {
    const saved = sessionStorage.getItem(SIDEBAR_KEY);
    if (saved !== null) return saved === "1";
  } catch {
    // Storage blocked: fall through to the width default.
  }
  return typeof window !== "undefined" && window.innerWidth >= 1024;
}

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
  const [expanded, setExpanded] = useState(readExpanded);
  const toggleExpanded = () =>
    setExpanded((v) => {
      try {
        sessionStorage.setItem(SIDEBAR_KEY, v ? "0" : "1");
      } catch {
        // Private mode or blocked storage: the choice just is not remembered.
      }
      return !v;
    });

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-page">
      <AppSidebar
        open={mobileOpen}
        onClose={onMobileClose}
        expanded={expanded}
        onToggleExpanded={toggleExpanded}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onMenuClick={onMobileToggle} />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
