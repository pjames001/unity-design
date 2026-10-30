export const STATUS_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Active: "success",
  Overdue: "danger",
  "In Dispute": "warning",
  Promise: "info",
  Resolved: "outline",
};

export const PRIORITY_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Critical: "danger",
  High: "warning",
  Medium: "info",
  Low: "default",
};

export const CLIENT_TAG_STYLES = [
  "border-transparent bg-[var(--brand)] text-white",
  "border-transparent bg-[var(--st-violet)] text-white",
  "border-transparent bg-[var(--st-warning)] text-white",
];

export const TOTAL_TINT: Record<string, string> = {
  "text-amber-500": "bg-[var(--st-warning)]",
  "text-red-500": "bg-[var(--st-danger)]",
  "text-emerald-500": "bg-[var(--st-success)]",
  "text-brand": "bg-[var(--brand)]",
  "text-[var(--foreground)]": "bg-[#52525b]",
};

export const CALENDAR_PRIORITY_STYLES: Record<string, string> = {
  Critical: "border-red-500/30 bg-red-500/10 text-red-500",
  High: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  Medium: "border-brand/30 bg-brand/10 text-brand",
  Low: "border-zinc-500/30 bg-zinc-500/10 text-[var(--muted-foreground)]",
};

export const NOTE_SOURCE_BADGE: Record<string, "default" | "info"> = {
  Automated: "default",
  "User note": "info",
};

export const TRANSACTION_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Payment: "success",
  "Settlement Payment": "success",
  "Interest Accrual": "warning",
  "Court Costs": "info",
  Adjustment: "outline",
  Placement: "default",
};
