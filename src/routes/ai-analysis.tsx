import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/shared/PageContainer";
import { AI_SUGGESTIONS } from "@/data/ai-suggestions";
import { RiskBadge, badgeForRpn } from "@/components/shared/RiskBadge";
import { KpiTile } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { selectClass } from "@/components/ui/input-styles";
import { toast } from "sonner";
import { icons } from "@/components/icons/iconMap";

export const Route = createFileRoute("/ai-analysis")({ component: AI });

const KPI = [
  ["Total generated", "143", icons.ai],
  ["Accepted", "89", icons.approve],
  ["Edited & accepted", "12", icons.edit],
  ["Pending review", "23", icons.pending],
  ["Rejected", "19", icons.reject],
] as const;

const scoreChip =
  "type-body-sm tabular rounded-md border border-hairline bg-raised px-2 py-0.5 font-mono text-secondary-foreground";

function AI() {
  return (
    <PageContainer
      title="AI Analysis Queue"
      subtitle="Review pending AI-generated failure mode suggestions across the device."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {KPI.map(([l, v, icon]) => (
          <KpiTile key={l} label={l} icon={icon} value={v} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <select aria-label="Subsystem" className={selectClass}>
          <option>Subsystem: All</option>
        </select>
        <select aria-label="Severity" className={selectClass}>
          <option>Severity: any</option>
        </select>
        <select aria-label="Confidence" className={selectClass}>
          <option>Confidence: any</option>
        </select>
        <select aria-label="Source" className={selectClass}>
          <option>Source: All</option>
        </select>
        <select aria-label="Show" className={selectClass}>
          <option>Show: Pending only</option>
        </select>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {AI_SUGGESTIONS.map((s) => {
          const rpn = s.s * s.o * s.d;
          return (
            <section
              key={s.id}
              className="min-w-0 rounded-lg border border-hairline bg-container p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="type-caption rounded-md bg-raised-2 px-2 py-0.5 text-secondary-foreground">
                  {s.path}
                </span>
                <div className="flex items-center gap-2">
                  <span className="type-caption tabular text-tertiary">
                    Confidence {s.confidence}%
                  </span>
                  <span className="type-caption rounded-full border border-hairline px-2 py-0.5 text-tertiary">
                    {s.source}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2">
                <icons.ai className="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden="true" />
                <h3 className="type-label-md min-w-0 text-foreground">
                  <span className="mr-2 font-mono font-normal text-tertiary">{s.id}</span>
                  {s.title}
                </h3>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={scoreChip}>S={s.s}</span>
                <span className={scoreChip}>O={s.o}</span>
                <span className={scoreChip}>D={s.d}</span>
                <span className={scoreChip}>RPN={rpn}</span>
                <RiskBadge level={badgeForRpn(rpn, s.s)} />
                <span className="type-caption ml-auto text-quaternary">AI</span>
              </div>
              <p className="type-body-md mt-3 text-secondary-foreground">{s.reasoning}</p>
              <p className="type-caption mt-1 font-normal text-quaternary italic">
                Source: {s.ref}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toast.success(`AI suggestion ${s.id} accepted and added to DFMEA Workspace.`)
                  }
                  className={buttonClass("secondary", { size: "sm" })}
                >
                  <icons.approve className="size-3.5" aria-hidden="true" /> Accept
                </button>
                <button
                  type="button"
                  onClick={() => toast(`Editing ${s.id}...`)}
                  className={buttonClass("secondary", { size: "sm" })}
                >
                  <icons.edit className="size-3.5" aria-hidden="true" /> Edit and accept
                </button>
                <button
                  type="button"
                  onClick={() => toast.error(`${s.id} rejected.`)}
                  className={buttonClass("secondary", { size: "sm" })}
                >
                  <icons.reject className="size-3.5" aria-hidden="true" /> Reject
                </button>
                <button
                  type="button"
                  onClick={() => toast(`${s.id} flagged for team review.`)}
                  className={buttonClass("secondary", { size: "sm" })}
                >
                  <icons.flag className="size-3.5" aria-hidden="true" /> Flag for team
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}
