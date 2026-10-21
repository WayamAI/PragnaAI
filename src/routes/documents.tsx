import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/shared/PageContainer";
import { DOCUMENTS } from "@/data/misc";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EngineerAvatar } from "@/components/shared/EngineerAvatar";
import { buttonClass } from "@/components/ui/button-styles";
import { tableStyles } from "@/components/ui/table-styles";
import { cn } from "@/lib/utils";
import { icons } from "@/components/icons/iconMap";
import { toast } from "sonner";

export const Route = createFileRoute("/documents")({ component: Docs });

const quiet = "text-tertiary";

function Docs() {
  return (
    <PageContainer
      title="Document Vault"
      subtitle="Uploaded engineering documents and extraction status."
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          toast.success("Document queued for extraction.");
        }}
        className="mb-6 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-strong bg-raised px-6 py-5 text-center sm:flex-row sm:justify-start sm:text-left"
      >
        <icons.upload size={28} />
        <div>
          <p className="type-body-md text-foreground">
            Drag and drop engineering documents here, or{" "}
            <button
              type="button"
              onClick={() => {
                console.log("[Documents] Browse clicked");
                toast("Opening file picker…");
              }}
              className="rounded-sm font-medium text-brand-text underline underline-offset-2 outline-none hover:brightness-90 focus-visible:ring-2 focus-visible:ring-active"
            >
              browse
            </button>
          </p>
          <p className="type-caption mt-0.5 font-normal text-quaternary">
            PDF, DOCX, XLSX, CSV · max 50MB per file
          </p>
        </div>
      </div>

      <div className={tableStyles.wrap}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={tableStyles.th()}>Name</th>
              <th className={tableStyles.th()}>Type</th>
              <th className={tableStyles.th()}>Version</th>
              <th className={tableStyles.th()}>Pages</th>
              <th className={tableStyles.th()}>Uploaded by</th>
              <th className={tableStyles.th()}>Date</th>
              <th className={tableStyles.th()}>Status</th>
              <th className={tableStyles.th()}>Entities</th>
              <th className={tableStyles.th()}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map((d) => (
              <tr key={d.name} className={tableStyles.tr()}>
                <td className={tableStyles.td({ primary: true, className: "font-mono" })}>
                  {d.name}
                </td>
                <td className={tableStyles.td({ className: quiet })}>{d.type}</td>
                <td className={tableStyles.td({ className: quiet })}>{d.version}</td>
                <td className={tableStyles.td({ className: quiet })}>{d.pages ?? "n/a"}</td>
                <td className={tableStyles.td()}>
                  <EngineerAvatar name={d.by} />
                </td>
                <td className={tableStyles.td({ className: cn("font-mono", quiet) })}>{d.date}</td>
                <td className={tableStyles.td()}>
                  <StatusBadge status={d.status} />
                </td>
                <td className={tableStyles.td({ className: quiet })}>{d.entities}</td>
                <td className={tableStyles.td()}>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[Documents] View", d.name);
                      toast(`Opening ${d.name}`);
                    }}
                    className={buttonClass("ghost", {
                      className: "px-2 text-secondary-foreground",
                    })}
                  >
                    <icons.view size={16} /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log("[Documents] Re-extract", d.name);
                      toast.success(`Re-extraction queued for ${d.name}`);
                    }}
                    className={buttonClass("ghost", {
                      className: "px-2 text-secondary-foreground",
                    })}
                  >
                    <icons.reextract size={16} /> Re-extract
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
