import { useState } from "react";
import Card from "@/components/ui/Card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Plus, Trash2 } from "lucide-react";

export type NewClientContact = {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  emails: string[];
  phones: string[];
  personalGuarantor: boolean;
};

export default function AddClientPage({ onCancel, onCreated }: { onCancel: () => void; onCreated: () => void }) {
  const [medical, setMedical] = useState(false);
  const [contacts, setContacts] = useState<NewClientContact[]>([
    { id: 1, firstName: "", lastName: "", title: "", emails: [""], phones: [""], personalGuarantor: false },
  ]);
  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";

  const updateContact = (id: number, patch: Partial<NewClientContact>) => {
    setContacts((current) => current.map((contact) => contact.id === id ? { ...contact, ...patch } : contact));
  };

  const updateContactList = (id: number, field: "emails" | "phones", index: number, value: string) => {
    setContacts((current) => current.map((contact) => {
      if (contact.id !== id) return contact;
      const values = [...contact[field]];
      values[index] = value;
      return { ...contact, [field]: values };
    }));
  };

  const addContact = () => {
    const nextId = contacts.reduce((highest, contact) => Math.max(highest, contact.id), 0) + 1;
    setContacts((current) => [
      ...current,
      { id: nextId, firstName: "", lastName: "", title: "", emails: [""], phones: [""], personalGuarantor: false },
    ]);
  };

  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";
  const section = (title: string, children: React.ReactNode) => (
    <Card className="h-full overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
      </div>
      <div className="grid grid-cols-2 content-start gap-4 p-5">{children}</div>
    </Card>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onCreated();
        }}
        className="space-y-5 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-brand">Add a Client</h2>
            <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">Enter the client profile, assignment, corporate details, and primary contacts.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Client
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 items-stretch gap-5">
          {section("Client Information", (
            <>
              <label className="col-span-2">
                <span className={labelClass}>Company Name</span>
                <input required placeholder="e.g. Westfield Group" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Business Type</span>
                <select required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a business type</option>
                  <option>Real Estate Company</option>
                  <option>Construction Company</option>
                  <option>Car Manufacturer</option>
                  <option>Healthcare Provider</option>
                  <option>Retail Company</option>
                  <option>Professional Services</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Website</span>
                <input type="url" placeholder="https://company.com" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Corporate Phone</span>
                <input required type="tel" placeholder="+1 (212) 555-0000" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Corporate Email</span>
                <input required type="email" placeholder="finance@company.com" className={fieldClass} />
              </label>
            </>
          ))}

          {section("Corporate Address", (
            <>
              <label className="col-span-2">
                <span className={labelClass}>Street Address</span>
                <input required placeholder="Street and suite number" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>City</span>
                <input required className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>State / Province</span>
                <input required className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>ZIP / Postal Code</span>
                <input required className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Country</span>
                <select required defaultValue="United States" className={fieldClass}>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </label>
            </>
          ))}

          {section("Status & Assignment", (
            <>
              <label>
                <span className={labelClass}>Status</span>
                <select required defaultValue="Active" className={fieldClass}>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Substatus</span>
                <select required defaultValue="Under Review" className={fieldClass}>
                  <option>Under Review</option>
                  <option>Onboarding</option>
                  <option>Approved</option>
                  <option>On Hold</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Opener</span>
                <select required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select an opener</option>
                  <option>Nina Alvarez</option>
                  <option>Sarah Okafor</option>
                  <option>James Patel</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Closer</span>
                <select required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a closer</option>
                  <option>Daniel Reeves</option>
                  <option>Sarah Okafor</option>
                  <option>James Patel</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Tags</span>
                <select defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a tag</option>
                  <option>High Value</option>
                  <option>Corporate</option>
                  <option>Disputed</option>
                  <option>Standard</option>
                  <option>Priority Client</option>
                </select>
              </label>
              <div className="flex h-10 items-center self-end">
                <ToggleSwitch checked={medical} onChange={setMedical} label="Medical company" />
              </div>
            </>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="section-head flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
            <div>
              <h3 className="text-[16px] font-semibold text-brand">Contacts</h3>
              <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Add contact details and identify personal guarantors.</p>
            </div>
            <button type="button" onClick={addContact} className="btn btn-secondary">
              <Plus size={12} />
              Add Contact
            </button>
          </div>
          <div className="grid grid-cols-3 items-start gap-4 p-5">
            {contacts.map((contact, contactIndex) => (
              <div key={contact.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-[var(--foreground)]">Contact {contactIndex + 1}</p>
                  {contacts.length > 1 && (
                    <button type="button" onClick={() => setContacts((current) => current.filter((item) => item.id !== contact.id))} className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10" aria-label="Remove contact">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className={labelClass}>First Name</span>
                    <input required value={contact.firstName} onChange={(event) => updateContact(contact.id, { firstName: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Last Name</span>
                    <input required value={contact.lastName} onChange={(event) => updateContact(contact.id, { lastName: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Title / Position</span>
                    <input required value={contact.title} onChange={(event) => updateContact(contact.id, { title: event.target.value })} className={fieldClass} />
                  </label>
                  <div className="flex h-10 items-center self-end">
                    <ToggleSwitch
                      checked={contact.personalGuarantor}
                      onChange={(personalGuarantor) => updateContact(contact.id, { personalGuarantor })}
                      label="Personal guarantor"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[var(--foreground)]">Email Addresses</span>
                      <button type="button" onClick={() => updateContact(contact.id, { emails: [...contact.emails, ""] })} className="text-[13px] font-medium text-brand">+ Add email</button>
                    </div>
                    <div className="space-y-2">
                      {contact.emails.map((email, index) => (
                        <input key={index} required type="email" value={email} onChange={(event) => updateContactList(contact.id, "emails", index, event.target.value)} placeholder="contact@company.com" className={fieldClass} />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[var(--foreground)]">Phone Numbers</span>
                      <button type="button" onClick={() => updateContact(contact.id, { phones: [...contact.phones, ""] })} className="text-[13px] font-medium text-brand">+ Add phone</button>
                    </div>
                    <div className="space-y-2">
                      {contact.phones.map((phone, index) => (
                        <input key={index} required type="tel" value={phone} onChange={(event) => updateContactList(contact.id, "phones", index, event.target.value)} placeholder="+1 (212) 555-0000" className={fieldClass} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addContact}
              className="flex min-h-40 flex-col items-center justify-center gap-2 self-stretch rounded-lg border-2 border-dashed border-[var(--border)] text-[14px] font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:text-brand"
            >
              <Plus size={18} />
              Add another contact
            </button>
          </div>
        </Card>
      </form>
    </main>
  );
}
