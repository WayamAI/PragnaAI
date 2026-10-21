import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { ACTIVITY } from "@/data/misc";
import { INTEGRATIONS } from "@/data/integrations";
import type { AppIconComponent } from "@/components/icons/iconMap";
import { icons } from "@/components/icons/iconMap";
import { zoneTint } from "@/components/dashboard/zoneTint";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import {
  KpiTile,
  Panel,
  QuietStatus,
  StatusDot,
  ToneBadge,
  Unit,
  type Tone,
} from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { ModalShell } from "@/components/ui/modal";
import {
  axisTick,
  chartTooltipLabelStyle,
  chartTooltipStyle,
} from "@/components/dashboard/chartTheme";
import {
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

export const Route = createFileRoute("/overview")({ component: Overview });

const KPI: {
  label: string;
  icon: AppIconComponent;
  value: string;
  unit?: string;
  sub: string;
  valueClassName?: string;
}[] = [
  { label: "Total DFMEA items", icon: icons.items, value: "280", sub: "Across all levels" },
  {
    label: "Critical risks (S≥9)",
    icon: icons.alert,
    value: "14",
    sub: "Require immediate action",
    valueClassName: "text-error",
  },
  { label: "AI suggestions pending", icon: icons.ai, value: "23", sub: "Awaiting engineer review" },
  {
    label: "Mitigations pending",
    icon: icons.pending,
    value: "31",
    sub: "Open action items",
    valueClassName: "text-warning",
  },
  {
    label: "DFMEA completion",
    icon: icons.completion,
    value: "67",
    unit: "%",
    sub: "188 of 280 approved",
  },
  {
    label: "Residual RPN reduced",
    icon: icons.reduction,
    value: "43",
    unit: "%",
    sub: "Avg reduction post-mitigation",
  },
];

const HEATMAP = [
  {
    row: "S9-10",
    tier: "Catastrophic",
    desc: "Patient death / life-threatening",
    cells: [0, 2, 5, 4, 3],
    avgD: 3.1,
  },
  {
    row: "S7-8",
    tier: "Critical",
    desc: "Serious injury, little/no warning",
    cells: [1, 6, 12, 9, 4],
    avgD: 3.6,
  },
  {
    row: "S5-6",
    tier: "Major",
    desc: "Moderate injury / therapy interruption",
    cells: [3, 9, 18, 11, 6],
    avgD: 4.0,
  },
  {
    row: "S3-4",
    tier: "Moderate",
    desc: "Minor injury / degraded performance",
    cells: [5, 14, 22, 16, 8],
    avgD: 4.3,
  },
  {
    row: "S1-2",
    tier: "Minor",
    desc: "Negligible / cosmetic",
    cells: [8, 19, 28, 21, 12],
    avgD: 4.6,
  },
];
// Zone tints share the severity tone map: High is warning, Medium is info, Low is neutral.
const ZONE_TINT = { High: zoneTint("High"), Medium: zoneTint("Medium"), Low: zoneTint("Low") };
// Proper S×O risk matrix: high severity + high occurrence = high-priority zone.
function riskZone(ri: number, ci: number) {
  const sev = 5 - ri; // ri 0 (S9-10) → 5 … ri 4 (S1-2) → 1
  const occ = ci + 1; // O1 → 1 … O5 → 5
  const score = sev * occ;
  if (score >= 12) return { bg: ZONE_TINT.High.bg, text: ZONE_TINT.High.text, band: "High" };
  if (score >= 6) return { bg: ZONE_TINT.Medium.bg, text: ZONE_TINT.Medium.text, band: "Medium" };
  return { bg: ZONE_TINT.Low.bg, text: ZONE_TINT.Low.text, band: "Low" };
}

const RINGS = [
  { level: "Product level", pct: 67, done: 4, total: 6 },
  { level: "System level", pct: 64, done: 18, total: 28 },
  { level: "Subsystem level", pct: 71, done: 44, total: 62 },
  { level: "Part / component", pct: 71, done: 88, total: 124 },
  { level: "Accessories", pct: 56, done: 18, total: 32 },
  { level: "Super system", pct: 57, done: 16, total: 28 },
];

const RPN_BUCKETS = [
  { range: "0-49", count: 98, fill: "url(#rpn-bar)" },
  { range: "50-99", count: 89, fill: "url(#rpn-bar)" },
  { range: "100-149", count: 52, fill: "url(#rpn-bar)" },
  { range: "150-199", count: 27, fill: "url(#rpn-bar)" },
  { range: "200+", count: 14, fill: "var(--feedback-error-content)" },
];

const AGENTS: {
  icon: AppIconComponent;
  name: string;
  status: string;
  tone: Tone;
  detail: string;
  last: string;
}[] = [
  {
    icon: icons.hierarchy,
    name: "Structure Analysis Agent",
    status: "Complete",
    tone: "success",
    detail: "Processed 14 documents, 114 hierarchy nodes identified",
    last: "Today 09:15",
  },
  {
    icon: icons.search,
    name: "Knowledge Retrieval Agent",
    status: "Active",
    tone: "success",
    detail:
      "Querying FDA MDR database and internal knowledge base. Queue: 23 suggestions pending review",
    last: "Running",
  },
  {
    icon: icons.riskRegister,
    name: "Risk Scoring Agent",
    status: "Idle",
    tone: "neutral",
    detail: "143 S/O/D recommendations generated, 89 accepted",
    last: "Today 11:30",
  },
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
    (sum, row, ri) =>
      sum + row.cells.reduce((s, v, ci) => (riskZone(ri, ci).band === "High" ? s + v : s), 0),
    0,
  );

  return (
    <PageContainer title="Project Overview" subtitle="CardioGuard 3000 · Rev B · DFMEA-2025-001">
      <div className="flex flex-col gap-6">
        {/* Live data-source status banner */}
        <button
          onClick={() => setShowIntegrations(true)}
          className="flex w-full items-center gap-3 rounded-lg border border-hairline bg-container p-3 text-left outline-none transition-colors duration-[150ms] hover:border-strong focus-visible:ring-2 focus-visible:ring-active"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-action text-tertiary">
            <icons.integrations size={24} />
          </span>
          <span className="type-body-md flex min-w-0 items-center gap-2">
            <StatusDot tone="success" />
            <span className="font-medium whitespace-nowrap text-foreground">
              {connected} of {INTEGRATIONS.length} data sources live
            </span>
            <span className="hidden truncate text-tertiary sm:inline">
              · Teamcenter (PLM), Jama, Greenlight Guru, FDA MAUDE, SAP, Polarion
            </span>
          </span>
          <span className="type-label-sm ml-auto inline-flex shrink-0 items-center gap-1 text-foreground">
            View integrations <icons.chevronRight size={12} />
          </span>
        </button>

        {showIntegrations && <IntegrationsPopup onClose={() => setShowIntegrations(false)} />}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 min-[1800px]:grid-cols-6">
          {KPI.map((k) => (
            <KpiTile
              key={k.label}
              label={k.label}
              icon={k.icon}
              value={k.value}
              unit={k.unit}
              hint={k.sub}
              valueClassName={k.valueClassName}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel
            title="Risk Distribution Matrix (Initial RPN)"
            icon={icons.matrix}
            className="lg:col-span-7"
          >
            <p className="type-body-sm mb-3 text-tertiary">
              Each cell counts the failure modes at that{" "}
              <span className="font-medium text-foreground">Severity (S)</span> ×{" "}
              <span className="font-medium text-foreground">Occurrence (O)</span> combination. Full{" "}
              <span className="font-medium text-foreground">RPN = S × O × Detection (D)</span>. The
              average Detection for each severity band is shown in the{" "}
              <span className="font-medium text-foreground">Avg&nbsp;D</span> column (and per cell
              on hover). Colour marks the risk zone; the top-right zone is highest priority.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr>
                    <th className="type-eyebrow pb-1 text-left text-quaternary" colSpan={2}>
                      <span className="inline-flex items-center gap-1">
                        Severity (S) <icons.flow size={12} className="rotate-90" />
                      </span>
                    </th>
                    <th className="type-eyebrow pb-1 text-quaternary" colSpan={5}>
                      <span className="inline-flex items-center gap-1">
                        Occurrence (O) <icons.flow size={12} />
                      </span>
                    </th>
                    <th className="type-eyebrow pb-1 pl-2 text-quaternary">Avg D</th>
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP.map((row, ri) => (
                    <tr key={row.row}>
                      <td className="pr-2 text-right leading-tight">
                        <div className="type-label-sm text-foreground">{row.tier}</div>
                        <div className="type-caption font-normal text-quaternary">{row.desc}</div>
                      </td>
                      <td className="type-caption tabular pr-2 text-right font-normal text-quaternary">
                        {row.row}
                      </td>
                      {row.cells.map((v, ci) => {
                        const z = riskZone(ri, ci);
                        return (
                          <td
                            key={ci}
                            title={`${row.tier} (${row.row}) × O${ci + 1}: ${v} failure modes · ${z.band} risk zone · avg Detection D≈${row.avgD.toFixed(1)}`}
                            style={{ background: z.bg, color: z.text }}
                            className="type-label-sm tabular h-11 w-14 border border-container"
                          >
                            {v}
                          </td>
                        );
                      })}
                      <td className="type-label-sm tabular pl-2 text-foreground">
                        {row.avgD.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td />
                    <td />
                    {["O1", "O2", "O3", "O4", "O5"].map((c) => (
                      <td key={c} className="type-caption font-normal text-quaternary">
                        {c}
                      </td>
                    ))}
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="type-caption mt-3 flex flex-wrap items-center gap-3 font-normal text-tertiary">
              <span className="text-quaternary">Risk zone:</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-sm" style={{ background: ZONE_TINT.Low.bg }} /> Low
                (S×O &lt; 6)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-sm" style={{ background: ZONE_TINT.Medium.bg }} />{" "}
                Medium (6-11)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-sm" style={{ background: ZONE_TINT.High.bg }} />{" "}
                High (≥ 12)
              </span>
              <span className="tabular ml-auto font-medium text-warning">
                {highCount} failure modes in the high zone
              </span>
            </div>
          </Panel>

          <Panel title="Completion by Level" icon={icons.completion} className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
              {RINGS.map((r) => (
                <ProgressRing
                  key={r.level}
                  pct={r.pct}
                  label={r.level}
                  detail={`${r.done}/${r.total}`}
                />
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Failure Mode Distribution by RPN Range" icon={icons.chart}>
          <div className="type-caption mb-3 ml-8 flex flex-wrap items-center gap-4 font-normal text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-brand-gradient" />
              Failure modes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-sm"
                style={{ background: "var(--feedback-error-content)" }}
              />
              Critical range (RPN 200+)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={RPN_BUCKETS} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rpn-bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffa12b" />
                  <stop offset="100%" stopColor="#f0731a" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--stroke-muted)" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={axisTick} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={axisTick}
                width={32}
                domain={[0, 100]}
                ticks={[0, 50, 100]}
              />
              <Tooltip
                cursor={{ fill: "var(--surface-raised)" }}
                contentStyle={chartTooltipStyle}
                labelStyle={chartTooltipLabelStyle}
                formatter={(v) => [v, "Failure modes"]}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56} isAnimationActive={false}>
                {RPN_BUCKETS.map((b, i) => (
                  <Cell key={i} fill={b.fill} />
                ))}
                <LabelList dataKey="count" position="top" style={axisTick} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel title="Recent Activity" icon={icons.history} className="lg:col-span-7">
            <ul className="type-body-md divide-y divide-hairline">
              {ACTIVITY.map(([t, who, what], i) => (
                <li key={i} className="flex gap-3 py-2">
                  <span className="type-caption tabular w-14 shrink-0 pt-0.5 font-normal text-quaternary">
                    {t}
                  </span>
                  <span className="text-secondary-foreground">
                    <span className="font-medium text-foreground">{who}</span> {what}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="AI Agent Activity" icon={icons.ai} className="lg:col-span-5">
            <div className="flex flex-col gap-3">
              {AGENTS.map((a) => (
                <div key={a.name} className="rounded-lg border border-hairline bg-raised p-3">
                  <div className="flex items-start gap-2">
                    <a.icon size={16} className="mt-0.5 shrink-0 text-tertiary" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="type-label-md text-foreground">{a.name}</div>
                        <QuietStatus tone={a.tone}>{a.status}</QuietStatus>
                      </div>
                      <p className="type-body-sm mt-1 text-tertiary">{a.detail}</p>
                      <p className="type-caption mt-1 font-normal text-quaternary">
                        Last run: {a.last}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/ai-analysis"
              className={buttonClass("ghost", { size: "sm", className: "mt-3 -ml-3" })}
            >
              Open AI analysis <icons.chevronRight size={12} />
            </Link>
          </Panel>
        </div>
      </div>
    </PageContainer>
  );
}

function IntegrationsPopup({ onClose }: { onClose: () => void }) {
  const connected = INTEGRATIONS.filter((i) => i.status === "connected").length;
  return (
    <ModalShell
      className="max-w-2xl"
      icon={<icons.integrations size={24} />}
      title="Connected data sources"
      titleExtra={
        <QuietStatus tone="success" className="font-sans">
          {connected} live
        </QuietStatus>
      }
      subtitle="PragnaAI pulls data from your PLM, requirements, quality, ERP and regulatory systems, and the AI agents turn it into this DFMEA."
      onClose={onClose}
      footer={
        <>
          <span className="type-body-sm text-tertiary">
            Data flows in automatically, with no manual re-entry.
          </span>
          <Link
            to="/integrations"
            onClick={onClose}
            className={buttonClass("primary", { size: "sm", className: "shrink-0" })}
          >
            Manage integrations <icons.chevronRight size={12} />
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {INTEGRATIONS.map((it) => (
          <div
            key={it.name}
            className="flex items-start gap-3 rounded-lg border border-hairline p-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-action text-tertiary">
              <it.icon size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="type-label-md truncate text-foreground">{it.name}</span>
                {it.status === "syncing" ? (
                  <ToneBadge tone="info" className="shrink-0 gap-1">
                    <icons.sync size={12} className="animate-spin" /> Syncing
                  </ToneBadge>
                ) : (
                  <QuietStatus tone="success" className="shrink-0">
                    Connected
                  </QuietStatus>
                )}
              </div>
              <div className="type-caption font-normal text-quaternary">
                {it.category} · {it.vendor}
              </div>
              <div className="type-body-sm mt-1 flex flex-wrap items-center gap-1">
                <span className="text-tertiary">{it.feeds}</span>
                <icons.flow size={12} className="text-quaternary" />
                <span className="font-medium text-foreground">{it.into}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}
