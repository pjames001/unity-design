import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import { LEGAL_BILLING, LEGAL_TRANSACTIONS } from "@/data/client";
import { formatUSDate } from "@/utils/date";
import { formatMoney } from "@/utils/format";
import { X } from "lucide-react";

export default function LegalBillingModal({ accountNumber, onClose }: { accountNumber: string | null; onClose: () => void }) {
  const [shown, setShown] = useState(accountNumber);
  useEffect(() => {
    if (accountNumber) setShown(accountNumber);
  }, [accountNumber]);
  useEffect(() => {
    if (!accountNumber) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accountNumber, onClose]);

  const open = Boolean(accountNumber);
  const bill = LEGAL_BILLING.find((row) => row.accountNumber === shown);
  const rows = (shown && LEGAL_TRANSACTIONS[shown]) || [];
  const money = (value: number) => (value ? formatMoney(value) : "—");
  const total = (key: "amount" | "agency" | "client" | "clientSent" | "agencySpent" | "convenience") => rows.reduce((sum, row) => sum + row[key], 0);
  const columns: Array<[string, "left" | "right"]> = [
    ["Date", "left"], ["Description", "left"], ["ID / Check #", "left"], ["Note", "left"], ["Collector", "left"],
    ["Amount", "right"], ["Agency", "right"], ["Client", "right"], ["Client Sent", "right"], ["Agency Spent", "right"], ["Convenience Fees", "right"],
  ];

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center px-6 py-8 transition-all duration-200 ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-detail-title"
        className={`relative z-10 flex max-h-full w-full max-w-[1520px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 id="legal-detail-title" className="text-[18px] font-semibold text-brand">Legal Billing · {shown}</h2>
              {bill && <Badge label={bill.status} variant={bill.status === "Active" ? "success" : bill.status === "Settled" ? "info" : "warning"} className="text-[13px]" />}
            </div>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{bill?.fullNameCompany} · {rows.length} transactions</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close legal billing details">
            <X size={15} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[var(--card)]">
              <tr className="border-b border-[var(--border)]">
                {columns.map(([heading, align]) => (
                  <th key={heading} className={`whitespace-nowrap px-3 py-3 text-[13px] font-semibold uppercase tracking-wider text-brand ${align === "right" ? "text-right" : "text-left"}`}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.reference} className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--muted)]">
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] text-[var(--foreground)]">{formatUSDate(row.date)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] font-medium text-[var(--foreground)]">{row.description}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] font-semibold text-brand">{row.reference}</td>
                  <td className="max-w-52 truncate px-3 py-3 text-[14px] text-[var(--muted-foreground)]" title={row.note}>{row.note}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] text-[var(--foreground)]">{row.collector}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-semibold text-emerald-500">{money(row.amount)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-amber-500">{money(row.agency)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-brand">{money(row.client)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-[var(--foreground)]">{money(row.clientSent)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-[var(--foreground)]">{money(row.agencySpent)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-[var(--muted-foreground)]">{money(row.convenience)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-10 text-center text-[14px] text-[var(--muted-foreground)]">No legal transactions for this account.</td></tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-[var(--border)] bg-[var(--muted)]/40">
                  <td colSpan={5} className="px-3 py-3 text-[13px] font-semibold uppercase tracking-wider text-brand">Totals</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-emerald-500">{money(total("amount"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-amber-500">{money(total("agency"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-brand">{money(total("client"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-[var(--foreground)]">{money(total("clientSent"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-[var(--foreground)]">{money(total("agencySpent"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-[var(--muted-foreground)]">{money(total("convenience"))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="flex justify-end border-t border-[var(--border)] px-6 py-3.5">
          <button type="button" onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </section>
    </div>
  );
}
