import type { FMStatus } from "@/data/dfmea";
import type { NodeStatus } from "@/data/hierarchy";

const styles: Record<string, string> = {
  "Not Started": "bg-slate-100 text-slate-700 border border-slate-200",
  "In Progress": "bg-amber-50 text-amber-800 border border-amber-200",
  "Under Review": "bg-sky-50 text-sky-800 border border-sky-200",
  Approved: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  Extracted: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  Parsing: "bg-amber-50 text-amber-800 border border-amber-200",
  Queued: "bg-slate-100 text-slate-700 border border-slate-200",
  Failed: "bg-red-50 text-red-800 border border-red-200",
};

export function StatusBadge({ status }: { status: FMStatus | NodeStatus | string }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${styles[status] ?? styles["Not Started"]}`}>
      {status}
    </span>
  );
}

export function StatusDot({ status }: { status: NodeStatus }) {
  const color =
    status === "Approved" ? "bg-emerald-500" :
    status === "In Progress" ? "bg-amber-500" :
    status === "Under Review" ? "bg-sky-500" : "bg-slate-300";
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}