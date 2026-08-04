import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { HIERARCHY, BATTERY_FUNCTIONS, type HierarchyNode } from "@/data/hierarchy";
import { StatusDot, StatusBadge } from "@/components/shared/StatusBadge";
import { BATTERY_ROWS } from "@/data/dfmea";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hierarchy")({ component: HierarchyPage });

function TreeNode({ node, depth, selectedId, onSelect }: { node: HierarchyNode; depth: number; selectedId: string; onSelect: (n: HierarchyNode) => void }) {
  const [open, setOpen] = useState(depth < 2 || node.id === "power" || node.id === "battery-pack");
  const hasChildren = !!node.children?.length;
  const isSel = node.id === selectedId;
  return (
    <div>
      <button
        onClick={() => { onSelect(node); if (hasChildren) setOpen(!open); }}
        className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-sm hover:bg-muted ${isSel ? "bg-accent font-semibold text-primary" : ""}`}
        style={{ paddingLeft: 6 + depth * 14 }}
      >
        {hasChildren ? (open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />) : <span className="w-3" />}
        <StatusDot status={node.status} />
        <span className="flex-1 truncate">{node.name}</span>
        <span className="text-[10px] uppercase text-muted-foreground">{node.kind}</span>
      </button>
      {open && hasChildren && node.children!.map((c) => (
        <TreeNode key={c.id} node={c} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}

function HierarchyPage() {
  const [sel, setSel] = useState<HierarchyNode>({ id: "battery-pack", name: "Battery Pack", kind: "Subsystem", status: "In Progress" });
  return (
    <PageContainer title="Product Hierarchy" subtitle="CardioGuard 3000 · Navigate the device tree and DFMEA status per node.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <input placeholder="Search components..." className="mb-3 w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <TreeNode node={HIERARCHY} depth={0} selectedId={sel.id} onSelect={setSel} />
          </div>
        </Card>

        <Card className="lg:col-span-8">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">{sel.name}</h2>
              <p className="text-sm text-muted-foreground">{sel.kind} · Power Management System · DFMEA Status: <StatusBadge status={sel.status} /></p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {[
              ["Functions", "4"], ["Failure modes", "18"], ["Critical", "2"], ["Mitigations pending", "4"], ["RPN range", "18-216"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-md border bg-muted/40 p-3 text-center">
                <div className="text-xs text-muted-foreground">{l}</div>
                <div className="font-display text-lg font-semibold">{v}</div>
              </div>
            ))}
          </div>

          <h3 className="mt-5 mb-2 text-sm font-semibold">Identified Functions</h3>
          <ul className="mb-4 space-y-1 rounded-md border bg-muted/30 p-3 text-sm">
            {BATTERY_FUNCTIONS.map((f) => (
              <li key={f.id} className="flex gap-3"><span className="font-mono text-xs text-primary">{f.id}</span> {f.text}</li>
            ))}
          </ul>

          <h3 className="mb-2 text-sm font-semibold">Failure Modes (first 6 of 18)</h3>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">FM ID</th><th className="px-2 py-2">Failure Mode</th>
                  <th className="px-1 py-2">S</th><th className="px-1 py-2">O</th><th className="px-1 py-2">D</th>
                  <th className="px-2 py-2">RPN</th><th className="px-2 py-2">Risk</th><th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {BATTERY_ROWS.slice(0, 6).map((r) => {
                  const rpn = r.s * r.o * r.d;
                  return (
                    <tr key={r.id} className="border-t hover:bg-muted/40">
                      <td className="px-2 py-2 font-mono text-primary">{r.id}</td>
                      <td className="px-2 py-2">{r.failureMode}</td>
                      <td className="px-1 py-2 font-mono">{r.s}</td>
                      <td className="px-1 py-2 font-mono">{r.o}</td>
                      <td className="px-1 py-2 font-mono">{r.d}</td>
                      <td className="px-2 py-2"><RpnCell rpn={rpn} s={r.s} /></td>
                      <td className="px-2 py-2"><RiskBadge level={badgeForRpn(rpn, r.s)} /></td>
                      <td className="px-2 py-2"><StatusBadge status={r.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-2">
            <Link to="/workspace" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Open DFMEA Workspace</Link>
            <button onClick={() => { console.log("[Hierarchy] AI Analyze", sel.name); toast(`AI is analyzing "${sel.name}" for potential failure modes…`); }} className="inline-flex items-center gap-2 rounded-md border border-[color:var(--ai-accent)]/40 bg-[color:var(--ai-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--ai-accent)] hover:bg-[color:var(--ai-bg)]/70">
              <Sparkles className="h-4 w-4" /> AI: Analyze This Component
            </button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}