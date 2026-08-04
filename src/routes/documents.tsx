import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, Card } from "@/components/shared/PageContainer";
import { DOCUMENTS } from "@/data/misc";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/documents")({ component: Docs });

function Docs() {
  return (
    <PageContainer title="Document Vault" subtitle="Uploaded engineering documents and extraction status.">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); toast.success("Document queued for extraction."); }}
        className="mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-accent/40 p-8 text-center"
      >
        <Upload className="h-6 w-6 text-primary" />
        <p className="mt-2 text-sm font-semibold">Drag and drop engineering documents here, or <button onClick={() => { console.log("[Documents] Browse clicked"); toast("Opening file picker…"); }} className="text-primary underline">Browse</button></p>
        <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, XLSX, CSV — max 50MB per file</p>
      </div>

      <Card className="!p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Name</th><th className="px-2 py-2">Type</th><th className="px-2 py-2">Version</th>
              <th className="px-2 py-2">Pages</th><th className="px-2 py-2">Uploaded By</th><th className="px-2 py-2">Date</th>
              <th className="px-2 py-2">Status</th><th className="px-2 py-2">Entities</th><th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map((d) => (
              <tr key={d.name} className="border-t hover:bg-sky-50/60">
                <td className="px-3 py-2 font-mono text-xs text-primary">{d.name}</td>
                <td className="px-2 py-2 text-xs">{d.type}</td>
                <td className="px-2 py-2 text-xs">{d.version}</td>
                <td className="px-2 py-2 text-xs">{d.pages ?? "—"}</td>
                <td className="px-2 py-2"><EngineerAvatar name={d.by} /></td>
                <td className="px-2 py-2 font-mono text-xs">{d.date}</td>
                <td className="px-2 py-2"><StatusBadge status={d.status} /></td>
                <td className="px-2 py-2 text-xs">{d.entities}</td>
                <td className="px-2 py-2 text-xs"><button onClick={() => { console.log("[Documents] View", d.name); toast(`Opening ${d.name}`); }} className="text-primary hover:underline mr-2">View</button><button onClick={() => { console.log("[Documents] Re-extract", d.name); toast.success(`Re-extraction queued for ${d.name}`); }} className="text-muted-foreground hover:underline">Re-extract</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageContainer>
  );
}