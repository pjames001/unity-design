import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { EDIT_FIELD_CLASS } from "@/components/ui/formStyles";
import { Trash2 } from "lucide-react";

export type CoDebtor = { name: string; reported: boolean };

export default function CoDebtorEditor({ value, onChange }: { value: CoDebtor[]; onChange: (next: CoDebtor[]) => void }) {
  return (
    <div>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <input value={item.name} placeholder="Full name" onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, name: e.target.value } : v)))} className={`${EDIT_FIELD_CLASS} min-w-0 flex-1`} />
            <ToggleSwitch checked={item.reported} onChange={(reported) => onChange(value.map((v, i) => (i === index ? { ...v, reported } : v)))} label="Reported" />
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label="Remove co-debtor" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, { name: "", reported: false }])} className="mt-2 text-[13px] font-medium text-brand">+ Add co-debtor</button>
    </div>
  );
}
