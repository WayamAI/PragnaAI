import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { RECENT_REPORTS } from "@/data/misc";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { Panel } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { tableStyles } from "@/components/ui/table-styles";
import { cn } from "@/lib/utils";
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

const checkClass = "size-4 shrink-0 accent-action-primary";
const optionRow = "type-body-md flex items-center gap-2 text-secondary-foreground";

function Reports() {
  const [type, setType] = useState(0);
  return (
    <PageContainer
      title="Reports"
      subtitle="Configure and generate DFMEA exports for submissions, reviews, and audit packages."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Generate Report" className="lg:col-span-7 lg:self-start">
          <div className="flex flex-col gap-2">
            {TYPES.map(([label, fmt, desc], i) => (
              <label
                key={label}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-[150ms] hover:bg-raised",
                  type === i ? "border-strong bg-raised" : "border-hairline",
                )}
              >
                <input
                  type="radio"
                  name="rtype"
                  checked={type === i}
                  onChange={() => setType(i)}
                  className={cn(checkClass, "mt-0.5")}
                />
                <div className="min-w-0 flex-1">
                  <div className="type-label-md text-foreground">
                    {label}{" "}
                    <span className="type-caption ml-2 font-normal text-tertiary">{fmt}</span>
                  </div>
                  <div className="type-body-sm text-tertiary">{desc}</div>
                </div>
              </label>
            ))}
          </div>

          <h3 className="type-eyebrow mt-6 mb-2 text-quaternary">Scope</h3>
          <div className="flex flex-col gap-2">
            <label className={optionRow}>
              <input type="radio" name="scope" defaultChecked className={checkClass} /> Full device
              — all levels
            </label>
            <label className={optionRow}>
              <input type="radio" name="scope" className={checkClass} /> By subsystem
            </label>
            <label className={optionRow}>
              <input type="radio" name="scope" className={checkClass} /> Critical risks only (S ≥ 9
              or RPN ≥ 200)
            </label>
            <label className={optionRow}>
              <input type="radio" name="scope" className={checkClass} /> By owner
            </label>
          </div>

          <h3 className="type-eyebrow mt-6 mb-2 text-quaternary">Options</h3>
          <div className="flex flex-col gap-2">
            <label className={optionRow}>
              <input type="checkbox" defaultChecked className={checkClass} /> Include AI confidence
              scores
            </label>
            <label className={optionRow}>
              <input type="checkbox" defaultChecked className={checkClass} /> Include traceability
              links
            </label>
            <label className={optionRow}>
              <input type="checkbox" defaultChecked className={checkClass} /> Include residual RPN
              (post-mitigation)
            </label>
            <label className={optionRow}>
              <input type="checkbox" className={checkClass} /> Include rejected AI suggestions
            </label>
            <label className={optionRow}>
              <input type="checkbox" defaultChecked className={checkClass} /> Include engineer
              comments
            </label>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.success("Report queued. You will receive an email when it's ready.")
            }
            className={buttonClass("primary", { size: "lg", className: "mt-6" })}
          >
            Generate Report
          </button>
        </Panel>

        <Panel title="Recent Reports" padded={false} className="lg:col-span-5 lg:self-start">
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th className={tableStyles.th()}>Report</th>
                <th className={tableStyles.th()}>Type</th>
                <th className={tableStyles.th()}>By</th>
                <th className={tableStyles.th()}>Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map(([name, t, , by, d]) => (
                <tr key={name as string} className={tableStyles.tr()}>
                  <td
                    className={tableStyles.td({
                      primary: true,
                      className: "max-w-[220px] font-mono !whitespace-normal break-words",
                    })}
                  >
                    {(name as string).replace(/_/g, "_\u200b")}
                  </td>
                  <td className={tableStyles.td({ className: "text-tertiary" })}>{t}</td>
                  <td className={tableStyles.td()}>
                    <EngineerAvatar name={by as string} />
                  </td>
                  <td className={tableStyles.td({ className: "font-mono text-tertiary" })}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </PageContainer>
  );
}
