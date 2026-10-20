import { useId, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { icons } from "@/components/icons/iconMap";
import { CURRENT_USER } from "@/data/team";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { logout } from "@/lib/auth";
import { toast } from "sonner";
import { buttonClass } from "@/components/ui/button-styles";
import { useOverlayDismiss } from "@/hooks/use-overlay-dismiss";
import { findNav } from "./nav";

type Panel = "notifications" | "help" | null;

const NOTIFICATIONS = [
  {
    icon: icons.alert,
    tone: "text-error",
    title: "7 mitigations overdue",
    detail: "Oldest: MIT-0033-A (BMS watchdog validation), 55 days late.",
    time: "just now",
  },
  {
    icon: icons.ai,
    tone: "text-tertiary",
    title: "23 AI suggestions pending review",
    detail: "New batch generated for Battery Pack and Signal Processing.",
    time: "2h ago",
  },
  {
    icon: icons.reports,
    tone: "text-tertiary",
    title: "Report ready to download",
    detail: "Risk Summary Report (PDF) finished generating.",
    time: "5h ago",
  },
];

const HELP_LINKS = [
  {
    icon: icons.standard,
    title: "DFMEA quick start guide",
    detail: "How to add failure modes, score S/O/D, and approve rows.",
  },
  {
    icon: icons.standard,
    title: "ISO 14971 · Risk Management",
    detail: "The core medical-device risk management standard.",
  },
  {
    icon: icons.standard,
    title: "IEC 62304 · Software Life Cycle",
    detail: "Software failure modes and safety classification.",
  },
  {
    icon: icons.standard,
    title: "How RPN is calculated",
    detail: "RPN = Severity × Occurrence × Detection.",
  },
];

const iconButton =
  "relative flex size-8 items-center justify-center rounded-full bg-action text-tertiary outline-none transition-colors duration-[180ms] ease-out hover:bg-raised-2 hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-active";

export function TopHeader({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  const [panel, setPanel] = useState<Panel>(null);
  const router = useRouter();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const nav = findNav(pathname);
  const toggle = (p: Panel) => {
    setPanel((cur) => (cur === p ? null : p));
    console.log(`[TopHeader] ${p} panel ${panel === p ? "closed" : "opened"}`);
  };
  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-hairline bg-page px-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} aria-label="Open menu" className={`${iconButton} lg:hidden`}>
          <icons.menu className="size-4" aria-hidden="true" />
        </button>
        <div className="hidden min-w-0 sm:block">
          <div className="type-eyebrow truncate text-quaternary">{nav?.group ?? "PragnaAI"}</div>
        </div>
        {nav && <h1 className="sr-only">{nav.item.title}</h1>}
        <button
          onClick={() => {
            console.log("[TopHeader] Switch project clicked");
            toast("Project switcher: only CardioGuard 3000 available in this demo.");
          }}
          className="type-label-sm hidden h-8 items-center gap-2 rounded-full border border-hairline bg-action px-3 text-secondary-foreground outline-none transition-colors duration-[180ms] ease-out hover:border-strong hover:bg-raised-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-active md:inline-flex"
        >
          <span className="text-tertiary">Project:</span>
          <span>CardioGuard 3000</span>
          <span className="text-quaternary">|</span>
          <span>Rev B</span>
          <span className="text-quaternary">|</span>
          <span className="tabular">DFMEA-2025-001</span>
          <icons.chevronDown className="size-3 text-quaternary" aria-hidden="true" />
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="relative">
          <button
            onClick={() => toggle("notifications")}
            className={`${iconButton} ${panel === "notifications" ? "bg-raised-2 text-foreground" : ""}`}
            aria-label="Notifications"
            aria-haspopup="dialog"
            aria-expanded={panel === "notifications"}
          >
            <icons.notifications className="size-4" aria-hidden="true" />
            <span className="type-caption tabular absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-error-surface text-error">
              3
            </span>
          </button>
          {panel === "notifications" && (
            <Dropdown
              onClose={() => setPanel(null)}
              title="Notifications"
              footer={
                <button
                  onClick={() => {
                    toast.success("All notifications marked as read.");
                    setPanel(null);
                  }}
                  className={buttonClass("ghost", { size: "sm", className: "-ml-3" })}
                >
                  Mark all as read
                </button>
              }
            >
              {NOTIFICATIONS.map((n) => (
                <button
                  key={n.title}
                  onClick={() => {
                    console.log("[Notifications] clicked", n.title);
                    toast(n.title);
                  }}
                  className="flex w-full gap-3 border-b border-hairline px-4 py-3 text-left outline-none transition-colors duration-[150ms] last:border-b-0 hover:bg-raised focus-visible:bg-raised focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-active"
                >
                  <n.icon className={`mt-0.5 size-4 shrink-0 ${n.tone}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="type-label-md truncate text-foreground">{n.title}</span>
                      <span className="type-caption tabular shrink-0 font-normal text-quaternary">
                        {n.time}
                      </span>
                    </div>
                    <p className="type-body-sm mt-0.5 text-tertiary">{n.detail}</p>
                  </div>
                </button>
              ))}
            </Dropdown>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => toggle("help")}
            className={`${iconButton} ${panel === "help" ? "bg-raised-2 text-foreground" : ""}`}
            aria-label="Help"
            aria-haspopup="dialog"
            aria-expanded={panel === "help"}
          >
            <icons.help className="size-4" aria-hidden="true" />
          </button>
          {panel === "help" && (
            <Dropdown
              onClose={() => setPanel(null)}
              title="Help & Standards"
              footer={
                <button
                  onClick={() => {
                    toast("Opening full documentation…");
                    setPanel(null);
                  }}
                  className={buttonClass("ghost", { size: "sm", className: "-ml-3" })}
                >
                  Open documentation <icons.external className="size-3" aria-hidden="true" />
                </button>
              }
            >
              {HELP_LINKS.map((h) => (
                <button
                  key={h.title}
                  onClick={() => {
                    console.log("[Help] clicked", h.title);
                    toast(`Opening: ${h.title}`);
                  }}
                  className="flex w-full gap-3 border-b border-hairline px-4 py-3 text-left outline-none transition-colors duration-[150ms] last:border-b-0 hover:bg-raised focus-visible:bg-raised focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-active"
                >
                  <h.icon className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="type-label-md truncate text-foreground">{h.title}</div>
                    <p className="type-body-sm mt-0.5 text-tertiary">{h.detail}</p>
                  </div>
                </button>
              ))}
            </Dropdown>
          )}
        </div>

        <div className="flex h-8 items-center gap-2 rounded-full border border-hairline bg-action px-1 sm:pr-3">
          <EngineerAvatar name={CURRENT_USER.name} />
          <span className="type-label-sm hidden text-foreground sm:block">{CURRENT_USER.name}</span>
        </div>
        <span className="type-label-sm hidden h-8 items-center rounded-full border border-hairline bg-action px-3 text-tertiary md:inline-flex">
          MediCore Systems
        </span>
        <button onClick={handleLogout} aria-label="Log out" title="Log out" className={iconButton}>
          <icons.logout className="size-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function Dropdown({
  title,
  children,
  footer,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}) {
  const titleId = useId();
  useOverlayDismiss(true, onClose);
  return (
    <>
      {/* click-outside overlay */}
      <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-labelledby={titleId}
        className="absolute top-[calc(100%+8px)] right-0 z-40 w-80 overflow-hidden rounded-lg border border-strong bg-container shadow-lg max-sm:fixed max-sm:top-[calc(3.5rem+8px)] max-sm:right-4 max-sm:left-4 max-sm:w-auto"
      >
        <div className="flex h-11 items-center justify-between border-b border-hairline px-4">
          <h2 id={titleId} className="type-eyebrow text-quaternary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={buttonClass("icon", { className: "size-7" })}
            aria-label="Close"
          >
            <icons.close className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-hairline px-4 py-1.5">{footer}</div>}
      </div>
    </>
  );
}
