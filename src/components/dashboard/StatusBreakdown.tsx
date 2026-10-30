import Card from "@/components/ui/Card";

export const STATUS_BREAKDOWN = [
  { label: "Active", value: 641, pct: 50, color: "var(--st-green)" },
  { label: "Overdue", value: 257, pct: 20, color: "var(--st-red)" },
  { label: "Promise", value: 192, pct: 15, color: "var(--st-violet)" },
  { label: "In Dispute", value: 128, pct: 10, color: "var(--st-amber)" },
  { label: "Resolved", value: 66, pct: 5, color: "var(--st-blue)" },
];

export default function StatusBreakdown() {
  return (
    <Card>
      <div className="section-head px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-[16px] font-semibold text-brand">Accounts Status</h3>
        <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">1,284 total accounts</p>
      </div>
      <div className="px-5 py-4">
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
          {STATUS_BREAKDOWN.map((s) => (
            <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} className="h-full" />
          ))}
        </div>
        <div className="space-y-2.5">
          {STATUS_BREAKDOWN.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                <span className="text-[15px] text-[var(--muted-foreground)]">{s.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[var(--muted-foreground)]">{s.pct}%</span>
                <span className="text-[15px] font-semibold text-[var(--foreground)] w-8 text-right">{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
