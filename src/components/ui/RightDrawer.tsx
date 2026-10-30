import { X } from "lucide-react";
export function AccountRightDrawer({
  open,
  title,
  subtitle,
  onClose,
  action,
  children,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-xl flex-col border-l border-[var(--border)] bg-[var(--card)] shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="text-[16px] font-semibold text-[var(--foreground)]">{title}</p>
            <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {action}
            <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label={`Close ${title}`}>
              <X size={15} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </>
  );
}
