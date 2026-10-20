import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type KeyboardEvent } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { HIERARCHY, BATTERY_FUNCTIONS, type HierarchyNode } from "@/data/hierarchy";
import { StatusDot, StatusBadge } from "@/components/shared/StatusBadge";
import { BATTERY_ROWS } from "@/data/dfmea";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { Panel } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass } from "@/components/ui/input-styles";
import { tableStyles } from "@/components/ui/table-styles";
import { cn } from "@/lib/utils";
import { icons } from "@/components/icons/iconMap";
import { toast } from "sonner";
import { ancestorNames, initialOpen, toggleOpen, visibleRows } from "@/lib/tree";

export const Route = createFileRoute("/hierarchy")({ component: HierarchyPage });

const STATS: { label: string; value: string; valueClassName?: string }[] = [
  { label: "Functions", value: "4" },
  { label: "Failure modes", value: "18" },
  { label: "Critical", value: "2", valueClassName: "text-error" },
  { label: "Mitigations pending", value: "4", valueClassName: "text-warning" },
  { label: "RPN range", value: "18-216" },
];

/** WAI-ARIA tree: click selects (and opens), chevron toggles, arrows move, one tab stop. */
function DeviceTree({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (n: HierarchyNode) => void;
}) {
  const [open, setOpen] = useState(() => initialOpen(HIERARCHY));
  const [focusId, setFocusId] = useState(selectedId);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const rows = visibleRows(HIERARCHY, open);

  const toggle = (id: string, to?: boolean) => setOpen((cur) => toggleOpen(cur, id, to));
  const focusRow = (id: string) => {
    setFocusId(id);
    itemRefs.current.get(id)?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    const { node, parentId } = rows[i];
    const hasChildren = !!node.children?.length;
    const isOpen = open.has(node.id);
    switch (e.key) {
      case "ArrowDown":
        if (rows[i + 1]) focusRow(rows[i + 1].node.id);
        break;
      case "ArrowUp":
        if (rows[i - 1]) focusRow(rows[i - 1].node.id);
        break;
      case "Home":
        focusRow(rows[0].node.id);
        break;
      case "End":
        focusRow(rows[rows.length - 1].node.id);
        break;
      case "ArrowRight":
        if (hasChildren && !isOpen) toggle(node.id, true);
        else if (hasChildren) focusRow(rows[i + 1].node.id);
        break;
      case "ArrowLeft":
        if (hasChildren && isOpen) toggle(node.id, false);
        else if (parentId) focusRow(parentId);
        break;
      case "Enter":
      case " ":
        onSelect(node);
        if (hasChildren && !isOpen) toggle(node.id, true);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  return (
    <div role="tree" aria-label="Device tree">
      {rows.map(({ node, depth }, i) => {
        const hasChildren = !!node.children?.length;
        const isOpen = open.has(node.id);
        const isSel = node.id === selectedId;
        return (
          <div
            key={node.id}
            ref={(el) => {
              if (el) itemRefs.current.set(node.id, el);
              else itemRefs.current.delete(node.id);
            }}
            role="treeitem"
            aria-level={depth + 1}
            aria-selected={isSel}
            aria-expanded={hasChildren ? isOpen : undefined}
            tabIndex={node.id === focusId ? 0 : -1}
            onFocus={() => setFocusId(node.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            onClick={() => {
              onSelect(node);
              if (hasChildren && !isOpen) toggle(node.id, true);
            }}
            className={cn(
              "type-body-md flex min-h-8 w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pr-2 text-left outline-none transition-colors duration-[150ms] hover:bg-raised focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-active",
              isSel ? "bg-raised-2 font-medium text-foreground" : "text-secondary-foreground",
            )}
            style={{ paddingLeft: 6 + depth * 14 }}
          >
            {hasChildren ? (
              <span
                aria-hidden="true"
                className="grid size-4 shrink-0 place-items-center rounded-sm hover:bg-raised-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(node.id);
                }}
              >
                {isOpen ? (
                  <icons.chevronDown className="size-3 text-quaternary" />
                ) : (
                  <icons.chevronRight className="size-3 text-quaternary" />
                )}
              </span>
            ) : (
              <span className="size-4 shrink-0" />
            )}
            <StatusDot status={node.status} />
            <span className="flex-1 truncate">{node.name}</span>
            <span className="type-caption shrink-0 font-normal text-quaternary">{node.kind}</span>
          </div>
        );
      })}
    </div>
  );
}

function HierarchyPage() {
  const [sel, setSel] = useState<HierarchyNode>({
    id: "battery-pack",
    name: "Battery Pack",
    kind: "Subsystem",
    status: "In Progress",
  });
  return (
    <PageContainer
      title="Product Hierarchy"
      subtitle="CardioGuard 3000 · Navigate the device tree and DFMEA status per node."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Device Tree" className="lg:col-span-4 lg:self-start">
          <input
            placeholder="Search components"
            aria-label="Search components"
            className={inputClass("sm", "mb-3")}
          />
          <div className="max-h-[70vh] overflow-y-auto">
            <DeviceTree selectedId={sel.id} onSelect={setSel} />
          </div>
        </Panel>

        <Panel className="lg:col-span-8">
          <div className="mb-4">
            <h2 className="type-display-lg text-foreground">{sel.name}</h2>
            <p className="type-body-md mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-tertiary">
              <span>
                {sel.kind} · {(ancestorNames(HIERARCHY, sel.id) ?? []).join(" › ") || "Top level"} ·
                DFMEA status:
              </span>
              <StatusBadge status={sel.status} />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex min-w-0 flex-col gap-1 rounded-lg border border-hairline bg-raised px-3 py-2.5"
              >
                <span className="type-eyebrow text-quaternary">{s.label}</span>
                <span className={cn("type-display-base tabular text-foreground", s.valueClassName)}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <h3 className="type-eyebrow mt-6 mb-2 text-quaternary">
            Identified functions · Battery Pack
          </h3>
          <ul className="type-body-md mb-6 divide-y divide-hairline rounded-lg border border-hairline bg-raised px-3">
            {BATTERY_FUNCTIONS.map((f) => (
              <li key={f.id} className="flex gap-3 py-2 text-secondary-foreground">
                <span className="type-body-sm shrink-0 font-mono text-foreground">{f.id}</span>
                {f.text}
              </li>
            ))}
          </ul>

          <h3 className="type-eyebrow mb-2 text-quaternary">
            Failure modes · Battery Pack, first 6 of 18
          </h3>
          <div className={tableStyles.wrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th className={tableStyles.th()}>FM ID</th>
                  <th className={tableStyles.th()}>Failure mode</th>
                  <th className={tableStyles.th({ numeric: true })}>S</th>
                  <th className={tableStyles.th({ numeric: true })}>O</th>
                  <th className={tableStyles.th({ numeric: true })}>D</th>
                  <th className={tableStyles.th({ numeric: true })}>RPN</th>
                  <th className={tableStyles.th()}>Risk</th>
                  <th className={tableStyles.th()}>Status</th>
                </tr>
              </thead>
              <tbody>
                {BATTERY_ROWS.slice(0, 6).map((r) => {
                  const rpn = r.s * r.o * r.d;
                  return (
                    <tr key={r.id} className={tableStyles.tr()}>
                      <td className={tableStyles.td({ primary: true, className: "font-mono" })}>
                        {r.id}
                      </td>
                      <td
                        className={tableStyles.td({
                          className: "min-w-[200px] !whitespace-normal",
                        })}
                      >
                        {r.failureMode}
                      </td>
                      <td className={tableStyles.td({ numeric: true, className: "font-mono" })}>
                        {r.s}
                      </td>
                      <td className={tableStyles.td({ numeric: true, className: "font-mono" })}>
                        {r.o}
                      </td>
                      <td className={tableStyles.td({ numeric: true, className: "font-mono" })}>
                        {r.d}
                      </td>
                      <td className={tableStyles.td({ numeric: true })}>
                        <RpnCell rpn={rpn} s={r.s} />
                      </td>
                      <td className={tableStyles.td()}>
                        <RiskBadge level={badgeForRpn(rpn, r.s)} />
                      </td>
                      <td className={tableStyles.td()}>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/workspace" className={buttonClass("primary", { size: "sm" })}>
              Open DFMEA workspace
            </Link>
            <button
              type="button"
              onClick={() => {
                console.log("[Hierarchy] AI Analyze", sel.name);
                toast(`AI is analyzing "${sel.name}" for potential failure modes…`);
              }}
              className={buttonClass("secondary", { size: "sm" })}
            >
              <icons.ai className="size-3.5" aria-hidden="true" /> Analyze this component
            </button>
          </div>
        </Panel>
      </div>
    </PageContainer>
  );
}
