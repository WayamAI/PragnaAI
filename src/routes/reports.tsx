import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { RECENT_REPORTS } from "@/data/misc";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({ component: Reports });

const TYPES = [
  ["Full DFMEA Export", "Excel (.xlsx)", "All failure modes, all columns"],
  ["Risk Summary Report", "PDF", "Top risks, heatmap, distribution chart"],
  ["Traceability Matrix", "Excel / PDF", "Requirement-to-verification matrix"],
  ["AI Suggestions Report", "PDF", "All AI suggestions with confidence scores"],
  ["Regulatory Package", "ZIP", "Combined: DFMEA + Traceability + Risk Summary"],
  ["Open Items Report", "PDF", "Mitigations pending, overdue, unlinked items"],
];

function Reports() {
  const [type, setType] = useState(0);
  return (
    <PageContainer title="Reports" subtitle="Configure and generate DFMEA exports for submissions, reviews, and audit packages.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <h2 className="mb-3 font-display text-lg font-semibold">Generate Report</h2>
          <div className="space-y-2">
            {TYPES.map(([label, fmt, desc], i) => (
              <label key={label as string} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40 ${type === i ? "border-primary bg-accent/50" : ""}`}>
                <input type="radio" name="rtype" checked={type === i} onChange={() => setType(i)} className="mt-1" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{label} <span className="ml-2 text-xs font-normal text-muted-foreground">{fmt}</span></div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </label>
            ))}
          </div>

          <h3 className="mt-5 mb-2 text-sm font-semibold">Scope</h3>
          <div className="space-y-1 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name="scope" defaultChecked /> Full device — all levels</label>
            <label className="flex items-center gap-2"><input type="radio" name="scope" /> By subsystem</label>
            <label className="flex items-center gap-2"><input type="radio" name="scope" /> Critical risks only (S ≥ 9 or RPN ≥ 200)</label>
            <label className="flex items-center gap-2"><input type="radio" name="scope" /> By owner</label>
          </div>

          <h3 className="mt-5 mb-2 text-sm font-semibold">Options</h3>
          <div className="space-y-1 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Include AI confidence scores</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Include traceability links</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Include residual RPN (post-mitigation)</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Include rejected AI suggestions</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Include engineer comments</label>
          </div>

          <button
            onClick={() => toast.success("Report queued. You will receive an email when it's ready.")}
            className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Generate Report
          </button>
        </Card>

        <Card className="lg:col-span-5 !p-0">
          <h2 className="p-5 pb-3 font-display text-lg font-semibold">Recent Reports</h2>
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-left text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Report</th><th className="px-2 py-2">Type</th><th className="px-2 py-2">By</th><th className="px-2 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map(([name, t, _s, by, d]) => (
                <tr key={name as string} className="border-t">
                  <td className="px-3 py-2 font-mono text-primary">{name}</td>
                  <td className="px-2 py-2">{t}</td>
                  <td className="px-2 py-2"><EngineerAvatar name={by as string} /></td>
                  <td className="px-2 py-2 font-mono">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </PageContainer>
  );
}