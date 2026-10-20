import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { KB_RESULTS } from "@/data/misc";
import { Panel, QuietStatus } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass } from "@/components/ui/input-styles";
import { cn } from "@/lib/utils";
import { icons } from "@/components/icons/iconMap";
import { toast } from "sonner";

export const Route = createFileRoute("/knowledge-base")({ component: KB });

const SOURCES = [
  "All sources",
  "Previous DFMEAs",
  "FDA MDR database",
  "Medical standards",
  "CAPA records",
  "Lessons learned",
];

const SUGGESTIONS = [
  "battery thermal runaway",
  "alarm latency IEC 60601",
  "electrode adhesion diaphoresis",
  "leakage current isolation",
  "watchdog timer software",
];

const INDEX = [
  ["Previous DFMEAs", "47 documents"],
  ["FDA MDR records", "1,284 indexed"],
  ["Medical standards", "23 documents"],
  ["CAPA records", "89 records"],
  ["Lessons learned", "61 entries"],
  ["Field complaints", "142 records"],
];

function KB() {
  const [query, setQuery] = useState("battery charging safety");
  const [source, setSource] = useState("All sources");

  const runSearch = (q: string) => {
    console.log("[KnowledgeBase] Search", { query: q, source });
    toast(`Searching "${q}" in ${source}…`);
  };

  return (
    <PageContainer
      title="Knowledge Base"
      subtitle="Search organizational knowledge: prior DFMEAs, FDA MDR, standards, CAPA, lessons learned."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="min-w-0 lg:col-span-3">
          <div className="relative">
            <icons.search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-quaternary"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch(query);
              }}
              aria-label="Search knowledge base"
              className={inputClass("md", "pl-11")}
              placeholder="Search failure modes, standards, recalls and lessons learned"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setQuery(c);
                  runSearch(c);
                }}
                className={buttonClass("chip")}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SOURCES.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={source === s}
                onClick={() => {
                  setSource(s);
                  console.log("[KnowledgeBase] Source filter", s);
                  toast(`Filtering results by: ${s}`);
                }}
                className={buttonClass("chip", { active: source === s })}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {KB_RESULTS.map((r) => (
              <section key={r.title} className="rounded-lg border border-hairline bg-container p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="type-caption rounded-md bg-raised-2 px-2 py-0.5 text-secondary-foreground">
                    {r.source}
                  </span>
                  <span className="type-caption tabular text-tertiary">
                    Similarity: {r.similarity}%
                  </span>
                </div>
                <h3 className="type-label-md text-foreground">{r.title}</h3>
                <p className="type-body-md mt-1 whitespace-pre-line text-tertiary">{r.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[KnowledgeBase] Use in DFMEA", r.title);
                      toast.success(`"${r.title}" added to DFMEA Workspace.`);
                    }}
                    className={buttonClass("secondary", { size: "sm" })}
                  >
                    <icons.workspace className="size-3.5" aria-hidden="true" /> Use in DFMEA
                    workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[KnowledgeBase] View Full Record", r.title);
                      toast(`Opening full record: ${r.title}`);
                    }}
                    className={buttonClass("ghost", { size: "sm" })}
                  >
                    <icons.view className="size-3.5" aria-hidden="true" /> View full record
                  </button>
                </div>
              </section>
            ))}
          </div>
        </div>

        <Panel title="Knowledge Base Index" icon={icons.database} className={cn("lg:self-start")}>
          <dl className="type-body-md divide-y divide-hairline">
            {INDEX.map(([l, v]) => (
              <div key={l} className="flex justify-between gap-3 py-2 first:pt-0">
                <dt className="text-tertiary">{l}</dt>
                <dd className="type-body-sm tabular font-mono text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 rounded-lg border border-hairline bg-raised p-3">
            <QuietStatus tone="success" className="whitespace-normal">
              Last updated: 2025-05-14 09:00 UTC · Index status: Current
            </QuietStatus>
          </div>
        </Panel>
      </div>
    </PageContainer>
  );
}
