import { useEffect } from "react";
import Badge from "@/components/ui/Badge";
import { CLIENT_AGREEMENT } from "@/data/client";
import { Download, X } from "lucide-react";

export default function AgreementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const a = CLIENT_AGREEMENT;
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center px-4 py-8 transition-all duration-200 ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-title"
        className={`relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="agreement-title" className="text-[18px] font-semibold text-brand">{a.title}</h2>
              <Badge label={a.version} variant="info" className="text-[13px]" />
            </div>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Between {a.agency.name} and {a.client.name} · Effective {a.effective}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close agreement">
            <X size={15} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-4 gap-3">
            {a.terms.map((term) => (
              <div key={term.label} className="rounded-lg bg-[var(--muted)]/60 px-3 py-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand">{term.label}</p>
                <p className="mt-0.5 text-[14px] font-medium text-[var(--foreground)]">{term.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {a.sections.map((section) => (
              <div key={section.heading}>
                <p className="text-[15px] font-semibold text-[var(--foreground)]">{section.heading}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted-foreground)]">{section.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-5">
            {[["Agency", a.agency], ["Client", a.client]].map(([party, info]) => {
              const p = info as typeof a.agency;
              return (
                <div key={party as string} className="rounded-lg border border-[var(--border)] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-brand">{party as string}</p>
                  <p className="mt-2 font-serif text-[20px] italic text-[var(--foreground)]">{p.signer}</p>
                  <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">{p.role}, {p.name}</p>
                  <p className="text-[13px] text-[var(--muted-foreground)]">Signed {a.signedOn}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-3.5">
          <button type="button" className="btn btn-secondary">
            <Download size={13} />
            Download PDF
          </button>
          <button type="button" onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </section>
    </div>
  );
}
