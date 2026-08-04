import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { KB_RESULTS } from "@/data/misc";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/knowledge-base")({ component: KB });

const SOURCES = ["All Sources", "Previous DFMEAs", "FDA MDR Database", "Medical Standards", "CAPA Records", "Lessons Learned"];

function KB() {
  const [query, setQuery] = useState("battery charging safety");
  const [source, setSource] = useState("All Sources");

  const runSearch = (q: string) => {
    console.log("[KnowledgeBase] Search", { query: q, source });
    toast(`Searching "${q}" in ${source}…`);
  };

  return (
    <PageContainer title="Knowledge Base" subtitle="Search organizational knowledge: prior DFMEAs, FDA MDR, standards, CAPA, lessons learned.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") runSearch(query); }}
              className="h-[52px] w-full rounded-lg border bg-card pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Search failure modes, standards, recalls, lessons learned..."
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["battery thermal runaway","alarm latency IEC 60601","electrode adhesion diaphoresis","leakage current isolation","watchdog timer software"].map((c) => (
              <button key={c} onClick={() => { setQuery(c); runSearch(c); }} className="rounded-full border bg-background px-3 py-1 text-xs hover:bg-muted">{c}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {SOURCES.map((s) => (
              <button key={s} onClick={() => { setSource(s); console.log("[KnowledgeBase] Source filter", s); toast(`Filtering results by: ${s}`); }} className={`rounded-full border px-3 py-1 text-xs ${source === s ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}>{s}</button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {KB_RESULTS.map((r) => (
              <Card key={r.title}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="rounded bg-accent px-2 py-0.5 font-semibold text-primary">{r.source}</span>
                  <span className="text-muted-foreground">Similarity: {r.similarity}%</span>
                </div>
                <div className="font-display font-semibold">{r.title}</div>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{r.body}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <button onClick={() => { console.log("[KnowledgeBase] Use in DFMEA", r.title); toast.success(`"${r.title}" added to DFMEA Workspace.`); }} className="rounded-md bg-primary px-2 py-1 font-semibold text-primary-foreground">Use in DFMEA Workspace</button>
                  <button onClick={() => { console.log("[KnowledgeBase] View Full Record", r.title); toast(`Opening full record: ${r.title}`); }} className="rounded-md border px-2 py-1 font-semibold hover:bg-muted">View Full Record</button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <h3 className="mb-3 font-display font-semibold">Knowledge Base Index</h3>
          <dl className="space-y-2 text-sm">
            {[
              ["Previous DFMEAs","47 documents"],
              ["FDA MDR Records","1,284 indexed"],
              ["Medical Standards","23 documents"],
              ["CAPA Records","89 records"],
              ["Lessons Learned","61 entries"],
              ["Field Complaints","142 records"],
            ].map(([l,v]) => (
              <div key={l} className="flex justify-between border-b pb-1"><dt className="text-muted-foreground">{l}</dt><dd className="font-mono text-xs">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-3 rounded bg-emerald-50 p-2 text-xs text-emerald-800">
            Last updated: 2025-05-14 09:00 UTC · Index status: Current
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}