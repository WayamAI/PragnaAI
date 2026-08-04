import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { BATTERY_ROWS, type FailureMode } from "@/data/dfmea";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { Plus, Sparkles, Download, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/workspace")({ component: Workspace });

function Workspace() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState("");
  const [sel, setSel] = useState<FailureMode | null>(null);
  const rows = useMemo(() => BATTERY_ROWS.filter((r) => {
    const rpn = r.s * r.o * r.d;
    const level = badgeForRpn(rpn, r.s);
    if (risk && level !== risk) return false;
    if (q && !`${r.id} ${r.failureMode} ${r.component}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, risk]);

  return (
    <PageContainer
      title="DFMEA Workspace"
      subtitle="CardioGuard 3000 › Power Management System › Battery Pack · 18 items"
      actions={
        <>
          <button onClick={() => { console.log("[Workspace] Add Failure Mode clicked"); toast("New failure mode form would open here."); }} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> Add Failure Mode</button>
          <button onClick={() => { console.log("[Workspace] AI Suggest clicked"); toast("AI is generating failure mode suggestions for Battery Pack…"); }} className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--ai-accent)]/40 bg-[color:var(--ai-bg)] px-3 py-1.5 text-sm font-semibold text-[color:var(--ai-accent)]"><Sparkles className="h-4 w-4" /> AI: Suggest for This Component</button>
          <button onClick={() => { console.log("[Workspace] Export clicked", { count: rows.length }); toast.success(`Exporting ${rows.length} failure modes to Excel…`); }} className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-muted"><Download className="h-4 w-4" /> Export</button>
          <button onClick={() => { console.log("[Workspace] Approve All Reviewed clicked"); toast.success("All reviewed failure modes approved."); }} className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-muted"><CheckCircle2 className="h-4 w-4" /> Approve All Reviewed</button>
        </>
      }
    >
      <Card className="!p-3">
        <div className="flex flex-wrap gap-2">
          <input placeholder="Search failure modes..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 min-w-[180px] rounded-md border bg-background px-3 py-1.5 text-sm" />
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="rounded-md border bg-background px-2 py-1.5 text-sm">
            <option value="">Risk: All</option>
            <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
          <select className="rounded-md border bg-background px-2 py-1.5 text-sm"><option>Status: All</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5 text-sm"><option>Owner: All</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5 text-sm"><option>Source: All</option></select>
        </div>
      </Card>

      <div className="mt-3 overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 text-left text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-2 py-2">FM ID</th>
              <th className="px-2 py-2">Component</th>
              <th className="px-2 py-2">Function</th>
              <th className="px-2 py-2">Failure Mode</th>
              <th className="px-2 py-2">Effect (Patient)</th>
              <th className="px-1 py-2">S</th><th className="px-1 py-2">O</th><th className="px-1 py-2">D</th>
              <th className="px-2 py-2">RPN</th>
              <th className="px-2 py-2">Risk</th>
              <th className="px-2 py-2">Mitigation</th>
              <th className="px-2 py-2">Owner</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rpn = r.s * r.o * r.d;
              return (
                <tr key={r.id} className="cursor-pointer border-t hover:bg-sky-50/60" onClick={() => setSel(r)}>
                  <td className="whitespace-nowrap px-2 py-2 font-mono text-primary">{r.id}</td>
                  <td className="px-2 py-2">{r.component}</td>
                  <td className="max-w-[180px] truncate px-2 py-2">{r.function}</td>
                  <td className="max-w-[220px] truncate px-2 py-2">{r.failureMode}</td>
                  <td className="max-w-[180px] truncate px-2 py-2">{r.effectPatient}</td>
                  <td className="px-1 py-2 text-center font-mono">{r.s}</td>
                  <td className="px-1 py-2 text-center font-mono">{r.o}</td>
                  <td className="px-1 py-2 text-center font-mono">{r.d}</td>
                  <td className="px-2 py-2 text-center"><RpnCell rpn={rpn} s={r.s} /></td>
                  <td className="px-2 py-2"><RiskBadge level={badgeForRpn(rpn, r.s)} /></td>
                  <td className="max-w-[220px] truncate px-2 py-2">{r.mitigation}</td>
                  <td className="px-2 py-2"><EngineerAvatar name={r.owner} /></td>
                  <td className="px-2 py-2"><StatusBadge status={r.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="fixed inset-y-0 right-0 z-40 w-[480px] overflow-y-auto border-l bg-card shadow-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b bg-card px-4 py-3">
            <div>
              <div className="font-mono text-xs text-primary">{sel.id}</div>
              <div className="font-display font-semibold">{sel.failureMode}</div>
            </div>
            <button onClick={() => setSel(null)} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <Field label="Component" value={sel.component} />
            <Field label="Function" value={sel.function} />
            <Field label="Effect (Local)" value={sel.effectLocal} />
            <Field label="Effect (System)" value={sel.effectSystem} />
            <Field label="Effect (Patient)" value={sel.effectPatient} />
            <Field label="Cause" value={sel.cause} />
            <Field label="Current Controls" value={sel.controls} />
            <Field label="Mitigation" value={sel.mitigation} />
            <div className="flex gap-3">
              <Field label="S" value={sel.s.toString()} />
              <Field label="O" value={sel.o.toString()} />
              <Field label="D" value={sel.d.toString()} />
              <Field label="RPN" value={(sel.s*sel.o*sel.d).toString()} />
            </div>
            <Field label="Standard" value={sel.standard} />
            <Field label="Owner / Due" value={`${sel.owner} · ${sel.due}`} />
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}