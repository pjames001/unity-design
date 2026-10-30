import { useState } from "react";
import Card from "@/components/ui/Card";
import { Check } from "lucide-react";

export const SPLIT_ROWS = [
  { key: "principal", label: "Principal", client: "75", attorney: "0", agency: "25" },
  { key: "interest", label: "Interest", client: "50", attorney: "0", agency: "50" },
  { key: "cost", label: "Cost", client: "100", attorney: "0", agency: "0" },
  { key: "attorneyFees", label: "Attorney Fees", client: "0", attorney: "100", agency: "0" },
  { key: "overpayment", label: "Overpayment", client: "100", attorney: "0", agency: "0" },
  { key: "convenienceFees", label: "Convenience Fees", client: "0", attorney: "0", agency: "100" },
  { key: "legalCosts", label: "Legal Costs", client: "0", attorney: "60", agency: "40" },
  { key: "collectorPercentage", label: "Collector Percentage", client: "0", attorney: "0", agency: "100" },
];

export default function DistributionSplitCard({ subtitle = "How each collected amount is divided between the client, attorney, and agency" }: { subtitle?: string }) {
  const [splits, setSplits] = useState(SPLIT_ROWS);
  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const parties = [
    { key: "client", label: "Client", color: "var(--brand)" },
    { key: "attorney", label: "Attorney", color: "var(--st-violet)" },
    { key: "agency", label: "Agency", color: "var(--st-warning)" },
  ] as const;

  return (
      <Card className="overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
          <div>
            <h3 className="text-[16px] font-semibold text-brand">Distribution Split</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            {parties.map((party) => (
              <span key={party.key} className="flex items-center gap-1.5 text-[13px] text-[var(--muted-foreground)]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: party.color }} />
                {party.label}
              </span>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
              <th className="w-48 px-5 py-3 text-left text-[13px] font-semibold uppercase tracking-wider text-brand">Amount Type</th>
              {parties.map((party) => (
                <th key={party.key} className="w-36 px-3 py-3 text-left text-[13px] font-semibold uppercase tracking-wider text-brand">{party.label}</th>
              ))}
              <th className="px-5 py-3 text-left text-[13px] font-semibold uppercase tracking-wider text-brand">Split</th>
              <th className="w-28 px-5 py-3 text-right text-[13px] font-semibold uppercase tracking-wider text-brand">Total</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((row) => {
              const numbers = parties.map((party) => Number(row[party.key]) || 0);
              const total = numbers.reduce((sum, value) => sum + value, 0);
              const valid = Math.abs(total - 100) < 0.001;
              return (
                <tr key={row.key} className="border-b border-[var(--border)] last:border-0">
                  <td className="whitespace-nowrap px-5 py-2.5 text-[15px] font-medium text-[var(--foreground)]">{row.label}</td>
                  {parties.map((party) => (
                    <td key={party.key} className="px-3 py-2.5">
                      <div className="relative w-28">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={row[party.key]}
                          aria-label={`${row.label} ${party.label} percentage`}
                          onChange={(event) => setSplits((current) => current.map((item) => (item.key === row.key ? { ...item, [party.key]: event.target.value } : item)))}
                          className={`${fieldClass} h-9 pr-8`}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">%</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-5 py-2.5">
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                      {parties.map((party, index) => (
                        <div
                          key={party.key}
                          title={`${party.label}: ${numbers[index]}%`}
                          className="h-full transition-all duration-300"
                          style={{ width: `${Math.min(numbers[index], 100)}%`, background: party.color }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[13px] font-semibold text-white ${valid ? "bg-[var(--st-success)]" : "bg-[var(--st-danger)]"}`}>
                      {valid && <Check size={12} />}
                      {Number(total.toFixed(2))}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
  );
}
