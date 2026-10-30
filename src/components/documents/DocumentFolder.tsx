import { useState } from "react";
import Card from "@/components/ui/Card";
import { CLIENT_DOCUMENT_FOLDERS } from "@/data/client";
import { ChevronDown, Download, FileText, Folder } from "lucide-react";

export default function DocumentFolder({ folder }: { folder: typeof CLIENT_DOCUMENT_FOLDERS[number] }) {
  const [open, setOpen] = useState(true);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[var(--muted)]"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-500">
          <Folder size={17} />
        </span>
        <div className="flex-1">
          <p className="text-[16px] font-semibold text-[var(--foreground)]">{folder.name}</p>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{folder.files.length} files</p>
        </div>
        <span className={`text-[var(--muted-foreground)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown size={15} />
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--border)]">
          {folder.files.length === 0 && (
            <p className="px-5 py-4 text-[14px] text-[var(--muted-foreground)]">No files yet</p>
          )}
          {folder.files.map((file, index) => (
            <div
              key={file.name}
              className={`group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--muted)] ${
                index < folder.files.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-brand/20 bg-brand/10 text-brand">
                <FileText size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-[var(--foreground)]">{file.name}</p>
                <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{file.size} · {file.date}</p>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-[var(--muted-foreground)] opacity-0 transition-all hover:bg-[var(--card)] hover:text-[var(--foreground)] group-hover:opacity-100"
                aria-label={`Download ${file.name}`}
              >
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
