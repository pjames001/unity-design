import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import NoteActions from "@/components/notes/NoteActions";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { NOTE_SOURCE_BADGE } from "@/constants/badges";
import { CLIENT_NOTES } from "@/data/client";
import { Plus, Star, X } from "lucide-react";

export type Note = typeof CLIENT_NOTES[number];

export const CURRENT_USER = "Marcus Klein";

export default function NotesSection({ initialNotes, limit }: { initialNotes: Note[]; limit?: number }) {
  const [notes, setNotes] = useState(initialNotes);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [importantNotesOnly, setImportantNotesOnly] = useState(false);
  const [noteSort, setNoteSort] = useState<"newest" | "oldest" | "author-asc" | "author-desc">("newest");
  const [noteAuthor, setNoteAuthor] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ text: "", important: false });

  useEffect(() => {
    if (!addOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setAddOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addOpen]);

  const addNote = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.text.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
    const id = notes.reduce((highest, note) => Math.max(highest, note.id), 0) + 1;
    setNotes((current) => [{ id, author: CURRENT_USER, time, text, source: "User note", important: draft.important }, ...current]);
    setDraft({ text: "", important: false });
    setImportantNotesOnly(false);
    setNoteAuthor("all");
    setNoteSort("newest");
    setAddOpen(false);
  };

  const editNote = (id: number, text: string) => {
    setEditingNoteId(id);
    setEditDraft(text);
  };

  const saveNote = () => {
    setNotes((current) => current.map((note) => note.id === editingNoteId ? { ...note, text: editDraft } : note));
    setEditingNoteId(null);
  };

  const toggleImportantNote = (id: number) => {
    setNotes((current) => current.map((note) => note.id === id ? { ...note, important: !note.important } : note));
  };

  const deleteNote = (id: number) => {
    setNotes((current) => current.filter((note) => note.id !== id));
    if (editingNoteId === id) setEditingNoteId(null);
  };

  const noteAuthors = Array.from(new Set(notes.map((note) => note.author))).sort((a, b) => a.localeCompare(b));
  const visibleNotes = notes
    .filter((note) => !importantNotesOnly || note.important)
    .filter((note) => noteAuthor === "all" || note.author === noteAuthor)
    .sort((a, b) => {
      if (noteSort === "author-asc") return a.author.localeCompare(b.author);
      if (noteSort === "author-desc") return b.author.localeCompare(a.author);
      const aTime = new Date(a.time.replace(" · ", " ")).getTime();
      const bTime = new Date(b.time.replace(" · ", " ")).getTime();
      return noteSort === "oldest" ? aTime - bTime : bTime - aTime;
    });

  return (
    <Card className="overflow-hidden">
      <div className="section-head flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Notes</h3>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setAddOpen(true)} className="btn btn-primary h-8 py-0">
            <Plus size={13} />
            Add Note
          </button>
          <button
            onClick={() => setImportantNotesOnly((value) => !value)}
            aria-pressed={importantNotesOnly}
            title="Show important notes only"
            className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
              importantNotesOnly
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Star size={14} />
          </button>
          <select
            value={noteSort}
            onChange={(event) => setNoteSort(event.target.value as typeof noteSort)}
            aria-label="Sort notes"
            className="h-8 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-brand"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="author-asc">User name A–Z</option>
            <option value="author-desc">User name Z–A</option>
          </select>
          <select
            value={noteAuthor}
            onChange={(event) => setNoteAuthor(event.target.value)}
            aria-label="Filter notes by user"
            className="h-8 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-brand"
          >
            <option value="all">All users</option>
            {noteAuthors.map((author) => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {visibleNotes.slice(0, limit).map((n) => (
            <div key={n.id} className="px-4 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-medium text-[var(--foreground)]">{n.author}</span>
                  <Badge label={n.source} variant={NOTE_SOURCE_BADGE[n.source]} className="text-[14px]" />
                  {n.important && (
                    <span className="text-amber-500" title="Important note">
                      <Star size={13} />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[var(--muted-foreground)]">{n.time}</span>
                  <NoteActions
                    important={n.important}
                    onEdit={() => editNote(n.id, n.text)}
                    onToggleImportant={() => toggleImportantNote(n.id)}
                    onDelete={() => deleteNote(n.id)}
                  />
                </div>
              </div>
              {editingNoteId === n.id ? (
                <div>
                  <textarea
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] leading-relaxed text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNote}
                      className="btn btn-primary"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[15px] text-[var(--muted-foreground)] leading-relaxed">{n.text}</p>
              )}
            </div>
        ))}
        {visibleNotes.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-[14px] font-medium text-[var(--foreground)]">No matching notes</p>
            <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">Adjust the importance or user filters.</p>
          </div>
        )}
      </div>
      {createPortal(
        <div className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-200 ${addOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!addOpen}>
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${addOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setAddOpen(false)} />
          <form
            onSubmit={addNote}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-note-title"
            className={`relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${addOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
          >
            <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h2 id="add-note-title" className="text-[18px] font-semibold text-brand">Add Note</h2>
                <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Posted as {CURRENT_USER}</p>
              </div>
              <button type="button" onClick={() => setAddOpen(false)} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close add note">
                <X size={15} />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Note <span className="text-red-500">*</span></span>
                <textarea
                  required
                  autoFocus={addOpen}
                  rows={5}
                  value={draft.text}
                  onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                  placeholder="Write the note"
                  className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] leading-relaxed text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              </label>
              <ToggleSwitch checked={draft.important} onChange={(important) => setDraft({ ...draft, important })} label="Mark as important" />
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-4">
              <button type="button" onClick={() => setAddOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Add Note</button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </Card>
  );
}
