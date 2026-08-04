import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { ACTIVITY } from "@/data/misc";
import { INTEGRATIONS } from "@/data/integrations";
import { Sparkles, Search, Shield, Plug, X, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from "recharts";

export const Route = createFileRoute("/overview")({ component: Overview });

const KPI = [
  { label: "Total DFMEA Items", value: "280", sub: "Across all levels", tone: "" },
  { label: "Critical Risks (S≥9)", value: "14", sub: "Require immediate action", tone: "text-red-600" },
  { label: "AI Suggestions Pending", value: "23", sub: "Awaiting engineer review", tone: "text-[color:var(--ai-accent)]" },
  { label: "Mitigations Pending", value: "31", sub: "Open action items", tone: "text-amber-600" },
  { label: "DFMEA Completion", value: "67%", sub: "188 of 280 approved", tone: "text-primary" },
  { label: "Residual RPN Reduced", value: "43%", sub: "Avg reduction post-mitigation", tone: "text-emerald-600" },
];

const HEATMAP = [
  { row: "S9-10", tier: "Catastrophic", desc: "Patient death / life-threatening", cells: [0, 2, 5, 4, 3], avgD: 3.1 },
  { row: "S7-8", tier: "Critical", desc: "Serious injury, little/no warning", cells: [1, 6, 12, 9, 4], avgD: 3.6 },
  { row: "S5-6", tier: "Major", desc: "Moderate injury / therapy interruption", cells: [3, 9, 18, 11, 6], avgD: 4.0 },
  { row: "S3-4", tier: "Moderate", desc: "Minor injury / degraded performance", cells: [5, 14, 22, 16, 8], avgD: 4.3 },
  { row: "S1-2", tier: "Minor", desc: "Negligible / cosmetic", cells: [8, 19, 28, 21, 12], avgD: 4.6 },
];
// Proper S×O risk matrix: high severity + high occurrence = high-priority (red) zone.
function riskZone(ri: number, ci: number) {
  const sev = 5 - ri;    // ri 0 (S9-10) → 5 … ri 4 (S1-2) → 1
  const occ = ci + 1;    // O1 → 1 … O5 → 5
  const score = sev * occ;
  if (score >= 12) return { bg: "#FEE2E2", text: "#B91C1C", band: "High" };
  if (score >= 6) return { bg: "#FEF3C7", text: "#B45309", band: "Medium" };
  return { bg: "#DCFCE7", text: "#15803D", band: "Low" };
}

const RINGS = [
  { level: "Product Level", pct: 67, done: 4, total: 6 },
  { level: "System Level", pct: 64, done: 18, total: 28 },
  { level: "Subsystem Level", pct: 71, done: 44, total: 62 },
  { level: "Part / Component", pct: 71, done: 88, total: 124 },
  { level: "Accessories", pct: 56, done: 18, total: 32 },
  { level: "Super System", pct: 57, done: 16, total: 28 },
];

const RPN_BUCKETS = [
  { range: "0-49", count: 98, fill: "#16A34A" },
  { range: "50-99", count: 89, fill: "#CA8A04" },
  { range: "100-149", count: 52, fill: "#D97706" },
  { range: "150-199", count: 27, fill: "#F97316" },
  { range: "200+", count: 14, fill: "#DC2626" },
];

const AGENTS = [
  { icon: Sparkles, name: "Structure Analysis Agent", status: "COMPLETE", statusColor: "bg-emerald-100 text-emerald-800", detail: "Processed 14 documents, 114 hierarchy nodes identified", last: "Today 09:15", accent: "text-[color:var(--ai-accent)]" },
  { icon: Search, name: "Knowledge Retrieval Agent", status: "ACTIVE", statusColor: "bg-primary/15 text-primary", detail: "Querying FDA MDR database and internal knowledge base — queue: 23 suggestions pending review", last: "Running", accent: "text-primary" },
  { icon: Shield, name: "Risk Scoring Agent", status: "IDLE", statusColor: "bg-slate-100 text-slate-700", detail: "143 S/O/D recommendations generated, 89 accepted", last: "Today 11:30", accent: "text-sky-600" },
];

function Overview() {
  const [showIntegrations, setShowIntegrations] = useState(false);
  // Auto-open the data-source popup only once per browser session.
  useEffect(() => {
    if (!sessionStorage.getItem("rl-integrations-popup-seen")) {
      setShowIntegrations(true);
      sessionStorage.setItem("rl-integrations-popup-seen", "1");
    }
  }, []);
  const connected = INTEGRATIONS.filter((i) => i.status === "connected").length;
  const highCount = HEATMAP.reduce(
    (sum, row, ri) => sum + row.cells.reduce((s, v, ci) => (riskZone(ri, ci).band === "High" ? s + v : s), 0),
    0,
  );

  return (
    <PageContainer title="Project Overview" subtitle="CardioGuard 3000 · Rev B · DFMEA-2025-001">
      {/* Live data-source status banner */}
      <button
        onClick={() => setShowIntegrations(true)}
        className="mb-4 flex w-full items-center gap-3 rounded-lg border bg-[color:var(--ai-bg)]/40 p-3 text-left transition hover:bg-[color:var(--ai-bg)]/70"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Plug className="h-4 w-4" /></span>
        <span className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-semibold">{connected} of {INTEGRATIONS.length} data sources live</span>
          <span className="hidden text-muted-foreground sm:inline">· Teamcenter (PLM), Jama, Greenlight Guru, FDA MAUDE, SAP, Polarion</span>
        </span>
        <span className="ml-auto text-xs font-semibold text-primary">View integrations →</span>
      </button>

      {showIntegrations && <IntegrationsPopup onClose={() => setShowIntegrations(false)} />}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {KPI.map((k) => (
          <Card key={k.label} className="!p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k.label}</div>
            <div className={`mt-1 font-display text-2xl font-semibold ${k.tone}`}>{k.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{k.sub}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Risk Distribution Matrix (Initial RPN)</h2>
            {/* <span className="text-xs text-muted-foreground">Severity × Occurrence</span> */}
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Each cell counts the failure modes at that <span className="font-medium text-foreground">Severity (S)</span> ×{" "}
            <span className="font-medium text-foreground">Occurrence (O)</span> combination. Full{" "}
            <span className="font-medium text-foreground">RPN = S × O × Detection (D)</span> — the average Detection for each severity band is shown in the{" "}
            <span className="font-medium text-foreground">Avg&nbsp;D</span> column (and per cell on hover). Colour marks the risk zone; the top-right red zone is highest priority.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-center text-xs">
              <thead>
                <tr>
                  <th className="pb-1 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground" colSpan={2}>Severity (S) ↓</th>
                  <th className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground" colSpan={5}>Occurrence (O) →</th>
                  <th className="pb-1 pl-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Avg D</th>
                </tr>
              </thead>
              <tbody>
                {HEATMAP.map((row, ri) => (
                  <tr key={row.row}>
                    <td className="pr-2 text-right leading-tight">
                      <div className="text-[11px] font-semibold text-foreground">{row.tier}</div>
                      <div className="text-[9px] text-muted-foreground">{row.desc}</div>
                    </td>
                    <td className="pr-2 text-right font-mono text-[10px] text-muted-foreground">{row.row}</td>
                    {row.cells.map((v, ci) => {
                      const z = riskZone(ri, ci);
                      return (
                        <td
                          key={ci}
                          title={`${row.tier} (${row.row}) × O${ci + 1}: ${v} failure modes — ${z.band} risk zone · avg Detection D≈${row.avgD.toFixed(1)}`}
                          style={{ background: z.bg, color: z.text }}
                          className="h-11 w-14 rounded font-semibold"
                        >
                          {v}
                        </td>
                      );
                    })}
                    <td className="pl-2 font-mono text-[11px] font-semibold text-foreground">{row.avgD.toFixed(1)}</td>
                  </tr>
                ))}
                <tr>
                  <td /><td />
                  {["O1", "O2", "O3", "O4", "O5"].map((c) => (
                    <td key={c} className="text-[10px] text-muted-foreground">{c}</td>
                  ))}
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
            <span className="font-semibold text-muted-foreground">Risk zone:</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ background: "#DCFCE7" }} /> Low (S×O &lt; 6)</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ background: "#FEF3C7" }} /> Medium (6–11)</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ background: "#FEE2E2" }} /> High (≥ 12)</span>
            <span className="ml-auto font-semibold text-red-600">{highCount} failure modes in the high zone</span>
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <h2 className="mb-3 font-display text-base font-semibold">Completion by Level</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {RINGS.map((r, i) => (
              <div key={r.level} className="text-center">
                <ResponsiveContainer width="100%" height={80}>
                  <PieChart>
                    <defs>
                      <linearGradient id={`ringGradient-${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--primary-gradient-from)" />
                        <stop offset="100%" stopColor="var(--primary-gradient-to)" />
                      </linearGradient>
                    </defs>
                    <Pie data={[{ v: r.pct }, { v: 100 - r.pct }]} dataKey="v" innerRadius={22} outerRadius={32} startAngle={90} endAngle={-270}>
                      <Cell fill={`url(#ringGradient-${i})`} />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-1 text-sm font-semibold">{r.pct}%</div>
                <div className="text-[10px] text-muted-foreground">{r.level}</div>
                <div className="text-[10px] text-muted-foreground">{r.done}/{r.total}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 font-display text-base font-semibold">Failure Mode Distribution by RPN Range</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={RPN_BUCKETS}>
            <XAxis dataKey="range" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip cursor={{ fill: "#F3F4F6" }} />
            <Bar dataKey="count" radius={[4,4,0,0]}>
              {RPN_BUCKETS.map((b, i) => <Cell key={i} fill={b.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <h2 className="mb-3 font-display text-base font-semibold">Recent Activity</h2>
          <ul className="divide-y text-sm">
            {ACTIVITY.map(([t, who, what], i) => (
              <li key={i} className="flex gap-3 py-2">
                <span className="w-14 font-mono text-xs text-muted-foreground">{t}</span>
                <span><span className="font-semibold">{who}</span> {what}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-5">
          <h2 className="mb-3 font-display text-base font-semibold">AI Agent Activity</h2>
          <div className="space-y-3">
            {AGENTS.map((a) => (
              <div key={a.name} className="rounded-md border bg-[color:var(--ai-bg)]/40 p-3">
                <div className="flex items-start gap-2">
                  <a.icon className={`h-4 w-4 ${a.accent}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">{a.name}</div>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${a.statusColor}`}>{a.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">Last run: {a.last}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/ai-analysis" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">Open AI Analysis →</Link>
        </Card>
      </div>
    </PageContainer>
  );
}

function IntegrationsPopup({ onClose }: { onClose: () => void }) {
  const connected = INTEGRATIONS.filter((i) => i.status === "connected").length;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-foreground">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border bg-card shadow-2xl">
        <div className="flex items-start justify-between border-b bg-[color:var(--ai-bg)]/50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"><Plug className="h-5 w-5" /></span>
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                Connected data sources
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {connected} LIVE
                </span>
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                RiskLens AI pulls data from your PLM, requirements, quality, ERP and regulatory systems — the AI agents turn it into this DFMEA.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>

        <div className="max-h-[55vh] space-y-2 overflow-y-auto p-4">
          {INTEGRATIONS.map((it) => (
            <div key={it.name} className="flex items-start gap-3 rounded-md border p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><it.icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{it.name}</span>
                  {it.status === "syncing" ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800"><RefreshCw className="h-3 w-3 animate-spin" /> SYNCING</span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800"><CheckCircle2 className="h-3 w-3" /> CONNECTED</span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground">{it.category} · {it.vendor}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
                  <span className="text-muted-foreground">{it.feeds}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-primary">{it.into}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3">
          <span className="text-xs text-muted-foreground">Data flows in automatically — no manual re-entry.</span>
          <Link to="/integrations" onClick={onClose} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
            Manage integrations <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}