import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type SyntheticEvent } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { icons } from "@/components/icons/iconMap";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme";
import { buttonClass } from "@/components/ui/button-styles";
import { ModalShell } from "@/components/ui/modal";
import { isNavActive, navGroups } from "./nav";

const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`;

type Flyout = { label: string; count?: string; top: number };

const puckBase =
  "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-[180ms] ease-out";
const puckIdle =
  "bg-action text-tertiary group-hover:bg-raised-2 group-hover:text-secondary-foreground";
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

  // Below lg the sidebar is an off-canvas drawer and always shows its full
  // layout. From lg it is a 68px rail that expands to 252px; labels are shown
  // only when expanded.
  const railOnly = expanded ? "" : "lg:hidden";

  // Collapsed rail: hovering or focusing a puck shows its label to the right.
  // The nav column scrolls (and clips), so the flyout is position:fixed.
  const showFlyout = (e: SyntheticEvent<HTMLElement>, label: string, count?: string) => {
    if (expanded) return;
    const r = e.currentTarget.getBoundingClientRect();
    setFlyout({ label, count, top: r.top + r.height / 2 });
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

  const footerButton = (label: string, Icon: LucideIcon, onClick: () => void, extra?: object) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onMouseEnter={(e) => showFlyout(e, label)}
      onFocus={(e) => showFlyout(e, label)}
      onMouseLeave={hideFlyout}
      onBlur={hideFlyout}
      className={cn("group flex items-center gap-3 rounded-full", rowFocus, !expanded && "lg:w-9")}
      {...extra}
    >
      <span className={cn(puckBase, puckIdle)}>
        <Icon className="size-[17px]" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "type-label-sm truncate text-tertiary transition-colors duration-[180ms] group-hover:text-secondary-foreground",
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
            <icons.close className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <nav
            aria-label="Primary"
            className={cn("flex flex-col gap-1.5 px-3 py-3", !expanded && "lg:px-[14px]")}
          >
            {navGroups.map((group, gi) => (
              <div key={group.label} className="flex flex-col gap-1.5">
                {gi > 0 && (
                  <div
                    className={cn("mx-1 my-1 border-t border-hairline", expanded ? "" : "lg:mx-2")}
                  />
                )}
                <div className={cn("type-eyebrow px-1 pt-1 text-quaternary", railOnly)}>
                  {group.label}
                </div>
                {group.items.map((it) => {
                  const active = isNavActive(it.url, pathname);
                  return (
                    <Link
                      key={it.url}
                      to={it.url}
                      aria-label={it.title}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={(e) => showFlyout(e, it.title, it.count)}
                      onFocus={(e) => showFlyout(e, it.title, it.count)}
                      onMouseLeave={hideFlyout}
                      onBlur={hideFlyout}
                      className={cn(
                        "group flex items-center gap-3 rounded-full",
                        rowFocus,
                        !expanded && "lg:w-9",
                      )}
                    >
                      <span
                        className={cn(
                          puckBase,
                          active ? "bg-action-primary text-on-color" : puckIdle,
                        )}
                      >
                        <it.icon className="size-[17px]" aria-hidden="true" />
                      </span>
                      <span
                        className={cn(
                          "type-label-sm min-w-0 flex-1 truncate transition-colors duration-[180ms]",
                          active
                            ? "text-foreground"
                            : "text-tertiary group-hover:text-secondary-foreground",
                          railOnly,
                        )}
                      >
                        {it.title}
                      </span>
                      {it.count && (
                        <span className={cn("type-caption tabular pr-2 text-quaternary", railOnly)}>
                          {it.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer: collapse, theme, settings, help */}
        <div
          className={cn(
            "flex shrink-0 flex-col gap-1.5 border-t border-hairline px-3 py-3",
            !expanded && "lg:px-[14px]",
          )}
        >
          <div className="hidden lg:block">
            {footerButton(
              expanded ? "Collapse sidebar" : "Expand sidebar",
              expanded ? icons.sidebarCollapse : icons.sidebarExpand,
              () => onToggleExpanded?.(),
              { "aria-expanded": expanded },
            )}
          </div>
          {footerButton(
            theme === "light" ? "Dark theme" : "Light theme",
            theme === "light" ? icons.themeDark : icons.themeLight,
            toggleTheme,
            { "aria-label": theme === "light" ? "Switch to dark theme" : "Switch to light theme" },
          )}
          {footerButton("Settings", icons.settings, () => {
            console.log("[Sidebar] Settings opened");
            setModal("Settings");
          })}
          {footerButton("Help & Standards", icons.help, () => {
            console.log("[Sidebar] Help & Standards opened");
            setModal("Help & Standards");
          })}
        </div>
      </aside>

      {flyout && !expanded && (
        <div
          role="presentation"
          style={{ top: flyout.top }}
          className="type-label-sm pointer-events-none fixed left-[76px] z-[60] hidden -translate-y-1/2 items-center gap-2 rounded-lg border border-hairline bg-container px-2.5 py-1.5 whitespace-nowrap text-foreground shadow-lg lg:flex"
        >
          {flyout.label}
          {flyout.count && <span className="tabular text-quaternary">{flyout.count}</span>}
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
          on ? "border-transparent bg-action-primary" : "bg-raised-2",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full transition-[left] duration-[180ms]",
            on ? "left-[18px] bg-on-color" : "left-0.5 bg-quaternary",
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
  [
    "ISO 14971:2019",
    "Application of risk management to medical devices — the core DFMEA standard.",
  ],
  [
    "IEC 62304:2006+A1",
    "Medical device software life cycle — software failure modes & safety classes.",
  ],
  ["IEC 60601-1", "Basic safety and essential performance — device-level safety requirements."],
  ["IEC 60601-1-8", "Alarm systems — alarm prioritization and failure modes."],
  ["IEC 62133-2:2017", "Secondary lithium cells — battery safety requirements."],
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
            Contact support <icons.external className="size-3" aria-hidden="true" />
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
                <icons.standard
                  className="mt-0.5 size-4 shrink-0 text-tertiary"
                  aria-hidden="true"
                />
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
