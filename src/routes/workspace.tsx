import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { BATTERY_ROWS, type FailureMode } from "@/data/dfmea";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { EmptyState, SearchInput, SelectField } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { tableStyles } from "@/components/ui/table-styles";
import { cn } from "@/lib/utils";
import { icons } from "@/components/icons/iconMap";
import { toast } from "sonner";

export const Route = createFileRoute("/workspace")({ component: Workspace });

// Low-value columns go quiet (tertiary text) but stay in the table.
const quiet = "text-tertiary";
// Sticky first column is pure CSS: it needs its own background so scrolled cells pass beneath it.
const stickyCell =
  "sticky left-0 z-[1] bg-container group-hover:bg-raised group-focus-visible:bg-raised";

function Workspace() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState("");
  const [sel, setSel] = useState<FailureMode | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const rows = useMemo(
    () =>
      BATTERY_ROWS.filter((r) => {
        const rpn = r.s * r.o * r.d;
        const level = badgeForRpn(rpn, r.s);
        if (risk && level !== risk) return false;
        if (q && !`${r.id} ${r.failureMode} ${r.component}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        return true;
      }),
    [q, risk],
  );

  const closeDrawer = () => {
    setSel(null);
    opener.current?.focus();
  };

  useEffect(() => {
    if (!sel) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setSel(null);
        opener.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  const openRow = (r: FailureMode, el: HTMLElement) => {
    opener.current = el;
    setSel(r);
  };
  const onRowKey = (e: KeyboardEvent<HTMLTableRowElement>, r: FailureMode) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openRow(r, e.currentTarget);
    }
  };

  return (
    <PageContainer
      title="DFMEA Workspace"
      subtitle="CardioGuard 3000 › Power Management System › Battery Pack · 18 items"
      actions={
        <>
          <button
            type="button"
            onClick={() => {
              console.log("[Workspace] Add Failure Mode clicked");
              toast("New failure mode form would open here.");
            }}
            className={buttonClass("primary", { size: "sm" })}
          >
            <icons.add size={16} /> Add failure mode
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("[Workspace] AI Suggest clicked");
              toast("AI is generating failure mode suggestions for Battery Pack…");
            }}
            className={buttonClass("secondary", { size: "sm" })}
          >
            <icons.ai size={16} /> Suggest for this component
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("[Workspace] Export clicked", { count: rows.length });
              toast.success(`Exporting ${rows.length} failure modes to Excel…`);
            }}
            className={buttonClass("secondary", { size: "sm" })}
          >
            <icons.export size={16} /> Export
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("[Workspace] Approve All Reviewed clicked");
              toast.success("All reviewed failure modes approved.");
            }}
            className={buttonClass("secondary", { size: "sm" })}
          >
            <icons.approve size={16} /> Approve all reviewed
          </button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <SearchInput
          placeholder="Search failure modes"
          aria-label="Search failure modes"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          wrapperClassName="min-w-[180px] flex-1"
        />
        <SelectField aria-label="Risk" value={risk} onChange={(e) => setRisk(e.target.value)}>
          <option value="">Risk: All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </SelectField>
        <SelectField aria-label="Status">
          <option>Status: All</option>
        </SelectField>
        <SelectField aria-label="Owner">
          <option>Owner: All</option>
        </SelectField>
        <SelectField aria-label="Source">
          <option>Source: All</option>
        </SelectField>
      </div>

      <div className={cn(tableStyles.wrap, "mt-3")}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th({ className: "left-0 z-20" })}>FM ID</th>
              <th className={tableStyles.th()}>Component</th>
              <th className={tableStyles.th()}>Function</th>
              <th className={tableStyles.th()}>Failure mode</th>
              <th className={tableStyles.th()}>Effect (patient)</th>
              <th className={tableStyles.th({ numeric: true })}>S</th>
              <th className={tableStyles.th({ numeric: true })}>O</th>
              <th className={tableStyles.th({ numeric: true })}>D</th>
              <th className={tableStyles.th({ numeric: true })}>RPN</th>
              <th className={tableStyles.th()}>Risk</th>
              <th className={tableStyles.th()}>Mitigation</th>
              <th className={tableStyles.th()}>Owner</th>
              <th className={tableStyles.th()}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rpn = r.s * r.o * r.d;
              return (
                <tr
                  key={r.id}
                  tabIndex={0}
                  className={tableStyles.tr({ clickable: true, className: "group" })}
                  onClick={(e) => openRow(r, e.currentTarget)}
                  onKeyDown={(e) => onRowKey(e, r)}
                >
                  <td
                    className={tableStyles.td({
                      primary: true,
                      className: cn("font-mono", stickyCell),
                    })}
                  >
                    {r.id}
                  </td>
                  <td className={tableStyles.td({ className: quiet })}>{r.component}</td>
                  <td
                    className={tableStyles.td({
                      truncate: true,
                      className: cn("max-w-[140px]", quiet),
                    })}
                  >
                    {r.function}
                  </td>
                  <td
                    className={tableStyles.td({
                      primary: true,
                      truncate: true,
                      className: "max-w-[220px]",
                    })}
                  >
                    {r.failureMode}
                  </td>
                  <td
                    className={tableStyles.td({
                      truncate: true,
                      className: cn("max-w-[140px]", quiet),
                    })}
                  >
                    {r.effectPatient}
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
                  <td className={tableStyles.td()}>
                    <RiskBadge level={badgeForRpn(rpn, r.s)} />
                  </td>
                  <td
                    className={tableStyles.td({
                      truncate: true,
                      className: cn("max-w-[160px]", quiet),
                    })}
                  >
                    {r.mitigation}
                  </td>
                  <td className={tableStyles.td()}>
                    <EngineerAvatar name={r.owner} />
                  </td>
                  <td className={tableStyles.td()}>
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <EmptyState
            title="No failure modes match"
            detail="Try a different search or risk level."
          />
        )}
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 text-foreground">
          <div className="absolute inset-0 bg-page/70" onClick={closeDrawer} aria-hidden="true" />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${sel.id} ${sel.failureMode}`}
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto border-l border-strong bg-container sm:w-[480px]"
          >
            <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-hairline bg-container px-4 py-3">
              <div className="min-w-0">
                <div className="type-body-sm font-mono text-tertiary">{sel.id}</div>
                <h2 className="type-display-base mt-0.5 text-foreground">{sel.failureMode}</h2>
              </div>
              <button
                type="button"
                autoFocus
                onClick={closeDrawer}
                className={buttonClass("icon", { className: "shrink-0" })}
                aria-label="Close"
              >
                <icons.close size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <Field label="Component" value={sel.component} />
              <Field label="Function" value={sel.function} />
              <Field label="Effect (local)" value={sel.effectLocal} />
              <Field label="Effect (system)" value={sel.effectSystem} />
              <Field label="Effect (patient)" value={sel.effectPatient} />
              <Field label="Cause" value={sel.cause} />
              <Field label="Current controls" value={sel.controls} />
              <Field label="Mitigation" value={sel.mitigation} />
              <div className="grid grid-cols-4 gap-3 rounded-lg border border-hairline bg-raised px-3 py-2.5">
                <Field label="S" value={sel.s.toString()} />
                <Field label="O" value={sel.o.toString()} />
                <Field label="D" value={sel.d.toString()} />
                <Field label="RPN" value={(sel.s * sel.o * sel.d).toString()} />
              </div>
              <Field label="Standard" value={sel.standard} />
              <Field label="Owner / due" value={`${sel.owner} · ${sel.due}`} />
            </div>
          </aside>
        </div>
      )}
    </PageContainer>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="type-eyebrow text-quaternary">{label}</div>
      <div className="type-body-md mt-0.5 text-secondary-foreground">{value}</div>
    </div>
  );
}
