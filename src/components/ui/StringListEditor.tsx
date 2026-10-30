import { EDIT_FIELD_CLASS } from "@/components/ui/formStyles";
import { Trash2 } from "lucide-react";

export default function StringListEditor({ values, onChange, placeholder, type = "text", addLabel }: { values: string[]; onChange: (next: string[]) => void; placeholder?: string; type?: string; addLabel: string }) {
  return (
    <div>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input type={type} value={item} placeholder={placeholder} onChange={(event) => onChange(values.map((v, i) => (i === index ? event.target.value : v)))} className={`${EDIT_FIELD_CLASS} min-w-0 flex-1`} />
            {values.length > 1 && (
              <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} aria-label="Remove" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...values, ""])} className="mt-2 text-[13px] font-medium text-brand">+ {addLabel}</button>
    </div>
  );
}
