import { useState } from "react";
import DocumentsSection from "@/components/documents/DocumentsSection";
import Card from "@/components/ui/Card";
import DateInput from "@/components/ui/DateInput";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { ACCOUNT_COLLECTORS, NEW_ACCOUNT_OPTIONS } from "@/constants/options";
import DebtorStep, { EMPTY_DEBTOR, NewDebtor } from "@/pages/add-account/DebtorStep";
import FinancialDetailsCard, { EMPTY_FINANCIAL, NewAccountFinancial } from "@/pages/add-account/FinancialDetailsCard";
import { Check } from "lucide-react";

export const NEW_ACCOUNT_STEPS = [
  { key: "details", label: "Account Details", sub: "Placement, assignment, and key dates" },
  { key: "debtor", label: "Add Debtor", sub: "Identity, addresses, and contacts" },
  { key: "documents", label: "Documents", sub: "Agreements, statements, and filings" },
  { key: "allocations", label: "Allocations", sub: "Payment allocation rules" },
];

export const NEW_ACCOUNT_DOCUMENT_FOLDERS = [
  { name: "Account Agreements", files: [] },
  { name: "Statements & Payments", files: [] },
  { name: "Legal Filings", files: [] },
];

export default function AddAccountPage({ onCancel, onCreated }: { onCancel: () => void; onCreated: () => void }) {
  const [step, setStep] = useState(0);
  const [financial, setFinancial] = useState<NewAccountFinancial>(EMPTY_FINANCIAL);
  const [debtor, setDebtor] = useState<NewDebtor>(EMPTY_DEBTOR);
  const [details, setDetails] = useState({
    client: "",
    creditor: "",
    referenceNumber: "",
    agreement: "",
    status: "Active",
    queue: "New Placements",
    accountType: "Commercial",
    medical: "Non-Medical",
    collector: "",
    coCollector: "",
    referringAttorney: "",
    lastServiceDate: "",
    chargedOffDate: "",
    originatedDate: "",
    nextWorkDate: "",
    firstDelinquency: "",
    statuteDate: "",
  });
  const set = (key: keyof typeof details) => (value: string) => setDetails((current) => ({ ...current, [key]: value }));

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";
  const isLastStep = step === NEW_ACCOUNT_STEPS.length - 1;

  const select = (label: string, key: keyof typeof details, options: string[], placeholder: string, required = false) => (
    <label>
      <span className={labelClass}>{label}{required && <span className="text-red-500"> *</span>}</span>
      <select required={required} value={details[key]} onChange={(e) => set(key)(e.target.value)} className={fieldClass}>
        <option value="" disabled={required}>{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );

  const date = (label: string, key: keyof typeof details) => (
    <label>
      <span className={labelClass}>{label}</span>
      <DateInput value={details[key]} onChange={set(key)} className={fieldClass} />
    </label>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (isLastStep) onCreated();
          else setStep((current) => current + 1);
        }}
        className="space-y-5 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-brand">Add a New Account</h2>
            <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">Place a new account and assign it to a collection team.</p>
          </div>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>

        <Card className="px-5 py-4">
          <ol className="flex items-center gap-3">
            {NEW_ACCOUNT_STEPS.map((item, index) => {
              const state = index < step ? "done" : index === step ? "current" : "upcoming";
              return (
                <li key={item.key} className="flex flex-1 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(index)}
                    aria-current={state === "current" ? "step" : undefined}
                    className="group flex items-center gap-3 rounded-md text-left"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-semibold transition-colors ${
                        state === "upcoming"
                          ? "border-[var(--border)] text-[var(--muted-foreground)] group-hover:border-brand group-hover:text-brand"
                          : "border-brand bg-brand text-white"
                      }`}
                    >
                      {state === "done" ? <Check size={15} /> : index + 1}
                    </span>
                    <span>
                      <span className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Step {index + 1}</span>
                      <span className={`block text-[15px] font-semibold ${state === "upcoming" ? "text-[var(--muted-foreground)] group-hover:text-brand" : "text-brand"}`}>{item.label}</span>
                    </span>
                  </button>
                  {index < NEW_ACCOUNT_STEPS.length - 1 && (
                    <span className={`h-0.5 flex-1 rounded-full ${index < step ? "bg-brand" : "bg-[var(--border)]"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </Card>

        {NEW_ACCOUNT_STEPS[step].key === "details" && (
          <div className="grid grid-cols-[3fr_1fr] items-start gap-5">
          <div className="space-y-5">
            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
                <h3 className="text-[16px] font-semibold text-brand">Placement</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 p-5">
                {select("Client's Name", "client", NEW_ACCOUNT_OPTIONS.clients, "Select a client", true)}
                {select("Creditor", "creditor", NEW_ACCOUNT_OPTIONS.creditors, "Select a creditor", true)}
                <label>
                  <span className={labelClass}>Reference Number</span>
                  <input value={details.referenceNumber} onChange={(e) => set("referenceNumber")(e.target.value)} placeholder="e.g. EMP-2026-0418" className={fieldClass} />
                </label>
                {select("Agreement", "agreement", NEW_ACCOUNT_OPTIONS.agreements, "Select an agreement")}
                {select("Status", "status", NEW_ACCOUNT_OPTIONS.statuses, "Select a status")}
                {select("Queue", "queue", NEW_ACCOUNT_OPTIONS.queues, "Select a queue")}
                <div>
                  <span className={labelClass}>Account Type</span>
                  <SegmentedControl label="Account type" options={["Commercial", "Consumer"]} value={details.accountType} onChange={set("accountType")} />
                </div>
                <div>
                  <span className={labelClass}>Medical</span>
                  <SegmentedControl label="Medical" options={["Medical", "Non-Medical"]} value={details.medical} onChange={set("medical")} />
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
                <h3 className="text-[16px] font-semibold text-brand">Assignment</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 p-5">
                {select("Collector", "collector", ACCOUNT_COLLECTORS, "Select a collector")}
                {select("Co-Collector", "coCollector", ACCOUNT_COLLECTORS, "Not assigned")}
                {select("Referring Attorney", "referringAttorney", NEW_ACCOUNT_OPTIONS.attorneys, "Not assigned")}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
                <h3 className="text-[16px] font-semibold text-brand">Key Dates</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 p-5">
                {date("Last Date of Service", "lastServiceDate")}
                {date("Charged Off Date", "chargedOffDate")}
                {date("Originated Date", "originatedDate")}
                {date("Next Work Date", "nextWorkDate")}
                {date("1st Delinquency", "firstDelinquency")}
                {date("Statute of Limitation Date", "statuteDate")}
              </div>
            </Card>
          </div>
          <FinancialDetailsCard value={financial} onChange={setFinancial} />
          </div>
        )}

        {NEW_ACCOUNT_STEPS[step].key === "debtor" && <DebtorStep value={debtor} onChange={setDebtor} />}

        {NEW_ACCOUNT_STEPS[step].key === "documents" && <DocumentsSection folders={NEW_ACCOUNT_DOCUMENT_FOLDERS} />}

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setStep((current) => current - 1)} disabled={step === 0} className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-40">
            Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[var(--muted-foreground)]">Step {step + 1} of {NEW_ACCOUNT_STEPS.length}</span>
            <button type="submit" className="btn btn-primary">
              {isLastStep ? "Create Account" : "Next"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
