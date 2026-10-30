export const CLIENT = {
  name: "Westfield Group",
  industry: "Commercial Real Estate",
  businessType: "Real Estate Company",
  status: "Active",
  substatus: "Under Review",
  opener: "Nina Alvarez",
  closer: "Daniel Reeves",
  since: "Mar 2023",
  website: "westfieldgroup.com",
  // Corporate address
  address: "350 Park Avenue, Suite 2400",
  city: "New York",
  state: "NY",
  zipCode: "10022",
  country: "United States",
  phone: "+1 (212) 555-0147",
  email: "finance@westfieldgroup.com",
  // KPIs
  outstanding: "$231,500",
  totalDebt: "$874,200",
  collectionRate: "62%",
  openAccounts: 3,
  tags: ["High Value", "Corporate", "Disputed"],
};

export const CLIENT_ACCOUNTS = [
  { id: "DBT-4820", name: "Q4 Invoice Dispute", desc: "Q4 Invoice Dispute", amount: "$231,500", totalCollected: "$0", currentBalance: "$231,500", due: "2026-09-03", status: "In Dispute", agent: "Daniel Reeves" },
  { id: "DBT-4791", name: "Lease Arrears — Tower B", desc: "Lease Arrears — Tower B", amount: "$412,700", totalCollected: "$100,000", currentBalance: "$312,700", due: "2026-07-15", status: "Overdue", agent: "Sarah Okafor" },
  { id: "DBT-4762", name: "Service Fee Balance", desc: "Service Fee Balance", amount: "$230,000", totalCollected: "$230,000", currentBalance: "$0", due: "2026-06-01", status: "Resolved", agent: "Daniel Reeves" },
  { id: "DBT-4738", name: "Maintenance Recovery", desc: "Maintenance Recovery", amount: "$87,400", totalCollected: "$87,400", currentBalance: "$0", due: "2026-04-20", status: "Resolved", agent: "Nina Alvarez" },
];

export const CLIENT_ACCOUNT_SUMMARY = [
  { label: "Total Accounts", value: "4", color: "text-[var(--foreground)]" },
  { label: "Total Accounts Collected", value: "2", color: "text-emerald-500" },
  { label: "Opened Accounts", value: "2", color: "text-brand" },
  { label: "Closed Accounts", value: "2", color: "text-[var(--foreground)]" },
  { label: "Legal Accounts", value: "1", color: "text-amber-500" },
  { label: "Total Face Value", value: "$961,600", color: "text-[var(--foreground)]" },
  { label: "Total Amount Collected", value: "$317,400", color: "text-emerald-500" },
  { label: "Client Portion", value: "$238,050", color: "text-brand" },
  { label: "Agency Portion", value: "$79,350", color: "text-violet-500" },
  { label: "Client Owes", value: "$28,450", color: "text-red-500" },
  { label: "Agency Owes", value: "$12,760", color: "text-amber-500" },
  { label: "Last Assignment Date", value: "Sep 2, 2026", color: "text-[var(--foreground)]" },
];

export const ACCOUNT_BILLING = [
  { accountNumber: "DBT-4820", status: "Due", idCheckNumber: "CHK-88421", description: "Collection commission", attorneyFees: "$1,250", agencyFees: "$4,600", clientFees: "$1,900", convenienceFees: "$700", attorneyOwes: "$0", agencyOwes: "$1,200", clientOwes: "$7,250" },
  { accountNumber: "DBT-4791", status: "Paid", idCheckNumber: "ACH-29018", description: "Payment processing fee", attorneyFees: "$800", agencyFees: "$2,100", clientFees: "$0", convenienceFees: "$300", attorneyOwes: "$450", agencyOwes: "$0", clientOwes: "$0" },
  { accountNumber: "DBT-4762", status: "Paid", idCheckNumber: "CHK-87904", description: "Recovery commission", attorneyFees: "$2,500", agencyFees: "$6,900", clientFees: "$1,500", convenienceFees: "$600", attorneyOwes: "$0", agencyOwes: "$850", clientOwes: "$0" },
  { accountNumber: "DBT-4738", status: "Due", idCheckNumber: "ACH-28776", description: "Final account fee", attorneyFees: "$650", agencyFees: "$2,420", clientFees: "$1,000", convenienceFees: "$300", attorneyOwes: "$250", agencyOwes: "$710", clientOwes: "$3,410" },
];

export const ACCOUNT_BILLING_TOTALS = [
  { label: "Total Attorney", value: "$5,200", color: "text-[var(--foreground)]" },
  { label: "Total Agency", value: "$16,020", color: "text-amber-500" },
  { label: "Total Client", value: "$4,400", color: "text-red-500" },
  { label: "Total", value: "$27,520", color: "text-brand" },
];

export const LEGAL_BILLING = [
  { accountNumber: "DBT-4820", fullNameCompany: "Westfield Group", status: "Active", currentBalanceDue: "$231,500", statuteOfLimitation: "Sep 3, 2029", clientSent: "$12,000", agencySpent: "$4,800", totalPending: "$16,800", trustBalance: "$8,250" },
  { accountNumber: "DBT-4791", fullNameCompany: "Westfield Tower B LLC", status: "In Review", currentBalanceDue: "$312,700", statuteOfLimitation: "Jul 15, 2029", clientSent: "$9,500", agencySpent: "$3,650", totalPending: "$13,150", trustBalance: "$5,900" },
  { accountNumber: "DBT-4762", fullNameCompany: "Westfield Services Inc.", status: "Settled", currentBalanceDue: "$0", statuteOfLimitation: "Jun 1, 2029", clientSent: "$6,000", agencySpent: "$1,950", totalPending: "$0", trustBalance: "$2,400" },
];

export const LEGAL_BILLING_TOTALS = [
  { label: "Agency Spent", value: "$10,400", color: "text-[var(--foreground)]" },
  { label: "Client Spent", value: "$27,500", color: "text-[var(--foreground)]" },
  { label: "Pending", value: "$29,950", color: "text-amber-500" },
  { label: "Client Trust Balance", value: "$16,550", color: "text-emerald-500" },
];

export const CLIENT_CONTACTS = [
  {
    firstName: "Gregory", lastName: "Westfield",
    title: "CEO & Founder", primary: true, personalGuarantor: true,
    emails: [
      { label: "Work", value: "g.westfield@westfieldgroup.com" },
      { label: "Personal", value: "greg.westfield@gmail.com" },
    ],
    phones: [
      { label: "Direct", value: "+1 (212) 555-0101" },
      { label: "Mobile", value: "+1 (646) 555-0198" },
    ],
  },
  {
    firstName: "Sandra", lastName: "Lim",
    title: "CFO", primary: true, personalGuarantor: false,
    emails: [
      { label: "Work", value: "s.lim@westfieldgroup.com" },
    ],
    phones: [
      { label: "Direct", value: "+1 (212) 555-0182" },
      { label: "Mobile", value: "+1 (917) 555-0134" },
    ],
  },
  {
    firstName: "Marcus", lastName: "Reid",
    title: "Legal Counsel", primary: false, personalGuarantor: false,
    emails: [
      { label: "Work", value: "m.reid@westfieldgroup.com" },
      { label: "Legal", value: "mreid@reidlawgroup.com" },
    ],
    phones: [
      { label: "Office", value: "+1 (212) 555-0165" },
    ],
  },
  {
    firstName: "Tanya", lastName: "Brooks",
    title: "Accounts Payable", primary: false, personalGuarantor: true,
    emails: [
      { label: "Work", value: "t.brooks@westfieldgroup.com" },
    ],
    phones: [
      { label: "Direct", value: "+1 (212) 555-0193" },
      { label: "Mobile", value: "+1 (929) 555-0177" },
    ],
  },
];

export const CLIENT_DOCUMENT_FOLDERS = [
  {
    name: "Contracts & Agreements",
    files: [
      { name: "Master Service Agreement.pdf", size: "842 KB", date: "Mar 14, 2023", type: "Contract" },
      { name: "Debt Placement Agreement.pdf", size: "516 KB", date: "Mar 18, 2023", type: "Agreement" },
      { name: "Fee Schedule 2026.pdf", size: "94 KB", date: "Jan 2, 2026", type: "Schedule" },
    ],
  },
  {
    name: "Invoices & Statements",
    files: [
      { name: "Invoice_Q4_2025.pdf", size: "124 KB", date: "Jan 8, 2026", type: "Invoice" },
      { name: "Account_Statement_Aug2026.pdf", size: "188 KB", date: "Aug 26, 2026", type: "Statement" },
      { name: "Payment_History_2026.xlsx", size: "72 KB", date: "Aug 26, 2026", type: "Spreadsheet" },
    ],
  },
  {
    name: "Legal & Correspondence",
    files: [
      { name: "Dispute_Letter_Feb2026.pdf", size: "67 KB", date: "Feb 22, 2026", type: "Correspondence" },
      { name: "Payment_Plan_Draft.docx", size: "38 KB", date: "Aug 5, 2026", type: "Draft" },
      { name: "Counsel_Response_Aug2026.pdf", size: "213 KB", date: "Aug 19, 2026", type: "Legal" },
    ],
  },
];

export const CLIENT_NOTES = [
  { id: 1, author: "Daniel Reeves", time: "Aug 28, 2026 · 10:14", text: "Spoke with Gregory Westfield. He acknowledged the Q4 invoice dispute and requested a revised payment schedule by Sep 10. Follow-up call booked.", source: "User note", important: true },
  { id: 2, author: "Sarah Okafor", time: "Aug 19, 2026 · 14:32", text: "Sent formal notice of arrears for Tower B lease. No response within 5 business days — escalating to legal.", source: "Automated", important: false },
  { id: 3, author: "Daniel Reeves", time: "Jul 30, 2026 · 09:55", text: "Reviewed account with legal team. Westfield's counsel claims $78K of the Q4 balance is double-billed. Documentation requested.", source: "User note", important: true },
  { id: 4, author: "Nina Alvarez", time: "Jul 3, 2026 · 11:00", text: "Maintenance Recovery account closed. $87,400 received in full. Client relationship in good standing for this account.", source: "Automated", important: false },
];

export const CLIENT_REMINDERS = [
  { id: 1, description: "Follow up on revised payment schedule", priority: "High", repetition: "Weekly", dueDate: "Sep 10, 2026", endDate: "Oct 8, 2026", note: "Call Gregory directly if no response is received by noon." },
  { id: 2, description: "Review Tower B arrears documentation", priority: "Critical", repetition: "Once", dueDate: "Sep 3, 2026", endDate: "Sep 3, 2026", note: "Confirm all lease statements are attached before legal review." },
  { id: 3, description: "Send monthly account statement", priority: "Medium", repetition: "Monthly", dueDate: "Sep 30, 2026", endDate: "Dec 31, 2026", note: "Include collected totals and all outstanding agency fees." },
  { id: 4, description: "Check promise-to-pay status", priority: "Low", repetition: "Every 2 weeks", dueDate: "Sep 14, 2026", endDate: "Nov 30, 2026", note: "Close reminder when the final installment clears." },
];

export const CLIENT_AGREEMENT = {
  version: "v3.2",
  title: "Debt Collection Services Agreement",
  effective: "Jan 2, 2026",
  signedOn: "Dec 18, 2025",
  agency: { name: "Northstar Recovery LLC", signer: "Marcus Klein", role: "Managing Director" },
  client: { name: "Westfield Group", signer: "Gregory Westfield", role: "CEO & Founder" },
  terms: [
    { label: "Contingency Fee", value: "25% of amounts collected" },
    { label: "Legal Contingency", value: "33% on accounts placed with counsel" },
    { label: "Remittance", value: "Monthly, by the 15th" },
    { label: "Term", value: "24 months, auto-renewing" },
  ],
  sections: [
    { heading: "1. Placement of Accounts", text: "Client may place delinquent commercial and consumer accounts with Agency for collection. Each placement is governed by this Agreement from the date of assignment until the account is resolved or recalled." },
    { heading: "2. Compensation", text: "Agency shall retain the contingency fee stated above from all amounts recovered, whether paid to Agency or directly to Client. No fee is owed on accounts with no recovery." },
    { heading: "3. Legal Action", text: "Agency may refer accounts to licensed counsel only with Client's written approval. Court costs advanced by Agency are reimbursed from the first recoveries on the account." },
    { heading: "4. Remittance and Reporting", text: "Agency shall remit Client's portion of collections monthly, together with a statement listing payments, fees, and current balances for every placed account." },
    { heading: "5. Compliance", text: "Agency shall comply with the FDCPA, the FCRA, and all applicable state collection laws, and shall maintain all licenses and bonds required to perform the services." },
    { heading: "6. Termination", text: "Either party may terminate this Agreement with 60 days' written notice. Fees remain due on payments received for 90 days after termination on accounts already placed." },
  ],
};

export const LEGAL_TRANSACTIONS: Record<string, Array<{ date: string; description: string; reference: string; note: string; collector: string; amount: number; agency: number; client: number; clientSent: number; agencySpent: number; convenience: number }>> = {
  "DBT-4820": [
    { date: "2026-03-02", description: "Filing Fee", reference: "CHK-88102", note: "Complaint filing — NY Supreme Court", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 4500, agencySpent: 1800, convenience: 0 },
    { date: "2026-04-18", description: "Service of Process", reference: "ACH-27731", note: "Metro Process Service", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 3000, agencySpent: 1200, convenience: 0 },
    { date: "2026-06-05", description: "Payment", reference: "CHK-88317", note: "Good-faith payment from debtor", collector: "Daniel Reeves", amount: 6000, agency: 1980, client: 4020, clientSent: 0, agencySpent: 0, convenience: 120 },
    { date: "2026-07-22", description: "Deposition Costs", reference: "CHK-88421", note: "Court reporter and transcript", collector: "Sarah Okafor", amount: 0, agency: 0, client: 0, clientSent: 4500, agencySpent: 1800, convenience: 0 },
  ],
  "DBT-4791": [
    { date: "2026-02-10", description: "Filing Fee", reference: "CHK-87990", note: "Filing fee — NY Supreme Court", collector: "Sarah Okafor", amount: 0, agency: 0, client: 0, clientSent: 3200, agencySpent: 1100, convenience: 0 },
    { date: "2026-03-05", description: "Payment", reference: "CHK-10421", note: "Partial payment", collector: "Sarah Okafor", amount: 50000, agency: 16500, client: 33500, clientSent: 0, agencySpent: 0, convenience: 250 },
    { date: "2026-07-12", description: "Service of Process", reference: "ACH-28802", note: "Affidavit of service filed", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 2250, agencySpent: 950, convenience: 0 },
    { date: "2026-08-26", description: "Payment", reference: "ACH-29018", note: "Payment plan installment", collector: "Sarah Okafor", amount: 85000, agency: 28050, client: 56950, clientSent: 0, agencySpent: 0, convenience: 425 },
    { date: "2026-09-04", description: "Motion Fee", reference: "CHK-88502", note: "Motion for summary judgment", collector: "Sarah Okafor", amount: 0, agency: 0, client: 0, clientSent: 4050, agencySpent: 1600, convenience: 0 },
  ],
  "DBT-4762": [
    { date: "2026-01-15", description: "Filing Fee", reference: "CHK-87650", note: "Civil Court filing", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 2500, agencySpent: 850, convenience: 0 },
    { date: "2026-03-20", description: "Service of Process", reference: "ACH-27104", note: "Liberty Process Servers", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 3500, agencySpent: 1100, convenience: 0 },
    { date: "2026-06-01", description: "Settlement Payment", reference: "CHK-87904", note: "Settled in full", collector: "Daniel Reeves", amount: 230000, agency: 75900, client: 154100, clientSent: 0, agencySpent: 0, convenience: 600 },
  ],
};
