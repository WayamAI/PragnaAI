import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { FAILURE_MODES } from "@/data/dfmea";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";

export const Route = createFileRoute("/risk-register")({ component: RiskRegister });

function RiskRegister() {
  const [showResidual, setShowResidual] = useState(false);
  const rows = [...FAILURE_MODES].sort((a, b) => (b.s * b.o * b.d) - (a.s * a.o * a.d));

  return (
    <PageContainer title="Risk Register" subtitle="Portfolio view of all approved and pending risks across CardioGuard 3000.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Total Risks","280"],["Critical (S≥9 or RPN≥200)","14"],["High (RPN 100-199)","47"],["Mitigations Overdue","7"]].map(([l,v]) => (
          <Card key={l} className="!p-4">
            <div className="text-[11px] font-semibold uppercase text-muted-foreground">{l}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{v}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 !p-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <input placeholder="Search risks..." className="flex-1 min-w-[180px] rounded-md border bg-background px-3 py-1.5" />
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Level: All</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Risk: All</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Status: All</option></select>
          <label className="ml-auto inline-flex items-center gap-2 text-xs">
            <input type="checkbox" checked={showResidual} onChange={(e) => setShowResidual(e.target.checked)} />
            Show Residual RPN
          </label>
        </div>
      </Card>

      <div className="mt-3 overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 text-left text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-2 py-2">Risk ID</th>
              <th className="px-2 py-2">Level</th>
              <th className="px-2 py-2">Component</th>
              <th className="px-2 py-2">Failure Mode</th>
              <th className="px-1 py-2">S</th><th className="px-1 py-2">O</th><th className="px-1 py-2">D</th>
              <th className={`px-2 py-2 ${!showResidual ? "bg-primary/10" : ""}`}>RPN (initial)</th>
              <th className={`px-2 py-2 ${showResidual ? "bg-primary/10" : ""}`}>RPN (residual)</th>
              <th className="px-2 py-2">Risk</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Owner</th>
              <th className="px-2 py-2">Due</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rpn = r.s * r.o * r.d;
              const critical = r.s >= 9;
              return (
                <tr key={r.id} className={`border-t hover:bg-sky-50/60 ${critical ? "border-l-2 border-l-red-400" : ""}`}>
                  <td className="px-2 py-2 font-mono text-primary">{r.id}</td>
                  <td className="px-2 py-2">{r.level}</td>
                  <td className="px-2 py-2">{r.component}</td>
                  <td className="max-w-[240px] truncate px-2 py-2">{r.failureMode}</td>
                  <td className="px-1 py-2 text-center font-mono">{r.s}</td>
                  <td className="px-1 py-2 text-center font-mono">{r.o}</td>
                  <td className="px-1 py-2 text-center font-mono">{r.d}</td>
                  <td className="px-2 py-2 text-center"><RpnCell rpn={rpn} s={r.s} /></td>
                  <td className="px-2 py-2 text-center font-mono">{r.residualRpn ?? "—"}</td>
                  <td className="px-2 py-2"><RiskBadge level={badgeForRpn(rpn, r.s)} /></td>
                  <td className="px-2 py-2"><StatusBadge status={r.status} /></td>
                  <td className="px-2 py-2"><EngineerAvatar name={r.owner} /></td>
                  <td className="px-2 py-2 font-mono text-[11px]">{r.due}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}