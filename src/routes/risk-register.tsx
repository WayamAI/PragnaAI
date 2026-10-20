import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { FAILURE_MODES } from "@/data/dfmea";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { KpiTile } from "@/components/ui/primitives";
import { inputClass, selectClass } from "@/components/ui/input-styles";
import { tableStyles } from "@/components/ui/table-styles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk-register")({ component: RiskRegister });

const KPI: { label: string; value: string; valueClassName?: string }[] = [
  { label: "Total Risks", value: "280" },
  { label: "Critical (S≥9 or RPN≥200)", value: "14", valueClassName: "text-error" },
  { label: "High (RPN 100-199)", value: "47", valueClassName: "text-warning" },
  { label: "Mitigations Overdue", value: "7" },
];

// Low-value columns go quiet (tertiary text) but stay in the table.
const quiet = "text-tertiary";
const activeCol = "bg-raised";

function RiskRegister() {
  const [showResidual, setShowResidual] = useState(false);
  const rows = [...FAILURE_MODES].sort((a, b) => b.s * b.o * b.d - a.s * a.o * a.d);

  return (
    <PageContainer
      title="Risk Register"
      subtitle="Portfolio view of all approved and pending risks across CardioGuard 3000."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {KPI.map((k) => (
          <KpiTile
            key={k.label}
            label={k.label}
            value={k.value}
            valueClassName={k.valueClassName}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          placeholder="Search risks"
          aria-label="Search risks"
          className={inputClass("sm", "min-w-[180px] flex-1")}
        />
        <select aria-label="Level" className={selectClass}>
          <option>Level: All</option>
        </select>
        <select aria-label="Risk" className={selectClass}>
          <option>Risk: All</option>
        </select>
        <select aria-label="Status" className={selectClass}>
          <option>Status: All</option>
        </select>
        <label className="type-label-sm ml-auto inline-flex items-center gap-2 text-secondary-foreground">
          <input
            type="checkbox"
            checked={showResidual}
            onChange={(e) => setShowResidual(e.target.checked)}
            className="size-4 accent-action-primary"
          />
          Show residual RPN
        </label>
      </div>

      <div className={cn(tableStyles.wrap, "mt-3")}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th()}>Risk ID</th>
              <th className={tableStyles.th()}>Level</th>
              <th className={tableStyles.th()}>Component</th>
              <th className={tableStyles.th()}>Failure Mode</th>
              <th className={tableStyles.th({ numeric: true })}>S</th>
              <th className={tableStyles.th({ numeric: true })}>O</th>
              <th className={tableStyles.th({ numeric: true })}>D</th>
              <th
                className={tableStyles.th({
                  numeric: true,
                  className: !showResidual ? activeCol : undefined,
                })}
              >
                RPN (initial)
              </th>
              <th
                className={tableStyles.th({
                  numeric: true,
                  className: showResidual ? activeCol : undefined,
                })}
              >
                RPN (residual)
              </th>
              <th className={tableStyles.th()}>Risk</th>
              <th className={tableStyles.th()}>Status</th>
              <th className={tableStyles.th()}>Owner</th>
              <th className={tableStyles.th()}>Due</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rpn = r.s * r.o * r.d;
              const critical = r.s >= 9;
              return (
                <tr key={r.id} className={tableStyles.tr()}>
                  <td
                    className={tableStyles.td({
                      primary: true,
                      className: cn(
                        "border-l-2 font-mono",
                        critical ? "border-l-error" : "border-l-transparent",
                      ),
                    })}
                  >
                    {r.id}
                  </td>
                  <td className={tableStyles.td({ className: quiet })}>{r.level}</td>
                  <td className={tableStyles.td({ className: quiet })}>{r.component}</td>
                  <td
                    className={tableStyles.td({
                      primary: true,
                      truncate: true,
                      className: "max-w-[240px]",
                    })}
                  >
                    {r.failureMode}
                  </td>
                  <td
                    className={tableStyles.td({ numeric: true, className: cn("font-mono", quiet) })}
                  >
                    {r.s}
                  </td>
                  <td
                    className={tableStyles.td({ numeric: true, className: cn("font-mono", quiet) })}
                  >
                    {r.o}
                  </td>
                  <td
                    className={tableStyles.td({ numeric: true, className: cn("font-mono", quiet) })}
                  >
                    {r.d}
                  </td>
                  <td className={tableStyles.td({ numeric: true })}>
                    <RpnCell rpn={rpn} s={r.s} />
                  </td>
                  <td
                    className={tableStyles.td({
                      numeric: true,
                      className: cn("font-mono", quiet),
                    })}
                  >
                    {r.residualRpn ?? "n/a"}
                  </td>
                  <td className={tableStyles.td()}>
                    <RiskBadge level={badgeForRpn(rpn, r.s)} />
                  </td>
                  <td className={tableStyles.td()}>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className={tableStyles.td()}>
                    <EngineerAvatar name={r.owner} />
                  </td>
                  <td className={tableStyles.td({ className: cn("font-mono", quiet) })}>{r.due}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
