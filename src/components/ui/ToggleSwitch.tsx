export default function ToggleSwitch({ checked, onChange, label, hideLabel = false }: { checked: boolean; onChange: (value: boolean) => void; label: string; hideLabel?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--brand)]" : "bg-[var(--muted)]"}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
      {!hideLabel && <span className="text-[15px] font-medium text-[var(--foreground)]">{label}</span>}
    </label>
  );
}
