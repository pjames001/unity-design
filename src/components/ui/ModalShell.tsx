import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function ModalShell({ open, title, subtitle, onClose, onSubmit, width = "max-w-3xl", children }: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  width?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return createPortal(
    <div className={`fixed inset-0 z-[80] flex items-center justify-center px-4 py-8 transition-all duration-200 ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <form
        onSubmit={(event) => { event.preventDefault(); onSubmit(); }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 flex max-h-full w-full ${width} flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-semibold text-brand">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label={`Close ${title}`}>
            <X size={15} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex justify-end gap-2 border-t border-[var(--border)] px-6 py-3.5">
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>,
    document.body
  );
}
