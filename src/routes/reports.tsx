import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { RECENT_REPORTS } from "@/data/misc";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { CheckInput, Panel } from "@/components/ui/primitives";
import { icons } from "@/components/icons/iconMap";
import { buttonClass } from "@/components/ui/button-styles";
import { tableStyles } from "@/components/ui/table-styles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({ component: Reports });

const TYPES = [
  ["Full DFMEA export", "Excel (.xlsx)", "All failure modes, all columns"],
  ["Risk summary report", "PDF", "Top risks, heatmap, distribution chart"],
  ["Traceability matrix", "Excel / PDF", "Requirement-to-verification matrix"],
  ["AI suggestions report", "PDF", "All AI suggestions with confidence scores"],
  ["Regulatory package", "ZIP", "Combined: DFMEA + traceability + risk summary"],
  ["Open items report", "PDF", "Mitigations pending, overdue, unlinked items"],
];

const optionRow = "type-body-md flex items-center gap-2 text-secondary-foreground";

function Reports() {
  const [type, setType] = useState(0);
  return (
    <PageContainer
      title="Reports"
      subtitle="Configure and generate DFMEA exports for submissions, reviews, and audit packages."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Generate Report" icon={icons.reports} className="lg:col-span-7 lg:self-start">
          <div className="flex flex-col gap-2">
            {TYPES.map(([label, fmt, desc], i) => (
              <label
                key={label}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-[150ms] hover:bg-raised",
                  type === i ? "border-strong bg-raised" : "border-hairline",
                )}
              >
                <CheckInput
                  type="radio"
                  name="rtype"
                  checked={type === i}
                  onChange={() => setType(i)}
                  className="mt-0.5"
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
              <CheckInput type="radio" name="scope" defaultChecked /> Full device · all levels
            </label>
            <label className={optionRow}>
              <CheckInput type="radio" name="scope" /> By subsystem
            </label>
            <label className={optionRow}>
              <CheckInput type="radio" name="scope" /> Critical risks only (S ≥ 9 or RPN ≥ 200)
            </label>
            <label className={optionRow}>
              <CheckInput type="radio" name="scope" /> By owner
            </label>
          </div>

          <h3 className="type-eyebrow mt-6 mb-2 text-quaternary">Options</h3>
          <div className="flex flex-col gap-2">
            <label className={optionRow}>
              <CheckInput type="checkbox" defaultChecked /> Include AI confidence scores
            </label>
            <label className={optionRow}>
              <CheckInput type="checkbox" defaultChecked /> Include traceability links
            </label>
            <label className={optionRow}>
              <CheckInput type="checkbox" defaultChecked /> Include residual RPN (post-mitigation)
            </label>
            <label className={optionRow}>
              <CheckInput type="checkbox" /> Include rejected AI suggestions
            </label>
            <label className={optionRow}>
              <CheckInput type="checkbox" defaultChecked /> Include engineer comments
            </label>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.success("Report queued. You will receive an email when it's ready.")
            }
            className={buttonClass("primary", { size: "sm", className: "mt-6" })}
          >
            <icons.reports size={16} /> Generate report
          </button>
        </Panel>

        <Panel title="Selected Report" icon={icons.export} className="lg:col-span-5 lg:self-start">
          <div className="flex items-start gap-3">
            <icons.reports size={44} />
            <div className="min-w-0">
              <div className="type-label-md text-foreground">{TYPES[type][0]}</div>
              <div className="type-caption mt-0.5 font-normal text-tertiary">{TYPES[type][1]}</div>
            </div>
          </div>
          <p className="type-body-md mt-3 text-secondary-foreground">{TYPES[type][2]}.</p>
          <p className="type-body-sm mt-3 border-t border-hairline pt-3 text-tertiary">
            Set the scope and options on the left, then generate. You will receive an email when the
            report is ready.
          </p>
        </Panel>

        <Panel
          title="Recent Reports"
          icon={icons.history}
          padded={false}
          className="lg:col-span-12"
        >
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
                      className: "font-mono",
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
