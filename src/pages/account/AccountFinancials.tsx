import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DateInput from "@/components/ui/DateInput";
import { TRANSACTION_BADGE } from "@/constants/badges";
import { ACCOUNT_COLLECTORS } from "@/constants/options";
import { ACCOUNT_DETAILS, AccountTransaction, EMPTY_SPLIT, INITIAL_TRANSACTIONS } from "@/data/account";
import { formatUSDate } from "@/utils/date";
import { formatMoney } from "@/utils/format";
import { Check, FileText, Plus, SquarePen, Trash2, X } from "lucide-react";

export const TRANSACTION_TYPES = ["Payment", "Settlement Payment", "Interest Accrual", "Court Costs", "Adjustment"];

export const PAYMENT_TYPES = ["Payment", "Settlement Payment"];

export default function AccountFinancials() {
  const [transactions, setTransactions] = useState<AccountTransaction[]>(INITIAL_TRANSACTIONS);
  const [form, setForm] = useState({
    date: "2026-10-09",
    description: "Payment",
    amount: "",
    reference: "",
    collector: ACCOUNT_DETAILS.collector,
    coCollector: ACCOUNT_DETAILS.coCollector,
  });
  const [error, setError] = useState("");
  const [checkFile, setCheckFile] = useState<{ name: string; url: string } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({ date: "", checkNumber: "", note: "", collector: "", coCollector: "" });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const runningBalance = new Map<number, number>();
  transactions.reduce((total, t) => {
    const next = t.payment ? total - t.amount : total + t.amount;
    runningBalance.set(t.id, next);
    return next;
  }, 0);

  const startEdit = (t: AccountTransaction) => {
    setDeletingId(null);
    setEditingId(t.id);
    setEditDraft({ date: t.date, checkNumber: t.checkNumber, note: t.note, collector: t.collector, coCollector: t.coCollector });
  };
  const saveEdit = () => {
    setTransactions((current) => current.map((t) => (t.id === editingId ? { ...t, ...editDraft } : t)));
    setEditingId(null);
  };

  const charges = transactions.filter((t) => !t.payment);
  const payments = transactions.filter((t) => t.payment);
  const sum = (rows: AccountTransaction[], key: "principal" | "interest" | "costs" | "amount") => rows.reduce((total, row) => total + row[key], 0);
  const principal = sum(charges, "principal");
  const interest = sum(charges, "interest");
  const costs = sum(charges, "costs");
  const subtotal = principal + interest + costs;
  const totalPaid = sum(payments, "amount");
  const balance = subtotal - totalPaid;

  const postTransaction = (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.date) return setError("Choose a post date.");
    if (!amount || amount <= 0) return setError("Enter an amount greater than zero.");
    const isPayment = PAYMENT_TYPES.includes(form.description);
    if (isPayment && amount > balance) return setError("The payment is larger than the current balance.");

    const base: AccountTransaction = {
      ...EMPTY_SPLIT,
      id: Date.now(),
      date: form.date,
      description: form.description,
      checkNumber: isPayment ? form.reference : "",
      note: isPayment ? "" : form.reference,
      collector: form.collector,
      coCollector: form.coCollector,
      amount,
      balance: isPayment ? balance - amount : balance + amount,
      payment: isPayment,
    };

    let row = base;
    if (isPayment) {
      let remaining = amount;
      const toCosts = Math.min(remaining, costs - sum(payments, "costs"));
      remaining -= toCosts;
      const toInterest = Math.min(remaining, interest - sum(payments, "interest"));
      remaining -= toInterest;
      const attorneyFees = Math.round(amount * 0.05);
      const thirdPartyFees = Math.round(amount * 0.01);
      const agency = Math.round(amount * 0.25);
      row = { ...base, costs: toCosts, interest: toInterest, principal: remaining, attorneyFees, thirdPartyFees, agency, client: amount - attorneyFees - thirdPartyFees - agency };
    } else if (form.description === "Interest Accrual") {
      row = { ...base, interest: amount };
    } else if (form.description === "Court Costs") {
      row = { ...base, costs: amount };
    } else {
      row = { ...base, principal: amount };
    }

    setTransactions((current) => [...current, checkFile ? { ...row, checkImage: checkFile.name } : row]);
    setForm((current) => ({ ...current, amount: "", reference: "" }));
    setCheckFile(null);
    setError("");
  };

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10";
  const labelClass = "mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-brand";
  const allocation = (value: number, payment: boolean) => (value === 0 ? "—" : `${payment ? "−" : ""}${formatMoney(value)}`);
  const split = (value: number) => (value === 0 ? "—" : formatMoney(value));

  return (
    <div className="space-y-4 p-5">
      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Balance Summary</h3>
        </div>
        <div className="grid grid-cols-6 divide-x divide-[var(--border)]">
          {[
            { label: "Principal", value: principal, color: "text-brand" },
            { label: "Interest", value: interest, color: "text-amber-500" },
            { label: "Costs / Fees", value: costs, color: "text-violet-500" },
            { label: "Subtotal", value: subtotal, color: "text-[var(--foreground)]" },
            { label: "Total Paid", value: totalPaid, color: "text-emerald-500" },
            { label: "Current Balance", value: balance, color: "text-red-500" },
          ].map((metric) => (
            <div key={metric.label} className="px-5 py-4">
              <p className="text-[14px] font-semibold uppercase tracking-wider text-brand">{metric.label}</p>
              <p className={`mt-1.5 text-[26px] font-bold tracking-tight ${metric.color}`}>{formatMoney(metric.value)}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Post Transaction</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Record a payment, charge, or adjustment against this account</p>
        </div>
        <form onSubmit={postTransaction} className="grid grid-cols-[repeat(6,minmax(0,1fr))_auto] items-end gap-3 p-5">
          <label>
            <span className={labelClass}>Post Date</span>
            <DateInput value={form.date} onChange={(date) => setForm({ ...form, date })} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Description</span>
            <select value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={fieldClass}>
              {TRANSACTION_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span className={labelClass}>Amount</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--muted-foreground)]">$</span>
              <input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={`${fieldClass} pl-7`} />
            </div>
          </label>
          <label>
            <span className={labelClass}>Note / Check #</span>
            <input type="text" placeholder={PAYMENT_TYPES.includes(form.description) ? "e.g. CHK-10422" : "Add a note"} value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Collector</span>
            <select value={form.collector} onChange={(e) => setForm({ ...form, collector: e.target.value })} className={fieldClass}>
              {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label>
            <span className={labelClass}>Co-Collector</span>
            <select value={form.coCollector} onChange={(e) => setForm({ ...form, coCollector: e.target.value })} className={fieldClass}>
              <option value="">Not assigned</option>
              {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <button type="submit" className="btn btn-primary h-10">
            <Plus size={13} />
            Post Transaction
          </button>
          <div className="col-span-7">
            <span className={labelClass}>Check Image <span className="normal-case tracking-normal text-[var(--muted-foreground)]">(proof of payment)</span></span>
            {checkFile ? (
              <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/40 p-2 pr-3">
                <img src={checkFile.url} alt="Check preview" className="h-12 w-20 rounded object-cover" />
                <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-[var(--foreground)]">{checkFile.name}</p>
                <button
                  type="button"
                  onClick={() => { URL.revokeObjectURL(checkFile.url); setCheckFile(null); }}
                  className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
                  aria-label="Remove check image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <label className="relative flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-dashed border-[var(--border)] text-[14px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:text-brand">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setCheckFile({ name: file.name, url: URL.createObjectURL(file) });
                    event.target.value = "";
                  }}
                />
                <FileText size={16} />
                Click to upload a photo or scan of the check
              </label>
            )}
          </div>
          {error && <p className="col-span-7 text-[13px] font-medium text-red-500">{error}</p>}
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Transaction History</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{transactions.length} transactions · newest first</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
                {[
                  ["Date", "left"], ["Description", "left"], ["Check #", "left"], ["Note", "left"], ["Collector", "left"], ["Co-Collector", "left"],
                  ["Amount", "right"], ["Principal", "right"], ["Interest", "right"], ["Costs / Fees", "right"], ["Attorney Fees", "right"],
                  ["3rd Party Fees", "right"], ["Agency", "right"], ["Client", "right"], ["Balance", "right"], ["Actions", "center"],
                ].map(([heading, align]) => (
                  <th
                    key={heading}
                    className={`whitespace-nowrap px-4 py-3 text-[13px] font-semibold uppercase tracking-wider text-brand ${align === "right" ? "text-right" : align === "center" ? "sticky right-0 bg-[var(--card)] text-center shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.4)]" : "text-left"}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...transactions].reverse().map((t) => {
                const editing = editingId === t.id;
                const editField = "h-8 w-full min-w-28 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-[13px] text-[var(--foreground)] outline-none focus:border-brand";
                return (
                <tr key={t.id} className={`group border-b border-[var(--border)] transition-colors last:border-0 ${editing ? "bg-[var(--brand)]/10" : "hover:bg-[var(--muted)]"}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] text-[var(--foreground)]">
                    {editing ? <div className="w-36"><DateInput value={editDraft.date} onChange={(date) => setEditDraft({ ...editDraft, date })} className={editField} /></div> : formatUSDate(t.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3"><Badge label={t.description} variant={TRANSACTION_BADGE[t.description] ?? "default"} className="text-[13px]" /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] font-semibold text-brand">
                    {editing ? (
                      <input value={editDraft.checkNumber} onChange={(e) => setEditDraft({ ...editDraft, checkNumber: e.target.value })} aria-label="Check number" className={editField} />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {t.checkNumber || "—"}
                        {t.checkImage && <span title={`Check image: ${t.checkImage}`} className="text-[var(--muted-foreground)]"><FileText size={13} /></span>}
                      </span>
                    )}
                  </td>
                  <td className="max-w-56 truncate px-4 py-3 text-[14px] text-[var(--muted-foreground)]" title={t.note}>
                    {editing ? <input value={editDraft.note} onChange={(e) => setEditDraft({ ...editDraft, note: e.target.value })} aria-label="Note" className={editField} /> : t.note || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] text-[var(--foreground)]">
                    {editing ? (
                      <select value={editDraft.collector} onChange={(e) => setEditDraft({ ...editDraft, collector: e.target.value })} aria-label="Collector" className={editField}>
                        {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
                      </select>
                    ) : t.collector}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] text-[var(--foreground)]">
                    {editing ? (
                      <select value={editDraft.coCollector} onChange={(e) => setEditDraft({ ...editDraft, coCollector: e.target.value })} aria-label="Co-collector" className={editField}>
                        <option value="">Not assigned</option>
                        {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
                      </select>
                    ) : t.coCollector || "—"}
                  </td>
                  <td className={`whitespace-nowrap px-4 py-3 text-right text-[14px] font-semibold ${t.payment ? "text-emerald-500" : "text-[var(--foreground)]"}`}>
                    {t.payment ? "−" : ""}{formatMoney(t.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--foreground)]">{allocation(t.principal, t.payment)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--foreground)]">{allocation(t.interest, t.payment)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--foreground)]">{allocation(t.costs, t.payment)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--muted-foreground)]">{split(t.attorneyFees)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--muted-foreground)]">{split(t.thirdPartyFees)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-amber-500">{split(t.agency)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-brand">{split(t.client)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] font-semibold text-[var(--foreground)]">{formatMoney(runningBalance.get(t.id) ?? t.balance)}</td>
                  <td className="sticky right-0 whitespace-nowrap bg-[var(--card)] px-3 py-2 shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center justify-center gap-1">
                      {editing ? (
                        <>
                          <button type="button" onClick={saveEdit} title="Save" aria-label="Save changes" className="rounded-md p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"><Check size={15} /></button>
                          <button type="button" onClick={() => setEditingId(null)} title="Cancel" aria-label="Cancel editing" className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
                            <X size={15} />
                          </button>
                        </>
                      ) : deletingId === t.id ? (
                        <>
                          <button type="button" onClick={() => { setTransactions((current) => current.filter((row) => row.id !== t.id)); setDeletingId(null); }} className="rounded-md bg-[var(--st-danger)] px-2 py-1 text-[12px] font-semibold text-white">Delete</button>
                          <button type="button" onClick={() => setDeletingId(null)} className="rounded-md px-2 py-1 text-[12px] font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">Keep</button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => startEdit(t)} title="Edit" aria-label={`Edit transaction from ${formatUSDate(t.date)}`} className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--brand)]/10 hover:text-brand"><SquarePen size={14} /></button>
                          <button type="button" onClick={() => { setEditingId(null); setDeletingId(t.id); }} title="Delete" aria-label={`Delete transaction from ${formatUSDate(t.date)}`} className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
