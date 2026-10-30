import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { PRIORITY_BADGE, STATUS_BADGE } from "@/constants/badges";
import { DEBTORS } from "@/data/debtors";
import { formatUSDate } from "@/utils/date";
import { Funnel } from "lucide-react";

export default function DebtorsTable() {
  return (
    <Card className="overflow-hidden">
      <div className="section-head flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-[16px] font-semibold text-brand">Active Accounts</h3>
          <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">1,284 total · showing recent</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary">
            <Funnel size={12} />
            Filter
          </button>
          <button className="btn btn-primary">
            + New Account
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Account ID", "Debtor", "Agent", "Amount", "Due Date", "Status", "Priority"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[13px] font-semibold text-brand uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEBTORS.map((row, i) => (
              <tr key={row.id} className={`border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors cursor-pointer ${i === DEBTORS.length - 1 ? "border-0" : ""}`}>
                <td className="px-4 py-3.5 text-[15px] text-brand font-semibold">{row.id}</td>
                <td className="px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{row.name}</td>
                <td className="px-4 py-3.5 text-[15px] text-[var(--muted-foreground)]">{row.agent}</td>
                <td className="px-4 py-3.5 text-[15px] font-semibold text-[var(--foreground)]">{row.amount}</td>
                <td className="px-4 py-3.5 text-[15px] text-[var(--muted-foreground)]">{formatUSDate(row.due)}</td>
                <td className="px-4 py-3.5"><Badge label={row.status} variant={STATUS_BADGE[row.status]} className="text-[14px]" /></td>
                <td className="px-4 py-3.5"><Badge label={row.priority} variant={PRIORITY_BADGE[row.priority]} className="text-[14px]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
