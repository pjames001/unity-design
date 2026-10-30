import { useState } from "react";
import ModalShell from "@/components/ui/ModalShell";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { EDIT_FIELD_CLASS, EDIT_LABEL_CLASS } from "@/components/ui/formStyles";

export const SKIP_TRACE_TABS = [{ key: "credit", label: "Credit Summary" }] as const;

export const PROPERTY_OWNERSHIP = ["None", "Own", "Rent", "Mortgage"];

export function creditRating(score: number) {
  if (score >= 800) return { label: "Exceptional", color: "var(--st-success)" };
  if (score >= 740) return { label: "Very Good", color: "var(--st-success)" };
  if (score >= 670) return { label: "Good", color: "var(--brand)" };
  if (score >= 580) return { label: "Fair", color: "var(--st-warning)" };
  return { label: "Poor", color: "var(--st-danger)" };
}

export default function SkipTracingModal({ open, onClose, debtorName }: { open: boolean; onClose: () => void; debtorName: string }) {
  const [tab, setTab] = useState<typeof SKIP_TRACE_TABS[number]["key"]>("credit");
  const [credit, setCredit] = useState({
    score: "642",
    revolving: "48200",
    available: "11800",
    ownership: "Mortgage",
    mortgage: "612000",
    equity: "438000",
    zillow: "1050000",
    rent: "5400",
  });
  const set = (key: keyof typeof credit) => (value: string) => setCredit((current) => ({ ...current, [key]: value }));

  const score = Math.min(850, Math.max(300, Number(credit.score) || 300));
  const rating = creditRating(score);
  const position = ((score - 300) / 550) * 100;
  const revolving = Number(credit.revolving) || 0;
  const available = Number(credit.available) || 0;
  const utilization = revolving + available ? Math.round((revolving / (revolving + available)) * 100) : 0;

  const money = (label: string, key: keyof typeof credit, hint?: string) => (
    <label className="block">
      <span className={EDIT_LABEL_CLASS}>{label}{hint && <span className="text-[var(--muted-foreground)]"> · {hint}</span>}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">$</span>
        <input type="number" min="0" step="1" value={credit[key]} onChange={(event) => set(key)(event.target.value)} className={`${EDIT_FIELD_CLASS} pl-7`} />
      </div>
    </label>
  );

  return (
    <ModalShell open={open} title="Skip Tracing" subtitle={`Credit and asset profile for ${debtorName} · last pulled 10/14/2026`} onClose={onClose} onSubmit={onClose} width="max-w-4xl">
      <div className="-mx-6 -mt-5 mb-5 flex items-center gap-1 border-b border-[var(--border)] px-6">
        {SKIP_TRACE_TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`border-b-2 px-3 py-3 text-[14px] font-medium transition-colors ${tab === item.key ? "border-[var(--brand)] text-brand" : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "credit" && (
        <div className="space-y-6">
          <div className="grid grid-cols-[1.1fr_1fr] gap-5">
            <div className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-4">
              <div className="flex items-end justify-between gap-4">
                <label className="block w-32">
                  <span className={EDIT_LABEL_CLASS}>Credit Score</span>
                  <input type="number" min="300" max="850" value={credit.score} onChange={(event) => set("score")(event.target.value)} className={`${EDIT_FIELD_CLASS} text-[18px] font-bold`} />
                </label>
                <span className="mb-2 rounded-md px-2.5 py-1 text-[13px] font-semibold text-white" style={{ background: rating.color }}>{rating.label}</span>
              </div>
              <div className="mt-6">
                <div className="relative">
                  <div className="flex h-2.5 overflow-hidden rounded-full">
                    <span className="h-full flex-[280]" style={{ background: "var(--st-danger)" }} />
                    <span className="h-full flex-[90]" style={{ background: "var(--st-warning)" }} />
                    <span className="h-full flex-[70]" style={{ background: "var(--brand)" }} />
                    <span className="h-full flex-[110]" style={{ background: "var(--st-success)" }} />
                  </div>
                  <span
                    className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--card)] shadow transition-[left] duration-300"
                    style={{ left: `${position}%`, background: rating.color }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[12px] text-[var(--muted-foreground)]">
                  <span>300</span><span>580</span><span>670</span><span>740</span><span>850</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 whitespace-nowrap text-[13px]">
                  {[
                    ["Poor", "var(--st-danger)", "300–579"],
                    ["Fair", "var(--st-warning)", "580–669"],
                    ["Good", "var(--brand)", "670–739"],
                    ["Very Good+", "var(--st-success)", "740–850"],
                  ].map(([name, color, range]) => (
                    <div key={name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: color }} />
                      <span className="text-[var(--foreground)]">{name}</span>
                      <span className="text-[var(--muted-foreground)]">{range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-4">
              {money("Revolving Credit", "revolving", "current balance")}
              {money("Available Credit", "available")}
              <div>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="font-medium text-[var(--foreground)]">Credit utilization</span>
                  <span className="font-semibold" style={{ color: utilization > 50 ? "var(--st-danger)" : utilization > 30 ? "var(--st-warning)" : "var(--st-success)" }}>{utilization}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${utilization}%`, background: utilization > 50 ? "var(--st-danger)" : utilization > 30 ? "var(--st-warning)" : "var(--st-success)" }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-brand">Property</p>
            <div className="grid grid-cols-[1.1fr_1fr] items-end gap-5">
              <div>
                <span className={EDIT_LABEL_CLASS}>Property Ownership</span>
                <SegmentedControl label="Property ownership" options={PROPERTY_OWNERSHIP} value={credit.ownership} onChange={set("ownership")} />
              </div>
              {money("Zillow Valuation", "zillow")}
              {money("Mortgage Amount", "mortgage")}
              {money("Available Equity", "equity")}
              {money("Est. Monthly Rent", "rent")}
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
