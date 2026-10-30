import { useState } from "react";
import ContactsEditModal from "@/components/contacts/ContactsEditModal";
import DocumentsSection from "@/components/documents/DocumentsSection";
import NotesSection from "@/components/notes/NotesSection";
import RemindersSection from "@/components/reminders/RemindersSection";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EditIconButton from "@/components/ui/EditIconButton";
import EditModal from "@/components/ui/EditModal";
import TagList from "@/components/ui/TagList";
import { STATUS_BADGE, TOTAL_TINT } from "@/constants/badges";
import { ACCOUNT_BILLING, ACCOUNT_BILLING_TOTALS, CLIENT, CLIENT_ACCOUNTS, CLIENT_ACCOUNT_SUMMARY, CLIENT_AGREEMENT, CLIENT_CONTACTS, CLIENT_DOCUMENT_FOLDERS, CLIENT_NOTES, CLIENT_REMINDERS, LEGAL_BILLING, LEGAL_BILLING_TOTALS } from "@/data/client";
import AgreementModal from "@/pages/client/AgreementModal";
import ClientConfigurations from "@/pages/client/ClientConfigurations";
import ClientKpi from "@/pages/client/ClientKpi";
import ClientPortal from "@/pages/client/ClientPortal";
import LegalBillingModal from "@/pages/client/LegalBillingModal";
import { ArrowLeft, Building2, Calendar, Check, Clock, DollarSign, Ellipsis, FileText, Globe, House, Mail, MapPin, Phone, Plus, Settings, SquarePen } from "lucide-react";

export default function ClientPage({ onBack }: { onBack: () => void }) {
  const [client, setClient] = useState(CLIENT);
  const [contacts, setContacts] = useState(CLIENT_CONTACTS);
  const [editing, setEditing] = useState<"assignment" | "corporate" | "contacts" | null>(null);
  const [legalDetail, setLegalDetail] = useState<string | null>(null);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [tab, setTab] = useState<"overview" | "accounts" | "documents" | "accounting" | "reminders" | "portal" | "configurations">("overview");
  const [accountingView, setAccountingView] = useState<"account" | "legal">("account");

  const TABS = [
    { key: "overview", label: "Overview", icon: House },
    { key: "accounts", label: "Accounts", icon: Clock },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "accounting", label: "Accounting", icon: DollarSign },
    { key: "reminders", label: "Reminders", icon: Calendar },
    { key: "portal", label: "Client Portal", icon: Globe },
    { key: "configurations", label: "Configurations", icon: Settings },
  ] as const;

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">

      {/* ── Hero strip ── */}
      <div className="border-b border-[var(--border)] bg-[var(--card)] px-6 pt-5 pb-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[14px] text-[var(--muted-foreground)]">
          <button onClick={onBack} className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">
            <ArrowLeft size={13} />
            Clients
          </button>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">{client.name}</span>
        </div>

        {/* Client identity row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-xl font-semibold text-brand">{client.name}</h2>
                <Badge label={client.status} variant="success" />
                <Badge label={client.substatus} variant="warning" />
                <button
                  type="button"
                  onClick={() => setAgreementOpen(true)}
                  className="ml-1 flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand/20"
                >
                  <FileText size={12} />
                  Agreement {CLIENT_AGREEMENT.version}
                </button>
              </div>
              <div className="flex items-center gap-4 text-[14px] text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5"><Building2 size={12} />{client.industry}</span>
                <span className="flex items-center gap-1.5"><MapPin size={12} />{client.city}, {client.state}</span>
                <span className="flex items-center gap-1.5"><Globe size={12} />{client.website}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} />Since {client.since}</span>
              </div>
              <div className="mt-2.5"><TagList tags={client.tags} /></div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="btn btn-secondary">
              <Mail size={13} />Email
            </button>
            <button className="btn btn-secondary">
              <Phone size={13} />Call
            </button>
            <button className="btn btn-primary">
              <SquarePen size={13} />Edit
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <Card className="flex rounded-none rounded-t-lg border-b-0 mb-0 overflow-hidden">
          <ClientKpi label="Outstanding Balance" value={client.outstanding} sub="across open accounts" color="text-red-500" />
          <ClientKpi label="Total Debt Value" value={client.totalDebt} sub="lifetime portfolio" color="text-[var(--foreground)]" />
          <ClientKpi label="Collection Rate" value={client.collectionRate} sub="resolved accounts" color="text-emerald-500" />
          <ClientKpi label="Open Accounts" value={String(client.openAccounts)} sub="requires attention" color="text-amber-500" />
        </Card>

        {/* Tab bar */}
        <div className="tab-bar flex items-center gap-1 mt-0 -mb-px">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[15px] font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-brand text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
              }`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="p-6">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2.7fr)] items-start gap-5">
            {/* Left sidebar */}
            <div className="space-y-4">

              {/* Assignment */}
              <Card className="overflow-hidden">
                <div className="section-head flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)]">
                  <h3 className="text-[16px] font-semibold text-brand capitalize tracking-widest">Assignment</h3>
                  <EditIconButton onClick={() => setEditing("assignment")} label="Edit assignment" />
                </div>
                <div className="px-4 py-3 space-y-3">
                  {[
                    { label: "Opener", value: client.opener },
                    { label: "Closer", value: client.closer },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-[14px] text-[var(--muted-foreground)]">{r.label}</span>
                      <span className="text-[15px] font-medium text-[var(--foreground)]">{r.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Corporate Info */}
              <Card className="overflow-hidden">
                <div className="section-head flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)]">
                  <h3 className="text-[16px] font-semibold text-brand capitalize tracking-widest">Corporate Info</h3>
                  <EditIconButton onClick={() => setEditing("corporate")} label="Edit corporate info" />
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><MapPin size={14} /></span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Address</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.address}</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.city}, {client.state} {client.zipCode}</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><Phone size={14} /></span>
                    <div>
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Phone</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><Mail size={14} /></span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Email</p>
                      <p className="text-[15px] text-[var(--foreground)] truncate">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><Globe size={14} /></span>
                    <div>
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Website</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.website}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contacts */}
              <Card className="overflow-hidden">
                <div className="section-head flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                  <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Contacts</h3>
                  <EditIconButton onClick={() => setEditing("contacts")} label="Edit contacts" />
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {contacts.map((contact) => (
                    <div key={`${contact.firstName}-${contact.lastName}`} className="px-4 py-3.5">
                      <div className="mb-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[18px] font-semibold text-[var(--foreground)]">
                            {contact.firstName} {contact.lastName}
                          </p>
                          {contact.primary && <Badge label="Primary" variant="info" className="shrink-0 text-[12px]" />}
                          {contact.personalGuarantor && (
                            <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-emerald-500">
                              <Check size={13} />
                              Personal guarantor
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[14px] font-medium uppercase tracking-wide text-brand">
                          {contact.title}
                        </p>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 shrink-0 text-[var(--muted-foreground)]">
                            <Mail size={14} />
                          </span>
                          <div className="min-w-0 flex-1 space-y-1">
                            {contact.emails.map((email) => (
                              <div key={email.value} className="flex min-w-0 items-center justify-between gap-2">
                                <span className="shrink-0 text-[13px] uppercase tracking-wide text-brand">{email.label}</span>
                                <span className="truncate text-[15px] text-[var(--foreground)]" title={email.value}>{email.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 shrink-0 text-[var(--muted-foreground)]">
                            <Phone size={14} />
                          </span>
                          <div className="min-w-0 flex-1 space-y-1">
                            {contact.phones.map((phone) => (
                              <div key={phone.value} className="flex items-center justify-between gap-2">
                                <span className="shrink-0 text-[13px] uppercase tracking-wide text-brand">{phone.label}</span>
                                <span className="text-[15px] text-[var(--foreground)]">{phone.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* Right 2 cols: recent accounts + notes */}
            <div className="space-y-4">
              {/* Recent Accounts */}
              <Card className="overflow-hidden">
                <div className="section-head px-4 py-3 border-b border-[var(--border)]">
                  <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Recent Accounts</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Account ID", "Description", "Amount", "Status", "Agent"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-[13px] font-semibold text-brand uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CLIENT_ACCOUNTS.slice(0, 3).map((c, i) => (
                      <tr key={c.id} className={`hover:bg-[var(--muted)] transition-colors cursor-pointer ${i < 2 ? "border-b border-[var(--border)]" : ""}`}>
                        <td className="px-4 py-3 text-[15px] text-brand font-semibold">{c.id}</td>
                        <td className="px-4 py-3 text-[15px] text-[var(--foreground)]">{c.desc}</td>
                        <td className="px-4 py-3 text-[15px] font-semibold text-[var(--foreground)]">{c.amount}</td>
                        <td className="px-4 py-3"><Badge label={c.status} variant={STATUS_BADGE[c.status]} className="text-[14px]" /></td>
                        <td className="px-4 py-3 text-[15px] text-[var(--muted-foreground)]">{c.agent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <NotesSection initialNotes={CLIENT_NOTES} limit={2} />
            </div>
          </div>
        )}

        {/* ── ACCOUNTS ── */}
        {tab === "accounts" && (
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3">
                <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Account Summary</h3>
              </div>
              <div className="grid grid-cols-6">
                {CLIENT_ACCOUNT_SUMMARY.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`px-4 py-3.5 ${
                      index % 6 !== 5 ? "border-r border-[var(--border)]" : ""
                    } ${index < 6 ? "border-b border-[var(--border)]" : ""}`}
                  >
                    <p className="mb-1 text-[15px] font-medium text-[var(--muted-foreground)]">{metric.label}</p>
                    <p className={`text-[20px] font-semibold tracking-tight ${metric.color}`}>{metric.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="section-head flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                <h3 className="text-[15px] font-semibold text-brand">All Accounts <span className="text-[var(--muted-foreground)] font-normal ml-1">({CLIENT_ACCOUNTS.length})</span></h3>
                <button className="btn btn-primary">
                  <Plus size={13} />New Account
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Account ID", "Name", "Status", "Total Amount", "Total Collected", "Current Balance", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-brand uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLIENT_ACCOUNTS.map((c, i) => (
                    <tr key={c.id} className={`hover:bg-[var(--muted)] transition-colors cursor-pointer ${i < CLIENT_ACCOUNTS.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                      <td className="px-4 py-3.5 text-[14px] text-brand font-semibold">{c.id}</td>
                      <td className="px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{c.name}</td>
                      <td className="px-4 py-3.5"><Badge label={c.status} variant={STATUS_BADGE[c.status]} /></td>
                      <td className="px-4 py-3.5 text-[15px] font-semibold text-[var(--foreground)]">{c.amount}</td>
                      <td className="px-4 py-3.5 text-[15px] font-semibold text-emerald-500">{c.totalCollected}</td>
                      <td className="px-4 py-3.5 text-[15px] font-semibold text-[var(--foreground)]">{c.currentBalance}</td>
                      <td className="px-4 py-3.5">
                        <button
                          className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                          aria-label={`Open actions for ${c.name}`}
                        >
                          <Ellipsis size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {tab === "documents" && (
          <DocumentsSection folders={CLIENT_DOCUMENT_FOLDERS} />
        )}

        {/* ── ACCOUNTING ── */}
        {tab === "accounting" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="px-5 py-4">
                <p className="text-[15px] font-medium text-[var(--muted-foreground)]">Client Owes</p>
                <p className="mt-2 text-[26px] font-semibold tracking-tight text-red-500">$28,450</p>
                <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">Outstanding client balance</p>
              </Card>
              <Card className="px-5 py-4">
                <p className="text-[15px] font-medium text-[var(--muted-foreground)]">Company Owes</p>
                <p className="mt-2 text-[26px] font-semibold tracking-tight text-amber-500">$12,760</p>
                <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">Pending company disbursements</p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 pt-4">
                <div className="flex gap-6">
                  {([
                    { key: "account", label: "Account Billing" },
                    { key: "legal", label: "Legal Billing" },
                  ] as const).map((billingTab) => (
                    <button
                      key={billingTab.key}
                      onClick={() => setAccountingView(billingTab.key)}
                      className={`border-b-2 pb-3 text-[15px] font-medium transition-colors ${
                        accountingView === billingTab.key
                          ? "border-brand text-[var(--foreground)]"
                          : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {billingTab.label}
                    </button>
                  ))}
                </div>
              </div>

              {accountingView === "account" ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Account Number", "Status", "ID / Check Number", "Description", "Attorney Fees", "Agency Fees", "Client Fees", "Convenience Fees", "Attorney Owes", "Agency Owes", "Client Owes"].map((heading) => (
                          <th key={heading} className="whitespace-nowrap px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-widest text-brand">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ACCOUNT_BILLING.map((bill, index) => (
                        <tr key={bill.accountNumber} className={index < ACCOUNT_BILLING.length - 1 ? "border-b border-[var(--border)]" : ""}>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-brand">{bill.accountNumber}</td>
                          <td className="px-4 py-3.5"><Badge label={bill.status} variant={bill.status === "Paid" ? "success" : "warning"} className="text-[14px]" /></td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{bill.idCheckNumber}</td>
                          <td className="min-w-48 px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.description}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.attorneyFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.agencyFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.clientFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.convenienceFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-amber-500">{bill.attorneyOwes}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-amber-500">{bill.agencyOwes}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-red-500">{bill.clientOwes}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-4 gap-3 border-t border-[var(--border)] p-4">
                    {ACCOUNT_BILLING_TOTALS.map((total) => (
                      <div key={total.label} className={`rounded-lg px-5 py-4 shadow-sm ${TOTAL_TINT[total.color] ?? "bg-[#52525b]"}`}>
                        <p className="text-[14px] font-medium text-white/85">{total.label}</p>
                        <p className="mt-1 text-[22px] font-bold tracking-tight text-white">{total.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Account Number", "Full Name / Company", "Status", "Current Balance Due", "Statute of Limitation", "Client Sent", "Agency Spent", "Total Pending", "Trust Balance"].map((heading) => (
                          <th key={heading} className="whitespace-nowrap px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-widest text-brand">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {LEGAL_BILLING.map((bill, index) => (
                        <tr
                          key={bill.accountNumber}
                          onClick={() => setLegalDetail(bill.accountNumber)}
                          className={`cursor-pointer transition-colors hover:bg-[var(--muted)] ${index < LEGAL_BILLING.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                        >
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-brand">{bill.accountNumber}</td>
                          <td className="min-w-52 px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{bill.fullNameCompany}</td>
                          <td className="px-4 py-3.5">
                            <Badge
                              label={bill.status}
                              variant={bill.status === "Active" ? "success" : bill.status === "Settled" ? "info" : "warning"}
                              className="text-[14px]"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-red-500">{bill.currentBalanceDue}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.statuteOfLimitation}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.clientSent}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.agencySpent}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-amber-500">{bill.totalPending}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-emerald-500">{bill.trustBalance}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-4 gap-3 border-t border-[var(--border)] p-4">
                    {LEGAL_BILLING_TOTALS.map((total) => (
                      <div key={total.label} className={`rounded-lg px-5 py-4 shadow-sm ${TOTAL_TINT[total.color] ?? "bg-[#52525b]"}`}>
                        <p className="text-[14px] font-medium text-white/85">{total.label}</p>
                        <p className="mt-1 text-[22px] font-bold tracking-tight text-white">{total.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── CLIENT PORTAL ── */}
        {tab === "portal" && <ClientPortal />}

        {/* ── CONFIGURATIONS ── */}
        {tab === "configurations" && <ClientConfigurations />}

        {/* ── REMINDERS ── */}
        {tab === "reminders" && (
          <RemindersSection initialReminders={CLIENT_REMINDERS} />
        )}

      </div>
      <AgreementModal open={agreementOpen} onClose={() => setAgreementOpen(false)} />
      <LegalBillingModal accountNumber={legalDetail} onClose={() => setLegalDetail(null)} />
      <EditModal
        open={editing === "assignment"}
        title="Edit Assignment"
        fields={[
          { key: "opener", label: "Opener", type: "select", options: ["Nina Alvarez", "Sarah Okafor", "James Patel", "Daniel Reeves"], span: 1 },
          { key: "closer", label: "Closer", type: "select", options: ["Daniel Reeves", "Sarah Okafor", "James Patel", "Nina Alvarez"], span: 1 },
        ]}
        values={client}
        onSave={(next) => setClient((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "corporate"}
        title="Edit Corporate Info"
        fields={[
          { key: "address", label: "Street Address", span: 3 },
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "zipCode", label: "ZIP Code" },
          { key: "country", label: "Country", type: "select", options: ["United States", "Canada", "United Kingdom", "Australia"] },
          { key: "phone", label: "Phone", type: "tel" },
          { key: "email", label: "Email", type: "email" },
          { key: "website", label: "Website", span: 3 },
        ]}
        values={client}
        onSave={(next) => setClient((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <ContactsEditModal open={editing === "contacts"} contacts={contacts} onSave={setContacts} onClose={() => setEditing(null)} />
    </main>
  );
}
