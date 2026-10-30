import { ReminderForm, WEEKDAY_OPTIONS } from "@/components/reminders/reminderForm";
import DateTimeInput from "@/components/ui/DateTimeInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { X } from "lucide-react";

export default function AddReminderModal({
  open,
  reminder,
  setReminder,
  scheduleError,
  clearScheduleError,
  onClose,
  onSubmit,
}: {
  open: boolean;
  reminder: ReminderForm;
  setReminder: (reminder: ReminderForm) => void;
  scheduleError: string;
  clearScheduleError: () => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-200 ${
        open ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!open}
    >
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <form
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-add-reminder-title"
        className={`relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 id="calendar-add-reminder-title" className="text-[18px] font-semibold text-brand">Add Reminder</h2>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Schedule a new reminder.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close add reminder">
            <X size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 px-5 py-5">
          <label className="col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Description</span>
            <select required value={reminder.description} onChange={(event) => setReminder({ ...reminder, description: event.target.value })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand">
              <option value="" disabled>Select a reminder description</option>
              {["Follow up on revised payment schedule", "Review account documentation", "Send monthly account statement", "Check promise-to-pay status", "Schedule client follow-up call"].map((description) => <option key={description}>{description}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Priority</span>
            <select value={reminder.priority} onChange={(event) => setReminder({ ...reminder, priority: event.target.value })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand">
              {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Repetition</span>
            <select
              value={reminder.repetition}
              onChange={(event) => {
                const repetition = event.target.value;
                clearScheduleError();
                setReminder({
                  ...reminder,
                  repetition,
                  weekDays: repetition === "Weekly" || repetition === "Every 2 weeks" ? reminder.weekDays : [],
                  monthDays: repetition === "Monthly" ? reminder.monthDays : [],
                });
              }}
              className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
            >
              {["Once", "Daily", "Weekly", "Every 2 weeks", "Monthly", "Quarterly"].map((repetition) => <option key={repetition}>{repetition}</option>)}
            </select>
          </label>
          {(reminder.repetition === "Weekly" || reminder.repetition === "Every 2 weeks") && (
            <div className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Week</span>
              <MultiSelectDropdown
                label="Select one or more weekdays"
                options={WEEKDAY_OPTIONS.map((day) => ({ value: day, label: day }))}
                selected={reminder.weekDays}
                onChange={(weekDays) => { clearScheduleError(); setReminder({ ...reminder, weekDays }); }}
              />
            </div>
          )}
          {reminder.repetition === "Monthly" && (
            <div className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Month</span>
              <MultiSelectDropdown
                label="Select one or more days"
                grid
                options={Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))}
                selected={reminder.monthDays}
                onChange={(monthDays) => { clearScheduleError(); setReminder({ ...reminder, monthDays }); }}
              />
              <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">Missing dates in shorter months run on the month&apos;s final day.</p>
            </div>
          )}
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Due Date &amp; Time</span>
            <DateTimeInput required value={reminder.dueDate} onChange={(dueDate) => setReminder({ ...reminder, dueDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand" />
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">End Date &amp; Time</span>
            <DateTimeInput required value={reminder.endDate} onChange={(endDate) => setReminder({ ...reminder, endDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand" />
          </label>
          <label className="col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Note</span>
            <textarea required rows={4} value={reminder.note} onChange={(event) => setReminder({ ...reminder, note: event.target.value })} placeholder="Add context or instructions" className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-brand" />
          </label>
          {scheduleError && <p className="col-span-2 text-[13px] font-medium text-red-500">{scheduleError}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-4">
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Add Reminder</button>
        </div>
      </form>
    </div>
  );
}
