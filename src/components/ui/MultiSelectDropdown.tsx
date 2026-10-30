import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  grid = false,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (values: string[]) => void;
  grid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const toggleValue = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex h-10 w-full items-center justify-between rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-left text-[14px] text-[var(--foreground)] outline-none transition-colors hover:border-[var(--ring)]"
      >
        <span className={selected.length ? "" : "text-[var(--muted-foreground)]"}>
          {selected.length ? `${selected.length} selected` : label}
        </span>
        <span className={`text-[var(--muted-foreground)] transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronDown size={13} />
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-30 w-full min-w-56 rounded-md border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl">
          <div className={grid ? "grid grid-cols-7 gap-1" : "space-y-0.5"}>
            {options.map((option) => {
              const active = selected.includes(option.value);
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => toggleValue(option.value)}
                  className={`flex items-center rounded px-2 py-1.5 text-[13px] transition-colors ${
                    grid ? "justify-center" : "w-full justify-between"
                  } ${active ? "bg-brand text-white" : "text-[var(--foreground)] hover:bg-[var(--muted)]"}`}
                >
                  {option.label}
                  {!grid && active && <Check size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
