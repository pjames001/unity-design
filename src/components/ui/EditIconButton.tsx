import { SquarePen } from "lucide-react";

export default function EditIconButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand)]/10 hover:text-brand"
    >
      <SquarePen size={14} />
    </button>
  );
}
