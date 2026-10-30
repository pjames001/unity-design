import DateInput from "@/components/ui/DateInput";

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 ? "30" : "00";
  const label = `${hours % 12 || 12}:${minutes} ${hours < 12 ? "AM" : "PM"}`;
  return { value: `${String(hours).padStart(2, "0")}:${minutes}`, label };
});

export default function DateTimeInput({ value, onChange, className = "", required = false }: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}) {
  const [date = "", time = ""] = value ? value.split("T") : [];
  const emit = (nextDate: string, nextTime: string) => onChange(nextDate || nextTime ? `${nextDate}T${nextTime}` : "");
  return (
    <div className="grid grid-cols-[1fr_8.5rem] gap-2">
      <DateInput value={date} onChange={(nextDate) => emit(nextDate, time)} className={className} required={required} ariaLabel="Date" />
      <select required={required} value={time} onChange={(event) => emit(date, event.target.value)} aria-label="Time" className={className}>
        <option value="" disabled>Time</option>
        {TIME_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}
