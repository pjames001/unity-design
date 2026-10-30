export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border bg-[var(--card)] border-[var(--border)] text-[var(--card-foreground)] ${className}`}>
      {children}
    </div>
  );
}
