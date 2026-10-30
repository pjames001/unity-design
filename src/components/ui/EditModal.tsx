import { useState, useEffect } from "react";
import DateInput from "@/components/ui/DateInput";
import ModalShell from "@/components/ui/ModalShell";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import StringListEditor from "@/components/ui/StringListEditor";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { EDIT_FIELD_CLASS, EDIT_LABEL_CLASS } from "@/components/ui/formStyles";
import { isoToTextDate, textDateToISO } from "@/utils/date";

export type EditValue = string | boolean | string[] | unknown;

export type EditField = {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "select" | "list" | "multi" | "toggle" | "custom";
  options?: string[];
  span?: 1 | 2 | 3;
  section?: string;
  placeholder?: string;
  render?: (value: EditValue, onChange: (next: EditValue) => void) => React.ReactNode;
};

export default function EditModal({ open, title, subtitle, fields, values, onSave, onClose }: {
  open: boolean;
  title: string;
  subtitle?: string;
  fields: EditField[];
  values: Record<string, EditValue>;
  onSave: (values: Record<string, EditValue>) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, EditValue>>(values);
  useEffect(() => {
    if (!open) return;
    const next: Record<string, EditValue> = { ...values };
    fields.forEach((field) => {
      if (field.type === "date") next[field.key] = textDateToISO(String(values[field.key] ?? ""));
    });
    setDraft(next);
  }, [open]);

  const save = () => {
    const next: Record<string, EditValue> = { ...draft };
    fields.forEach((field) => {
      if (field.type === "date") next[field.key] = isoToTextDate(String(draft[field.key] ?? ""));
      if (field.type === "list") next[field.key] = (draft[field.key] as string[]).map((v) => v.trim()).filter(Boolean);
    });
    onSave(next);
    onClose();
  };

  const set = (key: string) => (next: EditValue) => setDraft((current) => ({ ...current, [key]: next }));
  const spanClass = (span?: number) => (span === 3 ? "col-span-3" : span === 2 ? "col-span-2" : "");

  const control = (field: EditField) => {
    const value = draft[field.key];
    switch (field.type) {
      case "select":
        return (
          <select value={String(value ?? "")} onChange={(event) => set(field.key)(event.target.value)} className={EDIT_FIELD_CLASS}>
            {field.options?.map((option) => <option key={option} value={option}>{option || "Not assigned"}</option>)}
          </select>
        );
      case "date":
        return <DateInput value={String(value ?? "")} onChange={set(field.key)} className={EDIT_FIELD_CLASS} />;
      case "list":
        return <StringListEditor values={(value as string[])?.length ? (value as string[]) : [""]} onChange={set(field.key)} placeholder={field.placeholder} addLabel={`Add ${field.label.toLowerCase().replace(/sses$/, "ss").replace(/([^s])s$/, "$1")}`} />;
      case "multi":
        return (
          <MultiSelectDropdown
            label={`Select ${field.label.toLowerCase()}`}
            options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
            selected={(value as string[]) ?? []}
            onChange={set(field.key)}
          />
        );
      case "toggle":
        return <div className="flex h-10 items-center"><ToggleSwitch checked={Boolean(value)} onChange={set(field.key)} label={field.label} /></div>;
      case "custom":
        return field.render?.(value, set(field.key));
      default:
        return <input type={field.type ?? "text"} value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => set(field.key)(event.target.value)} className={EDIT_FIELD_CLASS} />;
    }
  };

  return (
    <ModalShell open={open} title={title} subtitle={subtitle} onClose={onClose} onSubmit={save}>
      <div className="grid grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <div key={field.key} className={`${spanClass(field.span)} ${field.type === "list" || field.type === "custom" ? "self-start" : ""}`}>
            {field.type !== "toggle" && <span className={EDIT_LABEL_CLASS}>{field.label}</span>}
            {control(field)}
          </div>
        )).flatMap((node, index) => {
          const field = fields[index];
          return field.section && field.section !== fields[index - 1]?.section
            ? [
                <p key={`section-${field.section}`} className={`col-span-3 text-[13px] font-semibold uppercase tracking-wider text-brand ${index > 0 ? "mt-2 border-t border-[var(--border)] pt-4" : ""}`}>{field.section}</p>,
                node,
              ]
            : [node];
        })}
      </div>
    </ModalShell>
  );
}
