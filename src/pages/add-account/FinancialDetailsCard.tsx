import Card from "@/components/ui/Card";
import DateInput from "@/components/ui/DateInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import SegmentedControl from "@/components/ui/SegmentedControl";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { DEBTORS } from "@/data/debtors";
import { formatMoney } from "@/utils/format";
import { Plus, Trash2 } from "lucide-react";

export type InterestEntry = { id: number; calc: string; type: string; rate: string; start: string; amount: string };

export type CostEntry = { id: number; amount: string; type: string; note: string };

export type PostInterestEntry = { id: number; rate: string; start: string; type: string };

export type NewAccountFinancial = {
  kind: string;
  principal: string;
  interests: InterestEntry[];
  costs: CostEntry[];
  linked: string[];
  judgmentAmount: string;
  preRate: string;
  preType: string;
  preStart: string;
  caseNumber: string;
  postEnabled: boolean;
  postInterests: PostInterestEntry[];
};

export const EMPTY_FINANCIAL: NewAccountFinancial = {
  kind: "Claim",
  principal: "",
  interests: [],
  costs: [],
  linked: [],
  judgmentAmount: "",
  preRate: "",
  preType: "Simple",
  preStart: "",
  caseNumber: "",
  postEnabled: false,
  postInterests: [{ id: 1, rate: "", start: "", type: "Simple" }],
};

export const COST_TYPES = ["Court Costs", "Filing Fee", "Service of Process", "Attorney Fee", "Skip Trace", "Other"];

export const INTEREST_TYPES = ["Simple", "Compounding"];

export default function FinancialDetailsCard({ value, onChange }: { value: NewAccountFinancial; onChange: (value: NewAccountFinancial) => void }) {
  const update = (changes: Partial<NewAccountFinancial>) => onChange({ ...value, ...changes });
  const num = (input: string) => Number(input) || 0;
  const totalInterest = value.interests.reduce((total, item) => total + num(item.amount), 0);
  const totalCosts = value.costs.reduce((total, item) => total + num(item.amount), 0);
  const totalBalance = num(value.principal) + totalInterest + totalCosts;

  const updateInterest = (id: number, changes: Partial<InterestEntry>) =>
    update({ interests: value.interests.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  const updateCost = (id: number, changes: Partial<CostEntry>) =>
    update({ costs: value.costs.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  const updatePost = (id: number, changes: Partial<PostInterestEntry>) =>
    update({ postInterests: value.postInterests.map((item) => (item.id === id ? { ...item, ...changes } : item)) });

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";
  const subheadClass = "text-[13px] font-semibold uppercase tracking-wider text-brand";

  const money = (label: string, input: string, onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">$</span>
        <input type="number" min="0" step="0.01" placeholder="0.00" value={input} onChange={(e) => onInput(e.target.value)} className={`${fieldClass} pl-7`} />
      </div>
    </label>
  );

  const percent = (label: string, input: string, onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <input type="number" min="0" step="0.01" placeholder="0.00" value={input} onChange={(e) => onInput(e.target.value)} className={`${fieldClass} pr-8`} />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">%</span>
      </div>
    </label>
  );

  const dateField = (label: string, input: string, onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <DateInput value={input} onChange={onInput} className={fieldClass} />
    </label>
  );

  const typeSelect = (label: string, input: string, options: string[], onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select value={input} onChange={(e) => onInput(e.target.value)} className={fieldClass}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );

  const entryBox = (key: number, title: string, onRemove: () => void, children: React.ReactNode) => (
    <div key={key} className="space-y-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{title}</span>
        <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-500/10">
          <Trash2 size={13} />
        </button>
      </div>
      {children}
    </div>
  );

  const addButton = (label: string, onAdd: () => void) => (
    <button type="button" onClick={onAdd} className="btn btn-secondary w-full">
      <Plus size={13} />
      {label}
    </button>
  );

  return (
    <Card className="overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">Financial Details</h3>
      </div>
      <div className="space-y-4 p-4">
        <SegmentedControl label="Account kind" options={["Claim", "Judgment"]} value={value.kind} onChange={(kind) => update({ kind })} />

        {value.kind === "Claim" ? (
          <>
            {money("Principal", value.principal, (principal) => update({ principal }))}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-[var(--muted)]/60 px-3 py-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Interest</p>
                <p className="mt-0.5 text-[17px] font-bold text-amber-500">{formatMoney(totalInterest)}</p>
              </div>
              <div className="rounded-md bg-brand/10 px-3 py-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Balance</p>
                <p className="mt-0.5 text-[17px] font-bold text-brand">{formatMoney(totalBalance)}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <p className={subheadClass}>Interest</p>
              {value.interests.map((item, index) =>
                entryBox(item.id, `Interest ${index + 1}`, () => update({ interests: value.interests.filter((row) => row.id !== item.id) }), (
                  <>
                    <SegmentedControl label="Calculation" options={["Flat", "Rate"]} value={item.calc} onChange={(calc) => updateInterest(item.id, { calc })} />
                    {item.calc === "Rate" && (
                      <>
                        {typeSelect("Interest Type", item.type, INTEREST_TYPES, (type) => updateInterest(item.id, { type }))}
                        {percent("Rate", item.rate, (rate) => updateInterest(item.id, { rate }))}
                        {dateField("Start From", item.start, (start) => updateInterest(item.id, { start }))}
                      </>
                    )}
                    {money("Amount", item.amount, (amount) => updateInterest(item.id, { amount }))}
                  </>
                ))
              )}
              {addButton("Add Interest", () =>
                update({ interests: [...value.interests, { id: Date.now(), calc: "Flat", type: "Simple", rate: "", start: "", amount: "" }] })
              )}
            </div>

            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <p className={subheadClass}>Costs / Fees</p>
              {value.costs.map((item, index) =>
                entryBox(item.id, `Cost ${index + 1}`, () => update({ costs: value.costs.filter((row) => row.id !== item.id) }), (
                  <>
                    {money("Amount", item.amount, (amount) => updateCost(item.id, { amount }))}
                    {typeSelect("Type", item.type, COST_TYPES, (type) => updateCost(item.id, { type }))}
                    <label className="block">
                      <span className={labelClass}>Note</span>
                      <input value={item.note} onChange={(e) => updateCost(item.id, { note: e.target.value })} placeholder="Add a note" className={fieldClass} />
                    </label>
                  </>
                ))
              )}
              {addButton("Add Cost / Fee", () =>
                update({ costs: [...value.costs, { id: Date.now(), amount: "", type: COST_TYPES[0], note: "" }] })
              )}
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <span className={labelClass}>Linked Accounts</span>
              <MultiSelectDropdown
                label="Select accounts"
                options={DEBTORS.map((debtor) => ({ value: debtor.id, label: `${debtor.id} · ${debtor.name}` }))}
                selected={value.linked}
                onChange={(linked) => update({ linked })}
              />
              {value.linked.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {value.linked.map((id) => (
                    <span key={id} className="rounded-md bg-brand/10 px-2 py-0.5 text-[12px] font-semibold text-brand">{id}</span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {money("Judgment Amount", value.judgmentAmount, (judgmentAmount) => update({ judgmentAmount }))}
            {percent("Pre-Judgment Rate", value.preRate, (preRate) => update({ preRate }))}
            {typeSelect("Pre-Judgment Interest", value.preType, INTEREST_TYPES, (preType) => update({ preType }))}
            {dateField("Start Date", value.preStart, (preStart) => update({ preStart }))}
            <label className="block">
              <span className={labelClass}>Court Case Number</span>
              <input value={value.caseNumber} onChange={(e) => update({ caseNumber: e.target.value })} placeholder="e.g. 651234/2026" className={fieldClass} />
            </label>

            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <ToggleSwitch checked={value.postEnabled} onChange={(postEnabled) => update({ postEnabled })} label="Apply post-judgment interest" />
              {value.postEnabled && (
                <>
                  {value.postInterests.map((item, index) => {
                    const fields = (
                      <>
                        {percent("Interest Rate", item.rate, (rate) => updatePost(item.id, { rate }))}
                        {dateField("Start Date", item.start, (start) => updatePost(item.id, { start }))}
                        {typeSelect("Interest Type", item.type, INTEREST_TYPES, (type) => updatePost(item.id, { type }))}
                      </>
                    );
                    return value.postInterests.length > 1
                      ? entryBox(item.id, `Rate ${index + 1}`, () => update({ postInterests: value.postInterests.filter((row) => row.id !== item.id) }), fields)
                      : <div key={item.id} className="space-y-3">{fields}</div>;
                  })}
                  {addButton("Add Interest Rate", () =>
                    update({ postInterests: [...value.postInterests, { id: Date.now(), rate: "", start: "", type: "Simple" }] })
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
