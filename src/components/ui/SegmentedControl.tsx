export default function SegmentedControl({ options, value, onChange, label }: { options: string[]; value: string; onChange: (value: string) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex h-10 items-center gap-0.5 rounded-md bg-[var(--muted)] p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={`h-full flex-1 rounded text-[14px] font-medium transition-all duration-150 ${
            value === option ? "bg-[var(--brand)] text-white shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
