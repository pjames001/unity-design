export default function ClientKpi({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="flex-1 px-4 py-2.5 border-r border-[var(--border)] last:border-r-0">
      <p className="text-[12px] font-medium text-[var(--muted-foreground)] mb-0.5">{label}</p>
      <p className={`text-lg font-semibold leading-none mb-0.5 ${color}`}>{value}</p>
      <p className="text-[12px] text-[var(--muted-foreground)]">{sub}</p>
    </div>
  );
}
