export const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  default: { bg: "#52525b", text: "#fff", border: "transparent" },
  success: { bg: "var(--st-success)", text: "#fff", border: "transparent" },
  warning: { bg: "var(--st-warning)", text: "#fff", border: "transparent" },
  danger: { bg: "var(--st-danger)", text: "#fff", border: "transparent" },
  info: { bg: "var(--brand)", text: "#fff", border: "transparent" },
  outline: { bg: "var(--muted)", text: "var(--foreground)", border: "var(--border)" },
};

export default function Badge({ label, variant = "default", className = "" }: { label: string; variant?: "default" | "success" | "warning" | "danger" | "info" | "outline"; className?: string }) {
  const c = BADGE_COLORS[variant];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[13px] font-medium border ${className}`}
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {label}
    </span>
  );
}
