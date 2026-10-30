import { useState } from "react";
import DistributionSplitCard from "@/components/billing/DistributionSplitCard";
import CoDebtorEditor, { CoDebtor } from "@/components/contacts/CoDebtorEditor";
import DocumentsSection from "@/components/documents/DocumentsSection";
import NotesSection from "@/components/notes/NotesSection";
import RemindersSection from "@/components/reminders/RemindersSection";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EditIconButton from "@/components/ui/EditIconButton";
import EditModal from "@/components/ui/EditModal";
import InfoField from "@/components/ui/InfoField";
import { AccountRightDrawer } from "@/components/ui/RightDrawer";
import TagList from "@/components/ui/TagList";
import { ACCOUNT_COLLECTORS, LICENSE_STATES, NEW_ACCOUNT_OPTIONS, PRACTICE_AREAS } from "@/constants/options";
import { ACCOUNT_DEBTOR, ACCOUNT_DETAILS, ACCOUNT_DOCUMENT_FOLDERS, ACCOUNT_NOTES, ACCOUNT_PAGE_TABS, ACCOUNT_PROFILE_DETAILS, ACCOUNT_REMINDERS, ASSIGNEE_ATTORNEY, VERIFIED_EMPLOYER } from "@/data/account";
import AccountFinancials from "@/pages/account/AccountFinancials";
import AccountLegal from "@/pages/account/AccountLegal";
import AccountSessions from "@/pages/account/AccountSessions";
import AccountSettlement from "@/pages/account/AccountSettlement";
import SkipTracingModal from "@/pages/account/SkipTracingModal";
import { ArrowLeft, Building2, Check, DollarSign, FileText, Mail, MapPin, Phone, Search } from "lucide-react";

export default function AccountPage({ onBack }: { onBack: () => void }) {
  const [account, setAccount] = useState(ACCOUNT_DETAILS);
  const [profile, setProfile] = useState(ACCOUNT_PROFILE_DETAILS);
  const [debtor, setDebtor] = useState(ACCOUNT_DEBTOR);
  const [attorney, setAttorney] = useState(ASSIGNEE_ATTORNEY);
  const [employer, setEmployer] = useState(VERIFIED_EMPLOYER);
  const [skipTraceOpen, setSkipTraceOpen] = useState(false);
  const [editing, setEditing] = useState<"header" | "debtor" | "details" | "attorney" | "employer" | null>(null);
  const prefixed = (prefix: string, data: object) => Object.fromEntries(Object.entries(data).map(([key, value]) => [`${prefix}${key}`, value]));
  const unprefixed = (prefix: string, data: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(data).filter(([key]) => key.startsWith(prefix)).map(([key, value]) => [key.slice(prefix.length), value]));
  const withExisting = (options: string[], existing: string[]) => Array.from(new Set([...options, ...existing]));
  const [drawer, setDrawer] = useState<"attorney" | "employer" | null>(null);
  const [accountTab, setAccountTab] = useState<typeof ACCOUNT_PAGE_TABS[number]["key"]>("overview");

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">
      <section className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="px-6 pt-4">
          <div className="mb-4 flex items-center gap-2 text-[14px] text-[var(--muted-foreground)]">
            <button onClick={onBack} className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
              <ArrowLeft size={13} />
              Collections
            </button>
            <span>/</span>
            <span>Manage Accounts</span>
            <span>/</span>
            <span className="font-medium text-[var(--foreground)]">{account.accountNumber}</span>
          </div>

          <div className="mb-4 flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <h2 className="text-[22px] font-semibold tracking-tight text-brand">{account.debtor}</h2>
                <div className="flex items-center gap-1.5">
                  <Badge label={account.status} variant="danger" className="text-[14px]" />
                  <Badge label={account.substatus} variant="warning" className="text-[14px]" />
                </div>
                <span className="mx-1 h-6 w-px bg-[var(--border)]" />
                <TagList tags={account.tags} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-medium text-[var(--muted-foreground)]">Co-debtors</span>
                {account.coDebtors.map((debtor) => (
                  <span
                    key={debtor.name}
                    className={`flex items-center gap-2 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/15 py-1 pr-3 text-[14px] font-medium text-[var(--foreground)] ${debtor.reported ? "pl-1" : "pl-3"}`}
                  >
                    {debtor.reported && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--st-danger)] text-[11px] font-bold text-white" title="Reported">
                        R
                      </span>
                    )}
                    {debtor.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <button type="button" onClick={() => setSkipTraceOpen(true)} className="btn btn-secondary h-8 py-0">
                <Search size={13} />
                Skip Tracing
              </button>
              <EditIconButton onClick={() => setEditing("header")} label="Edit account header" />
              {account.reported && (
                <div className="reported-pulse flex items-center gap-3 rounded-lg bg-[var(--st-danger)] px-4 py-2.5 text-white">
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
                    <Check size={14} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Reporting Status</p>
                    <p className="text-[16px] font-semibold">Reported</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-stretch gap-3 px-6 pb-4">
          <div className="grid flex-[2] grid-cols-2 items-center gap-x-6 rounded-lg border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-5 py-2.5">
            {[
              { label: "Account Number", value: account.accountNumber, color: "text-brand" },
              { label: "Account Age", value: account.age, color: "text-[var(--foreground)]" },
            ].map((detail) => (
              <div key={detail.label}>
                <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-brand">{detail.label}</p>
                <p className={`mt-0.5 whitespace-nowrap text-[17px] font-semibold ${detail.color}`}>{detail.value}</p>
              </div>
            ))}
          </div>
          <div className="grid flex-[4] grid-cols-4 items-center gap-x-6 rounded-lg border border-[var(--st-violet)]/25 bg-[var(--st-violet)]/10 px-5 py-2.5">
            {[
              { label: "Collector", value: account.collector },
              { label: "Co-Collector", value: account.coCollector || "Not assigned" },
              { label: "Attorney", value: account.attorney },
              { label: "Legal Assistant", value: account.legalAssistant },
            ].map((detail) => (
              <div key={detail.label}>
                <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-violet-500">{detail.label}</p>
                <p className="mt-0.5 whitespace-nowrap text-[17px] font-semibold text-[var(--foreground)]">{detail.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 rounded-lg border border-[var(--st-green)]/25 bg-[var(--st-green)]/10 px-4 py-2.5">
            <div className="border-r border-[var(--st-green)]/25 pr-5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-emerald-500">Total Balance</p>
              <p className="whitespace-nowrap text-[28px] font-bold leading-tight tracking-tight text-red-500">{account.totalBalance}</p>
              <button type="button" onClick={() => setAccountTab("financials")} className="btn mt-1.5 w-full bg-[var(--st-green)] py-1 text-white shadow-sm transition-[filter] hover:brightness-110">
                <DollarSign size={13} />
                Make Payment
              </button>
            </div>
            <div className="grid grid-flow-col grid-rows-2 gap-x-6 gap-y-2">
              {[
                { label: "Principal", value: profile.principalAmount },
                { label: "Interest", value: profile.interest },
                { label: "Costs / Fees", value: profile.costsFees },
                { label: "Payments", value: profile.payments },
                { label: "Settlement", value: profile.settlementAmount },
                { label: "Linked Balance", value: profile.linkedBalance },
              ].map((metric) => (
                <div key={metric.label}>
                  <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-emerald-500">{metric.label}</p>
                  <p className="mt-0.5 whitespace-nowrap text-[17px] font-semibold text-[var(--foreground)]">{metric.value}</p>
                </div>
              ))}
              <div className="row-span-2">
                <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-emerald-500">Linked Accounts</p>
                <div className="mt-1 flex flex-col gap-1">
                  {profile.linkedAccounts.map((account) => (
                    <span key={account} className="rounded bg-[var(--brand)] px-2 py-0.5 text-center text-[13px] font-semibold text-white">{account}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-bar flex items-center gap-1 overflow-x-auto border-t border-[var(--border)] px-6">
          {ACCOUNT_PAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAccountTab(tab.key)}
              className={`shrink-0 border-b-2 px-3 py-3 text-[14px] font-medium transition-colors ${
                accountTab === tab.key
                  ? "border-brand text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {accountTab === "overview" ? (
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-[1fr_1.35fr] items-start gap-4">
          <Card className="overflow-hidden">
            <div className="section-head flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-3">
              <div>
                <h3 className="text-[17px] font-semibold text-brand">Debtor Information</h3>
                <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Identity and verified contact information</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => setDrawer("attorney")}
                  className="btn btn-secondary"
                >
                  <Building2 size={12} />
                  Assignee Attorney
                </button>
                <button
                  onClick={() => setDrawer("employer")}
                  className="btn btn-secondary"
                >
                  <Check size={12} />
                  Verified Employer
                </button>
                <EditIconButton onClick={() => setEditing("debtor")} label="Edit debtor information" />
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-x-6">
                {[
                  { label: "First Name", value: debtor.firstName },
                  { label: "Middle Name", value: debtor.middleName },
                  { label: "Last Name", value: debtor.lastName },
                  { label: "SSN", value: debtor.ssn },
                  { label: "Date of Birth", value: debtor.dateOfBirth },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-2.5">
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{item.label}</p>
                    <p className="text-right text-[16px] font-medium text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider text-brand">
                  <MapPin size={12} />
                  Addresses
                </p>
                <div className="space-y-1.5">
                  {debtor.addresses.map((address, index) => (
                    <div key={address} className="flex items-start justify-between gap-3 rounded-md bg-[var(--muted)]/60 px-3 py-2">
                      <p className="text-[14px] leading-relaxed text-[var(--foreground)]">{address}</p>
                      <span className="shrink-0 text-[14px] font-medium text-[var(--muted-foreground)]">{index === 0 ? "Primary" : "Secondary"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider text-brand">
                  <Phone size={12} />
                  Phone Numbers
                </p>
                <div className="space-y-1.5">
                  {debtor.phoneNumbers.map((phone, index) => (
                    <div key={phone} className="flex items-center justify-between rounded-md bg-[var(--muted)]/60 px-3 py-2">
                      <span className="text-[14px] text-[var(--foreground)]">{phone}</span>
                      <span className="text-[14px] font-medium text-[var(--muted-foreground)]">{index === 0 ? "Direct" : "Mobile"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider text-brand">
                  <Mail size={12} />
                  Email Addresses
                </p>
                <div className="space-y-1.5">
                  {debtor.emails.map((email, index) => (
                    <div key={email} className="flex items-center justify-between gap-3 rounded-md bg-[var(--muted)]/60 px-3 py-2">
                      <span className="truncate text-[14px] text-[var(--foreground)]">{email}</span>
                      <span className="shrink-0 text-[14px] font-medium text-[var(--muted-foreground)]">{index === 0 ? "Work" : "Personal"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="section-head flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-3">
                <div>
                  <h3 className="text-[17px] font-semibold text-brand">Account Details</h3>
                  <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Placement, delinquency, and linked account information</p>
                </div>
                <EditIconButton onClick={() => setEditing("details")} label="Edit account details" />
              </div>
              <div className="grid grid-cols-2 gap-x-8 px-5">
                {[
                  { label: "Client Name", value: profile.clientName },
                  { label: "Creditor", value: profile.creditor },
                  { label: "Account Type", value: profile.accountType },
                  { label: "Originated Date", value: profile.originatedDate },
                  { label: "Last Date of Service", value: profile.lastServiceDate },
                  { label: "1st Delinquency", value: profile.firstDelinquency },
                  { label: "Charged Off Date", value: profile.chargedOffDate },
                  { label: "Next Work Date", value: profile.nextWorkDate },
                  { label: "Agreement Date", value: profile.agreementDate },
                  { label: "Statute of Limitation Date", value: profile.statuteDate },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-2.5">
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{item.label}</p>
                    <p className="text-right text-[16px] font-medium text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
            <NotesSection initialNotes={ACCOUNT_NOTES} />
          </div>
        </div>
      </div>
      ) : accountTab === "financials" ? (
        <AccountFinancials />
      ) : accountTab === "settlement" ? (
        <AccountSettlement />
      ) : accountTab === "legal" ? (
        <AccountLegal />
      ) : accountTab === "allocations" ? (
        <div className="p-5">
          <DistributionSplitCard subtitle="How each amount collected on this account is divided between the client, attorney, and agency" />
        </div>
      ) : accountTab === "sessions" ? (
        <AccountSessions />
      ) : accountTab === "reminders" ? (
        <div className="p-5">
          <RemindersSection initialReminders={ACCOUNT_REMINDERS} entityLabel="account" />
        </div>
      ) : accountTab === "documents" ? (
        <div className="p-5">
          <DocumentsSection folders={ACCOUNT_DOCUMENT_FOLDERS} />
        </div>
      ) : (
        <div className="p-6">
          <Card className="flex min-h-64 items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                <FileText size={16} />
              </div>
              <p className="text-[15px] font-semibold text-[var(--foreground)]">
                {ACCOUNT_PAGE_TABS.find((tab) => tab.key === accountTab)?.label}
              </p>
              <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                This workspace is ready for its account information.
              </p>
            </div>
          </Card>
        </div>
      )}

      <AccountRightDrawer
        open={drawer === "attorney"}
        title="Assignee Attorney"
        subtitle="Assigned firm and attorney information"
        onClose={() => setDrawer(null)}
        action={<EditIconButton onClick={() => setEditing("attorney")} label="Edit assignee attorney" />}
      >
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="section-head border-b border-[var(--border)] px-4 py-3">
              <p className="text-[14px] font-semibold text-[var(--foreground)]">Firm Information</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">
              <InfoField label="Firm Name" className="col-span-2">{attorney.firm.name}</InfoField>
              <InfoField label="Tax ID / EIN">{attorney.firm.taxId}</InfoField>
              <InfoField label="Email Address">{attorney.firm.email}</InfoField>
              <InfoField label="Phone Number">{attorney.firm.phone}</InfoField>
              <InfoField label="Fax">{attorney.firm.fax}</InfoField>
              <InfoField label="Street Address" className="col-span-2">{attorney.firm.street}</InfoField>
              <InfoField label="City">{attorney.firm.city}</InfoField>
              <InfoField label="State">{attorney.firm.state}</InfoField>
              <InfoField label="ZIP Code">{attorney.firm.zipCode}</InfoField>
              <InfoField label="Licensed In" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.firm.licensedIn.map((state) => <Badge key={state} label={state} variant="outline" />)}
                </div>
              </InfoField>
              <InfoField label="Practice Areas" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.firm.practiceAreas.map((area) => <Badge key={area} label={area} variant="info" />)}
                </div>
              </InfoField>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="section-head border-b border-[var(--border)] px-4 py-3">
              <p className="text-[14px] font-semibold text-[var(--foreground)]">Attorney Information</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">
              <InfoField label="First Name">{attorney.attorney.firstName}</InfoField>
              <InfoField label="Last Name">{attorney.attorney.lastName}</InfoField>
              <InfoField label="Phone Numbers" className="col-span-2">
                <div className="space-y-1">{attorney.attorney.phoneNumbers.map((phone) => <p key={phone}>{phone}</p>)}</div>
              </InfoField>
              <InfoField label="Email Addresses" className="col-span-2">
                <div className="space-y-1">{attorney.attorney.emails.map((email) => <p key={email}>{email}</p>)}</div>
              </InfoField>
              <InfoField label="Address" className="col-span-2">{attorney.attorney.address}</InfoField>
              <InfoField label="City">{attorney.attorney.city}</InfoField>
              <InfoField label="State">{attorney.attorney.state}</InfoField>
              <InfoField label="ZIP Code">{attorney.attorney.zipCode}</InfoField>
              <InfoField label="Bar Number">{attorney.attorney.barNumber}</InfoField>
              <InfoField label="Licensed In" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.attorney.licensedIn.map((state) => <Badge key={state} label={state} variant="outline" />)}
                </div>
              </InfoField>
              <InfoField label="Practice Areas" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.attorney.practiceAreas.map((area) => <Badge key={area} label={area} variant="info" />)}
                </div>
              </InfoField>
            </div>
          </Card>
        </div>
      </AccountRightDrawer>

      <AccountRightDrawer
        open={drawer === "employer"}
        title="Verified Employer"
        subtitle="Verified employment and contact information"
        onClose={() => setDrawer(null)}
        action={<EditIconButton onClick={() => setEditing("employer")} label="Edit verified employer" />}
      >
        <Card className="overflow-hidden">
          <div className="section-head border-b border-[var(--border)] px-4 py-3">
            <p className="text-[14px] font-semibold text-[var(--foreground)]">Employer Information</p>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">
            <InfoField label="Company Name" className="col-span-2">{employer.companyName}</InfoField>
            <InfoField label="Title" className="col-span-2">{employer.title}</InfoField>
            <InfoField label="Contact First Name">{employer.contactFirstName}</InfoField>
            <InfoField label="Contact Last Name">{employer.contactLastName}</InfoField>
            <InfoField label="Email Addresses" className="col-span-2">
              <div className="space-y-1">{employer.emails.map((email) => <p key={email}>{email}</p>)}</div>
            </InfoField>
            <InfoField label="Phone Numbers" className="col-span-2">
              <div className="space-y-1">{employer.phoneNumbers.map((phone) => <p key={phone}>{phone}</p>)}</div>
            </InfoField>
          </div>
        </Card>
      </AccountRightDrawer>
      <EditModal
        open={editing === "header"}
        title="Edit Account Header"
        subtitle="Identity, status, co-debtors, and assignment"
        fields={[
          { key: "debtor", label: "Account Name", span: 2 },
          { key: "accountNumber", label: "Account Number" },
          { key: "status", label: "Status", type: "select", options: withExisting(["Active", "Overdue", "In Dispute", "Promise", "Legal Review", "Resolved"], [account.status]) },
          { key: "substatus", label: "Sub-status", type: "select", options: withExisting(["Legal Review", "Payment Plan", "Skip Tracing", "Under Review", "On Hold"], [account.substatus]) },
          { key: "age", label: "Account Age" },
          { key: "collector", label: "Collector", type: "select", options: withExisting(ACCOUNT_COLLECTORS, [account.collector]) },
          { key: "coCollector", label: "Co-Collector", type: "select", options: ["", ...withExisting(ACCOUNT_COLLECTORS, [account.coCollector].filter(Boolean))] },
          { key: "attorney", label: "Attorney", type: "select", options: withExisting(NEW_ACCOUNT_OPTIONS.attorneys, [account.attorney]) },
          { key: "legalAssistant", label: "Legal Assistant" },
          { key: "reported", label: "Reported to credit bureaus", type: "toggle", span: 2 },
          { key: "coDebtors", label: "Co-debtors", type: "custom", span: 3, render: (value, onChange) => <CoDebtorEditor value={value as CoDebtor[]} onChange={onChange} /> },
        ]}
        values={account}
        onSave={(next) => setAccount((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "debtor"}
        title="Edit Debtor Information"
        fields={[
          { key: "firstName", label: "First Name" },
          { key: "middleName", label: "Middle Name" },
          { key: "lastName", label: "Last Name" },
          { key: "ssn", label: "SSN", placeholder: "XXX-XX-XXXX" },
          { key: "dateOfBirth", label: "Date of Birth", type: "date" },
          { key: "addresses", label: "Addresses", type: "list", span: 3, placeholder: "Street, City, State ZIP" },
          { key: "phoneNumbers", label: "Phone Numbers", type: "list", placeholder: "+1 (212) 555-0000" },
          { key: "emails", label: "Email Addresses", type: "list", span: 2, placeholder: "name@example.com" },
        ]}
        values={debtor}
        onSave={(next) => setDebtor((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "details"}
        title="Edit Account Details"
        fields={[
          { key: "clientName", label: "Client Name" },
          { key: "creditor", label: "Creditor" },
          { key: "accountType", label: "Account Type", type: "select", options: ["Commercial", "Consumer"] },
          { key: "originatedDate", label: "Originated Date", type: "date" },
          { key: "lastServiceDate", label: "Last Date of Service", type: "date" },
          { key: "firstDelinquency", label: "1st Delinquency", type: "date" },
          { key: "chargedOffDate", label: "Charged Off Date", type: "date" },
          { key: "nextWorkDate", label: "Next Work Date", type: "date" },
          { key: "agreementDate", label: "Agreement Date", type: "date" },
          { key: "statuteDate", label: "Statute of Limitation Date", type: "date" },
        ]}
        values={profile}
        onSave={(next) => setProfile((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "attorney"}
        title="Edit Assignee Attorney"
        fields={[
          { key: "firm_name", label: "Firm Name", span: 2, section: "Firm Information" },
          { key: "firm_taxId", label: "Tax ID / EIN", section: "Firm Information" },
          { key: "firm_email", label: "Email Address", type: "email", section: "Firm Information" },
          { key: "firm_phone", label: "Phone Number", type: "tel", section: "Firm Information" },
          { key: "firm_fax", label: "Fax", type: "tel", section: "Firm Information" },
          { key: "firm_street", label: "Street Address", span: 3, section: "Firm Information" },
          { key: "firm_city", label: "City", section: "Firm Information" },
          { key: "firm_state", label: "State", section: "Firm Information" },
          { key: "firm_zipCode", label: "ZIP Code", section: "Firm Information" },
          { key: "firm_licensedIn", label: "Licensed In", type: "multi", options: withExisting(LICENSE_STATES, attorney.firm.licensedIn), section: "Firm Information" },
          { key: "firm_practiceAreas", label: "Practice Areas", type: "multi", span: 2, options: withExisting(PRACTICE_AREAS, attorney.firm.practiceAreas), section: "Firm Information" },
          { key: "atty_firstName", label: "First Name", section: "Attorney Information" },
          { key: "atty_lastName", label: "Last Name", section: "Attorney Information" },
          { key: "atty_barNumber", label: "Bar Number", section: "Attorney Information" },
          { key: "atty_phoneNumbers", label: "Phone Numbers", type: "list", section: "Attorney Information" },
          { key: "atty_emails", label: "Email Addresses", type: "list", span: 2, section: "Attorney Information" },
          { key: "atty_address", label: "Address", span: 3, section: "Attorney Information" },
          { key: "atty_city", label: "City", section: "Attorney Information" },
          { key: "atty_state", label: "State", section: "Attorney Information" },
          { key: "atty_zipCode", label: "ZIP Code", section: "Attorney Information" },
          { key: "atty_licensedIn", label: "Licensed In", type: "multi", options: withExisting(LICENSE_STATES, attorney.attorney.licensedIn), section: "Attorney Information" },
          { key: "atty_practiceAreas", label: "Practice Areas", type: "multi", span: 2, options: withExisting(PRACTICE_AREAS, attorney.attorney.practiceAreas), section: "Attorney Information" },
        ]}
        values={{ ...prefixed("firm_", attorney.firm), ...prefixed("atty_", attorney.attorney) }}
        onSave={(next) => setAttorney((current) => ({
          firm: { ...current.firm, ...unprefixed("firm_", next) },
          attorney: { ...current.attorney, ...unprefixed("atty_", next) },
        }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "employer"}
        title="Edit Verified Employer"
        fields={[
          { key: "companyName", label: "Company Name", span: 2 },
          { key: "title", label: "Debtor's Title" },
          { key: "contactFirstName", label: "Contact First Name" },
          { key: "contactLastName", label: "Contact Last Name" },
          { key: "emails", label: "Email Addresses", type: "list", span: 3 },
          { key: "phoneNumbers", label: "Phone Numbers", type: "list", span: 3 },
        ]}
        values={employer}
        onSave={(next) => setEmployer((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <SkipTracingModal open={skipTraceOpen} onClose={() => setSkipTraceOpen(false)} debtorName={account.debtor} />
    </main>
  );
}
