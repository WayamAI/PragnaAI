import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { INTEGRATIONS } from "@/data/integrations";
import { RefreshCw, CheckCircle2, ArrowRight, Plug } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/integrations")({ component: Integrations });

function StatusPill({ status }: { status: "connected" | "syncing" }) {
  if (status === "syncing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
        <RefreshCw className="h-3 w-3 animate-spin" /> SYNCING
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
      <CheckCircle2 className="h-3 w-3" /> CONNECTED
    </span>
  );
}

function Integrations() {
  const connected = INTEGRATIONS.filter((i) => i.status === "connected").length;

  return (
    <PageContainer
      title="Integrations"
      subtitle="Connected engineering, quality and regulatory systems that feed this DFMEA."
      actions={
        <button
          onClick={() => toast.success("Re-syncing all connected systems…")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" /> Sync all
        </button>
      }
    >
      {/* Summary strip */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border bg-[color:var(--ai-bg)]/40 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Plug className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{connected} of {INTEGRATIONS.length} systems connected</div>
          <p className="text-xs text-muted-foreground">
            PragnaAI pulls product structure, requirements, field-quality and regulatory data
            from these systems, then the AI agents turn them into failure modes, S/O/D scores and traceability.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live
        </span>
      </div>

      {/* How data flows into the DFMEA */}
      <Card className="mb-6">
        <h2 className="mb-3 font-display text-base font-semibold">How your DFMEA is assembled</h2>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-md border bg-background px-3 py-2 font-medium">Connected systems</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="rounded-md border bg-[color:var(--ai-bg)] px-3 py-2 font-medium text-[color:var(--ai-accent)]">AI extraction &amp; retrieval agents</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="rounded-md border bg-background px-3 py-2 font-medium">Draft failure modes + S/O/D</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="rounded-md border bg-background px-3 py-2 font-medium">Engineer review</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="rounded-md border border-primary/30 bg-accent px-3 py-2 font-semibold text-primary">Approved DFMEA</span>
        </div>
      </Card>

      {/* System cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((it) => (
          <Card key={it.name} className="!p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-[11px] text-muted-foreground">{it.vendor}</div>
                </div>
              </div>
              <StatusPill status={it.status} />
            </div>

            <div className="mt-3 inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {it.category}
            </div>

            <dl className="mt-3 space-y-2 text-xs">
              <div>
                <dt className="font-semibold text-foreground">Data pulled in</dt>
                <dd className="text-muted-foreground">{it.feeds}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Feeds the DFMEA</dt>
                <dd className="text-muted-foreground">{it.into}</dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
              <span className="font-mono">{it.records}</span>
              <span>Last sync: {it.lastSync}</span>
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground/70">{it.endpoint}</div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
