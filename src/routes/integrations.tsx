import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/shared/PageContainer";
import { INTEGRATIONS } from "@/data/integrations";
import { QuietStatus, ToneBadge } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { icons } from "@/components/icons/iconMap";
import { toast } from "sonner";

export const Route = createFileRoute("/integrations")({ component: Integrations });

function StatusPill({ status }: { status: "connected" | "syncing" }) {
  if (status === "syncing") {
    return (
      <ToneBadge tone="info" className="shrink-0 gap-1">
        <icons.sync size={12} className="animate-spin" /> Syncing
      </ToneBadge>
    );
  }
  return (
    <QuietStatus tone="success" className="shrink-0">
      Connected
    </QuietStatus>
  );
}

const FLOW = [
  "Connected systems",
  "AI extraction & retrieval agents",
  "Draft failure modes + S/O/D",
  "Engineer review",
  "Approved DFMEA",
];

function Integrations() {
  const connected = INTEGRATIONS.filter((i) => i.status === "connected").length;

  return (
    <PageContainer
      title="Integrations"
      subtitle="Connected engineering, quality and regulatory systems that feed this DFMEA."
      actions={
        <button
          type="button"
          onClick={() => toast.success("Re-syncing all connected systems…")}
          className={buttonClass("primary", { size: "sm" })}
        >
          <icons.sync size={16} /> Sync all
        </button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-hairline bg-container p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-action text-tertiary">
          <icons.integrations size={24} />
        </span>
        <div className="min-w-0 flex-1 basis-64">
          <div className="type-label-md text-foreground">
            {connected} of {INTEGRATIONS.length} systems connected
          </div>
          <p className="type-body-sm mt-1 text-tertiary">
            PragnaAI pulls product structure, requirements, field-quality and regulatory data from
            these systems, then the AI agents turn them into failure modes, S/O/D scores and
            traceability.
          </p>
        </div>
        <QuietStatus tone="success">Live</QuietStatus>
      </div>

      <section className="mb-4 rounded-lg border border-hairline bg-container p-4">
        <h3 className="type-eyebrow mb-3 text-quaternary">How Your DFMEA Is Assembled</h3>
        <ol className="type-body-md flex flex-wrap items-center gap-2">
          {FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={
                  i === FLOW.length - 1
                    ? "type-label-md rounded-lg border border-strong bg-raised-2 px-3 py-2 text-foreground"
                    : "rounded-lg border border-hairline bg-raised px-3 py-2 text-secondary-foreground"
                }
              >
                {step}
              </span>
              {i < FLOW.length - 1 && <icons.flow size={16} className="text-quaternary" />}
            </li>
          ))}
        </ol>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((it) => (
          <section
            key={it.name}
            className="min-w-0 rounded-lg border border-hairline bg-container p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-action text-tertiary">
                  <it.icon size={24} />
                </span>
                <div className="min-w-0">
                  <h3 className="type-label-md truncate text-foreground">{it.name}</h3>
                  <div className="type-caption font-normal text-quaternary">{it.vendor}</div>
                </div>
              </div>
              <StatusPill status={it.status} />
            </div>

            <div className="type-eyebrow mt-3 inline-block rounded-md bg-raised-2 px-2 py-0.5 text-tertiary">
              {it.category}
            </div>

            <dl className="mt-3 flex flex-col gap-2">
              <div>
                <dt className="type-label-sm text-foreground">Data pulled in</dt>
                <dd className="type-body-sm text-tertiary">{it.feeds}</dd>
              </div>
              <div>
                <dt className="type-label-sm text-foreground">Feeds the DFMEA</dt>
                <dd className="type-body-sm text-tertiary">{it.into}</dd>
              </div>
            </dl>

            <div className="type-caption mt-3 flex flex-wrap items-center justify-between gap-x-3 border-t border-hairline pt-2 font-normal text-tertiary">
              <span className="font-mono">{it.records}</span>
              <span>Last sync: {it.lastSync}</span>
            </div>
            <div className="type-caption mt-1 font-mono font-normal break-all text-quaternary">
              {it.endpoint}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
