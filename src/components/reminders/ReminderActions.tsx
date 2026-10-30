import { useState } from "react";
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";

export default function ReminderActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  const runAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Open reminder actions"
        aria-expanded={open}
      >
        <Ellipsis size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl">
          <button
            onClick={() => runAction(onEdit)}
            className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[13px] text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            <SquarePen size={13} />
            Edit reminder
          </button>
          <button
            onClick={() => runAction(onDelete)}
            className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[13px] text-red-500 transition-colors hover:bg-red-500/10"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
