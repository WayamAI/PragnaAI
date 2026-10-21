import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type SyntheticEvent } from "react";
import { toast } from "sonner";
import type { AppIconComponent } from "@/components/icons/iconMap";
import { icons } from "@/components/icons/iconMap";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme";
import { buttonClass } from "@/components/ui/button-styles";
import { ModalShell } from "@/components/ui/modal";
import { isNavActive, navGroups } from "./nav";

const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`;

type Flyout = { group: string; label: string; top: number };

const GROUPS_KEY = "pragnaai-sidebar-groups";

/** Groups the user closed, kept for the browser session. */
function readClosed(): Set<string> {
  try {
    const raw = sessionStorage.getItem(GROUPS_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // Storage blocked or unreadable: every group starts open.
  }
  return new Set();
}

const puckBase =
  "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-[180ms] ease-out";
const puckIdle = "bg-action group-hover:bg-raised-2";
const rowFocus = "outline-none focus-visible:ring-2 focus-visible:ring-active";

export function AppSidebar({
  open = false,
  onClose,
  expanded = false,
  onToggleExpanded,
}: {
  open?: boolean;
  onClose?: () => void;
  expanded?: boolean;
  onToggleExpanded?: () => void;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [modal, setModal] = useState<"Settings" | "Help & Standards" | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [flyout, setFlyout] = useState<Flyout | null>(null);
  // Groups are open by default; the group of the current route is opened on navigation.
  const [closedGroups, setClosedGroups] = useState<Set<string>>(readClosed);
  const saveClosed = (next: Set<string>) => {
    try {
      sessionStorage.setItem(GROUPS_KEY, JSON.stringify([...next]));
    } catch {
      // Private mode: the choice just is not remembered.
    }
    return next;
  };
  const toggleGroup = (label: string) =>
    setClosedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return saveClosed(next);
    });
  const activeGroup = navGroups.find((g) =>
    g.items.some((i) => isNavActive(i.url, pathname)),
  )?.label;
  useEffect(() => {
    if (!activeGroup) return;
    setClosedGroups((prev) => {
      if (!prev.has(activeGroup)) return prev;
      const next = new Set(prev);
      next.delete(activeGroup);
      return saveClosed(next);
    });
  }, [activeGroup]);

  // Below lg the sidebar is an off-canvas drawer and always shows its full
  // layout. From lg it is a 68px rail that expands to 252px; labels are shown
  // only when expanded.
  const railOnly = expanded ? "" : "lg:hidden";

  // Collapsed rail: hovering or focusing a puck shows its label to the right.
  // The nav column scrolls (and clips), so the flyout is position:fixed.
  const showFlyout = (e: SyntheticEvent<HTMLElement>, group: string, label: string) => {
    if (expanded) return;
    const r = e.currentTarget.getBoundingClientRect();
    setFlyout({ group, label, top: r.top + r.height / 2 });
  };
  const hideFlyout = () => setFlyout(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const footerButton = (
    label: string,
    group: string,
    Icon: AppIconComponent,
    onClick: () => void,
    extra?: object,
  ) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onMouseEnter={(e) => showFlyout(e, group, label)}
      onFocus={(e) => showFlyout(e, group, label)}
      onMouseLeave={hideFlyout}
      onBlur={hideFlyout}
      title={label}
      className={cn("group flex w-full items-center gap-2.5 rounded-full", rowFocus)}
      {...extra}
    >
      <span className={cn(puckBase, puckIdle)}>
        <Icon size={24} />
      </span>
      <span
        className={cn(
          "type-label-sm truncate font-normal text-tertiary transition-colors duration-[180ms] group-hover:text-secondary-foreground",
          railOnly,
        )}
      >
        {label}
      </span>
    </button>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-page/70 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Sidebar"
        className={cn(
          "z-50 flex h-full shrink-0 flex-col border-r border-hairline bg-container",
          "transition-[width,transform,visibility] duration-200 ease-out",
          "fixed inset-y-0 left-0 w-[252px] lg:static lg:translate-x-0",
          open ? "translate-x-0" : "max-lg:invisible max-lg:-translate-x-full",
          expanded ? "lg:w-[252px]" : "lg:w-[68px]",
        )}
      >
        {/* Brand: mark only on the rail, mark + wordmark + app name when expanded */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center justify-between gap-2.5 border-b border-hairline px-3",
            !expanded && "lg:px-[18px]",
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={brand("wayam-mark-light.svg")}
              alt="PragnaAI"
              className="h-auto w-8 shrink-0 dark:hidden"
            />
            <img
              src={brand("wayam-mark-dark.svg")}
              alt="PragnaAI"
              className="hidden h-auto w-8 shrink-0 dark:block"
            />
            <div className={cn("flex min-w-0 flex-col gap-0.5", railOnly)}>
              <img
                src={brand("wayam-wordmark-light.svg")}
                alt=""
                className="h-5 w-auto self-start dark:hidden"
              />
              <img
                src={brand("wayam-wordmark-dark.svg")}
                alt=""
                className="hidden h-5 w-auto self-start dark:block"
              />
              <span className="type-eyebrow block truncate text-quaternary">PragnaAI</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full bg-action text-tertiary hover:bg-raised-2 hover:text-secondary-foreground lg:hidden",
              rowFocus,
            )}
          >
            <icons.close size={16} />
          </button>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <nav
            aria-label="Primary"
            className={cn("flex flex-col gap-1 px-3 py-3", !expanded && "lg:px-4")}
          >
            {navGroups.map((group, gi) => {
              const open = group.solo || !closedGroups.has(group.label);
              // The rail has no group headers, so it always shows every item.
              const hideItems = !open && (expanded ? "hidden" : "max-lg:hidden");
              return (
                <div key={group.label} className="flex flex-col gap-1">
                  {gi > 0 && (
                    <div
                      className={cn(
                        "my-1 border-t border-hairline",
                        expanded ? "-mx-3" : "-mx-3 lg:-mx-4",
                      )}
                    />
                  )}
                  {!group.solo && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.label)}
                      aria-expanded={open}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-1 py-1 text-left transition-colors duration-150 hover:bg-raised",
                        rowFocus,
                        railOnly,
                      )}
                    >
                      <span className="type-eyebrow text-quaternary">{group.label}</span>
                      <icons.chevronDown
                        size={12}
                        className={cn(
                          "opacity-60 grayscale transition-transform duration-150",
                          !open && "-rotate-90",
                        )}
                      />
                    </button>
                  )}
                  <div className={cn("flex flex-col gap-1", hideItems)}>
                    {group.items.map((it) => {
                      const active = isNavActive(it.url, pathname);
                      return (
                        <Link
                          key={it.url}
                          to={it.url}
                          aria-label={it.title}
                          aria-current={active ? "page" : undefined}
                          onMouseEnter={(e) => showFlyout(e, group.label, it.title)}
                          onFocus={(e) => showFlyout(e, group.label, it.title)}
                          onMouseLeave={hideFlyout}
                          onBlur={hideFlyout}
                          className={cn("group flex items-center gap-2.5 rounded-full", rowFocus)}
                        >
                          <span className={cn(puckBase, active ? "bg-action-primary" : puckIdle)}>
                            <it.icon size={24} />
                          </span>
                          <span
                            className={cn(
                              "type-label-sm truncate font-normal transition-colors duration-[180ms]",
                              active
                                ? "text-foreground"
                                : "text-tertiary group-hover:text-secondary-foreground",
                              railOnly,
                            )}
                          >
                            {it.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer: settings, help, theme and collapse, pinned to the bottom */}
        <div
          className={cn(
            "flex shrink-0 flex-col gap-1 border-t border-hairline py-2",
            expanded ? "px-3" : "px-3 lg:px-4",
          )}
        >
          {footerButton("Settings", "", icons.settings, () => {
            console.log("[Sidebar] Settings opened");
            setModal("Settings");
          })}
          {footerButton("Help & standards", "", icons.help, () => {
            console.log("[Sidebar] Help & Standards opened");
            setModal("Help & Standards");
          })}
          {footerButton(
            theme === "light" ? "Dark theme" : "Light theme",
            "",
            icons.theme,
            toggleTheme,
            { "aria-label": theme === "light" ? "Switch to dark theme" : "Switch to light theme" },
          )}
          <div className="hidden lg:block">
            {footerButton(
              expanded ? "Collapse sidebar" : "Expand sidebar",
              "",
              expanded ? icons.sidebarCollapse : icons.sidebarExpand,
              () => onToggleExpanded?.(),
              { "aria-expanded": expanded },
            )}
          </div>
        </div>
      </aside>

      {flyout && !expanded && (
        <div
          role="presentation"
          style={{ top: flyout.top }}
          className="pointer-events-none fixed left-[76px] z-[60] hidden -translate-y-1/2 rounded-xl border border-hairline bg-container px-3 py-2 shadow-lg lg:block"
        >
          {flyout.group && (
            <div className="type-eyebrow whitespace-nowrap text-quaternary">{flyout.group}</div>
          )}
          <div className="type-label-md whitespace-nowrap text-foreground">{flyout.label}</div>
        </div>
      )}

      {modal === "Settings" && <SettingsModal onClose={() => setModal(null)} />}
      {modal === "Help & Standards" && <HelpModal onClose={() => setModal(null)} />}
    </>
  );
}

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="type-body-md flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-hairline px-3 py-2 text-secondary-foreground">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => {
          setOn(!on);
          console.log(`[Settings] ${label} = ${!on}`);
        }}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border border-hairline outline-none transition-colors duration-[180ms] focus-visible:ring-2 focus-visible:ring-active",
          on ? "border-transparent bg-brand" : "bg-raised-2",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full transition-[left] duration-[180ms]",
            on ? "left-[18px] bg-white" : "left-0.5 bg-quaternary",
          )}
        />
      </button>
    </label>
  );
}

const sectionTitle = "type-eyebrow mb-2 text-quaternary";

function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      title="Settings"
      subtitle="Preferences for PragnaAI (saved locally in this demo)"
      onClose={onClose}
      footer={
        <>
          <span />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className={buttonClass("secondary", { size: "sm" })}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success("Settings saved.");
                onClose();
              }}
              className={buttonClass("primary", { size: "sm" })}
            >
              Save changes
            </button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <section>
          <h3 className={sectionTitle}>Account</h3>
          <div className="rounded-lg border border-hairline bg-raised p-3">
            <div className="type-label-md text-foreground">R. Sharma</div>
            <div className="type-body-sm text-tertiary">Systems Engineer · MediCore Systems</div>
            <div className="type-body-sm mt-1 font-mono text-secondary-foreground">
              practice@joulestowatts.com
            </div>
          </div>
        </section>
        <section>
          <h3 className={sectionTitle}>Notifications</h3>
          <div className="flex flex-col gap-2">
            <Toggle label="Email me when a mitigation is overdue" defaultOn />
            <Toggle label="Email me when the AI generates new suggestions" defaultOn />
            <Toggle label="Weekly risk summary digest" />
          </div>
        </section>
        <section>
          <h3 className={sectionTitle}>Display</h3>
          <div className="flex flex-col gap-2">
            <Toggle label="Show residual RPN by default" />
            <Toggle label="Compact table rows" defaultOn />
          </div>
        </section>
      </div>
    </ModalShell>
  );
}

const STANDARDS_HELP = [
  ["ISO 14971:2019", "Application of risk management to medical devices: the core DFMEA standard."],
  [
    "IEC 62304:2006+A1",
    "Medical device software life cycle: software failure modes & safety classes.",
  ],
  ["IEC 60601-1", "Basic safety and essential performance: device-level safety requirements."],
  ["IEC 60601-1-8", "Alarm systems: alarm prioritization and failure modes."],
  ["IEC 62133-2:2017", "Secondary lithium cells: battery safety requirements."],
];

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      title="Help & Standards"
      subtitle="Guidance, definitions, and the standards this DFMEA follows"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              toast("Opening support chat…");
              onClose();
            }}
            className={buttonClass("ghost", { size: "sm", className: "-ml-3" })}
          >
            Contact support <icons.external size={12} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={buttonClass("primary", { size: "sm" })}
          >
            Got it
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <section>
          <h3 className={sectionTitle}>Quick help</h3>
          <ul className="type-body-md list-inside list-disc space-y-1 text-tertiary">
            <li>
              <span className="font-medium text-foreground">RPN</span> = Severity × Occurrence ×
              Detection. Higher = more urgent.
            </li>
            <li>
              <span className="font-medium text-foreground">Add a failure mode:</span> DFMEA
              Workspace → "Add failure mode".
            </li>
            <li>
              <span className="font-medium text-foreground">Review AI ideas:</span> AI Analysis →
              Accept / Edit / Reject.
            </li>
            <li>
              <span className="font-medium text-foreground">Check coverage:</span> Traceability →
              red cells are testing gaps.
            </li>
          </ul>
        </section>
        <section>
          <h3 className={sectionTitle}>Standards referenced</h3>
          <div className="flex flex-col gap-2">
            {STANDARDS_HELP.map(([id, desc]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  console.log("[Help] standard", id);
                  toast(`Opening ${id}`);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border border-hairline p-3 text-left transition-colors duration-[150ms] hover:bg-raised",
                  rowFocus,
                )}
              >
                <icons.standard size={16} className="mt-0.5 shrink-0 text-tertiary" />
                <div>
                  <div className="type-label-sm font-mono text-foreground">{id}</div>
                  <div className="type-body-sm text-tertiary">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </ModalShell>
  );
}
