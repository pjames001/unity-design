export type ReminderForm = {
  description: string;
  priority: string;
  repetition: string;
  dueDate: string;
  endDate: string;
  note: string;
  weekDays: string[];
  monthDays: string[];
};

export const EMPTY_REMINDER_FORM: ReminderForm = {
  description: "",
  priority: "Medium",
  repetition: "Once",
  dueDate: "",
  endDate: "",
  note: "",
  weekDays: [],
  monthDays: [],
};

export const WEEKDAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
