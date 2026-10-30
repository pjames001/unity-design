export default function InfoField({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-brand">{label}</p>
      <div className="text-[13px] font-medium leading-relaxed text-[var(--foreground)]">{children}</div>
    </div>
  );
}
