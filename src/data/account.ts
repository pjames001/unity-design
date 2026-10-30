export const ACCOUNT_DETAILS = {
  debtor: "Westfield Tower B LLC",
  coDebtors: [
    { name: "Gregory Westfield", reported: true },
    { name: "Sandra Lim", reported: false },
  ],
  accountNumber: "DBT-4791",
  totalBalance: "$312,700",
  reported: true,
  age: "14 months",
  status: "Overdue",
  substatus: "Legal Review",
  collector: "Sarah Okafor",
  coCollector: "Daniel Reeves",
  attorney: "Marcus Reid",
  legalAssistant: "Avery Collins",
  tags: ["High Balance", "Commercial", "Legal"],
};

export const ACCOUNT_PROFILE_DETAILS = {
  clientName: "Westfield Group",
  creditor: "Empire Commercial Holdings",
  accountType: "Commercial",
  originatedDate: "Mar 14, 2025",
  lastServiceDate: "Nov 30, 2025",
  firstDelinquency: "Jan 15, 2026",
  chargedOffDate: "Jun 30, 2026",
  nextWorkDate: "Sep 10, 2026",
  agreementDate: "Mar 14, 2025",
  statuteDate: "Jan 15, 2030",
  principalAmount: "$412,700",
  interest: "$28,450",
  costsFees: "$6,550",
  payments: "$135,000",
  settlementAmount: "$285,000",
  linkedBalance: "$89,400",
  linkedAccounts: ["DBT-4820", "DBT-4762"],
};

export const ACCOUNT_DEBTOR = {
  firstName: "Gregory",
  middleName: "Alexander",
  lastName: "Westfield",
  ssn: "***-**-4821",
  dateOfBirth: "May 18, 1974",
  addresses: [
    "350 Park Avenue, Suite 2400, New York, NY 10022",
    "18 Meadow Lane, Greenwich, CT 06830",
  ],
  phoneNumbers: ["+1 (212) 555-0101", "+1 (646) 555-0198"],
  emails: ["g.westfield@westfieldgroup.com", "greg.westfield@gmail.com"],
};

export const ASSIGNEE_ATTORNEY = {
  firm: {
    name: "Reid, Carter & Associates LLP",
    taxId: "13-4829107",
    email: "intake@reidcarterlaw.com",
    phone: "+1 (212) 555-0165",
    fax: "+1 (212) 555-0166",
    street: "110 East 42nd Street, Floor 18",
    city: "New York",
    state: "NY",
    zipCode: "10017",
    licensedIn: ["New York", "New Jersey", "Connecticut"],
    practiceAreas: ["Commercial Collections", "Consumer Collections", "Creditors’ Rights"],
  },
  attorney: {
    firstName: "Marcus",
    lastName: "Reid",
    phoneNumbers: ["+1 (212) 555-0165", "+1 (917) 555-0114"],
    emails: ["m.reid@reidcarterlaw.com", "legal@reidcarterlaw.com"],
    address: "110 East 42nd Street, Floor 18",
    city: "New York",
    state: "NY",
    zipCode: "10017",
    barNumber: "NY-4982176",
    licensedIn: ["New York", "New Jersey"],
    practiceAreas: ["Commercial Collections", "Litigation"],
  },
};

export const VERIFIED_EMPLOYER = {
  companyName: "Westfield Group",
  title: "Chief Executive Officer",
  contactFirstName: "Sandra",
  contactLastName: "Lim",
  emails: ["s.lim@westfieldgroup.com", "payroll@westfieldgroup.com"],
  phoneNumbers: ["+1 (212) 555-0182", "+1 (917) 555-0134"],
};

export const ACCOUNT_PAGE_TABS = [
  { key: "overview", label: "Overview" },
  { key: "financials", label: "Financials" },
  { key: "settlement", label: "Payment Plan" },
  { key: "documents", label: "Documents" },
  { key: "legal", label: "Legal Details" },
  { key: "allocations", label: "Transaction Allocations" },
  { key: "reminders", label: "Reminders" },
  { key: "sessions", label: "Sessions" },
] as const;

export const ACCOUNT_DOCUMENT_FOLDERS = [
  {
    name: "Account Agreements",
    files: [
      { name: "Lease Agreement — Tower B.pdf", size: "1.2 MB", date: "Mar 14, 2025", type: "Contract" },
      { name: "Personal Guarantee — G. Westfield.pdf", size: "318 KB", date: "Mar 14, 2025", type: "Agreement" },
    ],
  },
  {
    name: "Statements & Payments",
    files: [
      { name: "Arrears_Statement_Jun2026.pdf", size: "142 KB", date: "Jun 30, 2026", type: "Statement" },
      { name: "Check_CHK-10421.jpg", size: "486 KB", date: "Mar 5, 2026", type: "Payment" },
      { name: "ACH_Receipt_ACH-29018.pdf", size: "64 KB", date: "Aug 26, 2026", type: "Payment" },
    ],
  },
  {
    name: "Legal Filings",
    files: [
      { name: "Summons_and_Complaint.pdf", size: "742 KB", date: "Feb 10, 2026", type: "Legal" },
      { name: "Affidavit_of_Service.pdf", size: "201 KB", date: "Jul 12, 2026", type: "Legal" },
      { name: "Notice_of_Arrears_Aug2026.pdf", size: "88 KB", date: "Aug 19, 2026", type: "Correspondence" },
    ],
  },
];

export const ACCOUNT_NOTES = [
  { id: 1, author: "Sarah Okafor", time: "Aug 26, 2026 · 15:42", text: "Received $85,000 ACH installment under the payment plan. Debtor confirmed the next installment for Oct 1.", source: "User note", important: true },
  { id: 2, author: "Daniel Reeves", time: "Aug 19, 2026 · 14:32", text: "Formal notice of arrears sent for Tower B lease. No response within 5 business days — escalated to legal review.", source: "Automated", important: false },
  { id: 3, author: "Marcus Reid", time: "Jul 12, 2026 · 10:05", text: "Service of process completed on Westfield Tower B LLC. Court costs posted to the account.", source: "User note", important: true },
  { id: 4, author: "Sarah Okafor", time: "Mar 5, 2026 · 09:20", text: "Partial payment of $50,000 received by check CHK-10421. Remaining balance discussed with Gregory Westfield.", source: "Automated", important: false },
];

export const ACCOUNT_REMINDERS = [
  { id: 1, description: "Confirm Oct 1 payment plan installment", priority: "High", repetition: "Monthly", dueDate: "Oct 1, 2026", endDate: "Mar 1, 2027", note: "Call Gregory Westfield if the ACH has not cleared by end of day." },
  { id: 2, description: "Check for answer to the complaint", priority: "Critical", repetition: "Once", dueDate: "Oct 14, 2026", endDate: "Oct 14, 2026", note: "If no answer is filed, ask Marcus Reid to move for default judgment." },
  { id: 3, description: "Review interest accrual", priority: "Medium", repetition: "Quarterly", dueDate: "Dec 31, 2026", endDate: "Dec 31, 2027", note: "Post the semi-annual interest and update the balance summary." },
];

export type AccountTransaction = {
  id: number;
  date: string;
  description: string;
  checkNumber: string;
  note: string;
  collector: string;
  coCollector: string;
  amount: number;
  principal: number;
  interest: number;
  costs: number;
  attorneyFees: number;
  thirdPartyFees: number;
  agency: number;
  client: number;
  balance: number;
  payment: boolean;
  checkImage?: string;
};

export const EMPTY_SPLIT = { principal: 0, interest: 0, costs: 0, attorneyFees: 0, thirdPartyFees: 0, agency: 0, client: 0 };

export const INITIAL_TRANSACTIONS: AccountTransaction[] = [
  { ...EMPTY_SPLIT, id: 1, date: "2025-03-14", description: "Placement", checkNumber: "", note: "Account placed by Empire Commercial Holdings", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 412700, principal: 412700, balance: 412700, payment: false },
  { ...EMPTY_SPLIT, id: 2, date: "2025-12-31", description: "Interest Accrual", checkNumber: "", note: "Annual contractual interest", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 18200, interest: 18200, balance: 430900, payment: false },
  { ...EMPTY_SPLIT, id: 3, date: "2026-02-10", description: "Court Costs", checkNumber: "", note: "Filing fee — NY Supreme Court", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 4300, costs: 4300, balance: 435200, payment: false },
  { id: 4, date: "2026-03-05", description: "Payment", checkNumber: "CHK-10421", note: "Partial payment", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 50000, principal: 27500, interest: 18200, costs: 4300, attorneyFees: 2500, thirdPartyFees: 500, agency: 12500, client: 34500, balance: 385200, payment: true },
  { ...EMPTY_SPLIT, id: 5, date: "2026-06-30", description: "Interest Accrual", checkNumber: "", note: "Semi-annual interest", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 10250, interest: 10250, balance: 395450, payment: false },
  { ...EMPTY_SPLIT, id: 6, date: "2026-07-12", description: "Court Costs", checkNumber: "", note: "Service of process", collector: "Daniel Reeves", coCollector: "Sarah Okafor", amount: 2250, costs: 2250, balance: 397700, payment: false },
  { id: 7, date: "2026-08-26", description: "Payment", checkNumber: "ACH-29018", note: "Payment plan installment", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 85000, principal: 72500, interest: 10250, costs: 2250, attorneyFees: 4250, thirdPartyFees: 850, agency: 21250, client: 58650, balance: 312700, payment: true },
];

export const SESSION_USER_DEPARTMENT: Record<string, string> = {
  "Sarah Okafor": "Collections",
  "Daniel Reeves": "Collections",
  "Marcus Reid": "Legal",
  "Avery Collins": "Legal",
  "Elena Brooks": "Accounting",
  "Jordan Hayes": "Customer Service",
};

export const ACCOUNT_SESSIONS = [
  { id: 1, date: "2026-10-08T14:20", user: "Sarah Okafor", minutes: 42 },
  { id: 2, date: "2026-10-08T09:05", user: "Elena Brooks", minutes: 18 },
  { id: 3, date: "2026-10-07T16:40", user: "Marcus Reid", minutes: 65 },
  { id: 4, date: "2026-10-07T11:15", user: "Daniel Reeves", minutes: 27 },
  { id: 5, date: "2026-10-06T10:30", user: "Avery Collins", minutes: 50 },
  { id: 6, date: "2026-10-05T15:45", user: "Sarah Okafor", minutes: 35 },
  { id: 7, date: "2026-10-02T13:10", user: "Jordan Hayes", minutes: 12 },
  { id: 8, date: "2026-10-01T09:20", user: "Sarah Okafor", minutes: 58 },
  { id: 9, date: "2026-10-01T08:45", user: "Elena Brooks", minutes: 24 },
  { id: 10, date: "2026-09-29T14:00", user: "Marcus Reid", minutes: 90 },
  { id: 11, date: "2026-09-26T11:30", user: "Daniel Reeves", minutes: 31 },
  { id: 12, date: "2026-09-24T16:15", user: "Avery Collins", minutes: 44 },
  { id: 13, date: "2026-09-22T10:05", user: "Jordan Hayes", minutes: 9 },
  { id: 14, date: "2026-09-19T09:40", user: "Sarah Okafor", minutes: 47 },
  { id: 15, date: "2026-09-15T15:20", user: "Elena Brooks", minutes: 21 },
  { id: 16, date: "2026-09-12T13:35", user: "Marcus Reid", minutes: 38 },
].map((session) => ({ ...session, department: SESSION_USER_DEPARTMENT[session.user] }));
