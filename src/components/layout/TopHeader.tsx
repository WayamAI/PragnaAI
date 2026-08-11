import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Bell, HelpCircle, ChevronDown, X, AlertTriangle, Sparkles, FileDown, BookOpen, ExternalLink, Menu, LogOut } from "lucide-react";
import { CURRENT_USER } from "@/data/team";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

type Panel = "notifications" | "help" | null;

const NOTIFICATIONS = [
  { icon: AlertTriangle, tone: "text-red-600", title: "7 mitigations overdue", detail: "Oldest: MIT-0033-A (BMS watchdog validation) — 55 days late.", time: "just now" },
  { icon: Sparkles, tone: "text-[color:var(--ai-accent)]", title: "23 AI suggestions pending review", detail: "New batch generated for Battery Pack and Signal Processing.", time: "2h ago" },
  { icon: FileDown, tone: "text-emerald-600", title: "Report ready to download", detail: "Risk Summary Report (PDF) finished generating.", time: "5h ago" },
];

const HELP_LINKS = [
  { icon: BookOpen, title: "DFMEA Quick Start Guide", detail: "How to add failure modes, score S/O/D, and approve rows." },
  { icon: BookOpen, title: "ISO 14971 — Risk Management", detail: "The core medical-device risk management standard." },
  { icon: BookOpen, title: "IEC 62304 — Software Life Cycle", detail: "Software failure modes and safety classification." },
  { icon: BookOpen, title: "How RPN is calculated", detail: "RPN = Severity × Occurrence × Detection." },
];

export function TopHeader({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  const [panel, setPanel] = useState<Panel>(null);
  const router = useRouter();
  const toggle = (p: Panel) => {
    setPanel((cur) => (cur === p ? null : p));
    console.log(`[TopHeader] ${p} panel ${panel === p ? "closed" : "opened"}`);
  };
  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-md p-2 hover:bg-muted md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden min-w-0 leading-tight sm:block">
            <div className="truncate text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              PragnaAI control room
            </div>
          </div>
          <div className="hidden h-8 w-px bg-border md:block" />
          <button onClick={() => { console.log("[TopHeader] Switch project clicked"); toast("Project switcher — only CardioGuard 3000 available in this demo."); }} className="hidden items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-muted md:inline-flex">
            <span className="text-muted-foreground">Project:</span>
            <span>CardioGuard 3000</span>
            <span className="text-muted-foreground">|</span>
            <span>Rev B</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-mono text-xs">DFMEA-2025-001</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => toggle("notifications")} className={`relative rounded-md p-2 hover:bg-muted ${panel === "notifications" ? "bg-muted" : ""}`} aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">3</span>
            </button>
            {panel === "notifications" && (
              <Dropdown onClose={() => setPanel(null)} title="Notifications" footer={
                <button onClick={() => { toast.success("All notifications marked as read."); setPanel(null); }} className="text-xs font-semibold text-primary hover:underline">Mark all as read</button>
              }>
                {NOTIFICATIONS.map((n) => (
                  <button key={n.title} onClick={() => { console.log("[Notifications] clicked", n.title); toast(n.title); }} className="flex w-full gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-muted/50">
                    <n.icon className={`mt-0.5 h-4 w-4 shrink-0 ${n.tone}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{n.title}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
                    </div>
                  </button>
                ))}
              </Dropdown>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggle("help")} className={`rounded-md p-2 hover:bg-muted ${panel === "help" ? "bg-muted" : ""}`} aria-label="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
            {panel === "help" && (
              <Dropdown onClose={() => setPanel(null)} title="Help & Standards" footer={
                <button onClick={() => { toast("Opening full documentation…"); setPanel(null); }} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Open documentation <ExternalLink className="h-3 w-3" /></button>
              }>
                {HELP_LINKS.map((h) => (
                  <button key={h.title} onClick={() => { console.log("[Help] clicked", h.title); toast(`Opening: ${h.title}`); }} className="flex w-full gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-muted/50">
                    <h.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{h.title}</div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{h.detail}</p>
                    </div>
                  </button>
                ))}
              </Dropdown>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-md border px-2 py-1">
            <EngineerAvatar name={CURRENT_USER.name} />
            <div className="hidden text-left text-xs leading-tight sm:block">
              <div className="font-semibold">{CURRENT_USER.name}</div>
              <div className="text-muted-foreground">Systems Engineer</div>
            </div>
          </div>
          <span className="hidden rounded-md border border-primary/30 bg-accent px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary md:inline-flex">
            MediCore Systems
          </span>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Dropdown({ title, children, footer, onClose }: { title: string; children: React.ReactNode; footer?: React.ReactNode; onClose: () => void }) {
  return (
    <>
      {/* click-outside overlay */}
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-80 overflow-hidden rounded-lg border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
          <span className="text-sm font-semibold">{title}</span>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted" aria-label="Close"><X className="h-3.5 w-3.5" /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && <div className="border-t bg-muted/20 px-4 py-2.5">{footer}</div>}
      </div>
    </>
  );
}
