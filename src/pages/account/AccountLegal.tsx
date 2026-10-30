import { useState } from "react";
import Card from "@/components/ui/Card";
import DateInput from "@/components/ui/DateInput";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export type LegalField = { key: string; label: string; type: "date" | "text" | "money" | "select"; options?: string[] };

export const LEGAL_COURTS = [
  "NY Supreme Court — New York County",
  "NY Supreme Court — Kings County",
  "NYC Civil Court — Manhattan",
  "US District Court — S.D.N.Y.",
];

export const PROCESS_SERVERS = ["Metro Process Service", "Empire Legal Services", "Liberty Process Servers"];

export const COMPLAINT_FIELDS: LegalField[] = [
  { key: "county", label: "County", type: "text" },
  { key: "caseNumber", label: "Court Case #", type: "text" },
  { key: "court", label: "Court", type: "select", options: LEGAL_COURTS },
  { key: "complaintSent", label: "Complaint Sent Date", type: "date" },
  { key: "complaintFiled", label: "Complaint Filed Date", type: "date" },
  { key: "courtNumber", label: "Court Number", type: "text" },
  { key: "sentForService", label: "Sent for Service Date", type: "date" },
  { key: "processServer", label: "Process Server", type: "select", options: PROCESS_SERVERS },
  { key: "complaintServed", label: "Complaint Served Date", type: "date" },
  { key: "answerFiled", label: "Answer Filed Date", type: "date" },
];

export const JUDGMENT_FIELDS: LegalField[] = [
  { key: "judgmentSent", label: "Judgment Sent Date", type: "date" },
  { key: "judgmentEntered", label: "Judgment Entered Date", type: "date" },
  { key: "abstractRecorded", label: "Abstract Recorded Date", type: "date" },
  { key: "satisfactionSent", label: "Satisfaction of Judgment Sent", type: "date" },
  { key: "feesSought", label: "Attorney Fees Sought", type: "money" },
  { key: "feesAwarded", label: "Attorney Fees Awarded", type: "money" },
  { key: "judgeName", label: "Name of Judge", type: "text" },
  { key: "countyAbstracted", label: "County Abstracted", type: "text" },
  { key: "courtAbstracted", label: "Court Abstracted", type: "select", options: LEGAL_COURTS },
  { key: "judgmentExpiration", label: "Judgment Expiration Date", type: "date" },
  { key: "judgmentReminder", label: "Judgment Reminder Date", type: "date" },
];

export const GARNISHMENT_FIELDS: LegalField[] = [
  { key: "writSent", label: "Writ Sent for Filing", type: "date" },
  { key: "writReturned", label: "Writ Returned Date", type: "date" },
  { key: "wagesSent", label: "Garnish Wages Sent", type: "date" },
  { key: "wagesReceived", label: "Garnish Wages Received", type: "date" },
  { key: "bankSent", label: "Bank Garnish Sent", type: "date" },
  { key: "bankReceived", label: "Bank Garnish Received", type: "date" },
  { key: "unsatisfiedReturn", label: "Unsatisfied Return Rec'd", type: "date" },
  { key: "garnishRecheck", label: "Garnish Recheck Date", type: "date" },
  { key: "countyExecuted", label: "County Executed", type: "text" },
  { key: "courtExecuted", label: "Court Executed", type: "select", options: LEGAL_COURTS },
];

export const LEGAL_INITIAL: Record<string, string> = {
  county: "New York",
  caseNumber: "651234/2026",
  court: "NY Supreme Court — New York County",
  courtNumber: "Part 54",
  complaintSent: "2026-02-03",
  complaintFiled: "2026-02-10",
  sentForService: "2026-06-20",
  processServer: "Metro Process Service",
  complaintServed: "2026-07-12",
};

export default function AccountLegal() {
  const [values, setValues] = useState<Record<string, string>>(LEGAL_INITIAL);
  const [hasJudgment, setHasJudgment] = useState(false);

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10";
  const labelClass = "mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-brand";

  const renderFields = (fields: LegalField[]) => (
    <div className="grid grid-cols-4 gap-4 p-5">
      {fields.map((field) => {
        const value = values[field.key] ?? "";
        const update = (next: string) => setValues((current) => ({ ...current, [field.key]: next }));
        return (
          <label key={field.key}>
            <span className={labelClass}>{field.label}</span>
            {field.type === "select" ? (
              <select value={value} onChange={(e) => update(e.target.value)} className={fieldClass}>
                <option value="">Select…</option>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.type === "money" ? (
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--muted-foreground)]">$</span>
                <input type="number" min="0" step="0.01" placeholder="0.00" value={value} onChange={(e) => update(e.target.value)} className={`${fieldClass} pl-7`} />
              </div>
            ) : (
              field.type === "date"
                ? <DateInput value={value} onChange={update} className={fieldClass} />
                : <input type={field.type} value={value} onChange={(e) => update(e.target.value)} className={fieldClass} />
            )}
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 p-5">
      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Complaint Information</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Court filing, service, and answer details for this account</p>
        </div>
        {renderFields(COMPLAINT_FIELDS)}
      </Card>

      <Card className="overflow-hidden">
        <div className={`section-head flex items-center gap-3 px-5 py-3 ${hasJudgment ? "border-b border-[var(--border)]" : ""}`}>
          <h3 className="text-[17px] font-semibold text-brand">Judgment Information</h3>
          <ToggleSwitch checked={hasJudgment} onChange={setHasJudgment} label="Judgment information" hideLabel />
        </div>
        {hasJudgment && renderFields(JUDGMENT_FIELDS)}
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Garnishment Information</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Writ, wage, and bank garnishment activity</p>
        </div>
        {renderFields(GARNISHMENT_FIELDS)}
      </Card>
    </div>
  );
}
