import DocumentFolder from "@/components/documents/DocumentFolder";
import { CLIENT_DOCUMENT_FOLDERS } from "@/data/client";
import { Plus } from "lucide-react";

export default function DocumentsSection({ folders }: { folders: typeof CLIENT_DOCUMENT_FOLDERS }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-brand">Documents</h3>
          <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">
            {folders.length} folders · {folders.reduce((total, folder) => total + folder.files.length, 0)} files
          </p>
        </div>
        <button type="button" className="btn btn-primary">
          <Plus size={13} />Upload
        </button>
      </div>
      <div className="space-y-3">
        {folders.map((folder) => (
          <DocumentFolder key={folder.name} folder={folder} />
        ))}
      </div>
    </div>
  );
}
