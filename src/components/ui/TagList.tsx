import { useState } from "react";
import { Tag, X } from "lucide-react";

export default function TagList({ tags }: { tags: string[] }) {
  const [list, setList] = useState(tags);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const tag = draft.trim();
    if (tag && !list.includes(tag)) setList((current) => [...current, tag]);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[var(--muted-foreground)]" title="Tags"><Tag size={14} /></span>
      {list.map((tag) => (
        <span key={tag} className="group flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)] py-0.5 pl-2.5 pr-2.5 text-[13px] font-medium text-[var(--foreground)]">
          {tag}
          <button
            type="button"
            onClick={() => setList((current) => current.filter((item) => item !== tag))}
            aria-label={`Remove ${tag} tag`}
            className="-mr-1 hidden h-4 w-4 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)] group-hover:flex"
          >
            <X size={9} strokeWidth={3} />
          </button>
        </span>
      ))}
      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); commit(); }
            if (event.key === "Escape") { setDraft(""); setAdding(false); }
          }}
          placeholder="New tag"
          className="h-6 w-28 rounded-full border border-[var(--brand)] bg-[var(--card)] px-2.5 text-[13px] text-[var(--foreground)] outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-[var(--border)] px-2.5 py-0.5 text-[13px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:text-brand"
        >
          + Add tag
        </button>
      )}
    </div>
  );
}
