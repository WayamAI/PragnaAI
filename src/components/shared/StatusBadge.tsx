import type { FMStatus } from "@/data/dfmea";
import type { NodeStatus } from "@/data/hierarchy";
import type { Tone } from "@/lib/severity";
import { QuietStatus, StatusDot as ToneDot, ToneBadge } from "@/components/ui/primitives";

// Normal states are quiet text with a dot. Solid badges are only for states
// that need attention: Under Review (info) and Failed (error).
const quiet: Record<string, Tone> = {
  "Not Started": "neutral",
  "In Progress": "warning",
  Approved: "success",
  Extracted: "success",
  Parsing: "warning",
  Queued: "neutral",
};

const badge: Record<string, Tone> = {
  "Under Review": "info",
  Failed: "error",
};

export function StatusBadge({ status }: { status: FMStatus | NodeStatus | string }) {
  const badgeTone = badge[status];
  if (badgeTone) return <ToneBadge tone={badgeTone}>{status}</ToneBadge>;
  return <QuietStatus tone={quiet[status] ?? "neutral"}>{status}</QuietStatus>;
}

export function StatusDot({ status }: { status: NodeStatus }) {
  const tone: Tone =
    status === "Approved"
      ? "success"
      : status === "In Progress"
        ? "warning"
        : status === "Under Review"
          ? "info"
          : "neutral";
  return <ToneDot tone={tone} />;
}
