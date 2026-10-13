import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { HIERARCHY, BATTERY_FUNCTIONS, type HierarchyNode } from "@/data/hierarchy";
import { StatusDot, StatusBadge } from "@/components/shared/StatusBadge";
import { BATTERY_ROWS } from "@/data/dfmea";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { Panel } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass } from "@/components/ui/input-styles";
import { tableStyles } from "@/components/ui/table-styles";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hierarchy")({ component: HierarchyPage });

const STATS: { label: string; value: string; valueClassName?: string }[] = [
  { label: "Functions", value: "4" },
  { label: "Failure modes", value: "18" },
  { label: "Critical", value: "2", valueClassName: "text-error" },
  { label: "Mitigations pending", value: "4", valueClassName: "text-warning" },
  { label: "RPN range", value: "18-216" },
];

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: HierarchyNode;
  depth: number;
  selectedId: string;
  onSelect: (n: HierarchyNode) => void;
}) {
  const [open, setOpen] = useState(depth < 2 || node.id === "power" || node.id === "battery-pack");
  const hasChildren = !!node.children?.length;
  const isSel = node.id === selectedId;
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelect(node);
          if (hasChildren) setOpen(!open);
        }}
        aria-current={isSel ? "true" : undefined}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          "type-body-md flex min-h-8 w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left outline-none transition-colors duration-[150ms] hover:bg-raised focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-active",
          isSel ? "bg-raised-2 font-medium text-foreground" : "text-secondary-foreground",
        )}
        style={{ paddingLeft: 6 + depth * 14 }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="size-3 shrink-0 text-quaternary" aria-hidden="true" />
          ) : (
            <ChevronRight className="size-3 shrink-0 text-quaternary" aria-hidden="true" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <StatusDot status={node.status} />
        <span className="flex-1 truncate">{node.name}</span>
        <span className="type-caption shrink-0 font-normal text-quaternary">{node.kind}</span>
      </button>
      {open &&
        hasChildren &&
        node.children!.map((c) => (
          <TreeNode
            key={c.id}
            node={c}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

function HierarchyPage() {
  const [sel, setSel] = useState<HierarchyNode>({
    id: "battery-pack",
    name: "Battery Pack",
    kind: "Subsystem",
    status: "In Progress",
  });
  return (
    <PageContainer
      title="Product Hierarchy"
      subtitle="CardioGuard 3000 · Navigate the device tree and DFMEA status per node."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Device tree" className="lg:col-span-4 lg:self-start">
          <input
            placeholder="Search components..."
            aria-label="Search components"
            className={inputClass("sm", "mb-3")}
          />
          <div className="max-h-[70vh] overflow-y-auto">
            <TreeNode node={HIERARCHY} depth={0} selectedId={sel.id} onSelect={setSel} />
          </div>
        </Panel>

        <Panel className="lg:col-span-8">
          <div className="mb-4">
            <h2 className="type-display-lg text-foreground">{sel.name}</h2>
            <p className="type-body-md mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-tertiary">
              <span>{sel.kind} · Power Management System · DFMEA Status:</span>
              <StatusBadge status={sel.status} />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex min-w-0 flex-col gap-1 rounded-lg border border-hairline bg-raised px-3 py-2.5"
              >
                <span className="type-eyebrow text-quaternary">{s.label}</span>
                <span className={cn("type-display-base tabular text-foreground", s.valueClassName)}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <h3 className="type-eyebrow mt-6 mb-2 text-quaternary">Identified Functions</h3>
          <ul className="type-body-md mb-6 divide-y divide-hairline rounded-lg border border-hairline bg-raised px-3">
            {BATTERY_FUNCTIONS.map((f) => (
              <li key={f.id} className="flex gap-3 py-2 text-secondary-foreground">
                <span className="type-body-sm shrink-0 font-mono text-foreground">{f.id}</span>
                {f.text}
              </li>
            ))}
          </ul>

          <h3 className="type-eyebrow mb-2 text-quaternary">Failure Modes (first 6 of 18)</h3>
          <div className={tableStyles.wrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th className={tableStyles.th()}>FM ID</th>
                  <th className={tableStyles.th()}>Failure Mode</th>
                  <th className={tableStyles.th({ numeric: true })}>S</th>
                  <th className={tableStyles.th({ numeric: true })}>O</th>
                  <th className={tableStyles.th({ numeric: true })}>D</th>
                  <th className={tableStyles.th({ numeric: true })}>RPN</th>
                  <th className={tableStyles.th()}>Risk</th>
                  <th className={tableStyles.th()}>Status</th>
                </tr>
              </thead>
              <tbody>
                {BATTERY_ROWS.slice(0, 6).map((r) => {
                  const rpn = r.s * r.o * r.d;
                  return (
                    <tr key={r.id} className={tableStyles.tr()}>
                      <td className={tableStyles.td({ primary: true, className: "font-mono" })}>
                        {r.id}
                      </td>
                      <td
                        className={tableStyles.td({
                          className: "min-w-[200px] !whitespace-normal",
                        })}
                      >
                        {r.failureMode}
                      </td>
                      <td className={tableStyles.td({ numeric: true, className: "font-mono" })}>
                        {r.s}
                      </td>
                      <td className={tableStyles.td({ numeric: true, className: "font-mono" })}>
                        {r.o}
                      </td>
                      <td className={tableStyles.td({ numeric: true, className: "font-mono" })}>
                        {r.d}
                      </td>
                      <td className={tableStyles.td({ numeric: true })}>
                        <RpnCell rpn={rpn} s={r.s} />
                      </td>
                      <td className={tableStyles.td()}>
                        <RiskBadge level={badgeForRpn(rpn, r.s)} />
                      </td>
                      <td className={tableStyles.td()}>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/workspace" className={buttonClass("primary", { size: "sm" })}>
              Open DFMEA Workspace
            </Link>
            <button
              type="button"
              onClick={() => {
                console.log("[Hierarchy] AI Analyze", sel.name);
                toast(`AI is analyzing "${sel.name}" for potential failure modes…`);
              }}
              className={buttonClass("secondary", { size: "sm" })}
            >
              <Sparkles className="size-3.5" aria-hidden="true" /> AI: Analyze This Component
            </button>
          </div>
        </Panel>
      </div>
    </PageContainer>
  );
}
