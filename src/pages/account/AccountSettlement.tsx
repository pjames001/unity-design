import { useState } from "react";
import { WEEKDAY_OPTIONS } from "@/components/reminders/reminderForm";
import Card from "@/components/ui/Card";
import DateInput from "@/components/ui/DateInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { ACCOUNT_COLLECTORS } from "@/constants/options";
import { ACCOUNT_DETAILS, ACCOUNT_PROFILE_DETAILS } from "@/data/account";
import { FileText, Plus, Trash2 } from "lucide-react";

export const PLAN_FREQUENCIES = [
  { value: "1", label: "Every" },
  { value: "2", label: "Every other" },
  { value: "3", label: "Every 3rd" },
  { value: "4", label: "Every 4th" },
];

export type Installment = { id: number; date: string; amount: string; description: string };

export default function AccountSettlement() {
  const [planner, setPlanner] = useState<"frequent" | "custom">("frequent");
  const [firstPayment, setFirstPayment] = useState("");
  const [cycle, setCycle] = useState<"weekly" | "monthly">("monthly");
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [monthDays, setMonthDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("1");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [sendReminders, setSendReminders] = useState(true);
  const [differentInitial, setDifferentInitial] = useState(false);
  const [firstPaymentAmount, setFirstPaymentAmount] = useState("");
  const [installments, setInstallments] = useState<Installment[]>([{ id: 1, date: "", amount: "", description: "" }]);
  const currentBalance = ACCOUNT_DETAILS.totalBalance.replace(/[$,]/g, "");
  const settlementBalance = ACCOUNT_PROFILE_DETAILS.settlementAmount.replace(/[$,]/g, "");
  const [primaryCollector, setPrimaryCollector] = useState(ACCOUNT_DETAILS.collector);
  const [coCollector, setCoCollector] = useState(ACCOUNT_DETAILS.coCollector);
  const [basis, setBasis] = useState<"balance" | "settlement">("balance");
  const [planAmount, setPlanAmount] = useState(currentBalance);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "", zip: "" });
  const [ach, setAch] = useState({ type: "Checking", name: "", account: "", routing: "" });
  const [checkFile, setCheckFile] = useState<{ name: string; url: string; isImage: boolean } | null>(null);

  const changeBasis = (value: "balance" | "settlement") => {
    setBasis(value);
    setPlanAmount(value === "balance" ? currentBalance : settlementBalance);
  };

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10";
  const labelClass = "mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-brand";
  const unit = cycle === "weekly" ? "week" : "month";

  const updateInstallment = (id: number, changes: Partial<Installment>) =>
    setInstallments((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const moneyInput = (value: string, onChange: (value: string) => void) => (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--muted-foreground)]">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldClass} pl-7`} />
    </div>
  );

  return (
    <div className="space-y-4 p-5">
      <Card className="overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3">
          <div>
            <h3 className="text-[17px] font-semibold text-brand">Payment Planner</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
              {planner === "frequent" ? "Schedule recurring settlement payments" : "Build a schedule of individual installments"}
            </p>
          </div>
          <select value={planner} onChange={(e) => setPlanner(e.target.value as "frequent" | "custom")} aria-label="Payment planner" className="h-9 w-32 shrink-0 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 text-[14px] font-medium text-[var(--foreground)] outline-none transition-colors focus:border-brand">
            <option value="frequent">Frequent</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {planner === "frequent" ? (
          <div className="p-5">
            <div className="grid grid-cols-4 gap-4">
              <label>
                <span className={labelClass}>First Payment</span>
                <DateInput value={firstPayment} onChange={setFirstPayment} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Repeat Cycle</span>
                <select value={cycle} onChange={(e) => setCycle(e.target.value as "weekly" | "monthly")} className={fieldClass}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
              <div className="col-span-2">
                {cycle === "weekly" ? (
                  <>
                    <span className={labelClass}>Days of the Week</span>
                    <MultiSelectDropdown
                      label="Select one or more weekdays"
                      options={WEEKDAY_OPTIONS.map((day) => ({ value: day, label: day }))}
                      selected={weekDays}
                      onChange={setWeekDays}
                    />
                  </>
                ) : (
                  <>
                    <span className={labelClass}>Days of the Month</span>
                    <MultiSelectDropdown
                      label="Select one or more days"
                      grid
                      options={Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))}
                      selected={monthDays}
                      onChange={setMonthDays}
                    />
                    <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">Missing dates in shorter months run on the month&apos;s final day.</p>
                  </>
                )}
              </div>
              <div>
                <span className={labelClass}>Frequency</span>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} aria-label="Frequency" className={fieldClass}>
                  {PLAN_FREQUENCIES.map((option) => (
                    <option key={option.value} value={option.value}>{option.label} {unit}</option>
                  ))}
                </select>
              </div>
              <label>
                <span className={labelClass}>Payment Amount</span>
                {moneyInput(paymentAmount, setPaymentAmount)}
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-[var(--border)] pt-5">
              <ToggleSwitch checked={sendReminders} onChange={setSendReminders} label="Send payment reminders" />
              <ToggleSwitch checked={differentInitial} onChange={setDifferentInitial} label="Initial payment is different amount" />
              {differentInitial && (
                <label className="w-56">
                  <span className={labelClass}>First Payment Amount</span>
                  {moneyInput(firstPaymentAmount, setFirstPaymentAmount)}
                </label>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="space-y-3">
              {installments.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[2.5rem_12rem_12rem_1fr_2.5rem] items-end gap-3">
                  <span className="flex h-10 items-center justify-center rounded-md bg-brand/10 text-[14px] font-semibold text-brand">{index + 1}</span>
                  <label>
                    <span className={labelClass}>Date</span>
                    <DateInput value={item.date} onChange={(date) => updateInstallment(item.id, { date })} className={fieldClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Amount</span>
                    {moneyInput(item.amount, (amount) => updateInstallment(item.id, { amount }))}
                  </label>
                  <label>
                    <span className={labelClass}>Description</span>
                    <input type="text" placeholder="e.g. Down payment" value={item.description} onChange={(e) => updateInstallment(item.id, { description: e.target.value })} className={fieldClass} />
                  </label>
                  {installments.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setInstallments((current) => current.filter((row) => row.id !== item.id))}
                      aria-label={`Remove installment ${index + 1}`}
                      className="flex h-10 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setInstallments((current) => [...current, { id: Date.now(), date: "", amount: "", description: "" }])}
              className="btn btn-secondary mt-4"
            >
              <Plus size={13} />
              Add Installment
            </button>
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <ToggleSwitch checked={sendReminders} onChange={setSendReminders} label="Send payment reminders" />
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Payment Details</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Assign collectors, set the plan amount, and choose how the debtor will pay</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-4 gap-4">
            <label>
              <span className={labelClass}>Primary Collector</span>
              <select value={primaryCollector} onChange={(e) => setPrimaryCollector(e.target.value)} className={fieldClass}>
                {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label>
              <span className={labelClass}>Co-Collector</span>
              <select value={coCollector} onChange={(e) => setCoCollector(e.target.value)} className={fieldClass}>
                <option value="">Not assigned</option>
                {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <div>
              <span className={labelClass}>Calculation Basis</span>
              <div className="flex h-10 items-center gap-0.5 rounded-md bg-[var(--muted)] p-0.5">
                {([["balance", "Current Balance"], ["settlement", "Settlement"]] as const).map(([value, text]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeBasis(value)}
                    aria-pressed={basis === value}
                    className={`h-full flex-1 rounded text-[14px] font-medium transition-all duration-150 ${
                      basis === value
                        ? "bg-[var(--brand)] text-white shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
            <label>
              <span className={labelClass}>Amount</span>
              {moneyInput(planAmount, setPlanAmount)}
            </label>
            <label>
              <span className={labelClass}>Payment Method</span>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  if (checkFile) URL.revokeObjectURL(checkFile.url);
                  setCheckFile(null);
                }}
                className={fieldClass}
              >
                <option value="" disabled>Select a method</option>
                <option value="card">Visa / MasterCard</option>
                <option value="ach">ACH</option>
                <option value="check">Check</option>
                <option value="wire">Wire Transfer</option>
              </select>
            </label>
          </div>

          {paymentMethod === "card" && (
            <div className="mt-5 grid grid-cols-4 gap-4 border-t border-[var(--border)] pt-5">
              <label className="col-span-2">
                <span className={labelClass}>Cardholder Name</span>
                <input type="text" autoComplete="cc-name" placeholder="Name as shown on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className={fieldClass} />
              </label>
              <label className="col-span-2">
                <span className={labelClass}>Card Number</span>
                <input type="text" inputMode="numeric" autoComplete="cc-number" maxLength={19} placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, "") })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Expiration</span>
                <input type="text" autoComplete="cc-exp" maxLength={5} placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>CVV</span>
                <input type="password" inputMode="numeric" autoComplete="cc-csc" maxLength={4} placeholder="•••" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Billing ZIP Code</span>
                <input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={10} placeholder="10022" value={card.zip} onChange={(e) => setCard({ ...card, zip: e.target.value })} className={fieldClass} />
              </label>
            </div>
          )}

          {paymentMethod === "ach" && (
            <div className="mt-5 grid grid-cols-4 gap-4 border-t border-[var(--border)] pt-5">
              <label>
                <span className={labelClass}>Account Type</span>
                <select value={ach.type} onChange={(e) => setAch({ ...ach, type: e.target.value })} className={fieldClass}>
                  <option>Checking</option>
                  <option>Savings</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Account Name</span>
                <input type="text" placeholder="Name on the account" value={ach.name} onChange={(e) => setAch({ ...ach, name: e.target.value })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Account Number</span>
                <input type="text" inputMode="numeric" maxLength={17} placeholder="000123456789" value={ach.account} onChange={(e) => setAch({ ...ach, account: e.target.value.replace(/\D/g, "") })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Routing Number</span>
                <input type="text" inputMode="numeric" maxLength={9} placeholder="021000021" value={ach.routing} onChange={(e) => setAch({ ...ach, routing: e.target.value.replace(/\D/g, "") })} className={fieldClass} />
              </label>
            </div>
          )}

          {(paymentMethod === "check" || paymentMethod === "wire") && (() => {
            const isWire = paymentMethod === "wire";
            return (
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <span className={labelClass}>{isWire ? "Wire Transfer Confirmation" : "Check Image"}</span>
              <label className="relative flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/40 p-6 text-center transition-colors hover:border-brand hover:bg-brand/5">
                <input
                  type="file"
                  accept={isWire ? "image/*,application/pdf" : "image/*"}
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (checkFile) URL.revokeObjectURL(checkFile.url);
                    setCheckFile({ name: file.name, url: URL.createObjectURL(file), isImage: file.type.startsWith("image/") });
                    e.target.value = "";
                  }}
                />
                {checkFile ? (
                  <>
                    {checkFile.isImage ? (
                      <img src={checkFile.url} alt={isWire ? "Uploaded wire confirmation" : "Uploaded check"} className="max-h-40 rounded-md border border-[var(--border)] object-contain" />
                    ) : (
                      <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <FileText size={28} />
                      </span>
                    )}
                    <p className="text-[14px] font-medium text-[var(--foreground)]">{checkFile.name}</p>
                    <p className="text-[13px] text-brand">Click to replace the file</p>
                  </>
                ) : (
                  <>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <FileText size={20} />
                    </span>
                    <p className="text-[15px] font-medium text-[var(--foreground)]">
                      {isWire ? "Click to upload the wire transfer confirmation" : "Click to upload the check image"}
                    </p>
                    <p className="text-[13px] text-[var(--muted-foreground)]">
                      {isWire ? "PDF, PNG, or JPG of the bank's wire receipt" : "PNG or JPG of the front of the check"}
                    </p>
                  </>
                )}
              </label>
            </div>
            );
          })()}
        </div>
      </Card>
    </div>
  );
}
