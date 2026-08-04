import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { REQUIREMENTS } from "@/data/misc";
import { FAILURE_MODES } from "@/data/dfmea";

export const Route = createFileRoute("/traceability")({ component: Traceability });

const FM_COLUMNS = FAILURE_MODES.slice(0, 14).map((failureMode) => ({
  id: failureMode.id,
  label: failureMode.failureMode.replace(/\s*\(.*\)$/, ""),
}));

function shortLabel(text: string, maxLength = 24) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function cellState(reqIdx: number, fmIdx: number): "green" | "amber" | "red" | "empty" {
  const key = (reqIdx * 7 + fmIdx * 3) % 11;
  if (key < 2) return "empty";
  if (key < 5) return "green";
  if (key < 8) return "amber";
  return "red";
}
const COLOR = { green: "bg-emerald-500", amber: "bg-amber-400", red: "bg-red-500", empty: "bg-slate-100" };

function Traceability() {
  const [view, setView] = useState<"matrix" | "chain">("matrix");
  return (
    <PageContainer
      title="Traceability"
      subtitle="Requirement-to-verification coverage · 171 of 280 fully traced (61%) · 42 partial · 67 gaps"
      actions={
        <div className="flex overflow-hidden rounded-md border">
          <button onClick={() => setView("matrix")} className={`px-3 py-1.5 text-sm font-semibold ${view === "matrix" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Matrix View</button>
          <button onClick={() => setView("chain")} className={`px-3 py-1.5 text-sm font-semibold ${view === "chain" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Chain View</button>
        </div>
      }
    >
      {view === "matrix" && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <Legend color="bg-emerald-500" label="Linked" />
              <Legend color="bg-amber-400" label="Partial" />
              <Legend color="bg-red-500" label="Gap" />
            </div>
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">67 gaps</span>
          </div>
          <div className="overflow-x-auto">
            <table className="text-[11px]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-card px-2 py-1 text-left">Requirement</th>
                  {FM_COLUMNS.map(({ id, label }) => (
                    <th key={id} className="w-24 px-1 pb-2 align-bottom text-center">
                      <div className="mx-auto flex min-h-14 flex-col justify-end rounded-md bg-muted/40 px-1 py-2 text-[10px] leading-tight">
                        <span className="font-mono font-semibold text-primary">{id}</span>
                        <span className="mt-1 text-[10px] font-medium text-muted-foreground">
                          {shortLabel(label)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REQUIREMENTS.map(([id, text], ri) => (
                  <tr key={id} className="border-t">
                    <td className="sticky left-0 z-10 min-w-[280px] bg-card px-2 py-1"><span className="font-mono text-primary">{id}</span> <span className="text-muted-foreground">{text}</span></td>
                    {FM_COLUMNS.map((_, fi) => {
                      const st = cellState(ri, fi);
                      return <td key={fi} className="p-0.5"><div className={`h-5 w-6 rounded ${COLOR[st]}`} /></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === "chain" && (
        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Select Failure Mode to Trace:</span>
            <select className="rounded-md border bg-background px-2 py-1"><option>FM-0031 — Capacity degradation</option></select>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-7">
            {[
              ["REQ-PWR-001", "Requirement", "emerald"],
              ["F-BAT-01", "Function", "emerald"],
              ["FM-0031", "Failure Mode", "amber"],
              ["CAUSE-031", "Root Cause", "amber"],
              ["MIT-0031-B", "Mitigation", "amber"],
              ["VT-0031", "Verification Test", "red"],
              ["VR-2025-012", "Validation Report", "red"],
            ].map(([id, label, tone]) => (
              <div key={id as string} className={`rounded-md border p-3 text-center border-${tone}-300 bg-${tone}-50`}>
                <div className="font-mono text-xs text-primary">{id}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1"><span className={`inline-block h-3 w-3 rounded ${color}`} /> {label}</span>;
}