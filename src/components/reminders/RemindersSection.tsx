import { useState } from "react";
import ReminderActions from "@/components/reminders/ReminderActions";
import { EMPTY_REMINDER_FORM, WEEKDAY_OPTIONS } from "@/components/reminders/reminderForm";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DateTimeInput from "@/components/ui/DateTimeInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { PRIORITY_BADGE } from "@/constants/badges";
import { CLIENT_REMINDERS } from "@/data/client";
import { Calendar, Check, Clock, Plus, X } from "lucide-react";

export const REMINDER_PRIORITY_COLOR: Record<string, string> = {
  Critical: "var(--st-red)",
  High: "var(--st-amber)",
  Medium: "var(--brand)",
  Low: "var(--ring)",
};

export default function RemindersSection({ initialReminders, entityLabel = "client" }: { initialReminders: typeof CLIENT_REMINDERS; entityLabel?: string }) {
  const [reminders, setReminders] = useState(initialReminders);
  const [completedReminderIds, setCompletedReminderIds] = useState<number[]>([]);
  const [showCompletedReminders, setShowCompletedReminders] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<number | null>(null);
  const [reminderDraft, setReminderDraft] = useState<typeof CLIENT_REMINDERS[number] | null>(null);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState(EMPTY_REMINDER_FORM);
  const [reminderScheduleError, setReminderScheduleError] = useState("");

  const editReminder = (reminder: typeof CLIENT_REMINDERS[number]) => {
    setEditingReminderId(reminder.id);
    setReminderDraft({ ...reminder });
  };

  const saveReminder = () => {
    if (!reminderDraft) return;
    setReminders((current) => current.map((reminder) => reminder.id === reminderDraft.id ? reminderDraft : reminder));
    setEditingReminderId(null);
    setReminderDraft(null);
  };

  const deleteReminder = (id: number) => {
    setReminders((current) => current.filter((reminder) => reminder.id !== id));
    setCompletedReminderIds((current) => current.filter((reminderId) => reminderId !== id));
    if (editingReminderId === id) {
      setEditingReminderId(null);
      setReminderDraft(null);
    }
  };

  const displayedReminders = reminders.filter((reminder) =>
    showCompletedReminders
      ? completedReminderIds.includes(reminder.id)
      : !completedReminderIds.includes(reminder.id)
  );

  const completeReminder = (id: number) => {
    setCompletedReminderIds((current) => current.includes(id) ? current : [...current, id]);
  };

  const addReminder = (event: React.FormEvent) => {
    event.preventDefault();
    const needsWeekDays = newReminder.repetition === "Weekly" || newReminder.repetition === "Every 2 weeks";
    if (needsWeekDays && newReminder.weekDays.length === 0) {
      setReminderScheduleError("Select at least one day of the week.");
      return;
    }
    if (newReminder.repetition === "Monthly" && newReminder.monthDays.length === 0) {
      setReminderScheduleError("Select at least one day of the month.");
      return;
    }

    const formatDateTime = (value: string) => new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const nextId = reminders.reduce((highest, reminder) => Math.max(highest, reminder.id), 0) + 1;
    const repetition = needsWeekDays
      ? `${newReminder.repetition} · ${newReminder.weekDays.map((day) => day.slice(0, 3)).join(", ")}`
      : newReminder.repetition === "Monthly"
        ? `Monthly · Days ${[...newReminder.monthDays].sort((a, b) => Number(a) - Number(b)).join(", ")}`
        : newReminder.repetition;

    setReminders((current) => [
      {
        id: nextId,
        description: newReminder.description,
        priority: newReminder.priority,
        repetition,
        dueDate: formatDateTime(newReminder.dueDate),
        endDate: formatDateTime(newReminder.endDate),
        note: newReminder.note,
      },
      ...current,
    ]);
    setNewReminder(EMPTY_REMINDER_FORM);
    setReminderScheduleError("");
    setShowCompletedReminders(false);
    setReminderModalOpen(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-brand">
              {showCompletedReminders ? "Completed Reminders" : "Reminders"}
            </h3>
            <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">
              {displayedReminders.length} {showCompletedReminders ? "completed" : "scheduled"} reminders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompletedReminders((value) => !value)}
              className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-2 text-[14px] font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Check size={13} />
              {showCompletedReminders ? "View Active Reminders" : "View Completed Reminders"}
            </button>
            <button
              onClick={() => { setReminderScheduleError(""); setReminderModalOpen(true); }}
              className="btn btn-primary"
            >
              <Plus size={13} />
              Add Reminder
            </button>
          </div>
        </div>
        {displayedReminders.length > 0 && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_13rem_10rem_10rem_9rem] items-center gap-5 border-b border-[var(--border)] bg-[var(--muted)]/40 py-2.5 pl-6 pr-5">
            {["Reminder", "Repeats", "Due", "Ends", ""].map((heading) => (
              <span key={heading || "actions"} className="text-[13px] font-semibold uppercase tracking-wider text-brand">{heading}</span>
            ))}
          </div>
          <div className="divide-y divide-[var(--border)]">
          {displayedReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="border-l-4 transition-colors hover:bg-[var(--muted)]/50"
              style={{ borderLeftColor: REMINDER_PRIORITY_COLOR[reminder.priority] ?? "var(--border)" }}
            >
              {editingReminderId === reminder.id && reminderDraft ? (
                <div className="space-y-3 py-4 pl-5 pr-5">
                  <input
                    value={reminderDraft.description}
                    onChange={(event) => setReminderDraft({ ...reminderDraft, description: event.target.value })}
                    aria-label="Reminder description"
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <select
                      value={reminderDraft.priority}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, priority: event.target.value })}
                      aria-label="Reminder priority"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    >
                      {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
                    </select>
                    <input
                      value={reminderDraft.repetition}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, repetition: event.target.value })}
                      aria-label="Reminder repetition"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    />
                    <input
                      value={reminderDraft.dueDate}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, dueDate: event.target.value })}
                      aria-label="Reminder due date"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    />
                    <input
                      value={reminderDraft.endDate}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, endDate: event.target.value })}
                      aria-label="Reminder end date"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    />
                  </div>
                  <textarea
                    value={reminderDraft.note}
                    onChange={(event) => setReminderDraft({ ...reminderDraft, note: event.target.value })}
                    rows={2}
                    aria-label="Reminder note"
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setEditingReminderId(null); setReminderDraft(null); }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button onClick={saveReminder} className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[minmax(0,1fr)_13rem_10rem_10rem_9rem] items-center gap-5 py-3.5 pl-5 pr-5">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug text-[var(--foreground)]">{reminder.description}</p>
                    <p className="mt-0.5 truncate text-[13px] text-[var(--muted-foreground)]" title={reminder.note}>{reminder.note}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--foreground)]">
                    <span className="text-[var(--muted-foreground)]"><Clock size={12} /></span>
                    {reminder.repetition}
                  </span>
                  <span className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--foreground)]">
                    <span className="text-[var(--muted-foreground)]"><Calendar size={12} /></span>
                    {reminder.dueDate}
                  </span>
                  <span className="text-[14px] text-[var(--muted-foreground)]">{reminder.endDate}</span>
                  <div className="flex items-center justify-end gap-1">
                    <Badge label={reminder.priority} variant={PRIORITY_BADGE[reminder.priority]} className="text-[13px]" />
                    {showCompletedReminders ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500" title="Completed">
                        <Check size={14} />
                      </span>
                    ) : (
                      <button
                        onClick={() => completeReminder(reminder.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
                        title="Mark as completed"
                        aria-label="Mark reminder as completed"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <ReminderActions onEdit={() => editReminder(reminder)} onDelete={() => deleteReminder(reminder.id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </Card>
        )}
        {displayedReminders.length === 0 && (
          <Card className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
              <Check size={16} />
            </div>
            <p className="text-[15px] font-medium text-[var(--foreground)]">
              {showCompletedReminders ? "No completed reminders" : "No active reminders"}
            </p>
            <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
              {showCompletedReminders ? "Completed reminders will appear here." : "Add a reminder to get started."}
            </p>
          </Card>
        )}
      </div>

      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-200 ${
          reminderModalOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        }`}
        aria-hidden={!reminderModalOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            reminderModalOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setReminderModalOpen(false)}
        />
        <form
          onSubmit={addReminder}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-reminder-title"
          className={`relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ${
            reminderModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
          }`}
        >
          <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <h2 id="add-reminder-title" className="text-[18px] font-semibold text-brand">Add Reminder</h2>
              <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Schedule a new reminder for this {entityLabel}.</p>
            </div>
            <button
              type="button"
              onClick={() => setReminderModalOpen(false)}
              className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Close add reminder"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 px-5 py-5">
            <label className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Description</span>
              <select
                required
                value={newReminder.description}
                onChange={(event) => setNewReminder({ ...newReminder, description: event.target.value })}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
              >
                <option value="" disabled>Select a reminder description</option>
                <option value="Follow up on revised payment schedule">Follow up on revised payment schedule</option>
                <option value="Review account documentation">Review account documentation</option>
                <option value="Send monthly account statement">Send monthly account statement</option>
                <option value="Check promise-to-pay status">Check promise-to-pay status</option>
                <option value="Schedule client follow-up call">Schedule client follow-up call</option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Priority</span>
              <select
                value={newReminder.priority}
                onChange={(event) => setNewReminder({ ...newReminder, priority: event.target.value })}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
              >
                {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Repetition</span>
              <select
                value={newReminder.repetition}
                onChange={(event) => {
                  const repetition = event.target.value;
                  setReminderScheduleError("");
                  setNewReminder({
                    ...newReminder,
                    repetition,
                    weekDays: repetition === "Weekly" || repetition === "Every 2 weeks" ? newReminder.weekDays : [],
                    monthDays: repetition === "Monthly" ? newReminder.monthDays : [],
                  });
                }}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
              >
                {["Once", "Daily", "Weekly", "Every 2 weeks", "Monthly", "Quarterly"].map((repetition) => <option key={repetition}>{repetition}</option>)}
              </select>
            </label>

            {(newReminder.repetition === "Weekly" || newReminder.repetition === "Every 2 weeks") && (
              <div className="col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Week</span>
                <MultiSelectDropdown
                  label="Select one or more weekdays"
                  options={WEEKDAY_OPTIONS.map((day) => ({ value: day, label: day }))}
                  selected={newReminder.weekDays}
                  onChange={(weekDays) => {
                    setReminderScheduleError("");
                    setNewReminder({ ...newReminder, weekDays });
                  }}
                />
              </div>
            )}

            {newReminder.repetition === "Monthly" && (
              <div className="col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Month</span>
                <MultiSelectDropdown
                  label="Select one or more days"
                  grid
                  options={Array.from({ length: 31 }, (_, index) => {
                    const day = String(index + 1);
                    return { value: day, label: day };
                  })}
                  selected={newReminder.monthDays}
                  onChange={(monthDays) => {
                    setReminderScheduleError("");
                    setNewReminder({ ...newReminder, monthDays });
                  }}
                />
                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
                  If a selected day does not exist in a shorter month, the reminder will run on that month&apos;s final day.
                </p>
              </div>
            )}

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Due Date &amp; Time</span>
              <DateTimeInput required value={newReminder.dueDate} onChange={(dueDate) => setNewReminder({ ...newReminder, dueDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand" />
            </label>

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">End Date &amp; Time</span>
              <DateTimeInput required value={newReminder.endDate} onChange={(endDate) => setNewReminder({ ...newReminder, endDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand" />
            </label>

            <label className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Note</span>
              <textarea
                required
                rows={4}
                value={newReminder.note}
                onChange={(event) => setNewReminder({ ...newReminder, note: event.target.value })}
                placeholder="Add context or instructions for this reminder"
                className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand"
              />
            </label>
            {reminderScheduleError && (
              <p className="col-span-2 text-[13px] font-medium text-red-500">{reminderScheduleError}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-4">
            <button
              type="button"
              onClick={() => setReminderModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
