import { useState } from "react";
import AddReminderModal from "@/components/reminders/AddReminderModal";
import { EMPTY_REMINDER_FORM, ReminderForm } from "@/components/reminders/reminderForm";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { CALENDAR_PRIORITY_STYLES, PRIORITY_BADGE } from "@/constants/badges";
import { CALENDAR_REMINDERS } from "@/data/calendar";
import { Plus } from "lucide-react";

export default function CalendarPage() {
  const [view, setView] = useState<"daily" | "monthly">("monthly");
  const [selectedDate, setSelectedDate] = useState("2026-09-14");
  const [calendarReminders, setCalendarReminders] = useState(CALENDAR_REMINDERS);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<ReminderForm>(EMPTY_REMINDER_FORM);
  const [scheduleError, setScheduleError] = useState("");
  const selectedDateLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dailySlots = Array.from({ length: 21 }, (_, index) => {
    const totalMinutes = 8 * 60 + index * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  });
  const firstDayOffset = new Date(2026, 8, 1).getDay();
  const monthCells = Array.from({ length: 35 }, (_, index) => {
    const day = index - firstDayOffset + 1;
    return day >= 1 && day <= 30 ? day : null;
  });

  const addCalendarReminder = (event: React.FormEvent) => {
    event.preventDefault();
    const needsWeekDays = newReminder.repetition === "Weekly" || newReminder.repetition === "Every 2 weeks";
    if (needsWeekDays && newReminder.weekDays.length === 0) {
      setScheduleError("Select at least one day of the week.");
      return;
    }
    if (newReminder.repetition === "Monthly" && newReminder.monthDays.length === 0) {
      setScheduleError("Select at least one day of the month.");
      return;
    }

    const dueDate = new Date(newReminder.dueDate);
    const date = newReminder.dueDate.slice(0, 10);
    const time = dueDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const nextId = calendarReminders.reduce((highest, reminder) => Math.max(highest, reminder.id), 0) + 1;
    setCalendarReminders((current) => [
      ...current,
      {
        id: nextId,
        date,
        time,
        title: newReminder.description,
        client: "Westfield Group",
        priority: newReminder.priority,
      },
    ]);
    setSelectedDate(date);
    setView("daily");
    setNewReminder(EMPTY_REMINDER_FORM);
    setScheduleError("");
    setReminderModalOpen(false);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-brand">
            {view === "monthly" ? "September 2026" : selectedDateLabel}
          </h2>
          <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">
            {view === "monthly" ? "Monthly reminder schedule" : "Daily schedule in 30-minute intervals"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setScheduleError(""); setReminderModalOpen(true); }}
            className="btn btn-primary"
          >
            <Plus size={13} />
            Add Reminder
          </button>
          <div className="flex items-center gap-0.5 rounded-md bg-[var(--muted)] p-0.5">
            <button
              onClick={() => setView("daily")}
              className={`rounded px-3 py-1.5 text-[14px] font-medium transition-all ${
                view === "daily"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setView("monthly")}
              className={`rounded px-3 py-1.5 text-[14px] font-medium transition-all ${
                view === "monthly"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {view === "monthly" ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--muted)]/40">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <div key={day} className="px-3 py-2.5 text-center text-[13px] font-semibold uppercase tracking-wider text-brand">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((day, index) => {
              const date = day ? `2026-09-${String(day).padStart(2, "0")}` : "";
              const events = day ? calendarReminders.filter((reminder) => reminder.date === date) : [];
              const isSelected = date === selectedDate;
              return (
                <button
                  key={index}
                  disabled={!day}
                  onClick={() => {
                    if (!day) return;
                    setSelectedDate(date);
                    setView("daily");
                  }}
                  className={`min-h-32 border-b border-r border-[var(--border)] p-2.5 text-left transition-colors ${
                    day ? "hover:bg-[var(--muted)]/50" : "bg-[var(--muted)]/20"
                  } ${isSelected ? "bg-brand/5" : ""} ${(index + 1) % 7 === 0 ? "border-r-0" : ""} ${index >= 28 ? "border-b-0" : ""}`}
                >
                  {day && (
                    <>
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[14px] font-medium ${
                        isSelected ? "bg-brand text-white" : "text-[var(--foreground)]"
                      }`}>
                        {day}
                      </span>
                      <div className="mt-2 space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div key={event.id} className={`truncate rounded border px-1.5 py-1 text-[12px] font-medium ${CALENDAR_PRIORITY_STYLES[event.priority]}`}>
                            {event.time} · {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <p className="px-1 text-[12px] text-[var(--muted-foreground)]">+{events.length - 2} more</p>
                        )}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="section-head border-b border-[var(--border)] px-5 py-3">
            <p className="text-[15px] font-semibold text-[var(--foreground)]">{selectedDateLabel}</p>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
              {calendarReminders.filter((reminder) => reminder.date === selectedDate).length} reminders scheduled
            </p>
          </div>
          <div>
            {dailySlots.map((slot) => {
              const events = calendarReminders.filter((reminder) => reminder.date === selectedDate && reminder.time === slot);
              return (
                <div key={slot} className="grid min-h-16 grid-cols-[90px_1fr] border-b border-[var(--border)] last:border-b-0">
                  <div className="border-r border-[var(--border)] px-4 py-3 text-right text-[13px] font-medium text-[var(--muted-foreground)]">
                    {slot}
                  </div>
                  <div className="px-4 py-2">
                    {events.map((event) => (
                      <div key={event.id} className={`flex items-center justify-between rounded-md border px-3 py-2 ${CALENDAR_PRIORITY_STYLES[event.priority]}`}>
                        <div>
                          <p className="text-[14px] font-semibold">{event.title}</p>
                          <p className="mt-0.5 text-[12px] opacity-80">{event.client}</p>
                        </div>
                        <Badge label={event.priority} variant={PRIORITY_BADGE[event.priority]} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      <AddReminderModal
        open={reminderModalOpen}
        reminder={newReminder}
        setReminder={setNewReminder}
        scheduleError={scheduleError}
        clearScheduleError={() => setScheduleError("")}
        onClose={() => setReminderModalOpen(false)}
        onSubmit={addCalendarReminder}
      />
    </main>
  );
}
