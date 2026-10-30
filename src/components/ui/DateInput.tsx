import { useState, useEffect, useRef } from "react";
import { formatUSDate, maskUSDate, parseUSDate } from "@/utils/date";
import { Calendar } from "lucide-react";

export default function DateInput({ value, onChange, className = "", required = false, ariaLabel }: {
  value: string;
  onChange: (iso: string) => void;
  className?: string;
  required?: boolean;
  ariaLabel?: string;
}) {
  const [text, setText] = useState(formatUSDate(value));
  const pickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (parseUSDate(text) !== value && !(value === "" && text.length < 10)) setText(formatUSDate(value));
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        placeholder="MM/DD/YYYY"
        required={required}
        pattern="\d{2}/\d{2}/\d{4}"
        title="Use MM/DD/YYYY"
        aria-label={ariaLabel}
        value={text}
        onChange={(event) => {
          const next = maskUSDate(event.target.value);
          setText(next);
          if (next === "") onChange("");
          else {
            const iso = parseUSDate(next);
            if (iso) onChange(iso);
          }
        }}
        className={`${className} pr-9`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => pickerRef.current?.showPicker?.()}
        aria-label="Open calendar"
        className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
      >
        <Calendar size={14} />
      </button>
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setText(formatUSDate(event.target.value));
        }}
        className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 opacity-0"
      />
    </div>
  );
}
