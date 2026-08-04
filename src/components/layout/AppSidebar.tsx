import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, GitBranch, Table2, Sparkles, ShieldAlert, Link as LinkIcon,
  BookOpen, FolderOpen, FileDown, Settings, HelpCircle, X, ExternalLink, Plug,
} from "lucide-react";

const logoSrc = `${import.meta.env.BASE_URL}brand/wayam-logo-light.svg`;

const items = [
  { title: "Project Overview", url: "/overview", icon: LayoutDashboard },
  { title: "Product Hierarchy", url: "/hierarchy", icon: GitBranch },
  { title: "DFMEA Workspace", url: "/workspace", icon: Table2, badge: "280", tone: "muted" as const },
  { title: "AI Analysis", url: "/ai-analysis", icon: Sparkles, badge: "23", tone: "ai" as const },
  { title: "Risk Register", url: "/risk-register", icon: ShieldAlert, badge: "14", tone: "danger" as const },
  { title: "Traceability", url: "/traceability", icon: LinkIcon },
  { title: "Knowledge Base", url: "/knowledge-base", icon: BookOpen },
  { title: "Document Vault", url: "/documents", icon: FolderOpen },
  { title: "Integrations", url: "/integrations", icon: Plug, badge: "6", tone: "muted" as const },
  { title: "Reports", url: "/reports", icon: FileDown },
];

const secondary = [
  { title: "Settings", url: "#", icon: Settings },
  { title: "Help & Standards", url: "#", icon: HelpCircle },
];

export function AppSidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (u: string) => pathname === u || (u === "/overview" && pathname === "/");
  const [modal, setModal] = useState<"Settings" | "Help & Standards" | null>(null);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="flex h-[64px] items-center gap-3 border-b border-sidebar-border bg-white/95 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-black/5">
          <img src={logoSrc} alt="RiskLens AI" className="h-8 w-8 object-contain" />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-semibold text-slate-900">RiskLens AI</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">FMEA Intelligence</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded p-1 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {items.map((it) => {
            const active = isActive(it.url);
            return (
              <li key={it.url}>
                <Link
                  to={it.url}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-sidebar-primary text-white border-l-[3px] border-white pl-[9px]"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                  }`}
                >
                  <it.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{it.title}</span>
                  {it.badge && (
                    <span
                      className={`inline-flex min-w-6 justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        it.tone === "danger"
                          ? "bg-red-500 text-white"
                          : it.tone === "ai"
                          ? "bg-[color:var(--ai-accent)] text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {it.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="my-3 border-t border-sidebar-border" />
        <ul className="space-y-0.5">
          {secondary.map((it) => (
            <li key={it.title}>
              <button
                onClick={() => {
                  console.log(`[Sidebar] ${it.title} opened`);
                  setModal(it.title as "Settings" | "Help & Standards");
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
              >
                <it.icon className="h-4 w-4" />
                <span>{it.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {modal === "Settings" && <SettingsModal onClose={() => setModal(null)} />}
      {modal === "Help & Standards" && <HelpModal onClose={() => setModal(null)} />}
      </aside>
    </>
  );
}

function ModalShell({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-foreground">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-2xl">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => { setOn(!on); console.log(`[Settings] ${label} = ${!on}`); }}
        className={`relative h-5 w-9 rounded-full transition ${on ? "bg-primary" : "bg-muted-foreground/30"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Settings" subtitle="Preferences for RiskLens AI (saved locally in this demo)" onClose={onClose}>
      <div className="space-y-5">
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account</h3>
          <div className="rounded-md border p-3 text-sm">
            <div className="font-semibold">R. Sharma</div>
            <div className="text-muted-foreground">Systems Engineer · MediCore Systems</div>
            <div className="mt-1 font-mono text-xs text-primary">practice@joulestowatts.com</div>
          </div>
        </section>
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notifications</h3>
          <div className="space-y-2">
            <Toggle label="Email me when a mitigation is overdue" defaultOn />
            <Toggle label="Email me when the AI generates new suggestions" defaultOn />
            <Toggle label="Weekly risk summary digest" />
          </div>
        </section>
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Display</h3>
          <div className="space-y-2">
            <Toggle label="Show residual RPN by default" />
            <Toggle label="Compact table rows" defaultOn />
          </div>
        </section>
        <div className="flex justify-end gap-2 border-t pt-4">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-muted">Cancel</button>
          <button onClick={() => { toast.success("Settings saved."); onClose(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Save changes</button>
        </div>
      </div>
    </ModalShell>
  );
}

const STANDARDS_HELP = [
  ["ISO 14971:2019", "Application of risk management to medical devices — the core DFMEA standard."],
  ["IEC 62304:2006+A1", "Medical device software life cycle — software failure modes & safety classes."],
  ["IEC 60601-1", "Basic safety and essential performance — device-level safety requirements."],
  ["IEC 60601-1-8", "Alarm systems — alarm prioritization and failure modes."],
  ["IEC 62133-2:2017", "Secondary lithium cells — battery safety requirements."],
];

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Help & Standards" subtitle="Guidance, definitions, and the standards this DFMEA follows" onClose={onClose}>
      <div className="space-y-5 text-sm">
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick help</h3>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li><span className="font-semibold text-foreground">RPN</span> = Severity × Occurrence × Detection. Higher = more urgent.</li>
            <li><span className="font-semibold text-foreground">Add a failure mode:</span> DFMEA Workspace → "Add Failure Mode".</li>
            <li><span className="font-semibold text-foreground">Review AI ideas:</span> AI Analysis → Accept / Edit / Reject.</li>
            <li><span className="font-semibold text-foreground">Check coverage:</span> Traceability → red cells are testing gaps.</li>
          </ul>
        </section>
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Standards referenced</h3>
          <div className="space-y-2">
            {STANDARDS_HELP.map(([id, desc]) => (
              <button key={id} onClick={() => { console.log("[Help] standard", id); toast(`Opening ${id}`); }} className="flex w-full items-start gap-3 rounded-md border p-3 text-left hover:bg-muted/50">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="font-mono text-xs font-semibold text-primary">{id}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
        <div className="flex items-center justify-between border-t pt-4">
          <button onClick={() => { toast("Opening support chat…"); onClose(); }} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Contact support <ExternalLink className="h-3 w-3" /></button>
          <button onClick={onClose} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Got it</button>
        </div>
      </div>
    </ModalShell>
  );
}