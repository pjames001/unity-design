import { useState } from "react";
import DistributionSplitCard from "@/components/billing/DistributionSplitCard";
import Card from "@/components/ui/Card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export const UNDER_THRESHOLDS = ["$500", "$1,000", "$2,500", "$5,000", "$10,000"];

export default function ClientConfigurations() {
  const [creditReporting, setCreditReporting] = useState(true);
  const [legalAuthorization, setLegalAuthorization] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    settlementAuth: "70",
    hourlyRate: "150",
    legalHourlyRate: "275",
    preLit: "33",
    postLit: "40",
    under1Year: "25",
    over1Year: "33",
    international: "40",
    bouncedChecks: "35",
    secondAssignment: "45",
    underThreshold: "$1,000",
    underRate: "40",
    legalRate: "33",
  });
  const set = (key: string) => (next: string) => setValues((current) => ({ ...current, [key]: next }));

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";

  const affix = (key: string, kind: "%" | "$", className = "") => (
    <div className={`relative ${className}`}>
      {kind === "$" && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">$</span>}
      <input
        type="number"
        min="0"
        max={kind === "%" ? 100 : undefined}
        step="0.01"
        value={values[key]}
        onChange={(event) => set(key)(event.target.value)}
        className={`${fieldClass} ${kind === "$" ? "pl-7" : "pr-8"}`}
      />
      {kind === "%" && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">%</span>}
    </div>
  );

  const field = (label: string, key: string, kind: "%" | "$", suffix?: string) => (
    <label>
      <span className={labelClass}>{label}{suffix && <span className="text-[var(--muted-foreground)]"> {suffix}</span>}</span>
      {affix(key, kind)}
    </label>
  );

  const section = (title: string, sub: string, children: React.ReactNode) => (
    <Card className="h-full overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
        <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{sub}</p>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );


  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[2fr_3fr] items-stretch gap-5">
        {section("Authorization", "What the agency may do on this client's accounts", (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex h-10 items-center">
                <ToggleSwitch checked={creditReporting} onChange={setCreditReporting} label="Credit reporting" />
              </div>
              <div className="flex h-10 items-center">
                <ToggleSwitch checked={legalAuthorization} onChange={setLegalAuthorization} label="Legal authorization" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("Settlement Authorization", "settlementAuth", "%", "of balance")}
            </div>
          </div>
        ))}
        {section("Account Cancellation", "Fees charged when the client cancels a placed account", (
          <div className="grid grid-cols-4 gap-4">
            {field("Hourly Rate", "hourlyRate", "$")}
            {field("Legal Hourly Rate", "legalHourlyRate", "$")}
            {field("Pre-Litigation", "preLit", "%")}
            {field("Post-Litigation", "postLit", "%")}
          </div>
        ))}
      </div>

      {section("Transaction Allocations", "Agency contingency rate applied to collected amounts", (
        <div className="grid grid-cols-7 gap-4">
          {field("Under 1 Year", "under1Year", "%")}
          {field("Over 1 Year", "over1Year", "%")}
          {field("International Accounts", "international", "%")}
          {field("Bounced Checks", "bouncedChecks", "%")}
          {field("Second Assignment", "secondAssignment", "%")}
          <div>
            <span className={labelClass}>Balances Under</span>
            <div className="grid grid-cols-[1fr_5.5rem] gap-2">
              <select value={values.underThreshold} onChange={(event) => set("underThreshold")(event.target.value)} aria-label="Balance threshold" className={fieldClass}>
                {UNDER_THRESHOLDS.map((amount) => <option key={amount} value={amount}>{amount}</option>)}
              </select>
              {affix("underRate", "%")}
            </div>
          </div>
          {field("Legal Rate", "legalRate", "%")}
        </div>
      ))}

      <DistributionSplitCard />

      <div className="flex justify-end">
        <button type="button" className="btn btn-primary">Save Configuration</button>
      </div>
    </div>
  );
}
