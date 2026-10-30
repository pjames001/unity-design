import { useState } from "react";
import { createPortal } from "react-dom";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DateInput from "@/components/ui/DateInput";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { AccountRightDrawer } from "@/components/ui/RightDrawer";
import SegmentedControl from "@/components/ui/SegmentedControl";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { EMAIL_LABELS, LICENSE_STATES, PHONE_LABELS, PRACTICE_AREAS } from "@/constants/options";
import { Building2, Check, Plus, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ContactEntry = { id: number; label: string; value: string };

export type AddressEntry = { id: number; address: string; city: string; state: string; zip: string; country: string };

export type ContactPerson = {
  title: string;
  firstName: string;
  lastName: string;
  guarantor: boolean;
  addresses: AddressEntry[];
  phones: ContactEntry[];
  emails: ContactEntry[];
};

export type NewDebtor = {
  kind: string;
  firstName: string;
  middleName: string;
  lastName: string;
  aka: string;
  ssn: string;
  birthday: string;
  companyName: string;
  fictitiousName: string;
  registeredName: string;
  contactPerson: ContactPerson;
  addresses: AddressEntry[];
  phones: ContactEntry[];
  emails: ContactEntry[];
  attorney: {
    firmName: string; firmTaxId: string; firmEmail: string; firmPhone: string; firmFax: string;
    firmStreet: string; firmCity: string; firmState: string; firmZip: string;
    firmLicensedIn: string[]; firmPracticeAreas: string[];
    firstName: string; lastName: string; phones: string[]; emails: string[];
    address: string; city: string; state: string; zip: string; barNumber: string;
    licensedIn: string[]; practiceAreas: string[];
  };
  employer: { companyName: string; title: string; contactFirstName: string; contactLastName: string; emails: string[]; phones: string[] };
};

export const EMPTY_DEBTOR: NewDebtor = {
  kind: "Individual",
  firstName: "", middleName: "", lastName: "", aka: "", ssn: "", birthday: "",
  companyName: "", fictitiousName: "", registeredName: "",
  contactPerson: {
    title: "", firstName: "", lastName: "", guarantor: false,
    addresses: [{ id: 1, address: "", city: "", state: "", zip: "", country: "" }],
    phones: [{ id: 1, label: "Work", value: "" }],
    emails: [{ id: 1, label: "Work", value: "" }],
  },
  addresses: [{ id: 1, address: "", city: "", state: "", zip: "", country: "United States" }],
  phones: [{ id: 1, label: "Mobile", value: "" }],
  emails: [{ id: 1, label: "Personal", value: "" }],
  attorney: {
    firmName: "", firmTaxId: "", firmEmail: "", firmPhone: "", firmFax: "",
    firmStreet: "", firmCity: "", firmState: "", firmZip: "",
    firmLicensedIn: [], firmPracticeAreas: [],
    firstName: "", lastName: "", phones: [""], emails: [""],
    address: "", city: "", state: "", zip: "", barNumber: "",
    licensedIn: [], practiceAreas: [],
  },
  employer: { companyName: "", title: "", contactFirstName: "", contactLastName: "", emails: [""], phones: [""] },
};

export default function DebtorStep({ value, onChange }: { value: NewDebtor; onChange: (value: NewDebtor) => void }) {
  const [drawer, setDrawer] = useState<"attorney" | "employer" | null>(null);
  const update = (changes: Partial<NewDebtor>) => onChange({ ...value, ...changes });
  const updateAttorney = (changes: Partial<NewDebtor["attorney"]>) => update({ attorney: { ...value.attorney, ...changes } });
  const updateEmployer = (changes: Partial<NewDebtor["employer"]>) => update({ employer: { ...value.employer, ...changes } });

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";

  const text = (label: string, input: string, onInput: (next: string) => void, options: { span?: string; placeholder?: string; type?: string; maxLength?: number } = {}) => (
    <label className={options.span ?? ""}>
      <span className={labelClass}>{label}</span>
      {options.type === "date" ? <DateInput value={input} onChange={onInput} className={fieldClass} /> : <input type={options.type ?? "text"} value={input} maxLength={options.maxLength} placeholder={options.placeholder} onChange={(e) => onInput(e.target.value)} className={fieldClass} />}
    </label>
  );

  const removeButton = (label: string, onRemove: () => void) => (
    <button type="button" onClick={onRemove} aria-label={label} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
      <Trash2 size={15} />
    </button>
  );

  const contactList = (title: string, entries: ContactEntry[], onEntries: (next: ContactEntry[]) => void, labels: string[], type: string, placeholder: string, addLabel: string) => (
    <div>
      <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-brand">{title}</p>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-2">
            <select
              value={entry.label}
              aria-label={`${title} label`}
              onChange={(e) => onEntries(entries.map((row) => (row.id === entry.id ? { ...row, label: e.target.value } : row)))}
              className="h-10 w-32 shrink-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
            >
              {labels.map((label) => <option key={label} value={label}>{label}</option>)}
            </select>
            <input
              type={type}
              value={entry.value}
              placeholder={placeholder}
              aria-label={title}
              onChange={(e) => onEntries(entries.map((row) => (row.id === entry.id ? { ...row, value: e.target.value } : row)))}
              className={`${fieldClass} min-w-0 flex-1`}
            />
            {entries.length > 1 && removeButton(`Remove ${entry.label}`, () => onEntries(entries.filter((row) => row.id !== entry.id)))}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onEntries([...entries, { id: Date.now(), label: labels[0], value: "" }])} className="mt-2 text-[13px] font-medium text-brand">
        + {addLabel}
      </button>
    </div>
  );

  const addressRows = (entries: AddressEntry[], onEntries: (next: AddressEntry[]) => void, withCountry: boolean) => (
    <div className="space-y-3">
      {entries.map((item, index) => {
        const set = (changes: Partial<AddressEntry>) => onEntries(entries.map((row) => (row.id === item.id ? { ...row, ...changes } : row)));
        return (
          <div key={item.id} className={`grid items-end gap-3 ${withCountry ? "grid-cols-[2.5rem_2fr_1fr_1fr_1fr_1fr_2.5rem]" : "grid-cols-[2.5rem_2fr_1fr_1fr_1fr_2.5rem]"}`}>
            <span className="flex h-10 items-center justify-center rounded-md bg-brand/10 text-[14px] font-semibold text-brand">{index + 1}</span>
            {text("Address", item.address, (address) => set({ address }), { placeholder: "Street and unit" })}
            {text("City", item.city, (city) => set({ city }))}
            {text("State", item.state, (state) => set({ state }), { placeholder: "NY" })}
            {text("ZIP Code", item.zip, (zip) => set({ zip }), { maxLength: 10 })}
            {withCountry && text("Country", item.country, (country) => set({ country }))}
            {entries.length > 1 ? removeButton(`Remove address ${index + 1}`, () => onEntries(entries.filter((row) => row.id !== item.id))) : <span />}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => onEntries([...entries, { id: Date.now(), address: "", city: "", state: "", zip: "", country: withCountry ? "United States" : "" }])}
        className="btn btn-secondary"
      >
        <Plus size={13} />
        Add Another Address
      </button>
    </div>
  );

  const section = (title: string, children: React.ReactNode, action?: React.ReactNode) => (
    <Card className="overflow-hidden">
      <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );

  const stringList = (label: string, values: string[], onValues: (next: string[]) => void, type: string, placeholder: string) => (
    <div className="col-span-2">
      <span className={labelClass}>{label}</span>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input type={type} value={item} placeholder={placeholder} aria-label={label} onChange={(e) => onValues(values.map((v, i) => (i === index ? e.target.value : v)))} className={fieldClass} />
            {values.length > 1 && removeButton(`Remove ${label}`, () => onValues(values.filter((_, i) => i !== index)))}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onValues([...values, ""])} className="mt-2 text-[13px] font-medium text-brand">
        + Add {type === "email" ? "email" : "phone"}
      </button>
    </div>
  );

  const multi = (label: string, options: string[], selected: string[], onSelected: (next: string[]) => void) => (
    <div className="col-span-2">
      <span className={labelClass}>{label}</span>
      <MultiSelectDropdown label={`Select ${label.toLowerCase()}`} options={options.map((o) => ({ value: o, label: o }))} selected={selected} onChange={onSelected} />
    </div>
  );

  const drawerCard = (title: string, children: React.ReactNode) => (
    <Card className="overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-4 py-3">
        <p className="text-[14px] font-semibold text-[var(--foreground)]">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">{children}</div>
    </Card>
  );

  const attorneyAdded = Boolean(value.attorney.firmName || value.attorney.firstName || value.attorney.lastName);
  const employerAdded = Boolean(value.employer.companyName);
  const a = value.attorney;
  const e = value.employer;

  const cp = { ...EMPTY_DEBTOR.contactPerson, ...value.contactPerson };
  const updateContactPerson = (changes: Partial<ContactPerson>) => update({ contactPerson: { ...cp, ...changes } });
  const partyButtons = (value.kind === "Individual"
    ? [
        ["attorney", "Attorney Representing Debtor", "Firm and attorney details", Building2, attorneyAdded],
        ["employer", "Verified Employer", "Employment and contact details", Check, employerAdded],
      ]
    : [["attorney", "Attorney Representing Debtor", "Firm and attorney details", Building2, attorneyAdded]]) as Array<["attorney" | "employer", string, string, LucideIcon, boolean]>;

  return (
    <div className="space-y-5">
      <Card className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-[16px] font-semibold text-brand">Debtor Type</p>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Choose whether the debtor is a person or a business</p>
        </div>
        <div className="w-72">
          <SegmentedControl label="Debtor type" options={["Individual", "Company"]} value={value.kind} onChange={(kind) => update({ kind })} />
        </div>
      </Card>

      {value.kind === "Individual"
        ? section("Debtor Information", (
            <div className="grid grid-cols-6 gap-4">
              {text("First Name", value.firstName, (firstName) => update({ firstName }), { placeholder: "Gregory" })}
              {text("Middle Name", value.middleName, (middleName) => update({ middleName }))}
              {text("Last Name", value.lastName, (lastName) => update({ lastName }), { placeholder: "Westfield" })}
              {text("AKA", value.aka, (aka) => update({ aka }), { placeholder: "Also known as" })}
              {text("SSN", value.ssn, (ssn) => update({ ssn }), { placeholder: "XXX-XX-XXXX", maxLength: 11 })}
              {text("Birthday", value.birthday, (birthday) => update({ birthday }), { type: "date" })}
            </div>
          ))
        : section("Company Information", (
            <div className="grid grid-cols-3 gap-4">
              {text("Company Name", value.companyName, (companyName) => update({ companyName }), { placeholder: "e.g. Westfield Tower B LLC" })}
              {text("Fictitious Business Name", value.fictitiousName, (fictitiousName) => update({ fictitiousName }), { placeholder: "DBA / trade name" })}
              {text("Registered Business Name", value.registeredName, (registeredName) => update({ registeredName }), { placeholder: "Legal registered name" })}
            </div>
          ))}

      {section("Addresses", addressRows(value.addresses, (addresses) => update({ addresses }), true))}

      {section("Contact Information", (
        <div className="grid grid-cols-2 gap-8">
          {contactList("Phone Numbers", value.phones, (phones) => update({ phones }), PHONE_LABELS, "tel", "+1 (212) 555-0101", "Add phone number")}
          {contactList("Email Addresses", value.emails, (emails) => update({ emails }), EMAIL_LABELS, "email", "name@example.com", "Add email address")}
        </div>
      ))}

      {value.kind === "Company" &&
        section("Contact Person", (
          <div className="space-y-5">
            <div className="grid grid-cols-4 items-end gap-4">
              {text("Title", cp.title, (title) => updateContactPerson({ title }), { placeholder: "e.g. CFO" })}
              {text("First Name", cp.firstName, (firstName) => updateContactPerson({ firstName }))}
              {text("Last Name", cp.lastName, (lastName) => updateContactPerson({ lastName }))}
              <div className="flex h-10 items-center">
                <ToggleSwitch checked={cp.guarantor} onChange={(guarantor) => updateContactPerson({ guarantor })} label="Personal guarantor" />
              </div>
            </div>
            <div className="border-t border-[var(--border)] pt-5">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-brand">Addresses</p>
              {addressRows(cp.addresses, (addresses) => updateContactPerson({ addresses }), false)}
            </div>
            <div className="grid grid-cols-2 gap-8 border-t border-[var(--border)] pt-5">
              {contactList("Phone Numbers", cp.phones, (phones) => updateContactPerson({ phones }), PHONE_LABELS, "tel", "+1 (212) 555-0182", "Add phone number")}
              {contactList("Email Addresses", cp.emails, (emails) => updateContactPerson({ emails }), EMAIL_LABELS, "email", "contact@company.com", "Add email address")}
            </div>
          </div>
        ))}

      <div className="grid grid-cols-2 gap-5">
        {partyButtons.map(([key, title, sub, PartyIcon, added]) => (
          <button
            key={key}
            type="button"
            onClick={() => setDrawer(key)}
            className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-left transition-colors hover:border-brand"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
              <PartyIcon size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-semibold text-brand">{title}</span>
              <span className="block text-[13px] text-[var(--muted-foreground)]">{sub}</span>
            </span>
            {added ? <Badge label="Added" variant="success" className="text-[13px]" /> : <Badge label="Not added" variant="outline" className="text-[13px]" />}
          </button>
        ))}
      </div>

      {createPortal(
        <>
          <AccountRightDrawer open={drawer === "attorney"} title="Attorney Representing Debtor" subtitle="Add the firm and attorney information" onClose={() => setDrawer(null)}>
            <div className="space-y-4">
              {drawerCard("Firm Information", (
                <>
                  {text("Firm Name", a.firmName, (firmName) => updateAttorney({ firmName }), { span: "col-span-2" })}
                  {text("Tax ID / EIN", a.firmTaxId, (firmTaxId) => updateAttorney({ firmTaxId }))}
                  {text("Email Address", a.firmEmail, (firmEmail) => updateAttorney({ firmEmail }), { type: "email" })}
                  {text("Phone Number", a.firmPhone, (firmPhone) => updateAttorney({ firmPhone }), { type: "tel" })}
                  {text("Fax", a.firmFax, (firmFax) => updateAttorney({ firmFax }), { type: "tel" })}
                  {text("Street Address", a.firmStreet, (firmStreet) => updateAttorney({ firmStreet }), { span: "col-span-2" })}
                  {text("City", a.firmCity, (firmCity) => updateAttorney({ firmCity }))}
                  {text("State", a.firmState, (firmState) => updateAttorney({ firmState }))}
                  {text("ZIP Code", a.firmZip, (firmZip) => updateAttorney({ firmZip }))}
                  {multi("Licensed In", LICENSE_STATES, a.firmLicensedIn, (firmLicensedIn) => updateAttorney({ firmLicensedIn }))}
                  {multi("Practice Areas", PRACTICE_AREAS, a.firmPracticeAreas, (firmPracticeAreas) => updateAttorney({ firmPracticeAreas }))}
                </>
              ))}
              {drawerCard("Attorney Information", (
                <>
                  {text("First Name", a.firstName, (firstName) => updateAttorney({ firstName }))}
                  {text("Last Name", a.lastName, (lastName) => updateAttorney({ lastName }))}
                  {stringList("Phone Numbers", a.phones, (phones) => updateAttorney({ phones }), "tel", "+1 (212) 555-0165")}
                  {stringList("Email Addresses", a.emails, (emails) => updateAttorney({ emails }), "email", "attorney@firm.com")}
                  {text("Address", a.address, (address) => updateAttorney({ address }), { span: "col-span-2" })}
                  {text("City", a.city, (city) => updateAttorney({ city }))}
                  {text("State", a.state, (state) => updateAttorney({ state }))}
                  {text("ZIP Code", a.zip, (zip) => updateAttorney({ zip }))}
                  {text("Bar Number", a.barNumber, (barNumber) => updateAttorney({ barNumber }))}
                  {multi("Licensed In", LICENSE_STATES, a.licensedIn, (licensedIn) => updateAttorney({ licensedIn }))}
                  {multi("Practice Areas", PRACTICE_AREAS, a.practiceAreas, (practiceAreas) => updateAttorney({ practiceAreas }))}
                </>
              ))}
              <div className="flex justify-end">
                <button type="button" onClick={() => setDrawer(null)} className="btn btn-primary">Save Attorney</button>
              </div>
            </div>
          </AccountRightDrawer>

          <AccountRightDrawer open={drawer === "employer"} title="Verified Employer" subtitle="Add the verified employment and contact information" onClose={() => setDrawer(null)}>
            <div className="space-y-4">
              {drawerCard("Employer Information", (
                <>
                  {text("Company Name", e.companyName, (companyName) => updateEmployer({ companyName }), { span: "col-span-2" })}
                  {text("Title", e.title, (title) => updateEmployer({ title }), { span: "col-span-2" })}
                  {text("Contact First Name", e.contactFirstName, (contactFirstName) => updateEmployer({ contactFirstName }))}
                  {text("Contact Last Name", e.contactLastName, (contactLastName) => updateEmployer({ contactLastName }))}
                  {stringList("Email Addresses", e.emails, (emails) => updateEmployer({ emails }), "email", "contact@company.com")}
                  {stringList("Phone Numbers", e.phones, (phones) => updateEmployer({ phones }), "tel", "+1 (212) 555-0182")}
                </>
              ))}
              <div className="flex justify-end">
                <button type="button" onClick={() => setDrawer(null)} className="btn btn-primary">Save Employer</button>
              </div>
            </div>
          </AccountRightDrawer>
        </>,
        document.body
      )}
    </div>
  );
}
