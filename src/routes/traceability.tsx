import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { REQUIREMENTS } from "@/data/misc";
import { FAILURE_MODES } from "@/data/dfmea";
import { Panel, SelectField, ToneBadge } from "@/components/ui/primitives";
import { icons } from "@/components/icons/iconMap";
import { buttonClass } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/traceability")({ component: Traceability });

const FM_COLUMNS = FAILURE_MODES.slice(0, 14).map((failureMode) => ({
  id: failureMode.id,
  label: failureMode.failureMode.replace(/\s*\(.*\)$/, ""),
}));

function shortLabel(text: string, maxLength = 24) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

type CellState = "green" | "amber" | "red" | "empty";

function cellState(reqIdx: number, fmIdx: number): CellState {
  const key = (reqIdx * 7 + fmIdx * 3) % 11;
  if (key < 2) return "empty";
  if (key < 5) return "green";
  if (key < 8) return "amber";
  return "red";
}

// Coverage swatches share the feedback tone map: linked is success, partial is warning, gap is error.
const COLOR: Record<CellState, string> = {
  green: "bg-success-badge",
  amber: "bg-warning-badge",
  red: "bg-error-badge",
  empty: "bg-raised-2",
};

type ChainTone = "success" | "warning" | "error";

// Complete class strings only: Tailwind cannot see names assembled with template literals.
const CHAIN_TONE: Record<ChainTone, string> = {
  success: "border-success/40 bg-success-surface",
  warning: "border-warning/40 bg-warning-surface",
  error: "border-error/40 bg-error-surface",
};

const CHAIN_STATE: Record<ChainTone, string> = {
  success: "Linked",
  warning: "Partial",
  error: "Gap",
};

const CHAIN: [string, string, ChainTone][] = [
  ["REQ-PWR-001", "Requirement", "success"],
  ["F-BAT-01", "Function", "success"],
  ["FM-0031", "Failure mode", "warning"],
  ["CAUSE-031", "Root cause", "warning"],
  ["MIT-0031-B", "Mitigation", "warning"],
  ["VT-0031", "Verification test", "error"],
  ["VR-2025-012", "Validation report", "error"],
];

function Traceability() {
  const [view, setView] = useState<"matrix" | "chain">("matrix");
  return (
    <PageContainer
      title="Traceability"
      subtitle="Requirement-to-verification coverage · 171 of 280 fully traced (61%) · 42 partial · 67 gaps"
      actions={
        <div className="flex items-center gap-1" role="group" aria-label="View">
          <button
            type="button"
            aria-pressed={view === "matrix"}
            onClick={() => setView("matrix")}
            className={buttonClass("chip", { size: "sm", active: view === "matrix" })}
          >
            Matrix view
          </button>
          <button
            type="button"
            aria-pressed={view === "chain"}
            onClick={() => setView("chain")}
            className={buttonClass("chip", { size: "sm", active: view === "chain" })}
          >
            Chain view
          </button>
        </div>
      }
    >
      {view === "matrix" && (
        <Panel
          title="Coverage Matrix"
          icon={icons.traceability}
          action={<ToneBadge tone="error">67 gaps</ToneBadge>}
          padded={false}
        >
          <div className="type-body-sm flex items-center gap-4 border-b border-hairline px-4 py-2.5 text-tertiary">
            <Legend color={COLOR.green} label="Linked" />
            <Legend color={COLOR.amber} label="Partial" />
            <Legend color={COLOR.red} label="Gap" />
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="type-eyebrow sticky left-0 z-10 bg-container px-3 py-2 text-left text-quaternary">
                    Requirement
                  </th>
                  {FM_COLUMNS.map(({ id, label }) => (
                    <th key={id} className="w-24 border-l border-hairline px-1 pt-2 pb-2 align-top">
                      <div className="mx-auto flex h-[72px] flex-col justify-start rounded-md bg-raised px-1 py-2 text-center">
                        <span className="type-caption font-mono text-foreground">{id}</span>
                        <span className="type-caption mt-1 text-[10px] leading-tight font-normal text-tertiary">
                          {shortLabel(label)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REQUIREMENTS.map(([id, text], ri) => (
                  <tr key={id} className="border-t border-hairline">
                    <td className="type-body-sm sticky left-0 z-10 min-w-[280px] bg-container px-3 py-1">
                      <span className="font-mono text-foreground">{id}</span>{" "}
                      <span className="text-tertiary">{text}</span>
                    </td>
                    {FM_COLUMNS.map((_, fi) => {
                      const st = cellState(ri, fi);
                      return (
                        <td key={fi} className="border-l border-hairline p-0.5">
                          <div className={cn("mx-auto h-5 w-6 rounded", COLOR[st])} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {view === "chain" && (
        <Panel title="Trace Chain" icon={icons.traceability}>
          <div className="type-body-md mb-4 flex flex-wrap items-center gap-2">
            <span className="text-tertiary">Select a failure mode to trace</span>
            <SelectField aria-label="Failure mode to trace">
              <option>FM-0031 · Capacity degradation</option>
            </SelectField>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-7">
            {CHAIN.map(([id, label, tone]) => (
              <div key={id} className={cn("rounded-lg border p-3 text-center", CHAIN_TONE[tone])}>
                <div className="type-body-sm font-mono text-foreground">{id}</div>
                <div className="type-caption mt-1 font-normal text-tertiary">{label}</div>
                <div className="type-caption mt-1 text-secondary-foreground">
                  {CHAIN_STATE[tone]}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </PageContainer>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("inline-block size-3 rounded", color)} /> {label}
    </span>
  );
}
