import { useState, useEffect } from "react";
import ModalShell from "@/components/ui/ModalShell";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { EDIT_FIELD_CLASS, EDIT_LABEL_CLASS } from "@/components/ui/formStyles";
import { CLIENT_CONTACTS } from "@/data/client";
import { Plus, Trash2 } from "lucide-react";

export type ClientContact = typeof CLIENT_CONTACTS[number];

export const CONTACT_EMAIL_LABELS = ["Work", "Personal", "Legal", "Other"];

export const CONTACT_PHONE_LABELS = ["Direct", "Mobile", "Office", "Other"];

export default function ContactsEditModal({ open, contacts, onSave, onClose }: { open: boolean; contacts: ClientContact[]; onSave: (next: ClientContact[]) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<ClientContact[]>(contacts);
  useEffect(() => {
    if (open) setDraft(contacts.map((contact) => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })));
  }, [open]);

  const update = (index: number, changes: Partial<ClientContact>) => setDraft((current) => current.map((contact, i) => (i === index ? { ...contact, ...changes } : contact)));

  const labeledList = (index: number, key: "emails" | "phones", labels: string[], type: string, placeholder: string) => {
    const entries = draft[index][key];
    return (
      <div className="col-span-2">
        <span className={EDIT_LABEL_CLASS}>{key === "emails" ? "Email Addresses" : "Phone Numbers"}</span>
        <div className="space-y-2">
          {entries.map((entry, entryIndex) => (
            <div key={entryIndex} className="flex gap-2">
              <select
                value={entry.label}
                onChange={(event) => update(index, { [key]: entries.map((e, i) => (i === entryIndex ? { ...e, label: event.target.value } : e)) })}
                className="h-10 w-28 shrink-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
              >
                {labels.map((label) => <option key={label} value={label}>{label}</option>)}
              </select>
              <input type={type} value={entry.value} placeholder={placeholder} onChange={(event) => update(index, { [key]: entries.map((e, i) => (i === entryIndex ? { ...e, value: event.target.value } : e)) })} className={`${EDIT_FIELD_CLASS} min-w-0 flex-1`} />
              {entries.length > 1 && (
                <button type="button" onClick={() => update(index, { [key]: entries.filter((_, i) => i !== entryIndex) })} aria-label="Remove" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => update(index, { [key]: [...entries, { label: labels[0], value: "" }] })} className="mt-2 text-[13px] font-medium text-brand">
          + Add {key === "emails" ? "email" : "phone"}
        </button>
      </div>
    );
  };

  return (
    <ModalShell
      open={open}
      title="Edit Contacts"
      subtitle="Names, titles, guarantors, and contact details"
      onClose={onClose}
      onSubmit={() => { onSave(draft.map((c) => ({ ...c, emails: c.emails.filter((e) => e.value.trim()), phones: c.phones.filter((p) => p.value.trim()) }))); onClose(); }}
      width="max-w-4xl"
    >
      <div className="space-y-4">
        {draft.map((contact, index) => (
          <div key={index} className="rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-semibold text-[var(--foreground)]">Contact {index + 1}</p>
              <div className="flex items-center gap-5">
                <ToggleSwitch checked={contact.primary} onChange={(primary) => update(index, { primary })} label="Primary" />
                <ToggleSwitch checked={contact.personalGuarantor} onChange={(personalGuarantor) => update(index, { personalGuarantor })} label="Personal guarantor" />
                {draft.length > 1 && (
                  <button type="button" onClick={() => setDraft((current) => current.filter((_, i) => i !== index))} aria-label={`Remove contact ${index + 1}`} className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <label><span className={EDIT_LABEL_CLASS}>First Name</span><input required value={contact.firstName} onChange={(e) => update(index, { firstName: e.target.value })} className={EDIT_FIELD_CLASS} /></label>
              <label><span className={EDIT_LABEL_CLASS}>Last Name</span><input required value={contact.lastName} onChange={(e) => update(index, { lastName: e.target.value })} className={EDIT_FIELD_CLASS} /></label>
              <label className="col-span-2"><span className={EDIT_LABEL_CLASS}>Title</span><input value={contact.title} onChange={(e) => update(index, { title: e.target.value })} className={EDIT_FIELD_CLASS} /></label>
              {labeledList(index, "emails", CONTACT_EMAIL_LABELS, "email", "name@company.com")}
              {labeledList(index, "phones", CONTACT_PHONE_LABELS, "tel", "+1 (212) 555-0000")}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setDraft((current) => [...current, { firstName: "", lastName: "", title: "", primary: false, personalGuarantor: false, emails: [{ label: "Work", value: "" }], phones: [{ label: "Direct", value: "" }] }])}
          className="btn btn-secondary"
        >
          <Plus size={13} />
          Add Contact
        </button>
      </div>
    </ModalShell>
  );
}
