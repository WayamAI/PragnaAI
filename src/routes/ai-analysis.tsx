import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { AI_SUGGESTIONS } from "@/data/ai-suggestions";
import { RiskBadge, badgeForRpn } from "@/components/shared/RiskBadge";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/ai-analysis")({ component: AI });

const KPI = [
  ["Total Generated", "143"], ["Accepted", "89"], ["Edited & Accepted", "12"], ["Pending Review", "23"], ["Rejected", "19"],
];

function AI() {
  return (
    <PageContainer title="AI Analysis Queue" subtitle="Review pending AI-generated failure mode suggestions across the device.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {KPI.map(([l, v]) => (
          <Card key={l} className="!p-4 text-center">
            <div className="text-[11px] font-semibold uppercase text-muted-foreground">{l}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{v}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 !p-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Subsystem: All</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Severity ≥ any</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Confidence ≥ any</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Source: All</option></select>
          <select className="rounded-md border bg-background px-2 py-1.5"><option>Show: Pending Only</option></select>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {AI_SUGGESTIONS.map((s) => {
          const rpn = s.s * s.o * s.d;
          return (
            <div key={s.id} className="rounded-lg border bg-[color:var(--ai-bg)]/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium">{s.path}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[color:var(--ai-accent)] px-2 py-0.5 text-[10px] font-semibold text-white">Confidence {s.confidence}%</span>
                  <span className="rounded border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{s.source}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[color:var(--ai-accent)]" />
                <span className="font-mono text-xs text-[color:var(--ai-accent)]">{s.id}</span>
                <span className="font-semibold">{s.title}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="rounded bg-white px-2 py-0.5 font-mono">S={s.s}</span>
                <span className="rounded bg-white px-2 py-0.5 font-mono">O={s.o}</span>
                <span className="rounded bg-white px-2 py-0.5 font-mono">D={s.d}</span>
                <span className="rounded bg-white px-2 py-0.5 font-mono">RPN={rpn}</span>
                <RiskBadge level={badgeForRpn(rpn, s.s)} />
                <span className="ml-auto rounded bg-[color:var(--ai-accent)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--ai-accent)]">AI</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{s.reasoning}</p>
              <p className="mt-1 text-[11px] italic text-muted-foreground">Source: {s.ref}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => toast.success(`AI suggestion ${s.id} accepted and added to DFMEA Workspace.`)} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">Accept</button>
                <button onClick={() => toast(`Editing ${s.id}...`)} className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-muted">Edit & Accept</button>
                <button onClick={() => toast.error(`${s.id} rejected.`)} className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-muted">Reject</button>
                <button onClick={() => toast(`${s.id} flagged for team review.`)} className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-muted">Flag for Team</button>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}