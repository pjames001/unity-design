import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ── Icons (inline SVG to avoid dep) ──────────────────────────────────────────
function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  leads: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  clients: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  debtors: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3",
  hr: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M12 22h.01",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  settings: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z",
  chevronDown: "M6 9l6 6 6-6",
  arrowUp: "M12 19V5m-7 7l7-7 7 7",
  arrowDown: "M12 5v14m7-7l-7 7-7-7",
  trendUp: "M22 7l-8.5 8.5-5-5L1 18",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  menu: "M3 12h18M3 6h18M3 18h18",
  circle: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
  check: "M20 6 9 17l-5-5",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  back: "M19 12H5m7-7-7 7 7 7",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  mapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
  building: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  note: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  moreH: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  plus: "M12 5v14 M5 12h14",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 16H6L5 6 M10 11v6 M14 11v6",
  folder: "M3 5h6l2 2h10v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z",
};

// ── US date fields ───────────────────────────────────────────────────────────
function formatUSDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return match ? `${match[2]}/${match[3]}/${match[1]}` : iso;
}

function parseUSDate(text: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [, mm, dd, yyyy] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (date.getMonth() !== Number(mm) - 1 || date.getDate() !== Number(dd)) return null;
  return `${yyyy}-${mm}-${dd}`;
}

function maskUSDate(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function DateInput({ value, onChange, className = "", required = false, ariaLabel }: {
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
        <Icon d={ICONS.calendar} size={14} />
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

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 ? "30" : "00";
  const label = `${hours % 12 || 12}:${minutes} ${hours < 12 ? "AM" : "PM"}`;
  return { value: `${String(hours).padStart(2, "0")}:${minutes}`, label };
});

function DateTimeInput({ value, onChange, className = "", required = false }: {
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

// ── Primitive components ──────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  default: { bg: "#52525b", text: "#fff", border: "transparent" },
  success: { bg: "var(--st-success)", text: "#fff", border: "transparent" },
  warning: { bg: "var(--st-warning)", text: "#fff", border: "transparent" },
  danger: { bg: "var(--st-danger)", text: "#fff", border: "transparent" },
  info: { bg: "var(--brand)", text: "#fff", border: "transparent" },
  outline: { bg: "var(--muted)", text: "var(--foreground)", border: "var(--border)" },
};

function Badge({ label, variant = "default", className = "" }: { label: string; variant?: "default" | "success" | "warning" | "danger" | "info" | "outline"; className?: string }) {
  const c = BADGE_COLORS[variant];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[13px] font-medium border ${className}`}
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {label}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border bg-[var(--card)] border-[var(--border)] text-[var(--card-foreground)] ${className}`}>
      {children}
    </div>
  );
}

// ── Sidebar nav tree ─────────────────────────────────────────────────────────
type NavChild = { key: string; label: string; badge?: number };
type NavItem = {
  key: string;
  label: string;
  icon: string;
  badge?: number;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: ICONS.dashboard },
  {
    key: "leads",
    label: "Leads",
    icon: ICONS.leads,
    badge: 24,
    children: [
      { key: "leads-pipeline", label: "Lead Pipeline" },
      { key: "leads-new", label: "New Lead" },
      { key: "leads-assigned", label: "Assigned" },
    ],
  },
  {
    key: "clients",
    label: "Clients",
    icon: ICONS.clients,
    children: [
      { key: "clients-add", label: "Add a Client" },
      { key: "clients-upload", label: "Upload Clients" },
      { key: "clients-manage", label: "Manage Clients" },
    ],
  },
  {
    key: "collections",
    label: "Collections",
    icon: ICONS.debtors,
    badge: 8,
    children: [
      { key: "collections-add", label: "Add New Account" },
      { key: "collections-manage", label: "Manage Accounts" },
    ],
  },
  {
    key: "hr",
    label: "HR",
    icon: ICONS.hr,
    children: [
      { key: "hr-employees", label: "Employees" },
      { key: "hr-departments", label: "Departments" },
      { key: "hr-payroll", label: "Payroll" },
    ],
  },
];

function NavGroup({
  item,
  active,
  onNav,
}: {
  item: NavItem;
  active: string;
  onNav: (k: string) => void;
}) {
  const isParentActive = active === item.key || item.children?.some((c) => c.key === active);
  const [open, setOpen] = useState(isParentActive);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            setOpen((o) => !o);
          } else {
            onNav(item.key);
          }
        }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors group ${
          isParentActive && !hasChildren
            ? "bg-[var(--muted)] text-[var(--foreground)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        <span className={`shrink-0 transition-colors ${isParentActive ? "text-brand" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"}`}>
          <Icon d={item.icon} size={15} />
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && !hasChildren && (
          <span className="text-[10px] bg-brand text-white px-1.5 py-0.5 rounded font-semibold">{item.badge}</span>
        )}
        {hasChildren && (
          <span className={`text-[var(--muted-foreground)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <Icon d={ICONS.chevronDown} size={13} />
          </span>
        )}
      </button>

      {hasChildren && open && (
        <div className="mt-0.5 ml-4 pl-3 border-l border-[var(--border)] space-y-0.5">
          {item.children!.map((child) => (
            <button
              key={child.key}
              onClick={() => onNav(child.key)}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-[12.5px] transition-colors ${
                active === child.key
                  ? "bg-[var(--muted)] text-[var(--foreground)] font-medium"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <span>{child.label}</span>
              {child.badge && (
                <span className="text-[10px] bg-brand text-white px-1.5 py-0.5 rounded font-semibold">{child.badge}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ active, onNav, open, onClose }: {
  active: string;
  onNav: (k: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer panel */}
      <aside
        className="shell fixed top-0 left-0 z-50 h-full flex flex-col bg-[var(--card)] border-r border-[var(--border)] transition-transform duration-300 ease-in-out"
        style={{ width: 260, transform: open ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Header */}
        <div className="h-[52px] px-4 flex items-center justify-between border-b border-[var(--border)] shrink-0">
          <p className="text-[14px] font-semibold text-[var(--foreground)] leading-tight">Northstar Recovery</p>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="px-3 text-[10px] font-semibold text-brand uppercase tracking-widest mb-2">Main</p>
          {NAV_ITEMS.map((item) => (
            <NavGroup
              key={item.key}
              item={item}
              active={active}
              onNav={(k) => { onNav(k); onClose(); }}
            />
          ))}

          <div className="pt-4">
            <p className="px-3 text-[10px] font-semibold text-brand uppercase tracking-widest mb-2">System</p>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
              <span className="text-[var(--muted-foreground)] shrink-0"><Icon d={ICONS.settings} size={15} /></span>
              Settings
            </button>
          </div>
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[var(--muted)] cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-white text-[11px] font-semibold">MK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[var(--foreground)] truncate">Marcus Klein</p>
              <p className="text-[10px] text-[var(--muted-foreground)] truncate">Admin · Collections</p>
            </div>
            <span className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors shrink-0">
              <Icon d={ICONS.chevronDown} size={13} />
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────
const KPI_DATA = [
  {
    label: "Total Collected",
    value: "$4,827,350",
    change: "+12.4%",
    changeDir: "up",
    sub: "vs last month",
    color: "emerald",
    icon: ICONS.dollar,
  },
  {
    label: "Active Debtors",
    value: "1,284",
    change: "+8",
    changeDir: "up",
    sub: "this week",
    color: "blue",
    icon: ICONS.debtors,
  },
  {
    label: "New Leads",
    value: "342",
    change: "-5.2%",
    changeDir: "down",
    sub: "vs last month",
    color: "amber",
    icon: ICONS.leads,
  },
  {
    label: "Collection Rate",
    value: "68.3%",
    change: "+2.1%",
    changeDir: "up",
    sub: "30-day avg",
    color: "violet",
    icon: ICONS.trendUp,
  },
];

function KpiCard({ label, value, change, changeDir, sub, color, icon }: typeof KPI_DATA[0]) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-500",
    blue: "text-brand",
    amber: "text-amber-500",
    violet: "text-violet-500",
  };
  const tileMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    blue: "bg-brand/10 text-brand",
    amber: "bg-amber-500/10 text-amber-500",
    violet: "bg-violet-500/10 text-violet-500",
  };
  return (
    <Card className="px-5 py-4 hover:border-[var(--ring)] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[15px] font-medium text-[var(--muted-foreground)]">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${tileMap[color]}`}>
          <Icon d={icon} size={14} />
        </span>
      </div>
      <p className={`text-2xl font-semibold tracking-tight mb-1 ${colorMap[color]}`}>{value}</p>
      <div className="flex items-center gap-1.5">
        <span className={`text-[14px] font-medium flex items-center gap-0.5 ${changeDir === "up" ? "text-emerald-500" : "text-red-500"}`}>
          <Icon d={changeDir === "up" ? ICONS.arrowUp : ICONS.arrowDown} size={11} />
          {change}
        </span>
        <span className="text-[14px] text-[var(--muted-foreground)]">{sub}</span>
      </div>
    </Card>
  );
}

// ── Sparkline (CSS-based) ─────────────────────────────────────────────────────
function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 40" className="w-full h-8" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Debtors Table ─────────────────────────────────────────────────────────────
const DEBTORS = [
  { id: "DBT-4821", name: "Harrington & Co.", agent: "Sarah Okafor", amount: "$84,200", due: "2026-09-12", status: "Active", priority: "High" },
  { id: "DBT-4820", name: "Westfield Group", agent: "Daniel Reeves", amount: "$231,500", due: "2026-09-03", status: "In Dispute", priority: "Critical" },
  { id: "DBT-4819", name: "Monica Tran", agent: "James Patel", amount: "$12,750", due: "2026-10-01", status: "Active", priority: "Medium" },
  { id: "DBT-4818", name: "Nordic Logistics AB", agent: "Sarah Okafor", amount: "$557,000", due: "2026-08-28", status: "Overdue", priority: "Critical" },
  { id: "DBT-4817", name: "Calloway Retail", agent: "Nina Alvarez", amount: "$38,400", due: "2026-09-19", status: "Active", priority: "Low" },
  { id: "DBT-4816", name: "Summit Capital LLC", agent: "Daniel Reeves", amount: "$1,200,000", due: "2026-08-30", status: "Overdue", priority: "Critical" },
  { id: "DBT-4815", name: "Priya Mehta", agent: "James Patel", amount: "$7,900", due: "2026-10-15", status: "Promise", priority: "Low" },
];

const STATUS_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Active: "success",
  Overdue: "danger",
  "In Dispute": "warning",
  Promise: "info",
  Resolved: "outline",
};

const PRIORITY_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Critical: "danger",
  High: "warning",
  Medium: "info",
  Low: "default",
};

function DebtorsTable() {
  return (
    <Card className="overflow-hidden">
      <div className="section-head flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-[16px] font-semibold text-brand">Active Accounts</h3>
          <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">1,284 total · showing recent</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary">
            <Icon d={ICONS.filter} size={12} />
            Filter
          </button>
          <button className="btn btn-primary">
            + New Account
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Account ID", "Debtor", "Agent", "Amount", "Due Date", "Status", "Priority"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[13px] font-semibold text-brand uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEBTORS.map((row, i) => (
              <tr key={row.id} className={`border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors cursor-pointer ${i === DEBTORS.length - 1 ? "border-0" : ""}`}>
                <td className="px-4 py-3.5 text-[15px] text-brand font-semibold">{row.id}</td>
                <td className="px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{row.name}</td>
                <td className="px-4 py-3.5 text-[15px] text-[var(--muted-foreground)]">{row.agent}</td>
                <td className="px-4 py-3.5 text-[15px] font-semibold text-[var(--foreground)]">{row.amount}</td>
                <td className="px-4 py-3.5 text-[15px] text-[var(--muted-foreground)]">{formatUSDate(row.due)}</td>
                <td className="px-4 py-3.5"><Badge label={row.status} variant={STATUS_BADGE[row.status]} className="text-[14px]" /></td>
                <td className="px-4 py-3.5"><Badge label={row.priority} variant={PRIORITY_BADGE[row.priority]} className="text-[14px]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── Collection Trend Chart (SVG) ──────────────────────────────────────────────
const CHART_DATA = {
  monthly: [
    { label: "Mar", collected: 320, target: 400 },
    { label: "Apr", collected: 445, target: 400 },
    { label: "May", collected: 380, target: 420 },
    { label: "Jun", collected: 510, target: 440 },
    { label: "Jul", collected: 490, target: 460 },
    { label: "Aug", collected: 612, target: 480 },
  ],
  weekly: [
    { label: "W1", collected: 118, target: 130 },
    { label: "W2", collected: 142, target: 130 },
    { label: "W3", collected: 109, target: 135 },
    { label: "W4", collected: 157, target: 135 },
    { label: "W5", collected: 134, target: 140 },
    { label: "W6", collected: 163, target: 140 },
    { label: "W7", collected: 148, target: 145 },
    { label: "W8", collected: 178, target: 145 },
  ],
};

function CollectionChart() {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const data = CHART_DATA[view];
  const chartH = 100;
  const chartW = 100;
  const maxVal = Math.ceil(Math.max(...data.map(d => Math.max(d.collected, d.target))) * 1.2);

  const toPoints = (values: number[]) =>
    values.map((v, i) => `${(i / (values.length - 1)) * chartW},${chartH - (v / maxVal) * chartH}`).join(" ");

  const collected = data.map(d => d.collected);
  const targets = data.map(d => d.target);

  const areaPath =
    collected.map((v, i) => {
      const x = (i / (collected.length - 1)) * chartW;
      const y = chartH - (v / maxVal) * chartH;
      return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
    }).join(" ") + ` L ${chartW},${chartH} L 0,${chartH} Z`;

  return (
    <Card className="overflow-hidden">
      <div className="section-head flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-[16px] font-semibold text-brand">Collection Trend</h3>
          <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">
            {view === "monthly" ? "Monthly collected vs target (thousands)" : "Weekly collected vs target (thousands)"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-[14px]">
            <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]"><span className="w-3 h-0.5 bg-brand inline-block rounded" />Collected</span>
            <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]"><span className="w-3 h-0.5 bg-zinc-400 inline-block rounded" />Target</span>
          </div>
          <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-[var(--muted)] ml-2">
            {(["monthly", "weekly"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
              className={`text-[14px] font-medium px-2.5 py-1 rounded capitalize transition-all duration-150 ${
                  view === v
                    ? "bg-[var(--brand)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {v === "monthly" ? "Monthly" : "Weekly"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 py-5">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-36" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line key={t} x1="0" y1={chartH * t} x2={chartW} y2={chartH * t} stroke="var(--border)" strokeWidth="0.5" />
          ))}
          <path d={areaPath} fill="url(#areaGrad)" />
          <polyline points={toPoints(targets)} fill="none" stroke="var(--ring)" strokeWidth="0.8" strokeDasharray="2,2" />
          <polyline points={toPoints(collected)} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {collected.map((v, i) => (
            <circle key={i} cx={(i / (collected.length - 1)) * chartW} cy={chartH - (v / maxVal) * chartH} r="1.5" fill="#3b82f6" />
          ))}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((d) => (
            <span key={d.label} className="text-[13px] text-[var(--muted-foreground)]">{d.label}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── Agent Performance ─────────────────────────────────────────────────────────
const COLLECTORS = [
  { name: "Sarah Okafor", metric: 74, value: "$842K", label: "Rate" },
  { name: "Daniel Reeves", metric: 69, value: "$712K", label: "Rate" },
  { name: "James Patel", metric: 81, value: "$610K", label: "Rate" },
  { name: "Nina Alvarez", metric: 65, value: "$389K", label: "Rate" },
];

const SALESPEOPLE = [
  { name: "Ethan Rousseau", metric: 88, value: "52 leads", label: "Conv." },
  { name: "Layla Andersen", metric: 76, value: "44 leads", label: "Conv." },
  { name: "Marcus Tan", metric: 63, value: "31 leads", label: "Conv." },
  { name: "Priya Nwosu", metric: 71, value: "38 leads", label: "Conv." },
];

const GRADIENT_COLORS = [
  "from-brand/60 to-indigo-600/60",
  "from-violet-500/60 to-purple-600/60",
  "from-emerald-500/60 to-teal-600/60",
  "from-amber-500/60 to-orange-600/60",
];

function AgentPerformance() {
  const [tab, setTab] = useState<"collectors" | "sales">("collectors");
  const data = tab === "collectors" ? COLLECTORS : SALESPEOPLE;
  const barColor = tab === "collectors" ? "var(--brand)" : "var(--st-violet)";

  return (
    <Card>
      <div className="section-head px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-brand">Agent Performance</h3>
          <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-[var(--muted)]">
            <button
              onClick={() => setTab("collectors")}
              className={`text-[14px] font-medium px-2.5 py-1 rounded transition-all duration-150 ${
                tab === "collectors"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Collectors
            </button>
            <button
              onClick={() => setTab("sales")}
              className={`text-[14px] font-medium px-2.5 py-1 rounded transition-all duration-150 ${
                tab === "sales"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Sales
            </button>
          </div>
        </div>
        <p className="text-[14px] text-[var(--muted-foreground)] mt-1">
          {tab === "collectors" ? "Collection rate · this month" : "Lead conversion · this month"}
        </p>
      </div>
      <div className="px-5 py-3 divide-y divide-[var(--border)]">
        {data.map((a, i) => (
          <div key={a.name} className="py-3 flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${GRADIENT_COLORS[i]} flex items-center justify-center shrink-0`}>
              <span className="text-white text-[9px] font-semibold">{a.name.split(" ").map(n => n[0]).join("")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[15px] font-medium text-[var(--foreground)] truncate">{a.name}</p>
                <p className="text-[14px] text-[var(--muted-foreground)] shrink-0 ml-2">{a.metric}%</p>
              </div>
              <div className="w-full h-1 bg-[var(--muted)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${a.metric}%`, background: barColor }} />
              </div>
            </div>
            <p className="text-[15px] font-semibold text-[var(--muted-foreground)] shrink-0 w-16 text-right">{a.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Status Breakdown ──────────────────────────────────────────────────────────
const STATUS_BREAKDOWN = [
  { label: "Active", value: 641, pct: 50, color: "var(--st-green)" },
  { label: "Overdue", value: 257, pct: 20, color: "var(--st-red)" },
  { label: "Promise", value: 192, pct: 15, color: "var(--st-violet)" },
  { label: "In Dispute", value: 128, pct: 10, color: "var(--st-amber)" },
  { label: "Resolved", value: 66, pct: 5, color: "var(--st-blue)" },
];

function StatusBreakdown() {
  return (
    <Card>
      <div className="section-head px-5 py-4 border-b border-[var(--border)]">
        <h3 className="text-[16px] font-semibold text-brand">Accounts Status</h3>
        <p className="text-[14px] text-[var(--muted-foreground)] mt-0.5">1,284 total accounts</p>
      </div>
      <div className="px-5 py-4">
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
          {STATUS_BREAKDOWN.map((s) => (
            <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} className="h-full" />
          ))}
        </div>
        <div className="space-y-2.5">
          {STATUS_BREAKDOWN.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                <span className="text-[15px] text-[var(--muted-foreground)]">{s.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[var(--muted-foreground)]">{s.pct}%</span>
                <span className="text-[15px] font-semibold text-[var(--foreground)] w-8 text-right">{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── Top Header ────────────────────────────────────────────────────────────────
const SEARCH_NAMES = [
  ["Harrington", "Cole"],
  ["Westfield", "Group"],
  ["Monica", "Tran"],
  ["Nordic", "Logistics"],
  ["Calloway", "Retail"],
  ["Summit", "Capital"],
  ["Priya", "Mehta"],
  ["Redwood", "Partners"],
  ["Amelia", "Stone"],
  ["Brightline", "Medical"],
] as const;

const SEARCH_RESULTS = Array.from({ length: 100 }, (_, index) => {
  const [firstCompany, last] = SEARCH_NAMES[index % SEARCH_NAMES.length];
  const type = (["Lead", "Client", "Account", "Attorney"] as const)[index % 4];
  const statusByType = {
    Lead: ["New", "Contacted", "Qualified"],
    Client: ["Active", "Under Review", "Inactive"],
    Account: ["Active", "Overdue", "In Dispute", "Resolved"],
    Attorney: ["Active", "Verified", "Pending"],
  };
  const group = Math.floor(index / SEARCH_NAMES.length);
  const accountPrefix = { Lead: "LD", Client: "CL", Account: "AC", Attorney: "AT" }[type];

  return {
    id: index + 1,
    firstCompany,
    last,
    name: `${firstCompany} ${last}${group ? ` ${group + 1}` : ""}`,
    type,
    status: statusByType[type][index % statusByType[type].length],
    accountNumber: `${accountPrefix}-${String(24001 + index).padStart(6, "0")}`,
  };
});

const SEARCH_STATUS_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Active: "success",
  New: "info",
  Contacted: "default",
  Qualified: "success",
  "Under Review": "warning",
  Inactive: "outline",
  Overdue: "danger",
  "In Dispute": "warning",
  Resolved: "outline",
  Verified: "success",
  Pending: "warning",
};

const SEARCH_TYPE_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Lead: "info",
  Client: "success",
  Account: "warning",
  Attorney: "default",
};

function GlobalSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [searchScope, setSearchScope] = useState("Global");
  const [firstCompany, setFirstCompany] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResults = SEARCH_RESULTS.filter((result) => {
    const scopeType = {
      Global: null,
      Leads: "Lead",
      Clients: "Client",
      Accounts: "Account",
      Legal: "Attorney",
    }[searchScope];
    const scopeMatch = scopeType === null || result.type === scopeType;
    const firstMatch = result.firstCompany.toLowerCase().includes(firstCompany.toLowerCase());
    const lastMatch = result.last.toLowerCase().includes(lastName.toLowerCase());
    const accountMatch = result.accountNumber.toLowerCase().includes(accountNumber.toLowerCase());
    const searchable = `${result.name} ${result.type} ${result.status} ${result.accountNumber}`.toLowerCase();
    return scopeMatch && firstMatch && lastMatch && accountMatch && searchable.includes(globalQuery.toLowerCase());
  });

  const pageCount = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const safePage = Math.min(currentPage, pageCount);
  const pageStart = (safePage - 1) * pageSize;
  const visibleResults = filteredResults.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchScope, firstCompany, lastName, accountNumber, globalQuery, pageSize]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-start justify-center px-4 pt-16 pb-6 transition-all duration-200 ${
        open ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-search-title"
        className={`relative z-10 flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${
          open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 id="global-search-title" className="text-[17px] font-semibold text-brand">Global Search</h2>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
              Search across leads, clients, accounts, and attorneys
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-brand">Search in</span>
              <select
                value={searchScope}
                onChange={(event) => setSearchScope(event.target.value)}
                className="h-8 min-w-28 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-[13px] font-medium text-[var(--foreground)] outline-none transition-colors focus:border-brand"
              >
                {["Global", "Leads", "Clients", "Accounts", "Legal"].map((scope) => (
                  <option key={scope} value={scope}>{scope}</option>
                ))}
              </select>
            </label>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Close global search"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border-b border-[var(--border)] bg-[var(--background)]/40 px-5 py-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "First / company name", value: firstCompany, setter: setFirstCompany, placeholder: "e.g. Westfield" },
              { label: "Last name", value: lastName, setter: setLastName, placeholder: "e.g. Group" },
              { label: "Account number", value: accountNumber, setter: setAccountNumber, placeholder: "e.g. CL-024002" },
              { label: "Global search", value: globalQuery, setter: setGlobalQuery, placeholder: "Search all fields" },
            ].map((field, index) => (
              <label key={field.label} className="block">
                <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-brand">
                  {field.label}
                </span>
                <div className="relative">
                  {index === 3 && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                      <Icon d={ICONS.search} size={13} />
                    </span>
                  )}
                  <input
                    autoFocus={open && index === 0}
                    value={field.value}
                    onChange={(event) => field.setter(event.target.value)}
                    placeholder={field.placeholder}
                    className={`h-9 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)]/70 focus:border-brand focus:ring-2 focus:ring-brand/10 ${
                      index === 3 ? "pl-9" : ""
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="section-head flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <p className="text-[14px] text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">{filteredResults.length}</span> results found
          </p>
          <label className="flex items-center gap-2 text-[13px] text-[var(--muted-foreground)]">
            Results per page
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="h-8 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 text-[13px] font-medium text-[var(--foreground)] outline-none transition-colors focus:border-brand"
            >
              {[25, 50, 75, 100].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[var(--card)]">
              <tr className="border-b border-[var(--border)]">
                {["Name", "Type", "Status", "Account Number"].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-widest text-brand">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleResults.map((result) => (
                <tr key={result.id} className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--muted)]">
                  <td className="px-5 py-3">
                    <p className="text-[14px] font-medium text-[var(--foreground)]">{result.name}</p>
                  </td>
                  <td className="px-5 py-3">
                    <Badge label={result.type} variant={SEARCH_TYPE_BADGE[result.type]} />
                  </td>
                  <td className="px-5 py-3">
                    <Badge label={result.status} variant={SEARCH_STATUS_BADGE[result.status]} />
                  </td>
                  <td className="px-5 py-3 text-[14px] font-semibold text-brand">{result.accountNumber}</td>
                </tr>
              ))}
              {visibleResults.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center">
                    <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                      <Icon d={ICONS.search} size={16} />
                    </div>
                    <p className="text-[14px] font-medium text-[var(--foreground)]">No matching results</p>
                    <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">Try adjusting one or more search fields.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3">
          <p className="text-[13px] text-[var(--muted-foreground)]">
            {filteredResults.length === 0
              ? "No results to display"
              : `Showing ${pageStart + 1}–${Math.min(pageStart + pageSize, filteredResults.length)} of ${filteredResults.length}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-[13px] font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-7 min-w-7 rounded-md px-2 text-[13px] font-medium transition-colors ${
                  safePage === pageNumber
                    ? "bg-brand text-white"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
              disabled={safePage === pageCount}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-[13px] font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TopBar({ theme, toggleTheme, onOpenSidebar, onOpenCalendar, calendarActive, pageTitle, pageSub }: {
  theme: "dark" | "light";
  toggleTheme: () => void;
  onOpenSidebar: () => void;
  onOpenCalendar: () => void;
  calendarActive: boolean;
  pageTitle: string;
  pageSub: string;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="shell h-[52px] shrink-0 border-b border-[var(--border)] flex items-center justify-between px-4 bg-[var(--card)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Open menu"
          >
            <Icon d={ICONS.menu} size={16} />
          </button>
          <div>
            <h1 className="text-[14px] font-semibold text-brand">{pageTitle}</h1>
            <p className="text-[11px] text-[var(--muted-foreground)]">{pageSub}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Global search (⌘K)"
            aria-label="Open global search"
          >
            <Icon d={ICONS.search} size={15} />
          </button>
          <button
            onClick={onOpenCalendar}
            className={`p-2 rounded-md transition-colors ${
              calendarActive
                ? "bg-[var(--muted)] text-[var(--foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            title="Calendar"
            aria-label="Open calendar"
            aria-current={calendarActive ? "page" : undefined}
          >
            <Icon d={ICONS.calendar} size={15} />
          </button>
          <button className="relative p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <Icon d={ICONS.bell} size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
          </button>
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <Icon d={theme === "dark" ? ICONS.sun : ICONS.moon} size={15} />
          </button>
        </div>
      </header>
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

// ── Client Page ───────────────────────────────────────────────────────────────
const CLIENT = {
  name: "Westfield Group",
  industry: "Commercial Real Estate",
  businessType: "Real Estate Company",
  status: "Active",
  substatus: "Under Review",
  opener: "Nina Alvarez",
  closer: "Daniel Reeves",
  since: "Mar 2023",
  website: "westfieldgroup.com",
  // Corporate address
  address: "350 Park Avenue, Suite 2400",
  city: "New York",
  state: "NY",
  zipCode: "10022",
  country: "United States",
  phone: "+1 (212) 555-0147",
  email: "finance@westfieldgroup.com",
  // KPIs
  outstanding: "$231,500",
  totalDebt: "$874,200",
  collectionRate: "62%",
  openAccounts: 3,
  tags: ["High Value", "Corporate", "Disputed"],
};

const ACCOUNT_DETAILS = {
  debtor: "Westfield Tower B LLC",
  coDebtors: [
    { name: "Gregory Westfield", reported: true },
    { name: "Sandra Lim", reported: false },
  ],
  accountNumber: "DBT-4791",
  totalBalance: "$312,700",
  reported: true,
  age: "14 months",
  status: "Overdue",
  substatus: "Legal Review",
  collector: "Sarah Okafor",
  coCollector: "Daniel Reeves",
  attorney: "Marcus Reid",
  legalAssistant: "Avery Collins",
  tags: ["High Balance", "Commercial", "Legal"],
};

const ACCOUNT_PROFILE_DETAILS = {
  clientName: "Westfield Group",
  creditor: "Empire Commercial Holdings",
  accountType: "Commercial",
  originatedDate: "Mar 14, 2025",
  lastServiceDate: "Nov 30, 2025",
  firstDelinquency: "Jan 15, 2026",
  chargedOffDate: "Jun 30, 2026",
  nextWorkDate: "Sep 10, 2026",
  agreementDate: "Mar 14, 2025",
  statuteDate: "Jan 15, 2030",
  principalAmount: "$412,700",
  interest: "$28,450",
  costsFees: "$6,550",
  payments: "$135,000",
  settlementAmount: "$285,000",
  linkedBalance: "$89,400",
  linkedAccounts: ["DBT-4820", "DBT-4762"],
};

const ACCOUNT_DEBTOR = {
  firstName: "Gregory",
  middleName: "Alexander",
  lastName: "Westfield",
  ssn: "***-**-4821",
  dateOfBirth: "May 18, 1974",
  addresses: [
    "350 Park Avenue, Suite 2400, New York, NY 10022",
    "18 Meadow Lane, Greenwich, CT 06830",
  ],
  phoneNumbers: ["+1 (212) 555-0101", "+1 (646) 555-0198"],
  emails: ["g.westfield@westfieldgroup.com", "greg.westfield@gmail.com"],
};

const ASSIGNEE_ATTORNEY = {
  firm: {
    name: "Reid, Carter & Associates LLP",
    taxId: "13-4829107",
    email: "intake@reidcarterlaw.com",
    phone: "+1 (212) 555-0165",
    fax: "+1 (212) 555-0166",
    street: "110 East 42nd Street, Floor 18",
    city: "New York",
    state: "NY",
    zipCode: "10017",
    licensedIn: ["New York", "New Jersey", "Connecticut"],
    practiceAreas: ["Commercial Collections", "Consumer Collections", "Creditors’ Rights"],
  },
  attorney: {
    firstName: "Marcus",
    lastName: "Reid",
    phoneNumbers: ["+1 (212) 555-0165", "+1 (917) 555-0114"],
    emails: ["m.reid@reidcarterlaw.com", "legal@reidcarterlaw.com"],
    address: "110 East 42nd Street, Floor 18",
    city: "New York",
    state: "NY",
    zipCode: "10017",
    barNumber: "NY-4982176",
    licensedIn: ["New York", "New Jersey"],
    practiceAreas: ["Commercial Collections", "Litigation"],
  },
};

const VERIFIED_EMPLOYER = {
  companyName: "Westfield Group",
  title: "Chief Executive Officer",
  contactFirstName: "Sandra",
  contactLastName: "Lim",
  emails: ["s.lim@westfieldgroup.com", "payroll@westfieldgroup.com"],
  phoneNumbers: ["+1 (212) 555-0182", "+1 (917) 555-0134"],
};

const ACCOUNT_PAGE_TABS = [
  { key: "overview", label: "Overview" },
  { key: "financials", label: "Financials" },
  { key: "settlement", label: "Payment Plan" },
  { key: "documents", label: "Documents" },
  { key: "legal", label: "Legal Details" },
  { key: "allocations", label: "Transaction Allocations" },
  { key: "reminders", label: "Reminders" },
  { key: "sessions", label: "Sessions" },
] as const;

const CLIENT_TAG_STYLES = [
  "border-transparent bg-[var(--brand)] text-white",
  "border-transparent bg-[var(--st-violet)] text-white",
  "border-transparent bg-[var(--st-warning)] text-white",
];

const CLIENT_ACCOUNTS = [
  { id: "DBT-4820", name: "Q4 Invoice Dispute", desc: "Q4 Invoice Dispute", amount: "$231,500", totalCollected: "$0", currentBalance: "$231,500", due: "2026-09-03", status: "In Dispute", agent: "Daniel Reeves" },
  { id: "DBT-4791", name: "Lease Arrears — Tower B", desc: "Lease Arrears — Tower B", amount: "$412,700", totalCollected: "$100,000", currentBalance: "$312,700", due: "2026-07-15", status: "Overdue", agent: "Sarah Okafor" },
  { id: "DBT-4762", name: "Service Fee Balance", desc: "Service Fee Balance", amount: "$230,000", totalCollected: "$230,000", currentBalance: "$0", due: "2026-06-01", status: "Resolved", agent: "Daniel Reeves" },
  { id: "DBT-4738", name: "Maintenance Recovery", desc: "Maintenance Recovery", amount: "$87,400", totalCollected: "$87,400", currentBalance: "$0", due: "2026-04-20", status: "Resolved", agent: "Nina Alvarez" },
];

const CLIENT_ACCOUNT_SUMMARY = [
  { label: "Total Accounts", value: "4", color: "text-[var(--foreground)]" },
  { label: "Total Accounts Collected", value: "2", color: "text-emerald-500" },
  { label: "Opened Accounts", value: "2", color: "text-brand" },
  { label: "Closed Accounts", value: "2", color: "text-[var(--foreground)]" },
  { label: "Legal Accounts", value: "1", color: "text-amber-500" },
  { label: "Total Face Value", value: "$961,600", color: "text-[var(--foreground)]" },
  { label: "Total Amount Collected", value: "$317,400", color: "text-emerald-500" },
  { label: "Client Portion", value: "$238,050", color: "text-brand" },
  { label: "Agency Portion", value: "$79,350", color: "text-violet-500" },
  { label: "Client Owes", value: "$28,450", color: "text-red-500" },
  { label: "Agency Owes", value: "$12,760", color: "text-amber-500" },
  { label: "Last Assignment Date", value: "Sep 2, 2026", color: "text-[var(--foreground)]" },
];

const ACCOUNT_BILLING = [
  { accountNumber: "DBT-4820", status: "Due", idCheckNumber: "CHK-88421", description: "Collection commission", attorneyFees: "$1,250", agencyFees: "$4,600", clientFees: "$1,900", convenienceFees: "$700", attorneyOwes: "$0", agencyOwes: "$1,200", clientOwes: "$7,250" },
  { accountNumber: "DBT-4791", status: "Paid", idCheckNumber: "ACH-29018", description: "Payment processing fee", attorneyFees: "$800", agencyFees: "$2,100", clientFees: "$0", convenienceFees: "$300", attorneyOwes: "$450", agencyOwes: "$0", clientOwes: "$0" },
  { accountNumber: "DBT-4762", status: "Paid", idCheckNumber: "CHK-87904", description: "Recovery commission", attorneyFees: "$2,500", agencyFees: "$6,900", clientFees: "$1,500", convenienceFees: "$600", attorneyOwes: "$0", agencyOwes: "$850", clientOwes: "$0" },
  { accountNumber: "DBT-4738", status: "Due", idCheckNumber: "ACH-28776", description: "Final account fee", attorneyFees: "$650", agencyFees: "$2,420", clientFees: "$1,000", convenienceFees: "$300", attorneyOwes: "$250", agencyOwes: "$710", clientOwes: "$3,410" },
];

const TOTAL_TINT: Record<string, string> = {
  "text-amber-500": "bg-[var(--st-warning)]",
  "text-red-500": "bg-[var(--st-danger)]",
  "text-emerald-500": "bg-[var(--st-success)]",
  "text-brand": "bg-[var(--brand)]",
  "text-[var(--foreground)]": "bg-[#52525b]",
};

const ACCOUNT_BILLING_TOTALS = [
  { label: "Total Attorney", value: "$5,200", color: "text-[var(--foreground)]" },
  { label: "Total Agency", value: "$16,020", color: "text-amber-500" },
  { label: "Total Client", value: "$4,400", color: "text-red-500" },
  { label: "Total", value: "$27,520", color: "text-brand" },
];

const LEGAL_BILLING = [
  { accountNumber: "DBT-4820", fullNameCompany: "Westfield Group", status: "Active", currentBalanceDue: "$231,500", statuteOfLimitation: "Sep 3, 2029", clientSent: "$12,000", agencySpent: "$4,800", totalPending: "$16,800", trustBalance: "$8,250" },
  { accountNumber: "DBT-4791", fullNameCompany: "Westfield Tower B LLC", status: "In Review", currentBalanceDue: "$312,700", statuteOfLimitation: "Jul 15, 2029", clientSent: "$9,500", agencySpent: "$3,650", totalPending: "$13,150", trustBalance: "$5,900" },
  { accountNumber: "DBT-4762", fullNameCompany: "Westfield Services Inc.", status: "Settled", currentBalanceDue: "$0", statuteOfLimitation: "Jun 1, 2029", clientSent: "$6,000", agencySpent: "$1,950", totalPending: "$0", trustBalance: "$2,400" },
];

const LEGAL_BILLING_TOTALS = [
  { label: "Agency Spent", value: "$10,400", color: "text-[var(--foreground)]" },
  { label: "Client Spent", value: "$27,500", color: "text-[var(--foreground)]" },
  { label: "Pending", value: "$29,950", color: "text-amber-500" },
  { label: "Client Trust Balance", value: "$16,550", color: "text-emerald-500" },
];

const CLIENT_CONTACTS = [
  {
    firstName: "Gregory", lastName: "Westfield",
    title: "CEO & Founder", primary: true, personalGuarantor: true,
    emails: [
      { label: "Work", value: "g.westfield@westfieldgroup.com" },
      { label: "Personal", value: "greg.westfield@gmail.com" },
    ],
    phones: [
      { label: "Direct", value: "+1 (212) 555-0101" },
      { label: "Mobile", value: "+1 (646) 555-0198" },
    ],
  },
  {
    firstName: "Sandra", lastName: "Lim",
    title: "CFO", primary: true, personalGuarantor: false,
    emails: [
      { label: "Work", value: "s.lim@westfieldgroup.com" },
    ],
    phones: [
      { label: "Direct", value: "+1 (212) 555-0182" },
      { label: "Mobile", value: "+1 (917) 555-0134" },
    ],
  },
  {
    firstName: "Marcus", lastName: "Reid",
    title: "Legal Counsel", primary: false, personalGuarantor: false,
    emails: [
      { label: "Work", value: "m.reid@westfieldgroup.com" },
      { label: "Legal", value: "mreid@reidlawgroup.com" },
    ],
    phones: [
      { label: "Office", value: "+1 (212) 555-0165" },
    ],
  },
  {
    firstName: "Tanya", lastName: "Brooks",
    title: "Accounts Payable", primary: false, personalGuarantor: true,
    emails: [
      { label: "Work", value: "t.brooks@westfieldgroup.com" },
    ],
    phones: [
      { label: "Direct", value: "+1 (212) 555-0193" },
      { label: "Mobile", value: "+1 (929) 555-0177" },
    ],
  },
];

const ACCOUNT_DOCUMENT_FOLDERS = [
  {
    name: "Account Agreements",
    files: [
      { name: "Lease Agreement — Tower B.pdf", size: "1.2 MB", date: "Mar 14, 2025", type: "Contract" },
      { name: "Personal Guarantee — G. Westfield.pdf", size: "318 KB", date: "Mar 14, 2025", type: "Agreement" },
    ],
  },
  {
    name: "Statements & Payments",
    files: [
      { name: "Arrears_Statement_Jun2026.pdf", size: "142 KB", date: "Jun 30, 2026", type: "Statement" },
      { name: "Check_CHK-10421.jpg", size: "486 KB", date: "Mar 5, 2026", type: "Payment" },
      { name: "ACH_Receipt_ACH-29018.pdf", size: "64 KB", date: "Aug 26, 2026", type: "Payment" },
    ],
  },
  {
    name: "Legal Filings",
    files: [
      { name: "Summons_and_Complaint.pdf", size: "742 KB", date: "Feb 10, 2026", type: "Legal" },
      { name: "Affidavit_of_Service.pdf", size: "201 KB", date: "Jul 12, 2026", type: "Legal" },
      { name: "Notice_of_Arrears_Aug2026.pdf", size: "88 KB", date: "Aug 19, 2026", type: "Correspondence" },
    ],
  },
];

const CLIENT_DOCUMENT_FOLDERS = [
  {
    name: "Contracts & Agreements",
    files: [
      { name: "Master Service Agreement.pdf", size: "842 KB", date: "Mar 14, 2023", type: "Contract" },
      { name: "Debt Placement Agreement.pdf", size: "516 KB", date: "Mar 18, 2023", type: "Agreement" },
      { name: "Fee Schedule 2026.pdf", size: "94 KB", date: "Jan 2, 2026", type: "Schedule" },
    ],
  },
  {
    name: "Invoices & Statements",
    files: [
      { name: "Invoice_Q4_2025.pdf", size: "124 KB", date: "Jan 8, 2026", type: "Invoice" },
      { name: "Account_Statement_Aug2026.pdf", size: "188 KB", date: "Aug 26, 2026", type: "Statement" },
      { name: "Payment_History_2026.xlsx", size: "72 KB", date: "Aug 26, 2026", type: "Spreadsheet" },
    ],
  },
  {
    name: "Legal & Correspondence",
    files: [
      { name: "Dispute_Letter_Feb2026.pdf", size: "67 KB", date: "Feb 22, 2026", type: "Correspondence" },
      { name: "Payment_Plan_Draft.docx", size: "38 KB", date: "Aug 5, 2026", type: "Draft" },
      { name: "Counsel_Response_Aug2026.pdf", size: "213 KB", date: "Aug 19, 2026", type: "Legal" },
    ],
  },
];

const CLIENT_NOTES = [
  { id: 1, author: "Daniel Reeves", time: "Aug 28, 2026 · 10:14", text: "Spoke with Gregory Westfield. He acknowledged the Q4 invoice dispute and requested a revised payment schedule by Sep 10. Follow-up call booked.", source: "User note", important: true },
  { id: 2, author: "Sarah Okafor", time: "Aug 19, 2026 · 14:32", text: "Sent formal notice of arrears for Tower B lease. No response within 5 business days — escalating to legal.", source: "Automated", important: false },
  { id: 3, author: "Daniel Reeves", time: "Jul 30, 2026 · 09:55", text: "Reviewed account with legal team. Westfield's counsel claims $78K of the Q4 balance is double-billed. Documentation requested.", source: "User note", important: true },
  { id: 4, author: "Nina Alvarez", time: "Jul 3, 2026 · 11:00", text: "Maintenance Recovery account closed. $87,400 received in full. Client relationship in good standing for this account.", source: "Automated", important: false },
];

const ACCOUNT_NOTES = [
  { id: 1, author: "Sarah Okafor", time: "Aug 26, 2026 · 15:42", text: "Received $85,000 ACH installment under the payment plan. Debtor confirmed the next installment for Oct 1.", source: "User note", important: true },
  { id: 2, author: "Daniel Reeves", time: "Aug 19, 2026 · 14:32", text: "Formal notice of arrears sent for Tower B lease. No response within 5 business days — escalated to legal review.", source: "Automated", important: false },
  { id: 3, author: "Marcus Reid", time: "Jul 12, 2026 · 10:05", text: "Service of process completed on Westfield Tower B LLC. Court costs posted to the account.", source: "User note", important: true },
  { id: 4, author: "Sarah Okafor", time: "Mar 5, 2026 · 09:20", text: "Partial payment of $50,000 received by check CHK-10421. Remaining balance discussed with Gregory Westfield.", source: "Automated", important: false },
];

const ACCOUNT_REMINDERS = [
  { id: 1, description: "Confirm Oct 1 payment plan installment", priority: "High", repetition: "Monthly", dueDate: "Oct 1, 2026", endDate: "Mar 1, 2027", note: "Call Gregory Westfield if the ACH has not cleared by end of day." },
  { id: 2, description: "Check for answer to the complaint", priority: "Critical", repetition: "Once", dueDate: "Oct 14, 2026", endDate: "Oct 14, 2026", note: "If no answer is filed, ask Marcus Reid to move for default judgment." },
  { id: 3, description: "Review interest accrual", priority: "Medium", repetition: "Quarterly", dueDate: "Dec 31, 2026", endDate: "Dec 31, 2027", note: "Post the semi-annual interest and update the balance summary." },
];

const CLIENT_REMINDERS = [
  { id: 1, description: "Follow up on revised payment schedule", priority: "High", repetition: "Weekly", dueDate: "Sep 10, 2026", endDate: "Oct 8, 2026", note: "Call Gregory directly if no response is received by noon." },
  { id: 2, description: "Review Tower B arrears documentation", priority: "Critical", repetition: "Once", dueDate: "Sep 3, 2026", endDate: "Sep 3, 2026", note: "Confirm all lease statements are attached before legal review." },
  { id: 3, description: "Send monthly account statement", priority: "Medium", repetition: "Monthly", dueDate: "Sep 30, 2026", endDate: "Dec 31, 2026", note: "Include collected totals and all outstanding agency fees." },
  { id: 4, description: "Check promise-to-pay status", priority: "Low", repetition: "Every 2 weeks", dueDate: "Sep 14, 2026", endDate: "Nov 30, 2026", note: "Close reminder when the final installment clears." },
];

const CALENDAR_REMINDERS = [
  { id: 1, date: "2026-09-03", time: "10:00 AM", title: "Review Tower B arrears documentation", client: "Westfield Group", priority: "Critical" },
  { id: 2, date: "2026-09-10", time: "11:30 AM", title: "Follow up on revised payment schedule", client: "Westfield Group", priority: "High" },
  { id: 3, date: "2026-09-14", time: "9:00 AM", title: "Check promise-to-pay status", client: "Westfield Group", priority: "Low" },
  { id: 4, date: "2026-09-14", time: "11:30 AM", title: "Call Gregory regarding payment plan", client: "Westfield Group", priority: "High" },
  { id: 5, date: "2026-09-14", time: "2:00 PM", title: "Review legal account documents", client: "Westfield Group", priority: "Critical" },
  { id: 6, date: "2026-09-18", time: "3:30 PM", title: "Send collection progress update", client: "Westfield Group", priority: "Medium" },
  { id: 7, date: "2026-09-30", time: "4:00 PM", title: "Send monthly account statement", client: "Westfield Group", priority: "Medium" },
];

const CALENDAR_PRIORITY_STYLES: Record<string, string> = {
  Critical: "border-red-500/30 bg-red-500/10 text-red-500",
  High: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  Medium: "border-brand/30 bg-brand/10 text-brand",
  Low: "border-zinc-500/30 bg-zinc-500/10 text-[var(--muted-foreground)]",
};

type ReminderForm = {
  description: string;
  priority: string;
  repetition: string;
  dueDate: string;
  endDate: string;
  note: string;
  weekDays: string[];
  monthDays: string[];
};

const EMPTY_REMINDER_FORM: ReminderForm = {
  description: "",
  priority: "Medium",
  repetition: "Once",
  dueDate: "",
  endDate: "",
  note: "",
  weekDays: [],
  monthDays: [],
};

const WEEKDAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const NOTE_SOURCE_BADGE: Record<string, "default" | "info"> = {
  Automated: "default",
  "User note": "info",
};

function ClientKpi({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="flex-1 px-4 py-2.5 border-r border-[var(--border)] last:border-r-0">
      <p className="text-[12px] font-medium text-[var(--muted-foreground)] mb-0.5">{label}</p>
      <p className={`text-lg font-semibold leading-none mb-0.5 ${color}`}>{value}</p>
      <p className="text-[12px] text-[var(--muted-foreground)]">{sub}</p>
    </div>
  );
}

function NoteActions({
  important,
  onEdit,
  onToggleImportant,
  onDelete,
}: {
  important: boolean;
  onEdit: () => void;
  onToggleImportant: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  const runAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Open note actions"
        aria-expanded={open}
      >
        <Icon d={ICONS.moreH} size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl">
          <button
            onClick={() => runAction(onEdit)}
            className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[13px] text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            <Icon d={ICONS.edit} size={13} />
            Edit note
          </button>
          <button
            onClick={() => runAction(onToggleImportant)}
            className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[13px] text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            <span className={important ? "text-amber-500" : ""}><Icon d={ICONS.star} size={13} /></span>
            {important ? "Remove importance" : "Mark as important"}
          </button>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            onClick={() => runAction(onDelete)}
            className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[13px] text-red-500 transition-colors hover:bg-red-500/10"
          >
            <Icon d={ICONS.trash} size={13} />
            Delete note
          </button>
        </div>
      )}
    </div>
  );
}

function ReminderActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  const runAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Open reminder actions"
        aria-expanded={open}
      >
        <Icon d={ICONS.moreH} size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl">
          <button
            onClick={() => runAction(onEdit)}
            className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[13px] text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            <Icon d={ICONS.edit} size={13} />
            Edit reminder
          </button>
          <button
            onClick={() => runAction(onDelete)}
            className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[13px] text-red-500 transition-colors hover:bg-red-500/10"
          >
            <Icon d={ICONS.trash} size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function MultiSelectDropdown({
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
          <Icon d={ICONS.chevronDown} size={13} />
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
                  {!grid && active && <Icon d={ICONS.check} size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AddReminderModal({
  open,
  reminder,
  setReminder,
  scheduleError,
  clearScheduleError,
  onClose,
  onSubmit,
}: {
  open: boolean;
  reminder: ReminderForm;
  setReminder: (reminder: ReminderForm) => void;
  scheduleError: string;
  clearScheduleError: () => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-200 ${
        open ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!open}
    >
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <form
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-add-reminder-title"
        className={`relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 id="calendar-add-reminder-title" className="text-[18px] font-semibold text-brand">Add Reminder</h2>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Schedule a new reminder.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close add reminder">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 px-5 py-5">
          <label className="col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Description</span>
            <select required value={reminder.description} onChange={(event) => setReminder({ ...reminder, description: event.target.value })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand">
              <option value="" disabled>Select a reminder description</option>
              {["Follow up on revised payment schedule", "Review account documentation", "Send monthly account statement", "Check promise-to-pay status", "Schedule client follow-up call"].map((description) => <option key={description}>{description}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Priority</span>
            <select value={reminder.priority} onChange={(event) => setReminder({ ...reminder, priority: event.target.value })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand">
              {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Repetition</span>
            <select
              value={reminder.repetition}
              onChange={(event) => {
                const repetition = event.target.value;
                clearScheduleError();
                setReminder({
                  ...reminder,
                  repetition,
                  weekDays: repetition === "Weekly" || repetition === "Every 2 weeks" ? reminder.weekDays : [],
                  monthDays: repetition === "Monthly" ? reminder.monthDays : [],
                });
              }}
              className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
            >
              {["Once", "Daily", "Weekly", "Every 2 weeks", "Monthly", "Quarterly"].map((repetition) => <option key={repetition}>{repetition}</option>)}
            </select>
          </label>
          {(reminder.repetition === "Weekly" || reminder.repetition === "Every 2 weeks") && (
            <div className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Week</span>
              <MultiSelectDropdown
                label="Select one or more weekdays"
                options={WEEKDAY_OPTIONS.map((day) => ({ value: day, label: day }))}
                selected={reminder.weekDays}
                onChange={(weekDays) => { clearScheduleError(); setReminder({ ...reminder, weekDays }); }}
              />
            </div>
          )}
          {reminder.repetition === "Monthly" && (
            <div className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Month</span>
              <MultiSelectDropdown
                label="Select one or more days"
                grid
                options={Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))}
                selected={reminder.monthDays}
                onChange={(monthDays) => { clearScheduleError(); setReminder({ ...reminder, monthDays }); }}
              />
              <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">Missing dates in shorter months run on the month&apos;s final day.</p>
            </div>
          )}
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Due Date &amp; Time</span>
            <DateTimeInput required value={reminder.dueDate} onChange={(dueDate) => setReminder({ ...reminder, dueDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand" />
          </label>
          <label>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">End Date &amp; Time</span>
            <DateTimeInput required value={reminder.endDate} onChange={(endDate) => setReminder({ ...reminder, endDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand" />
          </label>
          <label className="col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Note</span>
            <textarea required rows={4} value={reminder.note} onChange={(event) => setReminder({ ...reminder, note: event.target.value })} placeholder="Add context or instructions" className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-brand" />
          </label>
          {scheduleError && <p className="col-span-2 text-[13px] font-medium text-red-500">{scheduleError}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-4">
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Add Reminder</button>
        </div>
      </form>
    </div>
  );
}

function DocumentsSection({ folders }: { folders: typeof CLIENT_DOCUMENT_FOLDERS }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-brand">Documents</h3>
          <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">
            {folders.length} folders · {folders.reduce((total, folder) => total + folder.files.length, 0)} files
          </p>
        </div>
        <button type="button" className="btn btn-primary">
          <Icon d={ICONS.plus} size={13} />Upload
        </button>
      </div>
      <div className="space-y-3">
        {folders.map((folder) => (
          <DocumentFolder key={folder.name} folder={folder} />
        ))}
      </div>
    </div>
  );
}

function DocumentFolder({ folder }: { folder: typeof CLIENT_DOCUMENT_FOLDERS[number] }) {
  const [open, setOpen] = useState(true);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[var(--muted)]"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-500">
          <Icon d={ICONS.folder} size={17} />
        </span>
        <div className="flex-1">
          <p className="text-[16px] font-semibold text-[var(--foreground)]">{folder.name}</p>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{folder.files.length} files</p>
        </div>
        <span className={`text-[var(--muted-foreground)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <Icon d={ICONS.chevronDown} size={15} />
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--border)]">
          {folder.files.length === 0 && (
            <p className="px-5 py-4 text-[14px] text-[var(--muted-foreground)]">No files yet</p>
          )}
          {folder.files.map((file, index) => (
            <div
              key={file.name}
              className={`group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--muted)] ${
                index < folder.files.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-brand/20 bg-brand/10 text-brand">
                <Icon d={ICONS.file} size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-[var(--foreground)]">{file.name}</p>
                <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{file.size} · {file.date}</p>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-[var(--muted-foreground)] opacity-0 transition-all hover:bg-[var(--card)] hover:text-[var(--foreground)] group-hover:opacity-100"
                aria-label={`Download ${file.name}`}
              >
                <Icon d={ICONS.download} size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

type Note = typeof CLIENT_NOTES[number];

const CURRENT_USER = "Marcus Klein";

function NotesSection({ initialNotes, limit }: { initialNotes: Note[]; limit?: number }) {
  const [notes, setNotes] = useState(initialNotes);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [importantNotesOnly, setImportantNotesOnly] = useState(false);
  const [noteSort, setNoteSort] = useState<"newest" | "oldest" | "author-asc" | "author-desc">("newest");
  const [noteAuthor, setNoteAuthor] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ text: "", important: false });

  useEffect(() => {
    if (!addOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setAddOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addOpen]);

  const addNote = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.text.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
    const id = notes.reduce((highest, note) => Math.max(highest, note.id), 0) + 1;
    setNotes((current) => [{ id, author: CURRENT_USER, time, text, source: "User note", important: draft.important }, ...current]);
    setDraft({ text: "", important: false });
    setImportantNotesOnly(false);
    setNoteAuthor("all");
    setNoteSort("newest");
    setAddOpen(false);
  };

  const editNote = (id: number, text: string) => {
    setEditingNoteId(id);
    setEditDraft(text);
  };

  const saveNote = () => {
    setNotes((current) => current.map((note) => note.id === editingNoteId ? { ...note, text: editDraft } : note));
    setEditingNoteId(null);
  };

  const toggleImportantNote = (id: number) => {
    setNotes((current) => current.map((note) => note.id === id ? { ...note, important: !note.important } : note));
  };

  const deleteNote = (id: number) => {
    setNotes((current) => current.filter((note) => note.id !== id));
    if (editingNoteId === id) setEditingNoteId(null);
  };

  const noteAuthors = Array.from(new Set(notes.map((note) => note.author))).sort((a, b) => a.localeCompare(b));
  const visibleNotes = notes
    .filter((note) => !importantNotesOnly || note.important)
    .filter((note) => noteAuthor === "all" || note.author === noteAuthor)
    .sort((a, b) => {
      if (noteSort === "author-asc") return a.author.localeCompare(b.author);
      if (noteSort === "author-desc") return b.author.localeCompare(a.author);
      const aTime = new Date(a.time.replace(" · ", " ")).getTime();
      const bTime = new Date(b.time.replace(" · ", " ")).getTime();
      return noteSort === "oldest" ? aTime - bTime : bTime - aTime;
    });

  return (
    <Card className="overflow-hidden">
      <div className="section-head flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Notes</h3>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setAddOpen(true)} className="btn btn-primary h-8 py-0">
            <Icon d={ICONS.plus} size={13} />
            Add Note
          </button>
          <button
            onClick={() => setImportantNotesOnly((value) => !value)}
            aria-pressed={importantNotesOnly}
            title="Show important notes only"
            className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
              importantNotesOnly
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon d={ICONS.star} size={14} />
          </button>
          <select
            value={noteSort}
            onChange={(event) => setNoteSort(event.target.value as typeof noteSort)}
            aria-label="Sort notes"
            className="h-8 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-brand"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="author-asc">User name A–Z</option>
            <option value="author-desc">User name Z–A</option>
          </select>
          <select
            value={noteAuthor}
            onChange={(event) => setNoteAuthor(event.target.value)}
            aria-label="Filter notes by user"
            className="h-8 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-brand"
          >
            <option value="all">All users</option>
            {noteAuthors.map((author) => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {visibleNotes.slice(0, limit).map((n) => (
            <div key={n.id} className="px-4 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-medium text-[var(--foreground)]">{n.author}</span>
                  <Badge label={n.source} variant={NOTE_SOURCE_BADGE[n.source]} className="text-[14px]" />
                  {n.important && (
                    <span className="text-amber-500" title="Important note">
                      <Icon d={ICONS.star} size={13} />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[var(--muted-foreground)]">{n.time}</span>
                  <NoteActions
                    important={n.important}
                    onEdit={() => editNote(n.id, n.text)}
                    onToggleImportant={() => toggleImportantNote(n.id)}
                    onDelete={() => deleteNote(n.id)}
                  />
                </div>
              </div>
              {editingNoteId === n.id ? (
                <div>
                  <textarea
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] leading-relaxed text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNote}
                      className="btn btn-primary"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[15px] text-[var(--muted-foreground)] leading-relaxed">{n.text}</p>
              )}
            </div>
        ))}
        {visibleNotes.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-[14px] font-medium text-[var(--foreground)]">No matching notes</p>
            <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">Adjust the importance or user filters.</p>
          </div>
        )}
      </div>
      {createPortal(
        <div className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-200 ${addOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!addOpen}>
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${addOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setAddOpen(false)} />
          <form
            onSubmit={addNote}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-note-title"
            className={`relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${addOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
          >
            <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h2 id="add-note-title" className="text-[18px] font-semibold text-brand">Add Note</h2>
                <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Posted as {CURRENT_USER}</p>
              </div>
              <button type="button" onClick={() => setAddOpen(false)} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close add note">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Note <span className="text-red-500">*</span></span>
                <textarea
                  required
                  autoFocus={addOpen}
                  rows={5}
                  value={draft.text}
                  onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                  placeholder="Write the note"
                  className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] leading-relaxed text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              </label>
              <ToggleSwitch checked={draft.important} onChange={(important) => setDraft({ ...draft, important })} label="Mark as important" />
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-4">
              <button type="button" onClick={() => setAddOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Add Note</button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </Card>
  );
}

const REMINDER_PRIORITY_COLOR: Record<string, string> = {
  Critical: "var(--st-red)",
  High: "var(--st-amber)",
  Medium: "var(--brand)",
  Low: "var(--ring)",
};

function RemindersSection({ initialReminders, entityLabel = "client" }: { initialReminders: typeof CLIENT_REMINDERS; entityLabel?: string }) {
  const [reminders, setReminders] = useState(initialReminders);
  const [completedReminderIds, setCompletedReminderIds] = useState<number[]>([]);
  const [showCompletedReminders, setShowCompletedReminders] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<number | null>(null);
  const [reminderDraft, setReminderDraft] = useState<typeof CLIENT_REMINDERS[number] | null>(null);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState(EMPTY_REMINDER_FORM);
  const [reminderScheduleError, setReminderScheduleError] = useState("");

  const editReminder = (reminder: typeof CLIENT_REMINDERS[number]) => {
    setEditingReminderId(reminder.id);
    setReminderDraft({ ...reminder });
  };

  const saveReminder = () => {
    if (!reminderDraft) return;
    setReminders((current) => current.map((reminder) => reminder.id === reminderDraft.id ? reminderDraft : reminder));
    setEditingReminderId(null);
    setReminderDraft(null);
  };

  const deleteReminder = (id: number) => {
    setReminders((current) => current.filter((reminder) => reminder.id !== id));
    setCompletedReminderIds((current) => current.filter((reminderId) => reminderId !== id));
    if (editingReminderId === id) {
      setEditingReminderId(null);
      setReminderDraft(null);
    }
  };

  const displayedReminders = reminders.filter((reminder) =>
    showCompletedReminders
      ? completedReminderIds.includes(reminder.id)
      : !completedReminderIds.includes(reminder.id)
  );

  const completeReminder = (id: number) => {
    setCompletedReminderIds((current) => current.includes(id) ? current : [...current, id]);
  };

  const addReminder = (event: React.FormEvent) => {
    event.preventDefault();
    const needsWeekDays = newReminder.repetition === "Weekly" || newReminder.repetition === "Every 2 weeks";
    if (needsWeekDays && newReminder.weekDays.length === 0) {
      setReminderScheduleError("Select at least one day of the week.");
      return;
    }
    if (newReminder.repetition === "Monthly" && newReminder.monthDays.length === 0) {
      setReminderScheduleError("Select at least one day of the month.");
      return;
    }

    const formatDateTime = (value: string) => new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const nextId = reminders.reduce((highest, reminder) => Math.max(highest, reminder.id), 0) + 1;
    const repetition = needsWeekDays
      ? `${newReminder.repetition} · ${newReminder.weekDays.map((day) => day.slice(0, 3)).join(", ")}`
      : newReminder.repetition === "Monthly"
        ? `Monthly · Days ${[...newReminder.monthDays].sort((a, b) => Number(a) - Number(b)).join(", ")}`
        : newReminder.repetition;

    setReminders((current) => [
      {
        id: nextId,
        description: newReminder.description,
        priority: newReminder.priority,
        repetition,
        dueDate: formatDateTime(newReminder.dueDate),
        endDate: formatDateTime(newReminder.endDate),
        note: newReminder.note,
      },
      ...current,
    ]);
    setNewReminder(EMPTY_REMINDER_FORM);
    setReminderScheduleError("");
    setShowCompletedReminders(false);
    setReminderModalOpen(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-brand">
              {showCompletedReminders ? "Completed Reminders" : "Reminders"}
            </h3>
            <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">
              {displayedReminders.length} {showCompletedReminders ? "completed" : "scheduled"} reminders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompletedReminders((value) => !value)}
              className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-2 text-[14px] font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <Icon d={ICONS.check} size={13} />
              {showCompletedReminders ? "View Active Reminders" : "View Completed Reminders"}
            </button>
            <button
              onClick={() => { setReminderScheduleError(""); setReminderModalOpen(true); }}
              className="btn btn-primary"
            >
              <Icon d={ICONS.plus} size={13} />
              Add Reminder
            </button>
          </div>
        </div>
        {displayedReminders.length > 0 && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_13rem_10rem_10rem_9rem] items-center gap-5 border-b border-[var(--border)] bg-[var(--muted)]/40 py-2.5 pl-6 pr-5">
            {["Reminder", "Repeats", "Due", "Ends", ""].map((heading) => (
              <span key={heading || "actions"} className="text-[13px] font-semibold uppercase tracking-wider text-brand">{heading}</span>
            ))}
          </div>
          <div className="divide-y divide-[var(--border)]">
          {displayedReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="border-l-4 transition-colors hover:bg-[var(--muted)]/50"
              style={{ borderLeftColor: REMINDER_PRIORITY_COLOR[reminder.priority] ?? "var(--border)" }}
            >
              {editingReminderId === reminder.id && reminderDraft ? (
                <div className="space-y-3 py-4 pl-5 pr-5">
                  <input
                    value={reminderDraft.description}
                    onChange={(event) => setReminderDraft({ ...reminderDraft, description: event.target.value })}
                    aria-label="Reminder description"
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <select
                      value={reminderDraft.priority}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, priority: event.target.value })}
                      aria-label="Reminder priority"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    >
                      {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
                    </select>
                    <input
                      value={reminderDraft.repetition}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, repetition: event.target.value })}
                      aria-label="Reminder repetition"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    />
                    <input
                      value={reminderDraft.dueDate}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, dueDate: event.target.value })}
                      aria-label="Reminder due date"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    />
                    <input
                      value={reminderDraft.endDate}
                      onChange={(event) => setReminderDraft({ ...reminderDraft, endDate: event.target.value })}
                      aria-label="Reminder end date"
                      className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                    />
                  </div>
                  <textarea
                    value={reminderDraft.note}
                    onChange={(event) => setReminderDraft({ ...reminderDraft, note: event.target.value })}
                    rows={2}
                    aria-label="Reminder note"
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setEditingReminderId(null); setReminderDraft(null); }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button onClick={saveReminder} className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[minmax(0,1fr)_13rem_10rem_10rem_9rem] items-center gap-5 py-3.5 pl-5 pr-5">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug text-[var(--foreground)]">{reminder.description}</p>
                    <p className="mt-0.5 truncate text-[13px] text-[var(--muted-foreground)]" title={reminder.note}>{reminder.note}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--foreground)]">
                    <span className="text-[var(--muted-foreground)]"><Icon d={ICONS.clock} size={12} /></span>
                    {reminder.repetition}
                  </span>
                  <span className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--foreground)]">
                    <span className="text-[var(--muted-foreground)]"><Icon d={ICONS.calendar} size={12} /></span>
                    {reminder.dueDate}
                  </span>
                  <span className="text-[14px] text-[var(--muted-foreground)]">{reminder.endDate}</span>
                  <div className="flex items-center justify-end gap-1">
                    <Badge label={reminder.priority} variant={PRIORITY_BADGE[reminder.priority]} className="text-[13px]" />
                    {showCompletedReminders ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500" title="Completed">
                        <Icon d={ICONS.check} size={14} />
                      </span>
                    ) : (
                      <button
                        onClick={() => completeReminder(reminder.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
                        title="Mark as completed"
                        aria-label="Mark reminder as completed"
                      >
                        <Icon d={ICONS.check} size={14} />
                      </button>
                    )}
                    <ReminderActions onEdit={() => editReminder(reminder)} onDelete={() => deleteReminder(reminder.id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </Card>
        )}
        {displayedReminders.length === 0 && (
          <Card className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
              <Icon d={ICONS.check} size={16} />
            </div>
            <p className="text-[15px] font-medium text-[var(--foreground)]">
              {showCompletedReminders ? "No completed reminders" : "No active reminders"}
            </p>
            <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
              {showCompletedReminders ? "Completed reminders will appear here." : "Add a reminder to get started."}
            </p>
          </Card>
        )}
      </div>

      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-200 ${
          reminderModalOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        }`}
        aria-hidden={!reminderModalOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            reminderModalOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setReminderModalOpen(false)}
        />
        <form
          onSubmit={addReminder}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-reminder-title"
          className={`relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ${
            reminderModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
          }`}
        >
          <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
            <div>
              <h2 id="add-reminder-title" className="text-[18px] font-semibold text-brand">Add Reminder</h2>
              <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Schedule a new reminder for this {entityLabel}.</p>
            </div>
            <button
              type="button"
              onClick={() => setReminderModalOpen(false)}
              className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Close add reminder"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 px-5 py-5">
            <label className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Description</span>
              <select
                required
                value={newReminder.description}
                onChange={(event) => setNewReminder({ ...newReminder, description: event.target.value })}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
              >
                <option value="" disabled>Select a reminder description</option>
                <option value="Follow up on revised payment schedule">Follow up on revised payment schedule</option>
                <option value="Review account documentation">Review account documentation</option>
                <option value="Send monthly account statement">Send monthly account statement</option>
                <option value="Check promise-to-pay status">Check promise-to-pay status</option>
                <option value="Schedule client follow-up call">Schedule client follow-up call</option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Priority</span>
              <select
                value={newReminder.priority}
                onChange={(event) => setNewReminder({ ...newReminder, priority: event.target.value })}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
              >
                {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Repetition</span>
              <select
                value={newReminder.repetition}
                onChange={(event) => {
                  const repetition = event.target.value;
                  setReminderScheduleError("");
                  setNewReminder({
                    ...newReminder,
                    repetition,
                    weekDays: repetition === "Weekly" || repetition === "Every 2 weeks" ? newReminder.weekDays : [],
                    monthDays: repetition === "Monthly" ? newReminder.monthDays : [],
                  });
                }}
                className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
              >
                {["Once", "Daily", "Weekly", "Every 2 weeks", "Monthly", "Quarterly"].map((repetition) => <option key={repetition}>{repetition}</option>)}
              </select>
            </label>

            {(newReminder.repetition === "Weekly" || newReminder.repetition === "Every 2 weeks") && (
              <div className="col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Week</span>
                <MultiSelectDropdown
                  label="Select one or more weekdays"
                  options={WEEKDAY_OPTIONS.map((day) => ({ value: day, label: day }))}
                  selected={newReminder.weekDays}
                  onChange={(weekDays) => {
                    setReminderScheduleError("");
                    setNewReminder({ ...newReminder, weekDays });
                  }}
                />
              </div>
            )}

            {newReminder.repetition === "Monthly" && (
              <div className="col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Days of the Month</span>
                <MultiSelectDropdown
                  label="Select one or more days"
                  grid
                  options={Array.from({ length: 31 }, (_, index) => {
                    const day = String(index + 1);
                    return { value: day, label: day };
                  })}
                  selected={newReminder.monthDays}
                  onChange={(monthDays) => {
                    setReminderScheduleError("");
                    setNewReminder({ ...newReminder, monthDays });
                  }}
                />
                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
                  If a selected day does not exist in a shorter month, the reminder will run on that month&apos;s final day.
                </p>
              </div>
            )}

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Due Date &amp; Time</span>
              <DateTimeInput required value={newReminder.dueDate} onChange={(dueDate) => setNewReminder({ ...newReminder, dueDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand" />
            </label>

            <label>
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">End Date &amp; Time</span>
              <DateTimeInput required value={newReminder.endDate} onChange={(endDate) => setNewReminder({ ...newReminder, endDate })} className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand" />
            </label>

            <label className="col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Note</span>
              <textarea
                required
                rows={4}
                value={newReminder.note}
                onChange={(event) => setNewReminder({ ...newReminder, note: event.target.value })}
                placeholder="Add context or instructions for this reminder"
                className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand"
              />
            </label>
            {reminderScheduleError && (
              <p className="col-span-2 text-[13px] font-medium text-red-500">{reminderScheduleError}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-4">
            <button
              type="button"
              onClick={() => setReminderModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ── Edit pop-up ──────────────────────────────────────────────────────────────
type EditValue = string | boolean | string[] | unknown;
type EditField = {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "select" | "list" | "multi" | "toggle" | "custom";
  options?: string[];
  span?: 1 | 2 | 3;
  section?: string;
  placeholder?: string;
  render?: (value: EditValue, onChange: (next: EditValue) => void) => React.ReactNode;
};

function textDateToISO(text: string) {
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isoToTextDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const EDIT_FIELD_CLASS = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
const EDIT_LABEL_CLASS = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";

function EditIconButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand)]/10 hover:text-brand"
    >
      <Icon d={ICONS.edit} size={14} />
    </button>
  );
}

function ModalShell({ open, title, subtitle, onClose, onSubmit, width = "max-w-3xl", children }: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  width?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return createPortal(
    <div className={`fixed inset-0 z-[80] flex items-center justify-center px-4 py-8 transition-all duration-200 ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <form
        onSubmit={(event) => { event.preventDefault(); onSubmit(); }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 flex max-h-full w-full ${width} flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-semibold text-brand">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label={`Close ${title}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex justify-end gap-2 border-t border-[var(--border)] px-6 py-3.5">
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>,
    document.body
  );
}

function StringListEditor({ values, onChange, placeholder, type = "text", addLabel }: { values: string[]; onChange: (next: string[]) => void; placeholder?: string; type?: string; addLabel: string }) {
  return (
    <div>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input type={type} value={item} placeholder={placeholder} onChange={(event) => onChange(values.map((v, i) => (i === index ? event.target.value : v)))} className={`${EDIT_FIELD_CLASS} min-w-0 flex-1`} />
            {values.length > 1 && (
              <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} aria-label="Remove" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
                <Icon d={ICONS.trash} size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...values, ""])} className="mt-2 text-[13px] font-medium text-brand">+ {addLabel}</button>
    </div>
  );
}

function EditModal({ open, title, subtitle, fields, values, onSave, onClose }: {
  open: boolean;
  title: string;
  subtitle?: string;
  fields: EditField[];
  values: Record<string, EditValue>;
  onSave: (values: Record<string, EditValue>) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, EditValue>>(values);
  useEffect(() => {
    if (!open) return;
    const next: Record<string, EditValue> = { ...values };
    fields.forEach((field) => {
      if (field.type === "date") next[field.key] = textDateToISO(String(values[field.key] ?? ""));
    });
    setDraft(next);
  }, [open]);

  const save = () => {
    const next: Record<string, EditValue> = { ...draft };
    fields.forEach((field) => {
      if (field.type === "date") next[field.key] = isoToTextDate(String(draft[field.key] ?? ""));
      if (field.type === "list") next[field.key] = (draft[field.key] as string[]).map((v) => v.trim()).filter(Boolean);
    });
    onSave(next);
    onClose();
  };

  const set = (key: string) => (next: EditValue) => setDraft((current) => ({ ...current, [key]: next }));
  const spanClass = (span?: number) => (span === 3 ? "col-span-3" : span === 2 ? "col-span-2" : "");

  const control = (field: EditField) => {
    const value = draft[field.key];
    switch (field.type) {
      case "select":
        return (
          <select value={String(value ?? "")} onChange={(event) => set(field.key)(event.target.value)} className={EDIT_FIELD_CLASS}>
            {field.options?.map((option) => <option key={option} value={option}>{option || "Not assigned"}</option>)}
          </select>
        );
      case "date":
        return <DateInput value={String(value ?? "")} onChange={set(field.key)} className={EDIT_FIELD_CLASS} />;
      case "list":
        return <StringListEditor values={(value as string[])?.length ? (value as string[]) : [""]} onChange={set(field.key)} placeholder={field.placeholder} addLabel={`Add ${field.label.toLowerCase().replace(/sses$/, "ss").replace(/([^s])s$/, "$1")}`} />;
      case "multi":
        return (
          <MultiSelectDropdown
            label={`Select ${field.label.toLowerCase()}`}
            options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
            selected={(value as string[]) ?? []}
            onChange={set(field.key)}
          />
        );
      case "toggle":
        return <div className="flex h-10 items-center"><ToggleSwitch checked={Boolean(value)} onChange={set(field.key)} label={field.label} /></div>;
      case "custom":
        return field.render?.(value, set(field.key));
      default:
        return <input type={field.type ?? "text"} value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => set(field.key)(event.target.value)} className={EDIT_FIELD_CLASS} />;
    }
  };

  return (
    <ModalShell open={open} title={title} subtitle={subtitle} onClose={onClose} onSubmit={save}>
      <div className="grid grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <div key={field.key} className={`${spanClass(field.span)} ${field.type === "list" || field.type === "custom" ? "self-start" : ""}`}>
            {field.type !== "toggle" && <span className={EDIT_LABEL_CLASS}>{field.label}</span>}
            {control(field)}
          </div>
        )).flatMap((node, index) => {
          const field = fields[index];
          return field.section && field.section !== fields[index - 1]?.section
            ? [
                <p key={`section-${field.section}`} className={`col-span-3 text-[13px] font-semibold uppercase tracking-wider text-brand ${index > 0 ? "mt-2 border-t border-[var(--border)] pt-4" : ""}`}>{field.section}</p>,
                node,
              ]
            : [node];
        })}
      </div>
    </ModalShell>
  );
}

type ClientContact = typeof CLIENT_CONTACTS[number];
const CONTACT_EMAIL_LABELS = ["Work", "Personal", "Legal", "Other"];
const CONTACT_PHONE_LABELS = ["Direct", "Mobile", "Office", "Other"];

function ContactsEditModal({ open, contacts, onSave, onClose }: { open: boolean; contacts: ClientContact[]; onSave: (next: ClientContact[]) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<ClientContact[]>(contacts);
  useEffect(() => {
    if (open) setDraft(contacts.map((contact) => ({ ...contact, emails: [...contact.emails], phones: [...contact.phones] })));
  }, [open]);

  const update = (index: number, changes: Partial<ClientContact>) => setDraft((current) => current.map((contact, i) => (i === index ? { ...contact, ...changes } : contact)));

  const labeledList = (index: number, key: "emails" | "phones", labels: string[], type: string, placeholder: string) => {
    const entries = draft[index][key];
    return (
      <div className="col-span-2">
        <span className={EDIT_LABEL_CLASS}>{key === "emails" ? "Email Addresses" : "Phone Numbers"}</span>
        <div className="space-y-2">
          {entries.map((entry, entryIndex) => (
            <div key={entryIndex} className="flex gap-2">
              <select
                value={entry.label}
                onChange={(event) => update(index, { [key]: entries.map((e, i) => (i === entryIndex ? { ...e, label: event.target.value } : e)) })}
                className="h-10 w-28 shrink-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-[14px] text-[var(--foreground)] outline-none focus:border-brand"
              >
                {labels.map((label) => <option key={label} value={label}>{label}</option>)}
              </select>
              <input type={type} value={entry.value} placeholder={placeholder} onChange={(event) => update(index, { [key]: entries.map((e, i) => (i === entryIndex ? { ...e, value: event.target.value } : e)) })} className={`${EDIT_FIELD_CLASS} min-w-0 flex-1`} />
              {entries.length > 1 && (
                <button type="button" onClick={() => update(index, { [key]: entries.filter((_, i) => i !== entryIndex) })} aria-label="Remove" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
                  <Icon d={ICONS.trash} size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => update(index, { [key]: [...entries, { label: labels[0], value: "" }] })} className="mt-2 text-[13px] font-medium text-brand">
          + Add {key === "emails" ? "email" : "phone"}
        </button>
      </div>
    );
  };

  return (
    <ModalShell
      open={open}
      title="Edit Contacts"
      subtitle="Names, titles, guarantors, and contact details"
      onClose={onClose}
      onSubmit={() => { onSave(draft.map((c) => ({ ...c, emails: c.emails.filter((e) => e.value.trim()), phones: c.phones.filter((p) => p.value.trim()) }))); onClose(); }}
      width="max-w-4xl"
    >
      <div className="space-y-4">
        {draft.map((contact, index) => (
          <div key={index} className="rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-semibold text-[var(--foreground)]">Contact {index + 1}</p>
              <div className="flex items-center gap-5">
                <ToggleSwitch checked={contact.primary} onChange={(primary) => update(index, { primary })} label="Primary" />
                <ToggleSwitch checked={contact.personalGuarantor} onChange={(personalGuarantor) => update(index, { personalGuarantor })} label="Personal guarantor" />
                {draft.length > 1 && (
                  <button type="button" onClick={() => setDraft((current) => current.filter((_, i) => i !== index))} aria-label={`Remove contact ${index + 1}`} className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10">
                    <Icon d={ICONS.trash} size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <label><span className={EDIT_LABEL_CLASS}>First Name</span><input required value={contact.firstName} onChange={(e) => update(index, { firstName: e.target.value })} className={EDIT_FIELD_CLASS} /></label>
              <label><span className={EDIT_LABEL_CLASS}>Last Name</span><input required value={contact.lastName} onChange={(e) => update(index, { lastName: e.target.value })} className={EDIT_FIELD_CLASS} /></label>
              <label className="col-span-2"><span className={EDIT_LABEL_CLASS}>Title</span><input value={contact.title} onChange={(e) => update(index, { title: e.target.value })} className={EDIT_FIELD_CLASS} /></label>
              {labeledList(index, "emails", CONTACT_EMAIL_LABELS, "email", "name@company.com")}
              {labeledList(index, "phones", CONTACT_PHONE_LABELS, "tel", "+1 (212) 555-0000")}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setDraft((current) => [...current, { firstName: "", lastName: "", title: "", primary: false, personalGuarantor: false, emails: [{ label: "Work", value: "" }], phones: [{ label: "Direct", value: "" }] }])}
          className="btn btn-secondary"
        >
          <Icon d={ICONS.plus} size={13} />
          Add Contact
        </button>
      </div>
    </ModalShell>
  );
}

type CoDebtor = { name: string; reported: boolean };

function CoDebtorEditor({ value, onChange }: { value: CoDebtor[]; onChange: (next: CoDebtor[]) => void }) {
  return (
    <div>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <input value={item.name} placeholder="Full name" onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, name: e.target.value } : v)))} className={`${EDIT_FIELD_CLASS} min-w-0 flex-1`} />
            <ToggleSwitch checked={item.reported} onChange={(reported) => onChange(value.map((v, i) => (i === index ? { ...v, reported } : v)))} label="Reported" />
            <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label="Remove co-debtor" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
              <Icon d={ICONS.trash} size={14} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, { name: "", reported: false }])} className="mt-2 text-[13px] font-medium text-brand">+ Add co-debtor</button>
    </div>
  );
}

const CLIENT_AGREEMENT = {
  version: "v3.2",
  title: "Debt Collection Services Agreement",
  effective: "Jan 2, 2026",
  signedOn: "Dec 18, 2025",
  agency: { name: "Northstar Recovery LLC", signer: "Marcus Klein", role: "Managing Director" },
  client: { name: "Westfield Group", signer: "Gregory Westfield", role: "CEO & Founder" },
  terms: [
    { label: "Contingency Fee", value: "25% of amounts collected" },
    { label: "Legal Contingency", value: "33% on accounts placed with counsel" },
    { label: "Remittance", value: "Monthly, by the 15th" },
    { label: "Term", value: "24 months, auto-renewing" },
  ],
  sections: [
    { heading: "1. Placement of Accounts", text: "Client may place delinquent commercial and consumer accounts with Agency for collection. Each placement is governed by this Agreement from the date of assignment until the account is resolved or recalled." },
    { heading: "2. Compensation", text: "Agency shall retain the contingency fee stated above from all amounts recovered, whether paid to Agency or directly to Client. No fee is owed on accounts with no recovery." },
    { heading: "3. Legal Action", text: "Agency may refer accounts to licensed counsel only with Client's written approval. Court costs advanced by Agency are reimbursed from the first recoveries on the account." },
    { heading: "4. Remittance and Reporting", text: "Agency shall remit Client's portion of collections monthly, together with a statement listing payments, fees, and current balances for every placed account." },
    { heading: "5. Compliance", text: "Agency shall comply with the FDCPA, the FCRA, and all applicable state collection laws, and shall maintain all licenses and bonds required to perform the services." },
    { heading: "6. Termination", text: "Either party may terminate this Agreement with 60 days' written notice. Fees remain due on payments received for 90 days after termination on accounts already placed." },
  ],
};

function AgreementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const a = CLIENT_AGREEMENT;
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center px-4 py-8 transition-all duration-200 ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-title"
        className={`relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="agreement-title" className="text-[18px] font-semibold text-brand">{a.title}</h2>
              <Badge label={a.version} variant="info" className="text-[13px]" />
            </div>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Between {a.agency.name} and {a.client.name} · Effective {a.effective}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close agreement">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-4 gap-3">
            {a.terms.map((term) => (
              <div key={term.label} className="rounded-lg bg-[var(--muted)]/60 px-3 py-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand">{term.label}</p>
                <p className="mt-0.5 text-[14px] font-medium text-[var(--foreground)]">{term.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {a.sections.map((section) => (
              <div key={section.heading}>
                <p className="text-[15px] font-semibold text-[var(--foreground)]">{section.heading}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted-foreground)]">{section.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-5">
            {[["Agency", a.agency], ["Client", a.client]].map(([party, info]) => {
              const p = info as typeof a.agency;
              return (
                <div key={party as string} className="rounded-lg border border-[var(--border)] px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-brand">{party as string}</p>
                  <p className="mt-2 font-serif text-[20px] italic text-[var(--foreground)]">{p.signer}</p>
                  <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">{p.role}, {p.name}</p>
                  <p className="text-[13px] text-[var(--muted-foreground)]">Signed {a.signedOn}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-3.5">
          <button type="button" className="btn btn-secondary">
            <Icon d={ICONS.download} size={13} />
            Download PDF
          </button>
          <button type="button" onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </section>
    </div>
  );
}

const LEGAL_TRANSACTIONS: Record<string, Array<{ date: string; description: string; reference: string; note: string; collector: string; amount: number; agency: number; client: number; clientSent: number; agencySpent: number; convenience: number }>> = {
  "DBT-4820": [
    { date: "2026-03-02", description: "Filing Fee", reference: "CHK-88102", note: "Complaint filing — NY Supreme Court", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 4500, agencySpent: 1800, convenience: 0 },
    { date: "2026-04-18", description: "Service of Process", reference: "ACH-27731", note: "Metro Process Service", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 3000, agencySpent: 1200, convenience: 0 },
    { date: "2026-06-05", description: "Payment", reference: "CHK-88317", note: "Good-faith payment from debtor", collector: "Daniel Reeves", amount: 6000, agency: 1980, client: 4020, clientSent: 0, agencySpent: 0, convenience: 120 },
    { date: "2026-07-22", description: "Deposition Costs", reference: "CHK-88421", note: "Court reporter and transcript", collector: "Sarah Okafor", amount: 0, agency: 0, client: 0, clientSent: 4500, agencySpent: 1800, convenience: 0 },
  ],
  "DBT-4791": [
    { date: "2026-02-10", description: "Filing Fee", reference: "CHK-87990", note: "Filing fee — NY Supreme Court", collector: "Sarah Okafor", amount: 0, agency: 0, client: 0, clientSent: 3200, agencySpent: 1100, convenience: 0 },
    { date: "2026-03-05", description: "Payment", reference: "CHK-10421", note: "Partial payment", collector: "Sarah Okafor", amount: 50000, agency: 16500, client: 33500, clientSent: 0, agencySpent: 0, convenience: 250 },
    { date: "2026-07-12", description: "Service of Process", reference: "ACH-28802", note: "Affidavit of service filed", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 2250, agencySpent: 950, convenience: 0 },
    { date: "2026-08-26", description: "Payment", reference: "ACH-29018", note: "Payment plan installment", collector: "Sarah Okafor", amount: 85000, agency: 28050, client: 56950, clientSent: 0, agencySpent: 0, convenience: 425 },
    { date: "2026-09-04", description: "Motion Fee", reference: "CHK-88502", note: "Motion for summary judgment", collector: "Sarah Okafor", amount: 0, agency: 0, client: 0, clientSent: 4050, agencySpent: 1600, convenience: 0 },
  ],
  "DBT-4762": [
    { date: "2026-01-15", description: "Filing Fee", reference: "CHK-87650", note: "Civil Court filing", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 2500, agencySpent: 850, convenience: 0 },
    { date: "2026-03-20", description: "Service of Process", reference: "ACH-27104", note: "Liberty Process Servers", collector: "Daniel Reeves", amount: 0, agency: 0, client: 0, clientSent: 3500, agencySpent: 1100, convenience: 0 },
    { date: "2026-06-01", description: "Settlement Payment", reference: "CHK-87904", note: "Settled in full", collector: "Daniel Reeves", amount: 230000, agency: 75900, client: 154100, clientSent: 0, agencySpent: 0, convenience: 600 },
  ],
};

function LegalBillingModal({ accountNumber, onClose }: { accountNumber: string | null; onClose: () => void }) {
  const [shown, setShown] = useState(accountNumber);
  useEffect(() => {
    if (accountNumber) setShown(accountNumber);
  }, [accountNumber]);
  useEffect(() => {
    if (!accountNumber) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accountNumber, onClose]);

  const open = Boolean(accountNumber);
  const bill = LEGAL_BILLING.find((row) => row.accountNumber === shown);
  const rows = (shown && LEGAL_TRANSACTIONS[shown]) || [];
  const money = (value: number) => (value ? formatMoney(value) : "—");
  const total = (key: "amount" | "agency" | "client" | "clientSent" | "agencySpent" | "convenience") => rows.reduce((sum, row) => sum + row[key], 0);
  const columns: Array<[string, "left" | "right"]> = [
    ["Date", "left"], ["Description", "left"], ["ID / Check #", "left"], ["Note", "left"], ["Collector", "left"],
    ["Amount", "right"], ["Agency", "right"], ["Client", "right"], ["Client Sent", "right"], ["Agency Spent", "right"], ["Convenience Fees", "right"],
  ];

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center px-6 py-8 transition-all duration-200 ${open ? "pointer-events-auto visible" : "pointer-events-none invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-detail-title"
        className={`relative z-10 flex max-h-full w-full max-w-[1520px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 id="legal-detail-title" className="text-[18px] font-semibold text-brand">Legal Billing · {shown}</h2>
              {bill && <Badge label={bill.status} variant={bill.status === "Active" ? "success" : bill.status === "Settled" ? "info" : "warning"} className="text-[13px]" />}
            </div>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{bill?.fullNameCompany} · {rows.length} transactions</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close legal billing details">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[var(--card)]">
              <tr className="border-b border-[var(--border)]">
                {columns.map(([heading, align]) => (
                  <th key={heading} className={`whitespace-nowrap px-3 py-3 text-[13px] font-semibold uppercase tracking-wider text-brand ${align === "right" ? "text-right" : "text-left"}`}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.reference} className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--muted)]">
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] text-[var(--foreground)]">{formatUSDate(row.date)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] font-medium text-[var(--foreground)]">{row.description}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] font-semibold text-brand">{row.reference}</td>
                  <td className="max-w-52 truncate px-3 py-3 text-[14px] text-[var(--muted-foreground)]" title={row.note}>{row.note}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-[14px] text-[var(--foreground)]">{row.collector}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-semibold text-emerald-500">{money(row.amount)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-amber-500">{money(row.agency)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-brand">{money(row.client)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-[var(--foreground)]">{money(row.clientSent)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-[var(--foreground)]">{money(row.agencySpent)}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] text-[var(--muted-foreground)]">{money(row.convenience)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-10 text-center text-[14px] text-[var(--muted-foreground)]">No legal transactions for this account.</td></tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-[var(--border)] bg-[var(--muted)]/40">
                  <td colSpan={5} className="px-3 py-3 text-[13px] font-semibold uppercase tracking-wider text-brand">Totals</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-emerald-500">{money(total("amount"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-amber-500">{money(total("agency"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-brand">{money(total("client"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-[var(--foreground)]">{money(total("clientSent"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-[var(--foreground)]">{money(total("agencySpent"))}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-right text-[14px] font-bold text-[var(--muted-foreground)]">{money(total("convenience"))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="flex justify-end border-t border-[var(--border)] px-6 py-3.5">
          <button type="button" onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </section>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  const [list, setList] = useState(tags);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const tag = draft.trim();
    if (tag && !list.includes(tag)) setList((current) => [...current, tag]);
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[var(--muted-foreground)]" title="Tags"><Icon d={ICONS.tag} size={14} /></span>
      {list.map((tag) => (
        <span key={tag} className="group flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)] py-0.5 pl-2.5 pr-2.5 text-[13px] font-medium text-[var(--foreground)]">
          {tag}
          <button
            type="button"
            onClick={() => setList((current) => current.filter((item) => item !== tag))}
            aria-label={`Remove ${tag} tag`}
            className="-mr-1 hidden h-4 w-4 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)] group-hover:flex"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </span>
      ))}
      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); commit(); }
            if (event.key === "Escape") { setDraft(""); setAdding(false); }
          }}
          placeholder="New tag"
          className="h-6 w-28 rounded-full border border-[var(--brand)] bg-[var(--card)] px-2.5 text-[13px] text-[var(--foreground)] outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-[var(--border)] px-2.5 py-0.5 text-[13px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:text-brand"
        >
          + Add tag
        </button>
      )}
    </div>
  );
}

const SPLIT_ROWS = [
  { key: "principal", label: "Principal", client: "75", attorney: "0", agency: "25" },
  { key: "interest", label: "Interest", client: "50", attorney: "0", agency: "50" },
  { key: "cost", label: "Cost", client: "100", attorney: "0", agency: "0" },
  { key: "attorneyFees", label: "Attorney Fees", client: "0", attorney: "100", agency: "0" },
  { key: "overpayment", label: "Overpayment", client: "100", attorney: "0", agency: "0" },
  { key: "convenienceFees", label: "Convenience Fees", client: "0", attorney: "0", agency: "100" },
  { key: "legalCosts", label: "Legal Costs", client: "0", attorney: "60", agency: "40" },
  { key: "collectorPercentage", label: "Collector Percentage", client: "0", attorney: "0", agency: "100" },
];

const UNDER_THRESHOLDS = ["$500", "$1,000", "$2,500", "$5,000", "$10,000"];

function DistributionSplitCard({ subtitle = "How each collected amount is divided between the client, attorney, and agency" }: { subtitle?: string }) {
  const [splits, setSplits] = useState(SPLIT_ROWS);
  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const parties = [
    { key: "client", label: "Client", color: "var(--brand)" },
    { key: "attorney", label: "Attorney", color: "var(--st-violet)" },
    { key: "agency", label: "Agency", color: "var(--st-warning)" },
  ] as const;

  return (
      <Card className="overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
          <div>
            <h3 className="text-[16px] font-semibold text-brand">Distribution Split</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            {parties.map((party) => (
              <span key={party.key} className="flex items-center gap-1.5 text-[13px] text-[var(--muted-foreground)]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: party.color }} />
                {party.label}
              </span>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
              <th className="w-48 px-5 py-3 text-left text-[13px] font-semibold uppercase tracking-wider text-brand">Amount Type</th>
              {parties.map((party) => (
                <th key={party.key} className="w-36 px-3 py-3 text-left text-[13px] font-semibold uppercase tracking-wider text-brand">{party.label}</th>
              ))}
              <th className="px-5 py-3 text-left text-[13px] font-semibold uppercase tracking-wider text-brand">Split</th>
              <th className="w-28 px-5 py-3 text-right text-[13px] font-semibold uppercase tracking-wider text-brand">Total</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((row) => {
              const numbers = parties.map((party) => Number(row[party.key]) || 0);
              const total = numbers.reduce((sum, value) => sum + value, 0);
              const valid = Math.abs(total - 100) < 0.001;
              return (
                <tr key={row.key} className="border-b border-[var(--border)] last:border-0">
                  <td className="whitespace-nowrap px-5 py-2.5 text-[15px] font-medium text-[var(--foreground)]">{row.label}</td>
                  {parties.map((party) => (
                    <td key={party.key} className="px-3 py-2.5">
                      <div className="relative w-28">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={row[party.key]}
                          aria-label={`${row.label} ${party.label} percentage`}
                          onChange={(event) => setSplits((current) => current.map((item) => (item.key === row.key ? { ...item, [party.key]: event.target.value } : item)))}
                          className={`${fieldClass} h-9 pr-8`}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">%</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-5 py-2.5">
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                      {parties.map((party, index) => (
                        <div
                          key={party.key}
                          title={`${party.label}: ${numbers[index]}%`}
                          className="h-full transition-all duration-300"
                          style={{ width: `${Math.min(numbers[index], 100)}%`, background: party.color }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[13px] font-semibold text-white ${valid ? "bg-[var(--st-success)]" : "bg-[var(--st-danger)]"}`}>
                      {valid && <Icon d={ICONS.check} size={12} />}
                      {Number(total.toFixed(2))}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
  );
}

function ClientConfigurations() {
  const [creditReporting, setCreditReporting] = useState(true);
  const [legalAuthorization, setLegalAuthorization] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    settlementAuth: "70",
    hourlyRate: "150",
    legalHourlyRate: "275",
    preLit: "33",
    postLit: "40",
    under1Year: "25",
    over1Year: "33",
    international: "40",
    bouncedChecks: "35",
    secondAssignment: "45",
    underThreshold: "$1,000",
    underRate: "40",
    legalRate: "33",
  });
  const set = (key: string) => (next: string) => setValues((current) => ({ ...current, [key]: next }));

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";

  const affix = (key: string, kind: "%" | "$", className = "") => (
    <div className={`relative ${className}`}>
      {kind === "$" && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">$</span>}
      <input
        type="number"
        min="0"
        max={kind === "%" ? 100 : undefined}
        step="0.01"
        value={values[key]}
        onChange={(event) => set(key)(event.target.value)}
        className={`${fieldClass} ${kind === "$" ? "pl-7" : "pr-8"}`}
      />
      {kind === "%" && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">%</span>}
    </div>
  );

  const field = (label: string, key: string, kind: "%" | "$", suffix?: string) => (
    <label>
      <span className={labelClass}>{label}{suffix && <span className="text-[var(--muted-foreground)]"> {suffix}</span>}</span>
      {affix(key, kind)}
    </label>
  );

  const section = (title: string, sub: string, children: React.ReactNode) => (
    <Card className="h-full overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
        <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{sub}</p>
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );


  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[2fr_3fr] items-stretch gap-5">
        {section("Authorization", "What the agency may do on this client's accounts", (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex h-10 items-center">
                <ToggleSwitch checked={creditReporting} onChange={setCreditReporting} label="Credit reporting" />
              </div>
              <div className="flex h-10 items-center">
                <ToggleSwitch checked={legalAuthorization} onChange={setLegalAuthorization} label="Legal authorization" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("Settlement Authorization", "settlementAuth", "%", "of balance")}
            </div>
          </div>
        ))}
        {section("Account Cancellation", "Fees charged when the client cancels a placed account", (
          <div className="grid grid-cols-4 gap-4">
            {field("Hourly Rate", "hourlyRate", "$")}
            {field("Legal Hourly Rate", "legalHourlyRate", "$")}
            {field("Pre-Litigation", "preLit", "%")}
            {field("Post-Litigation", "postLit", "%")}
          </div>
        ))}
      </div>

      {section("Transaction Allocations", "Agency contingency rate applied to collected amounts", (
        <div className="grid grid-cols-7 gap-4">
          {field("Under 1 Year", "under1Year", "%")}
          {field("Over 1 Year", "over1Year", "%")}
          {field("International Accounts", "international", "%")}
          {field("Bounced Checks", "bouncedChecks", "%")}
          {field("Second Assignment", "secondAssignment", "%")}
          <div>
            <span className={labelClass}>Balances Under</span>
            <div className="grid grid-cols-[1fr_5.5rem] gap-2">
              <select value={values.underThreshold} onChange={(event) => set("underThreshold")(event.target.value)} aria-label="Balance threshold" className={fieldClass}>
                {UNDER_THRESHOLDS.map((amount) => <option key={amount} value={amount}>{amount}</option>)}
              </select>
              {affix("underRate", "%")}
            </div>
          </div>
          {field("Legal Rate", "legalRate", "%")}
        </div>
      ))}

      <DistributionSplitCard />

      <div className="flex justify-end">
        <button type="button" className="btn btn-primary">Save Configuration</button>
      </div>
    </div>
  );
}

const PORTAL_PERMISSIONS = [
  { key: "editStatus", label: "Edit collection status" },
  { key: "editAccount", label: "Edit account" },
  { key: "searchAccount", label: "Search for account" },
  { key: "enterPayments", label: "Enter payments" },
  { key: "uploadDocuments", label: "Upload documents" },
  { key: "uploadClientFiles", label: "Upload client files" },
];

const PORTAL_FIELDS = [
  { key: "firstDelinquency", label: "First delinquency date" },
  { key: "originatedDate", label: "Originated date" },
  { key: "debtorEmployer", label: "Debtor employer" },
  { key: "debtorNotes", label: "Show debtor notes" },
  { key: "callNotes", label: "Show call notes" },
  { key: "accountNotes", label: "Show account notes" },
  { key: "documentNotes", label: "Show document notes" },
];

function ClientPortal() {
  const [enabled, setEnabled] = useState(true);
  const [username, setUsername] = useState("westfield.finance");
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({ searchAccount: true, uploadDocuments: true });
  const [fields, setFields] = useState<Record<string, boolean>>({ originatedDate: true, accountNotes: true });

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand disabled:cursor-not-allowed";

  const toggleGroup = (
    title: string,
    sub: string,
    items: Array<{ key: string; label: string }>,
    state: Record<string, boolean>,
    setState: (next: Record<string, boolean>) => void,
  ) => {
    const allOn = items.every((item) => state[item.key]);
    const onCount = items.filter((item) => state[item.key]).length;
    return (
      <Card className="h-full overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
          <div>
            <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{sub} · {onCount} of {items.length} on</p>
          </div>
          <ToggleSwitch
            checked={allOn}
            onChange={(next) => setState(Object.fromEntries(items.map((item) => [item.key, next])))}
            label="Enable all"
          />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5">
          {items.map((item) => (
            <ToggleSwitch
              key={item.key}
              checked={Boolean(state[item.key])}
              onChange={(next) => setState({ ...state, [item.key]: next })}
              label={item.label}
            />
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
          <div>
            <h3 className="text-[16px] font-semibold text-brand">Portal Access</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Let this client sign in to view and manage their placed accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge label={enabled ? "Enabled" : "Disabled"} variant={enabled ? "success" : "outline"} className="text-[13px]" />
            <ToggleSwitch checked={enabled} onChange={setEnabled} label="Portal enabled" hideLabel />
          </div>
        </div>
        <fieldset disabled={!enabled} className="flex flex-wrap items-end gap-4 p-5 transition-opacity disabled:opacity-50">
          <label className="w-80">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Username</span>
            <input value={username} onChange={(event) => { setUsername(event.target.value); setSentAt(null); }} placeholder="client.username" className={fieldClass} />
          </label>
          <button
            type="button"
            disabled={!username.trim()}
            onClick={() => setSentAt(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }))}
            className="btn btn-primary h-10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon d={ICONS.mail} size={13} />
            Send Temporary Password
          </button>
          {sentAt && (
            <span className="flex h-10 items-center gap-1.5 text-[14px] font-medium text-emerald-500">
              <Icon d={ICONS.check} size={14} />
              Temporary password sent to {CLIENT.email} at {sentAt}
            </span>
          )}
        </fieldset>
      </Card>

      <fieldset disabled={!enabled} className="grid grid-cols-2 items-stretch gap-5 transition-opacity disabled:opacity-50">
        {toggleGroup("Permissions", "What the client can do in the portal", PORTAL_PERMISSIONS, permissions, setPermissions)}
        {toggleGroup("Show Fields", "Account details visible to the client", PORTAL_FIELDS, fields, setFields)}
      </fieldset>
    </div>
  );
}

function ClientPage({ onBack }: { onBack: () => void }) {
  const [client, setClient] = useState(CLIENT);
  const [contacts, setContacts] = useState(CLIENT_CONTACTS);
  const [editing, setEditing] = useState<"assignment" | "corporate" | "contacts" | null>(null);
  const [legalDetail, setLegalDetail] = useState<string | null>(null);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [tab, setTab] = useState<"overview" | "accounts" | "documents" | "accounting" | "reminders" | "portal" | "configurations">("overview");
  const [accountingView, setAccountingView] = useState<"account" | "legal">("account");

  const TABS = [
    { key: "overview", label: "Overview", icon: ICONS.dashboard },
    { key: "accounts", label: "Accounts", icon: ICONS.debtors },
    { key: "documents", label: "Documents", icon: ICONS.file },
    { key: "accounting", label: "Accounting", icon: ICONS.dollar },
    { key: "reminders", label: "Reminders", icon: ICONS.calendar },
    { key: "portal", label: "Client Portal", icon: ICONS.globe },
    { key: "configurations", label: "Configurations", icon: ICONS.settings },
  ] as const;

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">

      {/* ── Hero strip ── */}
      <div className="border-b border-[var(--border)] bg-[var(--card)] px-6 pt-5 pb-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[14px] text-[var(--muted-foreground)]">
          <button onClick={onBack} className="flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors">
            <Icon d={ICONS.back} size={13} />
            Clients
          </button>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">{client.name}</span>
        </div>

        {/* Client identity row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-xl font-semibold text-brand">{client.name}</h2>
                <Badge label={client.status} variant="success" />
                <Badge label={client.substatus} variant="warning" />
                <button
                  type="button"
                  onClick={() => setAgreementOpen(true)}
                  className="ml-1 flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[13px] font-semibold text-brand transition-colors hover:bg-brand/20"
                >
                  <Icon d={ICONS.file} size={12} />
                  Agreement {CLIENT_AGREEMENT.version}
                </button>
              </div>
              <div className="flex items-center gap-4 text-[14px] text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5"><Icon d={ICONS.building} size={12} />{client.industry}</span>
                <span className="flex items-center gap-1.5"><Icon d={ICONS.mapPin} size={12} />{client.city}, {client.state}</span>
                <span className="flex items-center gap-1.5"><Icon d={ICONS.globe} size={12} />{client.website}</span>
                <span className="flex items-center gap-1.5"><Icon d={ICONS.calendar} size={12} />Since {client.since}</span>
              </div>
              <div className="mt-2.5"><TagList tags={client.tags} /></div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="btn btn-secondary">
              <Icon d={ICONS.mail} size={13} />Email
            </button>
            <button className="btn btn-secondary">
              <Icon d={ICONS.phone} size={13} />Call
            </button>
            <button className="btn btn-primary">
              <Icon d={ICONS.edit} size={13} />Edit
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <Card className="flex rounded-none rounded-t-lg border-b-0 mb-0 overflow-hidden">
          <ClientKpi label="Outstanding Balance" value={client.outstanding} sub="across open accounts" color="text-red-500" />
          <ClientKpi label="Total Debt Value" value={client.totalDebt} sub="lifetime portfolio" color="text-[var(--foreground)]" />
          <ClientKpi label="Collection Rate" value={client.collectionRate} sub="resolved accounts" color="text-emerald-500" />
          <ClientKpi label="Open Accounts" value={String(client.openAccounts)} sub="requires attention" color="text-amber-500" />
        </Card>

        {/* Tab bar */}
        <div className="tab-bar flex items-center gap-1 mt-0 -mb-px">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[15px] font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-brand text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
              }`}
            >
              <Icon d={t.icon} size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="p-6">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2.7fr)] items-start gap-5">
            {/* Left sidebar */}
            <div className="space-y-4">

              {/* Assignment */}
              <Card className="overflow-hidden">
                <div className="section-head flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)]">
                  <h3 className="text-[16px] font-semibold text-brand capitalize tracking-widest">Assignment</h3>
                  <EditIconButton onClick={() => setEditing("assignment")} label="Edit assignment" />
                </div>
                <div className="px-4 py-3 space-y-3">
                  {[
                    { label: "Opener", value: client.opener },
                    { label: "Closer", value: client.closer },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-[14px] text-[var(--muted-foreground)]">{r.label}</span>
                      <span className="text-[15px] font-medium text-[var(--foreground)]">{r.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Corporate Info */}
              <Card className="overflow-hidden">
                <div className="section-head flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)]">
                  <h3 className="text-[16px] font-semibold text-brand capitalize tracking-widest">Corporate Info</h3>
                  <EditIconButton onClick={() => setEditing("corporate")} label="Edit corporate info" />
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><Icon d={ICONS.mapPin} size={14} /></span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Address</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.address}</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.city}, {client.state} {client.zipCode}</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><Icon d={ICONS.phone} size={14} /></span>
                    <div>
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Phone</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><Icon d={ICONS.mail} size={14} /></span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Email</p>
                      <p className="text-[15px] text-[var(--foreground)] truncate">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-[var(--muted-foreground)] mt-0.5 shrink-0"><Icon d={ICONS.globe} size={14} /></span>
                    <div>
                      <p className="text-[13px] text-brand uppercase tracking-wide mb-0.5">Website</p>
                      <p className="text-[15px] text-[var(--foreground)]">{client.website}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contacts */}
              <Card className="overflow-hidden">
                <div className="section-head flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                  <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Contacts</h3>
                  <EditIconButton onClick={() => setEditing("contacts")} label="Edit contacts" />
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {contacts.map((contact) => (
                    <div key={`${contact.firstName}-${contact.lastName}`} className="px-4 py-3.5">
                      <div className="mb-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[18px] font-semibold text-[var(--foreground)]">
                            {contact.firstName} {contact.lastName}
                          </p>
                          {contact.primary && <Badge label="Primary" variant="info" className="shrink-0 text-[12px]" />}
                          {contact.personalGuarantor && (
                            <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-emerald-500">
                              <Icon d={ICONS.check} size={13} />
                              Personal guarantor
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[14px] font-medium uppercase tracking-wide text-brand">
                          {contact.title}
                        </p>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 shrink-0 text-[var(--muted-foreground)]">
                            <Icon d={ICONS.mail} size={14} />
                          </span>
                          <div className="min-w-0 flex-1 space-y-1">
                            {contact.emails.map((email) => (
                              <div key={email.value} className="flex min-w-0 items-center justify-between gap-2">
                                <span className="shrink-0 text-[13px] uppercase tracking-wide text-brand">{email.label}</span>
                                <span className="truncate text-[15px] text-[var(--foreground)]" title={email.value}>{email.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 shrink-0 text-[var(--muted-foreground)]">
                            <Icon d={ICONS.phone} size={14} />
                          </span>
                          <div className="min-w-0 flex-1 space-y-1">
                            {contact.phones.map((phone) => (
                              <div key={phone.value} className="flex items-center justify-between gap-2">
                                <span className="shrink-0 text-[13px] uppercase tracking-wide text-brand">{phone.label}</span>
                                <span className="text-[15px] text-[var(--foreground)]">{phone.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* Right 2 cols: recent accounts + notes */}
            <div className="space-y-4">
              {/* Recent Accounts */}
              <Card className="overflow-hidden">
                <div className="section-head px-4 py-3 border-b border-[var(--border)]">
                  <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Recent Accounts</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {["Account ID", "Description", "Amount", "Status", "Agent"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-[13px] font-semibold text-brand uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CLIENT_ACCOUNTS.slice(0, 3).map((c, i) => (
                      <tr key={c.id} className={`hover:bg-[var(--muted)] transition-colors cursor-pointer ${i < 2 ? "border-b border-[var(--border)]" : ""}`}>
                        <td className="px-4 py-3 text-[15px] text-brand font-semibold">{c.id}</td>
                        <td className="px-4 py-3 text-[15px] text-[var(--foreground)]">{c.desc}</td>
                        <td className="px-4 py-3 text-[15px] font-semibold text-[var(--foreground)]">{c.amount}</td>
                        <td className="px-4 py-3"><Badge label={c.status} variant={STATUS_BADGE[c.status]} className="text-[14px]" /></td>
                        <td className="px-4 py-3 text-[15px] text-[var(--muted-foreground)]">{c.agent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <NotesSection initialNotes={CLIENT_NOTES} limit={2} />
            </div>
          </div>
        )}

        {/* ── ACCOUNTS ── */}
        {tab === "accounts" && (
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3">
                <h3 className="text-[16px] font-semibold capitalize tracking-widest text-brand">Account Summary</h3>
              </div>
              <div className="grid grid-cols-6">
                {CLIENT_ACCOUNT_SUMMARY.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`px-4 py-3.5 ${
                      index % 6 !== 5 ? "border-r border-[var(--border)]" : ""
                    } ${index < 6 ? "border-b border-[var(--border)]" : ""}`}
                  >
                    <p className="mb-1 text-[15px] font-medium text-[var(--muted-foreground)]">{metric.label}</p>
                    <p className={`text-[20px] font-semibold tracking-tight ${metric.color}`}>{metric.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="section-head flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                <h3 className="text-[15px] font-semibold text-brand">All Accounts <span className="text-[var(--muted-foreground)] font-normal ml-1">({CLIENT_ACCOUNTS.length})</span></h3>
                <button className="btn btn-primary">
                  <Icon d={ICONS.plus} size={13} />New Account
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Account ID", "Name", "Status", "Total Amount", "Total Collected", "Current Balance", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-brand uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLIENT_ACCOUNTS.map((c, i) => (
                    <tr key={c.id} className={`hover:bg-[var(--muted)] transition-colors cursor-pointer ${i < CLIENT_ACCOUNTS.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                      <td className="px-4 py-3.5 text-[14px] text-brand font-semibold">{c.id}</td>
                      <td className="px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{c.name}</td>
                      <td className="px-4 py-3.5"><Badge label={c.status} variant={STATUS_BADGE[c.status]} /></td>
                      <td className="px-4 py-3.5 text-[15px] font-semibold text-[var(--foreground)]">{c.amount}</td>
                      <td className="px-4 py-3.5 text-[15px] font-semibold text-emerald-500">{c.totalCollected}</td>
                      <td className="px-4 py-3.5 text-[15px] font-semibold text-[var(--foreground)]">{c.currentBalance}</td>
                      <td className="px-4 py-3.5">
                        <button
                          className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                          aria-label={`Open actions for ${c.name}`}
                        >
                          <Icon d={ICONS.moreH} size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {tab === "documents" && (
          <DocumentsSection folders={CLIENT_DOCUMENT_FOLDERS} />
        )}

        {/* ── ACCOUNTING ── */}
        {tab === "accounting" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="px-5 py-4">
                <p className="text-[15px] font-medium text-[var(--muted-foreground)]">Client Owes</p>
                <p className="mt-2 text-[26px] font-semibold tracking-tight text-red-500">$28,450</p>
                <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">Outstanding client balance</p>
              </Card>
              <Card className="px-5 py-4">
                <p className="text-[15px] font-medium text-[var(--muted-foreground)]">Company Owes</p>
                <p className="mt-2 text-[26px] font-semibold tracking-tight text-amber-500">$12,760</p>
                <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">Pending company disbursements</p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 pt-4">
                <div className="flex gap-6">
                  {([
                    { key: "account", label: "Account Billing" },
                    { key: "legal", label: "Legal Billing" },
                  ] as const).map((billingTab) => (
                    <button
                      key={billingTab.key}
                      onClick={() => setAccountingView(billingTab.key)}
                      className={`border-b-2 pb-3 text-[15px] font-medium transition-colors ${
                        accountingView === billingTab.key
                          ? "border-brand text-[var(--foreground)]"
                          : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {billingTab.label}
                    </button>
                  ))}
                </div>
              </div>

              {accountingView === "account" ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Account Number", "Status", "ID / Check Number", "Description", "Attorney Fees", "Agency Fees", "Client Fees", "Convenience Fees", "Attorney Owes", "Agency Owes", "Client Owes"].map((heading) => (
                          <th key={heading} className="whitespace-nowrap px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-widest text-brand">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ACCOUNT_BILLING.map((bill, index) => (
                        <tr key={bill.accountNumber} className={index < ACCOUNT_BILLING.length - 1 ? "border-b border-[var(--border)]" : ""}>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-brand">{bill.accountNumber}</td>
                          <td className="px-4 py-3.5"><Badge label={bill.status} variant={bill.status === "Paid" ? "success" : "warning"} className="text-[14px]" /></td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{bill.idCheckNumber}</td>
                          <td className="min-w-48 px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.description}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.attorneyFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.agencyFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.clientFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.convenienceFees}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-amber-500">{bill.attorneyOwes}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-amber-500">{bill.agencyOwes}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-red-500">{bill.clientOwes}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-4 gap-3 border-t border-[var(--border)] p-4">
                    {ACCOUNT_BILLING_TOTALS.map((total) => (
                      <div key={total.label} className={`rounded-lg px-5 py-4 shadow-sm ${TOTAL_TINT[total.color] ?? "bg-[#52525b]"}`}>
                        <p className="text-[14px] font-medium text-white/85">{total.label}</p>
                        <p className="mt-1 text-[22px] font-bold tracking-tight text-white">{total.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Account Number", "Full Name / Company", "Status", "Current Balance Due", "Statute of Limitation", "Client Sent", "Agency Spent", "Total Pending", "Trust Balance"].map((heading) => (
                          <th key={heading} className="whitespace-nowrap px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-widest text-brand">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {LEGAL_BILLING.map((bill, index) => (
                        <tr
                          key={bill.accountNumber}
                          onClick={() => setLegalDetail(bill.accountNumber)}
                          className={`cursor-pointer transition-colors hover:bg-[var(--muted)] ${index < LEGAL_BILLING.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                        >
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-brand">{bill.accountNumber}</td>
                          <td className="min-w-52 px-4 py-3.5 text-[15px] font-medium text-[var(--foreground)]">{bill.fullNameCompany}</td>
                          <td className="px-4 py-3.5">
                            <Badge
                              label={bill.status}
                              variant={bill.status === "Active" ? "success" : bill.status === "Settled" ? "info" : "warning"}
                              className="text-[14px]"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-red-500">{bill.currentBalanceDue}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.statuteOfLimitation}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.clientSent}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] text-[var(--foreground)]">{bill.agencySpent}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-amber-500">{bill.totalPending}</td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-[15px] font-semibold text-emerald-500">{bill.trustBalance}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-4 gap-3 border-t border-[var(--border)] p-4">
                    {LEGAL_BILLING_TOTALS.map((total) => (
                      <div key={total.label} className={`rounded-lg px-5 py-4 shadow-sm ${TOTAL_TINT[total.color] ?? "bg-[#52525b]"}`}>
                        <p className="text-[14px] font-medium text-white/85">{total.label}</p>
                        <p className="mt-1 text-[22px] font-bold tracking-tight text-white">{total.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── CLIENT PORTAL ── */}
        {tab === "portal" && <ClientPortal />}

        {/* ── CONFIGURATIONS ── */}
        {tab === "configurations" && <ClientConfigurations />}

        {/* ── REMINDERS ── */}
        {tab === "reminders" && (
          <RemindersSection initialReminders={CLIENT_REMINDERS} />
        )}

      </div>
      <AgreementModal open={agreementOpen} onClose={() => setAgreementOpen(false)} />
      <LegalBillingModal accountNumber={legalDetail} onClose={() => setLegalDetail(null)} />
      <EditModal
        open={editing === "assignment"}
        title="Edit Assignment"
        fields={[
          { key: "opener", label: "Opener", type: "select", options: ["Nina Alvarez", "Sarah Okafor", "James Patel", "Daniel Reeves"], span: 1 },
          { key: "closer", label: "Closer", type: "select", options: ["Daniel Reeves", "Sarah Okafor", "James Patel", "Nina Alvarez"], span: 1 },
        ]}
        values={client}
        onSave={(next) => setClient((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "corporate"}
        title="Edit Corporate Info"
        fields={[
          { key: "address", label: "Street Address", span: 3 },
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "zipCode", label: "ZIP Code" },
          { key: "country", label: "Country", type: "select", options: ["United States", "Canada", "United Kingdom", "Australia"] },
          { key: "phone", label: "Phone", type: "tel" },
          { key: "email", label: "Email", type: "email" },
          { key: "website", label: "Website", span: 3 },
        ]}
        values={client}
        onSave={(next) => setClient((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <ContactsEditModal open={editing === "contacts"} contacts={contacts} onSave={setContacts} onClose={() => setEditing(null)} />
    </main>
  );
}

function InfoField({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-brand">{label}</p>
      <div className="text-[13px] font-medium leading-relaxed text-[var(--foreground)]">{children}</div>
    </div>
  );
}

function AccountRightDrawer({
  open,
  title,
  subtitle,
  onClose,
  action,
  children,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-xl flex-col border-l border-[var(--border)] bg-[var(--card)] shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="text-[16px] font-semibold text-[var(--foreground)]">{title}</p>
            <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {action}
            <button type="button" onClick={onClose} className="rounded-md p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]" aria-label={`Close ${title}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </>
  );
}

const TRANSACTION_TYPES = ["Payment", "Settlement Payment", "Interest Accrual", "Court Costs", "Adjustment"];
const PAYMENT_TYPES = ["Payment", "Settlement Payment"];
const ACCOUNT_COLLECTORS = ["Sarah Okafor", "Daniel Reeves", "James Patel", "Nina Alvarez"];

type AccountTransaction = {
  id: number;
  date: string;
  description: string;
  checkNumber: string;
  note: string;
  collector: string;
  coCollector: string;
  amount: number;
  principal: number;
  interest: number;
  costs: number;
  attorneyFees: number;
  thirdPartyFees: number;
  agency: number;
  client: number;
  balance: number;
  payment: boolean;
  checkImage?: string;
};

const EMPTY_SPLIT = { principal: 0, interest: 0, costs: 0, attorneyFees: 0, thirdPartyFees: 0, agency: 0, client: 0 };

const INITIAL_TRANSACTIONS: AccountTransaction[] = [
  { ...EMPTY_SPLIT, id: 1, date: "2025-03-14", description: "Placement", checkNumber: "", note: "Account placed by Empire Commercial Holdings", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 412700, principal: 412700, balance: 412700, payment: false },
  { ...EMPTY_SPLIT, id: 2, date: "2025-12-31", description: "Interest Accrual", checkNumber: "", note: "Annual contractual interest", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 18200, interest: 18200, balance: 430900, payment: false },
  { ...EMPTY_SPLIT, id: 3, date: "2026-02-10", description: "Court Costs", checkNumber: "", note: "Filing fee — NY Supreme Court", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 4300, costs: 4300, balance: 435200, payment: false },
  { id: 4, date: "2026-03-05", description: "Payment", checkNumber: "CHK-10421", note: "Partial payment", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 50000, principal: 27500, interest: 18200, costs: 4300, attorneyFees: 2500, thirdPartyFees: 500, agency: 12500, client: 34500, balance: 385200, payment: true },
  { ...EMPTY_SPLIT, id: 5, date: "2026-06-30", description: "Interest Accrual", checkNumber: "", note: "Semi-annual interest", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 10250, interest: 10250, balance: 395450, payment: false },
  { ...EMPTY_SPLIT, id: 6, date: "2026-07-12", description: "Court Costs", checkNumber: "", note: "Service of process", collector: "Daniel Reeves", coCollector: "Sarah Okafor", amount: 2250, costs: 2250, balance: 397700, payment: false },
  { id: 7, date: "2026-08-26", description: "Payment", checkNumber: "ACH-29018", note: "Payment plan installment", collector: "Sarah Okafor", coCollector: "Daniel Reeves", amount: 85000, principal: 72500, interest: 10250, costs: 2250, attorneyFees: 4250, thirdPartyFees: 850, agency: 21250, client: 58650, balance: 312700, payment: true },
];

const TRANSACTION_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Payment: "success",
  "Settlement Payment": "success",
  "Interest Accrual": "warning",
  "Court Costs": "info",
  Adjustment: "outline",
  Placement: "default",
};

function formatMoney(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2, minimumFractionDigits: 0 });
}

function AccountFinancials() {
  const [transactions, setTransactions] = useState<AccountTransaction[]>(INITIAL_TRANSACTIONS);
  const [form, setForm] = useState({
    date: "2026-10-09",
    description: "Payment",
    amount: "",
    reference: "",
    collector: ACCOUNT_DETAILS.collector,
    coCollector: ACCOUNT_DETAILS.coCollector,
  });
  const [error, setError] = useState("");
  const [checkFile, setCheckFile] = useState<{ name: string; url: string } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({ date: "", checkNumber: "", note: "", collector: "", coCollector: "" });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const runningBalance = new Map<number, number>();
  transactions.reduce((total, t) => {
    const next = t.payment ? total - t.amount : total + t.amount;
    runningBalance.set(t.id, next);
    return next;
  }, 0);

  const startEdit = (t: AccountTransaction) => {
    setDeletingId(null);
    setEditingId(t.id);
    setEditDraft({ date: t.date, checkNumber: t.checkNumber, note: t.note, collector: t.collector, coCollector: t.coCollector });
  };
  const saveEdit = () => {
    setTransactions((current) => current.map((t) => (t.id === editingId ? { ...t, ...editDraft } : t)));
    setEditingId(null);
  };

  const charges = transactions.filter((t) => !t.payment);
  const payments = transactions.filter((t) => t.payment);
  const sum = (rows: AccountTransaction[], key: "principal" | "interest" | "costs" | "amount") => rows.reduce((total, row) => total + row[key], 0);
  const principal = sum(charges, "principal");
  const interest = sum(charges, "interest");
  const costs = sum(charges, "costs");
  const subtotal = principal + interest + costs;
  const totalPaid = sum(payments, "amount");
  const balance = subtotal - totalPaid;

  const postTransaction = (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.date) return setError("Choose a post date.");
    if (!amount || amount <= 0) return setError("Enter an amount greater than zero.");
    const isPayment = PAYMENT_TYPES.includes(form.description);
    if (isPayment && amount > balance) return setError("The payment is larger than the current balance.");

    const base: AccountTransaction = {
      ...EMPTY_SPLIT,
      id: Date.now(),
      date: form.date,
      description: form.description,
      checkNumber: isPayment ? form.reference : "",
      note: isPayment ? "" : form.reference,
      collector: form.collector,
      coCollector: form.coCollector,
      amount,
      balance: isPayment ? balance - amount : balance + amount,
      payment: isPayment,
    };

    let row = base;
    if (isPayment) {
      let remaining = amount;
      const toCosts = Math.min(remaining, costs - sum(payments, "costs"));
      remaining -= toCosts;
      const toInterest = Math.min(remaining, interest - sum(payments, "interest"));
      remaining -= toInterest;
      const attorneyFees = Math.round(amount * 0.05);
      const thirdPartyFees = Math.round(amount * 0.01);
      const agency = Math.round(amount * 0.25);
      row = { ...base, costs: toCosts, interest: toInterest, principal: remaining, attorneyFees, thirdPartyFees, agency, client: amount - attorneyFees - thirdPartyFees - agency };
    } else if (form.description === "Interest Accrual") {
      row = { ...base, interest: amount };
    } else if (form.description === "Court Costs") {
      row = { ...base, costs: amount };
    } else {
      row = { ...base, principal: amount };
    }

    setTransactions((current) => [...current, checkFile ? { ...row, checkImage: checkFile.name } : row]);
    setForm((current) => ({ ...current, amount: "", reference: "" }));
    setCheckFile(null);
    setError("");
  };

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10";
  const labelClass = "mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-brand";
  const allocation = (value: number, payment: boolean) => (value === 0 ? "—" : `${payment ? "−" : ""}${formatMoney(value)}`);
  const split = (value: number) => (value === 0 ? "—" : formatMoney(value));

  return (
    <div className="space-y-4 p-5">
      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Balance Summary</h3>
        </div>
        <div className="grid grid-cols-6 divide-x divide-[var(--border)]">
          {[
            { label: "Principal", value: principal, color: "text-brand" },
            { label: "Interest", value: interest, color: "text-amber-500" },
            { label: "Costs / Fees", value: costs, color: "text-violet-500" },
            { label: "Subtotal", value: subtotal, color: "text-[var(--foreground)]" },
            { label: "Total Paid", value: totalPaid, color: "text-emerald-500" },
            { label: "Current Balance", value: balance, color: "text-red-500" },
          ].map((metric) => (
            <div key={metric.label} className="px-5 py-4">
              <p className="text-[14px] font-semibold uppercase tracking-wider text-brand">{metric.label}</p>
              <p className={`mt-1.5 text-[26px] font-bold tracking-tight ${metric.color}`}>{formatMoney(metric.value)}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Post Transaction</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Record a payment, charge, or adjustment against this account</p>
        </div>
        <form onSubmit={postTransaction} className="grid grid-cols-[repeat(6,minmax(0,1fr))_auto] items-end gap-3 p-5">
          <label>
            <span className={labelClass}>Post Date</span>
            <DateInput value={form.date} onChange={(date) => setForm({ ...form, date })} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Description</span>
            <select value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={fieldClass}>
              {TRANSACTION_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span className={labelClass}>Amount</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--muted-foreground)]">$</span>
              <input type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={`${fieldClass} pl-7`} />
            </div>
          </label>
          <label>
            <span className={labelClass}>Note / Check #</span>
            <input type="text" placeholder={PAYMENT_TYPES.includes(form.description) ? "e.g. CHK-10422" : "Add a note"} value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Collector</span>
            <select value={form.collector} onChange={(e) => setForm({ ...form, collector: e.target.value })} className={fieldClass}>
              {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label>
            <span className={labelClass}>Co-Collector</span>
            <select value={form.coCollector} onChange={(e) => setForm({ ...form, coCollector: e.target.value })} className={fieldClass}>
              <option value="">Not assigned</option>
              {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <button type="submit" className="btn btn-primary h-10">
            <Icon d={ICONS.plus} size={13} />
            Post Transaction
          </button>
          <div className="col-span-7">
            <span className={labelClass}>Check Image <span className="normal-case tracking-normal text-[var(--muted-foreground)]">(proof of payment)</span></span>
            {checkFile ? (
              <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/40 p-2 pr-3">
                <img src={checkFile.url} alt="Check preview" className="h-12 w-20 rounded object-cover" />
                <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-[var(--foreground)]">{checkFile.name}</p>
                <button
                  type="button"
                  onClick={() => { URL.revokeObjectURL(checkFile.url); setCheckFile(null); }}
                  className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
                  aria-label="Remove check image"
                >
                  <Icon d={ICONS.trash} size={14} />
                </button>
              </div>
            ) : (
              <label className="relative flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-dashed border-[var(--border)] text-[14px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:text-brand">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setCheckFile({ name: file.name, url: URL.createObjectURL(file) });
                    event.target.value = "";
                  }}
                />
                <Icon d={ICONS.file} size={16} />
                Click to upload a photo or scan of the check
              </label>
            )}
          </div>
          {error && <p className="col-span-7 text-[13px] font-medium text-red-500">{error}</p>}
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Transaction History</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{transactions.length} transactions · newest first</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
                {[
                  ["Date", "left"], ["Description", "left"], ["Check #", "left"], ["Note", "left"], ["Collector", "left"], ["Co-Collector", "left"],
                  ["Amount", "right"], ["Principal", "right"], ["Interest", "right"], ["Costs / Fees", "right"], ["Attorney Fees", "right"],
                  ["3rd Party Fees", "right"], ["Agency", "right"], ["Client", "right"], ["Balance", "right"], ["Actions", "center"],
                ].map(([heading, align]) => (
                  <th
                    key={heading}
                    className={`whitespace-nowrap px-4 py-3 text-[13px] font-semibold uppercase tracking-wider text-brand ${align === "right" ? "text-right" : align === "center" ? "sticky right-0 bg-[var(--card)] text-center shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.4)]" : "text-left"}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...transactions].reverse().map((t) => {
                const editing = editingId === t.id;
                const editField = "h-8 w-full min-w-28 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-[13px] text-[var(--foreground)] outline-none focus:border-brand";
                return (
                <tr key={t.id} className={`group border-b border-[var(--border)] transition-colors last:border-0 ${editing ? "bg-[var(--brand)]/10" : "hover:bg-[var(--muted)]"}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] text-[var(--foreground)]">
                    {editing ? <div className="w-36"><DateInput value={editDraft.date} onChange={(date) => setEditDraft({ ...editDraft, date })} className={editField} /></div> : formatUSDate(t.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3"><Badge label={t.description} variant={TRANSACTION_BADGE[t.description] ?? "default"} className="text-[13px]" /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] font-semibold text-brand">
                    {editing ? (
                      <input value={editDraft.checkNumber} onChange={(e) => setEditDraft({ ...editDraft, checkNumber: e.target.value })} aria-label="Check number" className={editField} />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {t.checkNumber || "—"}
                        {t.checkImage && <span title={`Check image: ${t.checkImage}`} className="text-[var(--muted-foreground)]"><Icon d={ICONS.file} size={13} /></span>}
                      </span>
                    )}
                  </td>
                  <td className="max-w-56 truncate px-4 py-3 text-[14px] text-[var(--muted-foreground)]" title={t.note}>
                    {editing ? <input value={editDraft.note} onChange={(e) => setEditDraft({ ...editDraft, note: e.target.value })} aria-label="Note" className={editField} /> : t.note || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] text-[var(--foreground)]">
                    {editing ? (
                      <select value={editDraft.collector} onChange={(e) => setEditDraft({ ...editDraft, collector: e.target.value })} aria-label="Collector" className={editField}>
                        {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
                      </select>
                    ) : t.collector}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[14px] text-[var(--foreground)]">
                    {editing ? (
                      <select value={editDraft.coCollector} onChange={(e) => setEditDraft({ ...editDraft, coCollector: e.target.value })} aria-label="Co-collector" className={editField}>
                        <option value="">Not assigned</option>
                        {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
                      </select>
                    ) : t.coCollector || "—"}
                  </td>
                  <td className={`whitespace-nowrap px-4 py-3 text-right text-[14px] font-semibold ${t.payment ? "text-emerald-500" : "text-[var(--foreground)]"}`}>
                    {t.payment ? "−" : ""}{formatMoney(t.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--foreground)]">{allocation(t.principal, t.payment)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--foreground)]">{allocation(t.interest, t.payment)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--foreground)]">{allocation(t.costs, t.payment)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--muted-foreground)]">{split(t.attorneyFees)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-[var(--muted-foreground)]">{split(t.thirdPartyFees)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-amber-500">{split(t.agency)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] text-brand">{split(t.client)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-[14px] font-semibold text-[var(--foreground)]">{formatMoney(runningBalance.get(t.id) ?? t.balance)}</td>
                  <td className="sticky right-0 whitespace-nowrap bg-[var(--card)] px-3 py-2 shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center justify-center gap-1">
                      {editing ? (
                        <>
                          <button type="button" onClick={saveEdit} title="Save" aria-label="Save changes" className="rounded-md p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"><Icon d={ICONS.check} size={15} /></button>
                          <button type="button" onClick={() => setEditingId(null)} title="Cancel" aria-label="Cancel editing" className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                          </button>
                        </>
                      ) : deletingId === t.id ? (
                        <>
                          <button type="button" onClick={() => { setTransactions((current) => current.filter((row) => row.id !== t.id)); setDeletingId(null); }} className="rounded-md bg-[var(--st-danger)] px-2 py-1 text-[12px] font-semibold text-white">Delete</button>
                          <button type="button" onClick={() => setDeletingId(null)} className="rounded-md px-2 py-1 text-[12px] font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">Keep</button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => startEdit(t)} title="Edit" aria-label={`Edit transaction from ${formatUSDate(t.date)}`} className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--brand)]/10 hover:text-brand"><Icon d={ICONS.edit} size={14} /></button>
                          <button type="button" onClick={() => { setEditingId(null); setDeletingId(t.id); }} title="Delete" aria-label={`Delete transaction from ${formatUSDate(t.date)}`} className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"><Icon d={ICONS.trash} size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label, hideLabel = false }: { checked: boolean; onChange: (value: boolean) => void; label: string; hideLabel?: boolean }) {
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

const PLAN_FREQUENCIES = [
  { value: "1", label: "Every" },
  { value: "2", label: "Every other" },
  { value: "3", label: "Every 3rd" },
  { value: "4", label: "Every 4th" },
];

type Installment = { id: number; date: string; amount: string; description: string };

function AccountSettlement() {
  const [planner, setPlanner] = useState<"frequent" | "custom">("frequent");
  const [firstPayment, setFirstPayment] = useState("");
  const [cycle, setCycle] = useState<"weekly" | "monthly">("monthly");
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [monthDays, setMonthDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("1");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [sendReminders, setSendReminders] = useState(true);
  const [differentInitial, setDifferentInitial] = useState(false);
  const [firstPaymentAmount, setFirstPaymentAmount] = useState("");
  const [installments, setInstallments] = useState<Installment[]>([{ id: 1, date: "", amount: "", description: "" }]);
  const currentBalance = ACCOUNT_DETAILS.totalBalance.replace(/[$,]/g, "");
  const settlementBalance = ACCOUNT_PROFILE_DETAILS.settlementAmount.replace(/[$,]/g, "");
  const [primaryCollector, setPrimaryCollector] = useState(ACCOUNT_DETAILS.collector);
  const [coCollector, setCoCollector] = useState(ACCOUNT_DETAILS.coCollector);
  const [basis, setBasis] = useState<"balance" | "settlement">("balance");
  const [planAmount, setPlanAmount] = useState(currentBalance);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "", zip: "" });
  const [ach, setAch] = useState({ type: "Checking", name: "", account: "", routing: "" });
  const [checkFile, setCheckFile] = useState<{ name: string; url: string; isImage: boolean } | null>(null);

  const changeBasis = (value: "balance" | "settlement") => {
    setBasis(value);
    setPlanAmount(value === "balance" ? currentBalance : settlementBalance);
  };

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10";
  const labelClass = "mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-brand";
  const unit = cycle === "weekly" ? "week" : "month";

  const updateInstallment = (id: number, changes: Partial<Installment>) =>
    setInstallments((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const moneyInput = (value: string, onChange: (value: string) => void) => (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--muted-foreground)]">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldClass} pl-7`} />
    </div>
  );

  return (
    <div className="space-y-4 p-5">
      <Card className="overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3">
          <div>
            <h3 className="text-[17px] font-semibold text-brand">Payment Planner</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
              {planner === "frequent" ? "Schedule recurring settlement payments" : "Build a schedule of individual installments"}
            </p>
          </div>
          <select value={planner} onChange={(e) => setPlanner(e.target.value as "frequent" | "custom")} aria-label="Payment planner" className="h-9 w-32 shrink-0 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 text-[14px] font-medium text-[var(--foreground)] outline-none transition-colors focus:border-brand">
            <option value="frequent">Frequent</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {planner === "frequent" ? (
          <div className="p-5">
            <div className="grid grid-cols-4 gap-4">
              <label>
                <span className={labelClass}>First Payment</span>
                <DateInput value={firstPayment} onChange={setFirstPayment} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Repeat Cycle</span>
                <select value={cycle} onChange={(e) => setCycle(e.target.value as "weekly" | "monthly")} className={fieldClass}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
              <div className="col-span-2">
                {cycle === "weekly" ? (
                  <>
                    <span className={labelClass}>Days of the Week</span>
                    <MultiSelectDropdown
                      label="Select one or more weekdays"
                      options={WEEKDAY_OPTIONS.map((day) => ({ value: day, label: day }))}
                      selected={weekDays}
                      onChange={setWeekDays}
                    />
                  </>
                ) : (
                  <>
                    <span className={labelClass}>Days of the Month</span>
                    <MultiSelectDropdown
                      label="Select one or more days"
                      grid
                      options={Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))}
                      selected={monthDays}
                      onChange={setMonthDays}
                    />
                    <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">Missing dates in shorter months run on the month&apos;s final day.</p>
                  </>
                )}
              </div>
              <div>
                <span className={labelClass}>Frequency</span>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} aria-label="Frequency" className={fieldClass}>
                  {PLAN_FREQUENCIES.map((option) => (
                    <option key={option.value} value={option.value}>{option.label} {unit}</option>
                  ))}
                </select>
              </div>
              <label>
                <span className={labelClass}>Payment Amount</span>
                {moneyInput(paymentAmount, setPaymentAmount)}
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-[var(--border)] pt-5">
              <ToggleSwitch checked={sendReminders} onChange={setSendReminders} label="Send payment reminders" />
              <ToggleSwitch checked={differentInitial} onChange={setDifferentInitial} label="Initial payment is different amount" />
              {differentInitial && (
                <label className="w-56">
                  <span className={labelClass}>First Payment Amount</span>
                  {moneyInput(firstPaymentAmount, setFirstPaymentAmount)}
                </label>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="space-y-3">
              {installments.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[2.5rem_12rem_12rem_1fr_2.5rem] items-end gap-3">
                  <span className="flex h-10 items-center justify-center rounded-md bg-brand/10 text-[14px] font-semibold text-brand">{index + 1}</span>
                  <label>
                    <span className={labelClass}>Date</span>
                    <DateInput value={item.date} onChange={(date) => updateInstallment(item.id, { date })} className={fieldClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Amount</span>
                    {moneyInput(item.amount, (amount) => updateInstallment(item.id, { amount }))}
                  </label>
                  <label>
                    <span className={labelClass}>Description</span>
                    <input type="text" placeholder="e.g. Down payment" value={item.description} onChange={(e) => updateInstallment(item.id, { description: e.target.value })} className={fieldClass} />
                  </label>
                  {installments.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setInstallments((current) => current.filter((row) => row.id !== item.id))}
                      aria-label={`Remove installment ${index + 1}`}
                      className="flex h-10 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <Icon d={ICONS.trash} size={15} />
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setInstallments((current) => [...current, { id: Date.now(), date: "", amount: "", description: "" }])}
              className="btn btn-secondary mt-4"
            >
              <Icon d={ICONS.plus} size={13} />
              Add Installment
            </button>
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <ToggleSwitch checked={sendReminders} onChange={setSendReminders} label="Send payment reminders" />
            </div>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Payment Details</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Assign collectors, set the plan amount, and choose how the debtor will pay</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-4 gap-4">
            <label>
              <span className={labelClass}>Primary Collector</span>
              <select value={primaryCollector} onChange={(e) => setPrimaryCollector(e.target.value)} className={fieldClass}>
                {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label>
              <span className={labelClass}>Co-Collector</span>
              <select value={coCollector} onChange={(e) => setCoCollector(e.target.value)} className={fieldClass}>
                <option value="">Not assigned</option>
                {ACCOUNT_COLLECTORS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <div>
              <span className={labelClass}>Calculation Basis</span>
              <div className="flex h-10 items-center gap-0.5 rounded-md bg-[var(--muted)] p-0.5">
                {([["balance", "Current Balance"], ["settlement", "Settlement"]] as const).map(([value, text]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeBasis(value)}
                    aria-pressed={basis === value}
                    className={`h-full flex-1 rounded text-[14px] font-medium transition-all duration-150 ${
                      basis === value
                        ? "bg-[var(--brand)] text-white shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
            <label>
              <span className={labelClass}>Amount</span>
              {moneyInput(planAmount, setPlanAmount)}
            </label>
            <label>
              <span className={labelClass}>Payment Method</span>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  if (checkFile) URL.revokeObjectURL(checkFile.url);
                  setCheckFile(null);
                }}
                className={fieldClass}
              >
                <option value="" disabled>Select a method</option>
                <option value="card">Visa / MasterCard</option>
                <option value="ach">ACH</option>
                <option value="check">Check</option>
                <option value="wire">Wire Transfer</option>
              </select>
            </label>
          </div>

          {paymentMethod === "card" && (
            <div className="mt-5 grid grid-cols-4 gap-4 border-t border-[var(--border)] pt-5">
              <label className="col-span-2">
                <span className={labelClass}>Cardholder Name</span>
                <input type="text" autoComplete="cc-name" placeholder="Name as shown on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className={fieldClass} />
              </label>
              <label className="col-span-2">
                <span className={labelClass}>Card Number</span>
                <input type="text" inputMode="numeric" autoComplete="cc-number" maxLength={19} placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, "") })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Expiration</span>
                <input type="text" autoComplete="cc-exp" maxLength={5} placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>CVV</span>
                <input type="password" inputMode="numeric" autoComplete="cc-csc" maxLength={4} placeholder="•••" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Billing ZIP Code</span>
                <input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={10} placeholder="10022" value={card.zip} onChange={(e) => setCard({ ...card, zip: e.target.value })} className={fieldClass} />
              </label>
            </div>
          )}

          {paymentMethod === "ach" && (
            <div className="mt-5 grid grid-cols-4 gap-4 border-t border-[var(--border)] pt-5">
              <label>
                <span className={labelClass}>Account Type</span>
                <select value={ach.type} onChange={(e) => setAch({ ...ach, type: e.target.value })} className={fieldClass}>
                  <option>Checking</option>
                  <option>Savings</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Account Name</span>
                <input type="text" placeholder="Name on the account" value={ach.name} onChange={(e) => setAch({ ...ach, name: e.target.value })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Account Number</span>
                <input type="text" inputMode="numeric" maxLength={17} placeholder="000123456789" value={ach.account} onChange={(e) => setAch({ ...ach, account: e.target.value.replace(/\D/g, "") })} className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Routing Number</span>
                <input type="text" inputMode="numeric" maxLength={9} placeholder="021000021" value={ach.routing} onChange={(e) => setAch({ ...ach, routing: e.target.value.replace(/\D/g, "") })} className={fieldClass} />
              </label>
            </div>
          )}

          {(paymentMethod === "check" || paymentMethod === "wire") && (() => {
            const isWire = paymentMethod === "wire";
            return (
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <span className={labelClass}>{isWire ? "Wire Transfer Confirmation" : "Check Image"}</span>
              <label className="relative flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/40 p-6 text-center transition-colors hover:border-brand hover:bg-brand/5">
                <input
                  type="file"
                  accept={isWire ? "image/*,application/pdf" : "image/*"}
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (checkFile) URL.revokeObjectURL(checkFile.url);
                    setCheckFile({ name: file.name, url: URL.createObjectURL(file), isImage: file.type.startsWith("image/") });
                    e.target.value = "";
                  }}
                />
                {checkFile ? (
                  <>
                    {checkFile.isImage ? (
                      <img src={checkFile.url} alt={isWire ? "Uploaded wire confirmation" : "Uploaded check"} className="max-h-40 rounded-md border border-[var(--border)] object-contain" />
                    ) : (
                      <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Icon d={ICONS.file} size={28} />
                      </span>
                    )}
                    <p className="text-[14px] font-medium text-[var(--foreground)]">{checkFile.name}</p>
                    <p className="text-[13px] text-brand">Click to replace the file</p>
                  </>
                ) : (
                  <>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icon d={ICONS.file} size={20} />
                    </span>
                    <p className="text-[15px] font-medium text-[var(--foreground)]">
                      {isWire ? "Click to upload the wire transfer confirmation" : "Click to upload the check image"}
                    </p>
                    <p className="text-[13px] text-[var(--muted-foreground)]">
                      {isWire ? "PDF, PNG, or JPG of the bank's wire receipt" : "PNG or JPG of the front of the check"}
                    </p>
                  </>
                )}
              </label>
            </div>
            );
          })()}
        </div>
      </Card>
    </div>
  );
}

type LegalField = { key: string; label: string; type: "date" | "text" | "money" | "select"; options?: string[] };

const LEGAL_COURTS = [
  "NY Supreme Court — New York County",
  "NY Supreme Court — Kings County",
  "NYC Civil Court — Manhattan",
  "US District Court — S.D.N.Y.",
];
const PROCESS_SERVERS = ["Metro Process Service", "Empire Legal Services", "Liberty Process Servers"];

const COMPLAINT_FIELDS: LegalField[] = [
  { key: "county", label: "County", type: "text" },
  { key: "caseNumber", label: "Court Case #", type: "text" },
  { key: "court", label: "Court", type: "select", options: LEGAL_COURTS },
  { key: "complaintSent", label: "Complaint Sent Date", type: "date" },
  { key: "complaintFiled", label: "Complaint Filed Date", type: "date" },
  { key: "courtNumber", label: "Court Number", type: "text" },
  { key: "sentForService", label: "Sent for Service Date", type: "date" },
  { key: "processServer", label: "Process Server", type: "select", options: PROCESS_SERVERS },
  { key: "complaintServed", label: "Complaint Served Date", type: "date" },
  { key: "answerFiled", label: "Answer Filed Date", type: "date" },
];

const JUDGMENT_FIELDS: LegalField[] = [
  { key: "judgmentSent", label: "Judgment Sent Date", type: "date" },
  { key: "judgmentEntered", label: "Judgment Entered Date", type: "date" },
  { key: "abstractRecorded", label: "Abstract Recorded Date", type: "date" },
  { key: "satisfactionSent", label: "Satisfaction of Judgment Sent", type: "date" },
  { key: "feesSought", label: "Attorney Fees Sought", type: "money" },
  { key: "feesAwarded", label: "Attorney Fees Awarded", type: "money" },
  { key: "judgeName", label: "Name of Judge", type: "text" },
  { key: "countyAbstracted", label: "County Abstracted", type: "text" },
  { key: "courtAbstracted", label: "Court Abstracted", type: "select", options: LEGAL_COURTS },
  { key: "judgmentExpiration", label: "Judgment Expiration Date", type: "date" },
  { key: "judgmentReminder", label: "Judgment Reminder Date", type: "date" },
];

const GARNISHMENT_FIELDS: LegalField[] = [
  { key: "writSent", label: "Writ Sent for Filing", type: "date" },
  { key: "writReturned", label: "Writ Returned Date", type: "date" },
  { key: "wagesSent", label: "Garnish Wages Sent", type: "date" },
  { key: "wagesReceived", label: "Garnish Wages Received", type: "date" },
  { key: "bankSent", label: "Bank Garnish Sent", type: "date" },
  { key: "bankReceived", label: "Bank Garnish Received", type: "date" },
  { key: "unsatisfiedReturn", label: "Unsatisfied Return Rec'd", type: "date" },
  { key: "garnishRecheck", label: "Garnish Recheck Date", type: "date" },
  { key: "countyExecuted", label: "County Executed", type: "text" },
  { key: "courtExecuted", label: "Court Executed", type: "select", options: LEGAL_COURTS },
];

const LEGAL_INITIAL: Record<string, string> = {
  county: "New York",
  caseNumber: "651234/2026",
  court: "NY Supreme Court — New York County",
  courtNumber: "Part 54",
  complaintSent: "2026-02-03",
  complaintFiled: "2026-02-10",
  sentForService: "2026-06-20",
  processServer: "Metro Process Service",
  complaintServed: "2026-07-12",
};

function AccountLegal() {
  const [values, setValues] = useState<Record<string, string>>(LEGAL_INITIAL);
  const [hasJudgment, setHasJudgment] = useState(false);

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10";
  const labelClass = "mb-1.5 block text-[13px] font-semibold uppercase tracking-wider text-brand";

  const renderFields = (fields: LegalField[]) => (
    <div className="grid grid-cols-4 gap-4 p-5">
      {fields.map((field) => {
        const value = values[field.key] ?? "";
        const update = (next: string) => setValues((current) => ({ ...current, [field.key]: next }));
        return (
          <label key={field.key}>
            <span className={labelClass}>{field.label}</span>
            {field.type === "select" ? (
              <select value={value} onChange={(e) => update(e.target.value)} className={fieldClass}>
                <option value="">Select…</option>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.type === "money" ? (
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--muted-foreground)]">$</span>
                <input type="number" min="0" step="0.01" placeholder="0.00" value={value} onChange={(e) => update(e.target.value)} className={`${fieldClass} pl-7`} />
              </div>
            ) : (
              field.type === "date"
                ? <DateInput value={value} onChange={update} className={fieldClass} />
                : <input type={field.type} value={value} onChange={(e) => update(e.target.value)} className={fieldClass} />
            )}
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 p-5">
      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Complaint Information</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Court filing, service, and answer details for this account</p>
        </div>
        {renderFields(COMPLAINT_FIELDS)}
      </Card>

      <Card className="overflow-hidden">
        <div className={`section-head flex items-center gap-3 px-5 py-3 ${hasJudgment ? "border-b border-[var(--border)]" : ""}`}>
          <h3 className="text-[17px] font-semibold text-brand">Judgment Information</h3>
          <ToggleSwitch checked={hasJudgment} onChange={setHasJudgment} label="Judgment information" hideLabel />
        </div>
        {hasJudgment && renderFields(JUDGMENT_FIELDS)}
      </Card>

      <Card className="overflow-hidden">
        <div className="section-head border-b border-[var(--border)] px-5 py-3">
          <h3 className="text-[17px] font-semibold text-brand">Garnishment Information</h3>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Writ, wage, and bank garnishment activity</p>
        </div>
        {renderFields(GARNISHMENT_FIELDS)}
      </Card>
    </div>
  );
}

const SESSION_DEPARTMENTS: Record<string, { color: string; badge: "default" | "success" | "warning" | "danger" | "info" | "outline" }> = {
  Collections: { color: "var(--brand)", badge: "info" },
  Legal: { color: "var(--st-violet)", badge: "default" },
  Accounting: { color: "var(--st-green)", badge: "success" },
  "Customer Service": { color: "var(--st-amber)", badge: "warning" },
};

const SESSION_USER_DEPARTMENT: Record<string, string> = {
  "Sarah Okafor": "Collections",
  "Daniel Reeves": "Collections",
  "Marcus Reid": "Legal",
  "Avery Collins": "Legal",
  "Elena Brooks": "Accounting",
  "Jordan Hayes": "Customer Service",
};

const ACCOUNT_SESSIONS = [
  { id: 1, date: "2026-10-08T14:20", user: "Sarah Okafor", minutes: 42 },
  { id: 2, date: "2026-10-08T09:05", user: "Elena Brooks", minutes: 18 },
  { id: 3, date: "2026-10-07T16:40", user: "Marcus Reid", minutes: 65 },
  { id: 4, date: "2026-10-07T11:15", user: "Daniel Reeves", minutes: 27 },
  { id: 5, date: "2026-10-06T10:30", user: "Avery Collins", minutes: 50 },
  { id: 6, date: "2026-10-05T15:45", user: "Sarah Okafor", minutes: 35 },
  { id: 7, date: "2026-10-02T13:10", user: "Jordan Hayes", minutes: 12 },
  { id: 8, date: "2026-10-01T09:20", user: "Sarah Okafor", minutes: 58 },
  { id: 9, date: "2026-10-01T08:45", user: "Elena Brooks", minutes: 24 },
  { id: 10, date: "2026-09-29T14:00", user: "Marcus Reid", minutes: 90 },
  { id: 11, date: "2026-09-26T11:30", user: "Daniel Reeves", minutes: 31 },
  { id: 12, date: "2026-09-24T16:15", user: "Avery Collins", minutes: 44 },
  { id: 13, date: "2026-09-22T10:05", user: "Jordan Hayes", minutes: 9 },
  { id: 14, date: "2026-09-19T09:40", user: "Sarah Okafor", minutes: 47 },
  { id: 15, date: "2026-09-15T15:20", user: "Elena Brooks", minutes: 21 },
  { id: 16, date: "2026-09-12T13:35", user: "Marcus Reid", minutes: 38 },
].map((session) => ({ ...session, department: SESSION_USER_DEPARTMENT[session.user] }));

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function AccountSessions() {
  const [userFilter, setUserFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const totalMinutes = ACCOUNT_SESSIONS.reduce((total, session) => total + session.minutes, 0);
  const users = Array.from(new Set(ACCOUNT_SESSIONS.map((session) => session.user))).sort((a, b) => a.localeCompare(b));
  const departments = Object.keys(SESSION_DEPARTMENTS)
    .map((name) => ({ name, minutes: ACCOUNT_SESSIONS.filter((s) => s.department === name).reduce((total, s) => total + s.minutes, 0) }))
    .sort((a, b) => b.minutes - a.minutes);

  const visibleSessions = ACCOUNT_SESSIONS
    .filter((session) => userFilter === "all" || session.user === userFilter)
    .filter((session) => departmentFilter === "all" || session.department === departmentFilter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const visibleMinutes = visibleSessions.reduce((total, session) => total + session.minutes, 0);

  const exportSessions = () => {
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [
      ["Date", "User", "Department", "Duration (minutes)"],
      ...visibleSessions.map((session) => [formatSessionDate(session.date), session.user, session.department, String(session.minutes)]),
    ];
    const csv = rows.map((row) => row.map(quote).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `sessions-${ACCOUNT_DETAILS.accountNumber}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filterClass = "h-8 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 text-[13px] font-medium text-[var(--foreground)] outline-none focus:border-brand";
  const formatSessionDate = (value: string) =>
    new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <div className="space-y-4 p-5">
      <div className="grid grid-cols-[1fr_2fr] items-stretch gap-4">
        <Card className="flex flex-col overflow-hidden">
          <div className="section-head border-b border-[var(--border)] px-5 py-3">
            <h3 className="text-[17px] font-semibold text-brand">Total Time on Account</h3>
          </div>
          <div className="flex flex-1 flex-col justify-center px-5 py-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon d={ICONS.clock} size={22} />
              </span>
              <p className="text-[40px] font-bold leading-none tracking-tight text-brand">{formatDuration(totalMinutes)}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 divide-x divide-[var(--border)] border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">Sessions</p>
                <p className="mt-1 text-[20px] font-semibold text-[var(--foreground)]">{ACCOUNT_SESSIONS.length}</p>
              </div>
              <div className="pl-4">
                <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">Users</p>
                <p className="mt-1 text-[20px] font-semibold text-[var(--foreground)]">{users.length}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="section-head border-b border-[var(--border)] px-5 py-3">
            <h3 className="text-[17px] font-semibold text-brand">Time by Department</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Minutes spent on this account per department</p>
          </div>
          <div className="space-y-4 px-5 py-5">
            {departments.map((department) => {
              const share = totalMinutes ? Math.round((department.minutes / totalMinutes) * 100) : 0;
              return (
                <div key={department.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[15px] font-medium text-[var(--foreground)]">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SESSION_DEPARTMENTS[department.name].color }} />
                      {department.name}
                    </span>
                    <span className="text-[15px] text-[var(--muted-foreground)]">
                      <span className="font-semibold text-[var(--foreground)]">{formatDuration(department.minutes)}</span> · {share}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${share}%`, background: SESSION_DEPARTMENTS[department.name].color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="section-head flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3">
          <div>
            <h3 className="text-[17px] font-semibold text-brand">Session History</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
              {visibleSessions.length} sessions · {formatDuration(visibleMinutes)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} aria-label="Filter sessions by user" className={filterClass}>
              <option value="all">All users</option>
              {users.map((user) => <option key={user} value={user}>{user}</option>)}
            </select>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} aria-label="Filter sessions by department" className={filterClass}>
              <option value="all">All departments</option>
              {Object.keys(SESSION_DEPARTMENTS).map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <button
              type="button"
              onClick={exportSessions}
              disabled={visibleSessions.length === 0}
              title="Export to CSV"
              aria-label="Export sessions to CSV"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand)]/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon d={ICONS.download} size={14} />
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
              {["Date", "User", "Department", "Duration"].map((heading) => (
                <th key={heading} className={`px-5 py-3 text-[13px] font-semibold uppercase tracking-wider text-brand ${heading === "Duration" ? "text-right" : "text-left"}`}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleSessions.map((session) => (
              <tr key={session.id} className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--muted)]">
                <td className="px-5 py-3 text-[14px] text-[var(--foreground)]">{formatSessionDate(session.date)}</td>
                <td className="px-5 py-3 text-[14px] font-medium text-[var(--foreground)]">{session.user}</td>
                <td className="px-5 py-3"><Badge label={session.department} variant={SESSION_DEPARTMENTS[session.department].badge} className="text-[13px]" /></td>
                <td className="px-5 py-3 text-right text-[14px] font-semibold text-[var(--foreground)]">{formatDuration(session.minutes)}</td>
              </tr>
            ))}
            {visibleSessions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center">
                  <p className="text-[14px] font-medium text-[var(--foreground)]">No matching sessions</p>
                  <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">This user has no sessions in the selected department.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const SKIP_TRACE_TABS = [{ key: "credit", label: "Credit Summary" }] as const;
const PROPERTY_OWNERSHIP = ["None", "Own", "Rent", "Mortgage"];

function creditRating(score: number) {
  if (score >= 800) return { label: "Exceptional", color: "var(--st-success)" };
  if (score >= 740) return { label: "Very Good", color: "var(--st-success)" };
  if (score >= 670) return { label: "Good", color: "var(--brand)" };
  if (score >= 580) return { label: "Fair", color: "var(--st-warning)" };
  return { label: "Poor", color: "var(--st-danger)" };
}

function SkipTracingModal({ open, onClose, debtorName }: { open: boolean; onClose: () => void; debtorName: string }) {
  const [tab, setTab] = useState<typeof SKIP_TRACE_TABS[number]["key"]>("credit");
  const [credit, setCredit] = useState({
    score: "642",
    revolving: "48200",
    available: "11800",
    ownership: "Mortgage",
    mortgage: "612000",
    equity: "438000",
    zillow: "1050000",
    rent: "5400",
  });
  const set = (key: keyof typeof credit) => (value: string) => setCredit((current) => ({ ...current, [key]: value }));

  const score = Math.min(850, Math.max(300, Number(credit.score) || 300));
  const rating = creditRating(score);
  const position = ((score - 300) / 550) * 100;
  const revolving = Number(credit.revolving) || 0;
  const available = Number(credit.available) || 0;
  const utilization = revolving + available ? Math.round((revolving / (revolving + available)) * 100) : 0;

  const money = (label: string, key: keyof typeof credit, hint?: string) => (
    <label className="block">
      <span className={EDIT_LABEL_CLASS}>{label}{hint && <span className="text-[var(--muted-foreground)]"> · {hint}</span>}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">$</span>
        <input type="number" min="0" step="1" value={credit[key]} onChange={(event) => set(key)(event.target.value)} className={`${EDIT_FIELD_CLASS} pl-7`} />
      </div>
    </label>
  );

  return (
    <ModalShell open={open} title="Skip Tracing" subtitle={`Credit and asset profile for ${debtorName} · last pulled 10/14/2026`} onClose={onClose} onSubmit={onClose} width="max-w-4xl">
      <div className="-mx-6 -mt-5 mb-5 flex items-center gap-1 border-b border-[var(--border)] px-6">
        {SKIP_TRACE_TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`border-b-2 px-3 py-3 text-[14px] font-medium transition-colors ${tab === item.key ? "border-[var(--brand)] text-brand" : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "credit" && (
        <div className="space-y-6">
          <div className="grid grid-cols-[1.1fr_1fr] gap-5">
            <div className="flex flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-4">
              <div className="flex items-end justify-between gap-4">
                <label className="block w-32">
                  <span className={EDIT_LABEL_CLASS}>Credit Score</span>
                  <input type="number" min="300" max="850" value={credit.score} onChange={(event) => set("score")(event.target.value)} className={`${EDIT_FIELD_CLASS} text-[18px] font-bold`} />
                </label>
                <span className="mb-2 rounded-md px-2.5 py-1 text-[13px] font-semibold text-white" style={{ background: rating.color }}>{rating.label}</span>
              </div>
              <div className="mt-6">
                <div className="relative">
                  <div className="flex h-2.5 overflow-hidden rounded-full">
                    <span className="h-full flex-[280]" style={{ background: "var(--st-danger)" }} />
                    <span className="h-full flex-[90]" style={{ background: "var(--st-warning)" }} />
                    <span className="h-full flex-[70]" style={{ background: "var(--brand)" }} />
                    <span className="h-full flex-[110]" style={{ background: "var(--st-success)" }} />
                  </div>
                  <span
                    className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--card)] shadow transition-[left] duration-300"
                    style={{ left: `${position}%`, background: rating.color }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[12px] text-[var(--muted-foreground)]">
                  <span>300</span><span>580</span><span>670</span><span>740</span><span>850</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 whitespace-nowrap text-[13px]">
                  {[
                    ["Poor", "var(--st-danger)", "300–579"],
                    ["Fair", "var(--st-warning)", "580–669"],
                    ["Good", "var(--brand)", "670–739"],
                    ["Very Good+", "var(--st-success)", "740–850"],
                  ].map(([name, color, range]) => (
                    <div key={name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: color }} />
                      <span className="text-[var(--foreground)]">{name}</span>
                      <span className="text-[var(--muted-foreground)]">{range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-4">
              {money("Revolving Credit", "revolving", "current balance")}
              {money("Available Credit", "available")}
              <div>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="font-medium text-[var(--foreground)]">Credit utilization</span>
                  <span className="font-semibold" style={{ color: utilization > 50 ? "var(--st-danger)" : utilization > 30 ? "var(--st-warning)" : "var(--st-success)" }}>{utilization}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${utilization}%`, background: utilization > 50 ? "var(--st-danger)" : utilization > 30 ? "var(--st-warning)" : "var(--st-success)" }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-brand">Property</p>
            <div className="grid grid-cols-[1.1fr_1fr] items-end gap-5">
              <div>
                <span className={EDIT_LABEL_CLASS}>Property Ownership</span>
                <SegmentedControl label="Property ownership" options={PROPERTY_OWNERSHIP} value={credit.ownership} onChange={set("ownership")} />
              </div>
              {money("Zillow Valuation", "zillow")}
              {money("Mortgage Amount", "mortgage")}
              {money("Available Equity", "equity")}
              {money("Est. Monthly Rent", "rent")}
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

function AccountPage({ onBack }: { onBack: () => void }) {
  const [account, setAccount] = useState(ACCOUNT_DETAILS);
  const [profile, setProfile] = useState(ACCOUNT_PROFILE_DETAILS);
  const [debtor, setDebtor] = useState(ACCOUNT_DEBTOR);
  const [attorney, setAttorney] = useState(ASSIGNEE_ATTORNEY);
  const [employer, setEmployer] = useState(VERIFIED_EMPLOYER);
  const [skipTraceOpen, setSkipTraceOpen] = useState(false);
  const [editing, setEditing] = useState<"header" | "debtor" | "details" | "attorney" | "employer" | null>(null);
  const prefixed = (prefix: string, data: object) => Object.fromEntries(Object.entries(data).map(([key, value]) => [`${prefix}${key}`, value]));
  const unprefixed = (prefix: string, data: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(data).filter(([key]) => key.startsWith(prefix)).map(([key, value]) => [key.slice(prefix.length), value]));
  const withExisting = (options: string[], existing: string[]) => Array.from(new Set([...options, ...existing]));
  const [drawer, setDrawer] = useState<"attorney" | "employer" | null>(null);
  const [accountTab, setAccountTab] = useState<typeof ACCOUNT_PAGE_TABS[number]["key"]>("overview");

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">
      <section className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="px-6 pt-4">
          <div className="mb-4 flex items-center gap-2 text-[14px] text-[var(--muted-foreground)]">
            <button onClick={onBack} className="flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]">
              <Icon d={ICONS.back} size={13} />
              Collections
            </button>
            <span>/</span>
            <span>Manage Accounts</span>
            <span>/</span>
            <span className="font-medium text-[var(--foreground)]">{account.accountNumber}</span>
          </div>

          <div className="mb-4 flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <h2 className="text-[22px] font-semibold tracking-tight text-brand">{account.debtor}</h2>
                <div className="flex items-center gap-1.5">
                  <Badge label={account.status} variant="danger" className="text-[14px]" />
                  <Badge label={account.substatus} variant="warning" className="text-[14px]" />
                </div>
                <span className="mx-1 h-6 w-px bg-[var(--border)]" />
                <TagList tags={account.tags} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-medium text-[var(--muted-foreground)]">Co-debtors</span>
                {account.coDebtors.map((debtor) => (
                  <span
                    key={debtor.name}
                    className={`flex items-center gap-2 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/15 py-1 pr-3 text-[14px] font-medium text-[var(--foreground)] ${debtor.reported ? "pl-1" : "pl-3"}`}
                  >
                    {debtor.reported && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--st-danger)] text-[11px] font-bold text-white" title="Reported">
                        R
                      </span>
                    )}
                    {debtor.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <button type="button" onClick={() => setSkipTraceOpen(true)} className="btn btn-secondary h-8 py-0">
                <Icon d={ICONS.search} size={13} />
                Skip Tracing
              </button>
              <EditIconButton onClick={() => setEditing("header")} label="Edit account header" />
              {account.reported && (
                <div className="reported-pulse flex items-center gap-3 rounded-lg bg-[var(--st-danger)] px-4 py-2.5 text-white">
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
                    <Icon d={ICONS.check} size={14} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-wider opacity-80">Reporting Status</p>
                    <p className="text-[16px] font-semibold">Reported</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-stretch gap-3 px-6 pb-4">
          <div className="grid flex-[2] grid-cols-2 items-center gap-x-6 rounded-lg border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-5 py-2.5">
            {[
              { label: "Account Number", value: account.accountNumber, color: "text-brand" },
              { label: "Account Age", value: account.age, color: "text-[var(--foreground)]" },
            ].map((detail) => (
              <div key={detail.label}>
                <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-brand">{detail.label}</p>
                <p className={`mt-0.5 whitespace-nowrap text-[17px] font-semibold ${detail.color}`}>{detail.value}</p>
              </div>
            ))}
          </div>
          <div className="grid flex-[4] grid-cols-4 items-center gap-x-6 rounded-lg border border-[var(--st-violet)]/25 bg-[var(--st-violet)]/10 px-5 py-2.5">
            {[
              { label: "Collector", value: account.collector },
              { label: "Co-Collector", value: account.coCollector || "Not assigned" },
              { label: "Attorney", value: account.attorney },
              { label: "Legal Assistant", value: account.legalAssistant },
            ].map((detail) => (
              <div key={detail.label}>
                <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-violet-500">{detail.label}</p>
                <p className="mt-0.5 whitespace-nowrap text-[17px] font-semibold text-[var(--foreground)]">{detail.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 rounded-lg border border-[var(--st-green)]/25 bg-[var(--st-green)]/10 px-4 py-2.5">
            <div className="border-r border-[var(--st-green)]/25 pr-5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-emerald-500">Total Balance</p>
              <p className="whitespace-nowrap text-[28px] font-bold leading-tight tracking-tight text-red-500">{account.totalBalance}</p>
              <button type="button" onClick={() => setAccountTab("financials")} className="btn mt-1.5 w-full bg-[var(--st-green)] py-1 text-white shadow-sm transition-[filter] hover:brightness-110">
                <Icon d={ICONS.dollar} size={13} />
                Make Payment
              </button>
            </div>
            <div className="grid grid-flow-col grid-rows-2 gap-x-6 gap-y-2">
              {[
                { label: "Principal", value: profile.principalAmount },
                { label: "Interest", value: profile.interest },
                { label: "Costs / Fees", value: profile.costsFees },
                { label: "Payments", value: profile.payments },
                { label: "Settlement", value: profile.settlementAmount },
                { label: "Linked Balance", value: profile.linkedBalance },
              ].map((metric) => (
                <div key={metric.label}>
                  <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-emerald-500">{metric.label}</p>
                  <p className="mt-0.5 whitespace-nowrap text-[17px] font-semibold text-[var(--foreground)]">{metric.value}</p>
                </div>
              ))}
              <div className="row-span-2">
                <p className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider text-emerald-500">Linked Accounts</p>
                <div className="mt-1 flex flex-col gap-1">
                  {profile.linkedAccounts.map((account) => (
                    <span key={account} className="rounded bg-[var(--brand)] px-2 py-0.5 text-center text-[13px] font-semibold text-white">{account}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-bar flex items-center gap-1 overflow-x-auto border-t border-[var(--border)] px-6">
          {ACCOUNT_PAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAccountTab(tab.key)}
              className={`shrink-0 border-b-2 px-3 py-3 text-[14px] font-medium transition-colors ${
                accountTab === tab.key
                  ? "border-brand text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {accountTab === "overview" ? (
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-[1fr_1.35fr] items-start gap-4">
          <Card className="overflow-hidden">
            <div className="section-head flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-3">
              <div>
                <h3 className="text-[17px] font-semibold text-brand">Debtor Information</h3>
                <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Identity and verified contact information</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => setDrawer("attorney")}
                  className="btn btn-secondary"
                >
                  <Icon d={ICONS.building} size={12} />
                  Assignee Attorney
                </button>
                <button
                  onClick={() => setDrawer("employer")}
                  className="btn btn-secondary"
                >
                  <Icon d={ICONS.check} size={12} />
                  Verified Employer
                </button>
                <EditIconButton onClick={() => setEditing("debtor")} label="Edit debtor information" />
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-x-6">
                {[
                  { label: "First Name", value: debtor.firstName },
                  { label: "Middle Name", value: debtor.middleName },
                  { label: "Last Name", value: debtor.lastName },
                  { label: "SSN", value: debtor.ssn },
                  { label: "Date of Birth", value: debtor.dateOfBirth },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-2.5">
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{item.label}</p>
                    <p className="text-right text-[16px] font-medium text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider text-brand">
                  <Icon d={ICONS.mapPin} size={12} />
                  Addresses
                </p>
                <div className="space-y-1.5">
                  {debtor.addresses.map((address, index) => (
                    <div key={address} className="flex items-start justify-between gap-3 rounded-md bg-[var(--muted)]/60 px-3 py-2">
                      <p className="text-[14px] leading-relaxed text-[var(--foreground)]">{address}</p>
                      <span className="shrink-0 text-[14px] font-medium text-[var(--muted-foreground)]">{index === 0 ? "Primary" : "Secondary"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider text-brand">
                  <Icon d={ICONS.phone} size={12} />
                  Phone Numbers
                </p>
                <div className="space-y-1.5">
                  {debtor.phoneNumbers.map((phone, index) => (
                    <div key={phone} className="flex items-center justify-between rounded-md bg-[var(--muted)]/60 px-3 py-2">
                      <span className="text-[14px] text-[var(--foreground)]">{phone}</span>
                      <span className="text-[14px] font-medium text-[var(--muted-foreground)]">{index === 0 ? "Direct" : "Mobile"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wider text-brand">
                  <Icon d={ICONS.mail} size={12} />
                  Email Addresses
                </p>
                <div className="space-y-1.5">
                  {debtor.emails.map((email, index) => (
                    <div key={email} className="flex items-center justify-between gap-3 rounded-md bg-[var(--muted)]/60 px-3 py-2">
                      <span className="truncate text-[14px] text-[var(--foreground)]">{email}</span>
                      <span className="shrink-0 text-[14px] font-medium text-[var(--muted-foreground)]">{index === 0 ? "Work" : "Personal"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="section-head flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-3">
                <div>
                  <h3 className="text-[17px] font-semibold text-brand">Account Details</h3>
                  <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Placement, delinquency, and linked account information</p>
                </div>
                <EditIconButton onClick={() => setEditing("details")} label="Edit account details" />
              </div>
              <div className="grid grid-cols-2 gap-x-8 px-5">
                {[
                  { label: "Client Name", value: profile.clientName },
                  { label: "Creditor", value: profile.creditor },
                  { label: "Account Type", value: profile.accountType },
                  { label: "Originated Date", value: profile.originatedDate },
                  { label: "Last Date of Service", value: profile.lastServiceDate },
                  { label: "1st Delinquency", value: profile.firstDelinquency },
                  { label: "Charged Off Date", value: profile.chargedOffDate },
                  { label: "Next Work Date", value: profile.nextWorkDate },
                  { label: "Agreement Date", value: profile.agreementDate },
                  { label: "Statute of Limitation Date", value: profile.statuteDate },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-2.5">
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">{item.label}</p>
                    <p className="text-right text-[16px] font-medium text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
            <NotesSection initialNotes={ACCOUNT_NOTES} />
          </div>
        </div>
      </div>
      ) : accountTab === "financials" ? (
        <AccountFinancials />
      ) : accountTab === "settlement" ? (
        <AccountSettlement />
      ) : accountTab === "legal" ? (
        <AccountLegal />
      ) : accountTab === "allocations" ? (
        <div className="p-5">
          <DistributionSplitCard subtitle="How each amount collected on this account is divided between the client, attorney, and agency" />
        </div>
      ) : accountTab === "sessions" ? (
        <AccountSessions />
      ) : accountTab === "reminders" ? (
        <div className="p-5">
          <RemindersSection initialReminders={ACCOUNT_REMINDERS} entityLabel="account" />
        </div>
      ) : accountTab === "documents" ? (
        <div className="p-5">
          <DocumentsSection folders={ACCOUNT_DOCUMENT_FOLDERS} />
        </div>
      ) : (
        <div className="p-6">
          <Card className="flex min-h-64 items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                <Icon d={ICONS.file} size={16} />
              </div>
              <p className="text-[15px] font-semibold text-[var(--foreground)]">
                {ACCOUNT_PAGE_TABS.find((tab) => tab.key === accountTab)?.label}
              </p>
              <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                This workspace is ready for its account information.
              </p>
            </div>
          </Card>
        </div>
      )}

      <AccountRightDrawer
        open={drawer === "attorney"}
        title="Assignee Attorney"
        subtitle="Assigned firm and attorney information"
        onClose={() => setDrawer(null)}
        action={<EditIconButton onClick={() => setEditing("attorney")} label="Edit assignee attorney" />}
      >
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="section-head border-b border-[var(--border)] px-4 py-3">
              <p className="text-[14px] font-semibold text-[var(--foreground)]">Firm Information</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">
              <InfoField label="Firm Name" className="col-span-2">{attorney.firm.name}</InfoField>
              <InfoField label="Tax ID / EIN">{attorney.firm.taxId}</InfoField>
              <InfoField label="Email Address">{attorney.firm.email}</InfoField>
              <InfoField label="Phone Number">{attorney.firm.phone}</InfoField>
              <InfoField label="Fax">{attorney.firm.fax}</InfoField>
              <InfoField label="Street Address" className="col-span-2">{attorney.firm.street}</InfoField>
              <InfoField label="City">{attorney.firm.city}</InfoField>
              <InfoField label="State">{attorney.firm.state}</InfoField>
              <InfoField label="ZIP Code">{attorney.firm.zipCode}</InfoField>
              <InfoField label="Licensed In" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.firm.licensedIn.map((state) => <Badge key={state} label={state} variant="outline" />)}
                </div>
              </InfoField>
              <InfoField label="Practice Areas" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.firm.practiceAreas.map((area) => <Badge key={area} label={area} variant="info" />)}
                </div>
              </InfoField>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="section-head border-b border-[var(--border)] px-4 py-3">
              <p className="text-[14px] font-semibold text-[var(--foreground)]">Attorney Information</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">
              <InfoField label="First Name">{attorney.attorney.firstName}</InfoField>
              <InfoField label="Last Name">{attorney.attorney.lastName}</InfoField>
              <InfoField label="Phone Numbers" className="col-span-2">
                <div className="space-y-1">{attorney.attorney.phoneNumbers.map((phone) => <p key={phone}>{phone}</p>)}</div>
              </InfoField>
              <InfoField label="Email Addresses" className="col-span-2">
                <div className="space-y-1">{attorney.attorney.emails.map((email) => <p key={email}>{email}</p>)}</div>
              </InfoField>
              <InfoField label="Address" className="col-span-2">{attorney.attorney.address}</InfoField>
              <InfoField label="City">{attorney.attorney.city}</InfoField>
              <InfoField label="State">{attorney.attorney.state}</InfoField>
              <InfoField label="ZIP Code">{attorney.attorney.zipCode}</InfoField>
              <InfoField label="Bar Number">{attorney.attorney.barNumber}</InfoField>
              <InfoField label="Licensed In" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.attorney.licensedIn.map((state) => <Badge key={state} label={state} variant="outline" />)}
                </div>
              </InfoField>
              <InfoField label="Practice Areas" className="col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {attorney.attorney.practiceAreas.map((area) => <Badge key={area} label={area} variant="info" />)}
                </div>
              </InfoField>
            </div>
          </Card>
        </div>
      </AccountRightDrawer>

      <AccountRightDrawer
        open={drawer === "employer"}
        title="Verified Employer"
        subtitle="Verified employment and contact information"
        onClose={() => setDrawer(null)}
        action={<EditIconButton onClick={() => setEditing("employer")} label="Edit verified employer" />}
      >
        <Card className="overflow-hidden">
          <div className="section-head border-b border-[var(--border)] px-4 py-3">
            <p className="text-[14px] font-semibold text-[var(--foreground)]">Employer Information</p>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">
            <InfoField label="Company Name" className="col-span-2">{employer.companyName}</InfoField>
            <InfoField label="Title" className="col-span-2">{employer.title}</InfoField>
            <InfoField label="Contact First Name">{employer.contactFirstName}</InfoField>
            <InfoField label="Contact Last Name">{employer.contactLastName}</InfoField>
            <InfoField label="Email Addresses" className="col-span-2">
              <div className="space-y-1">{employer.emails.map((email) => <p key={email}>{email}</p>)}</div>
            </InfoField>
            <InfoField label="Phone Numbers" className="col-span-2">
              <div className="space-y-1">{employer.phoneNumbers.map((phone) => <p key={phone}>{phone}</p>)}</div>
            </InfoField>
          </div>
        </Card>
      </AccountRightDrawer>
      <EditModal
        open={editing === "header"}
        title="Edit Account Header"
        subtitle="Identity, status, co-debtors, and assignment"
        fields={[
          { key: "debtor", label: "Account Name", span: 2 },
          { key: "accountNumber", label: "Account Number" },
          { key: "status", label: "Status", type: "select", options: withExisting(["Active", "Overdue", "In Dispute", "Promise", "Legal Review", "Resolved"], [account.status]) },
          { key: "substatus", label: "Sub-status", type: "select", options: withExisting(["Legal Review", "Payment Plan", "Skip Tracing", "Under Review", "On Hold"], [account.substatus]) },
          { key: "age", label: "Account Age" },
          { key: "collector", label: "Collector", type: "select", options: withExisting(ACCOUNT_COLLECTORS, [account.collector]) },
          { key: "coCollector", label: "Co-Collector", type: "select", options: ["", ...withExisting(ACCOUNT_COLLECTORS, [account.coCollector].filter(Boolean))] },
          { key: "attorney", label: "Attorney", type: "select", options: withExisting(NEW_ACCOUNT_OPTIONS.attorneys, [account.attorney]) },
          { key: "legalAssistant", label: "Legal Assistant" },
          { key: "reported", label: "Reported to credit bureaus", type: "toggle", span: 2 },
          { key: "coDebtors", label: "Co-debtors", type: "custom", span: 3, render: (value, onChange) => <CoDebtorEditor value={value as CoDebtor[]} onChange={onChange} /> },
        ]}
        values={account}
        onSave={(next) => setAccount((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "debtor"}
        title="Edit Debtor Information"
        fields={[
          { key: "firstName", label: "First Name" },
          { key: "middleName", label: "Middle Name" },
          { key: "lastName", label: "Last Name" },
          { key: "ssn", label: "SSN", placeholder: "XXX-XX-XXXX" },
          { key: "dateOfBirth", label: "Date of Birth", type: "date" },
          { key: "addresses", label: "Addresses", type: "list", span: 3, placeholder: "Street, City, State ZIP" },
          { key: "phoneNumbers", label: "Phone Numbers", type: "list", placeholder: "+1 (212) 555-0000" },
          { key: "emails", label: "Email Addresses", type: "list", span: 2, placeholder: "name@example.com" },
        ]}
        values={debtor}
        onSave={(next) => setDebtor((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "details"}
        title="Edit Account Details"
        fields={[
          { key: "clientName", label: "Client Name" },
          { key: "creditor", label: "Creditor" },
          { key: "accountType", label: "Account Type", type: "select", options: ["Commercial", "Consumer"] },
          { key: "originatedDate", label: "Originated Date", type: "date" },
          { key: "lastServiceDate", label: "Last Date of Service", type: "date" },
          { key: "firstDelinquency", label: "1st Delinquency", type: "date" },
          { key: "chargedOffDate", label: "Charged Off Date", type: "date" },
          { key: "nextWorkDate", label: "Next Work Date", type: "date" },
          { key: "agreementDate", label: "Agreement Date", type: "date" },
          { key: "statuteDate", label: "Statute of Limitation Date", type: "date" },
        ]}
        values={profile}
        onSave={(next) => setProfile((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "attorney"}
        title="Edit Assignee Attorney"
        fields={[
          { key: "firm_name", label: "Firm Name", span: 2, section: "Firm Information" },
          { key: "firm_taxId", label: "Tax ID / EIN", section: "Firm Information" },
          { key: "firm_email", label: "Email Address", type: "email", section: "Firm Information" },
          { key: "firm_phone", label: "Phone Number", type: "tel", section: "Firm Information" },
          { key: "firm_fax", label: "Fax", type: "tel", section: "Firm Information" },
          { key: "firm_street", label: "Street Address", span: 3, section: "Firm Information" },
          { key: "firm_city", label: "City", section: "Firm Information" },
          { key: "firm_state", label: "State", section: "Firm Information" },
          { key: "firm_zipCode", label: "ZIP Code", section: "Firm Information" },
          { key: "firm_licensedIn", label: "Licensed In", type: "multi", options: withExisting(LICENSE_STATES, attorney.firm.licensedIn), section: "Firm Information" },
          { key: "firm_practiceAreas", label: "Practice Areas", type: "multi", span: 2, options: withExisting(PRACTICE_AREAS, attorney.firm.practiceAreas), section: "Firm Information" },
          { key: "atty_firstName", label: "First Name", section: "Attorney Information" },
          { key: "atty_lastName", label: "Last Name", section: "Attorney Information" },
          { key: "atty_barNumber", label: "Bar Number", section: "Attorney Information" },
          { key: "atty_phoneNumbers", label: "Phone Numbers", type: "list", section: "Attorney Information" },
          { key: "atty_emails", label: "Email Addresses", type: "list", span: 2, section: "Attorney Information" },
          { key: "atty_address", label: "Address", span: 3, section: "Attorney Information" },
          { key: "atty_city", label: "City", section: "Attorney Information" },
          { key: "atty_state", label: "State", section: "Attorney Information" },
          { key: "atty_zipCode", label: "ZIP Code", section: "Attorney Information" },
          { key: "atty_licensedIn", label: "Licensed In", type: "multi", options: withExisting(LICENSE_STATES, attorney.attorney.licensedIn), section: "Attorney Information" },
          { key: "atty_practiceAreas", label: "Practice Areas", type: "multi", span: 2, options: withExisting(PRACTICE_AREAS, attorney.attorney.practiceAreas), section: "Attorney Information" },
        ]}
        values={{ ...prefixed("firm_", attorney.firm), ...prefixed("atty_", attorney.attorney) }}
        onSave={(next) => setAttorney((current) => ({
          firm: { ...current.firm, ...unprefixed("firm_", next) },
          attorney: { ...current.attorney, ...unprefixed("atty_", next) },
        }))}
        onClose={() => setEditing(null)}
      />
      <EditModal
        open={editing === "employer"}
        title="Edit Verified Employer"
        fields={[
          { key: "companyName", label: "Company Name", span: 2 },
          { key: "title", label: "Debtor's Title" },
          { key: "contactFirstName", label: "Contact First Name" },
          { key: "contactLastName", label: "Contact Last Name" },
          { key: "emails", label: "Email Addresses", type: "list", span: 3 },
          { key: "phoneNumbers", label: "Phone Numbers", type: "list", span: 3 },
        ]}
        values={employer}
        onSave={(next) => setEmployer((current) => ({ ...current, ...next }))}
        onClose={() => setEditing(null)}
      />
      <SkipTracingModal open={skipTraceOpen} onClose={() => setSkipTraceOpen(false)} debtorName={account.debtor} />
    </main>
  );
}

type NewClientContact = {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  emails: string[];
  phones: string[];
  personalGuarantor: boolean;
};

function AddClientPage({ onCancel, onCreated }: { onCancel: () => void; onCreated: () => void }) {
  const [medical, setMedical] = useState(false);
  const [contacts, setContacts] = useState<NewClientContact[]>([
    { id: 1, firstName: "", lastName: "", title: "", emails: [""], phones: [""], personalGuarantor: false },
  ]);
  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";

  const updateContact = (id: number, patch: Partial<NewClientContact>) => {
    setContacts((current) => current.map((contact) => contact.id === id ? { ...contact, ...patch } : contact));
  };

  const updateContactList = (id: number, field: "emails" | "phones", index: number, value: string) => {
    setContacts((current) => current.map((contact) => {
      if (contact.id !== id) return contact;
      const values = [...contact[field]];
      values[index] = value;
      return { ...contact, [field]: values };
    }));
  };

  const addContact = () => {
    const nextId = contacts.reduce((highest, contact) => Math.max(highest, contact.id), 0) + 1;
    setContacts((current) => [
      ...current,
      { id: nextId, firstName: "", lastName: "", title: "", emails: [""], phones: [""], personalGuarantor: false },
    ]);
  };

  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";
  const section = (title: string, children: React.ReactNode) => (
    <Card className="h-full overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
      </div>
      <div className="grid grid-cols-2 content-start gap-4 p-5">{children}</div>
    </Card>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onCreated();
        }}
        className="space-y-5 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-brand">Add a Client</h2>
            <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">Enter the client profile, assignment, corporate details, and primary contacts.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Client
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 items-stretch gap-5">
          {section("Client Information", (
            <>
              <label className="col-span-2">
                <span className={labelClass}>Company Name</span>
                <input required placeholder="e.g. Westfield Group" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Business Type</span>
                <select required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a business type</option>
                  <option>Real Estate Company</option>
                  <option>Construction Company</option>
                  <option>Car Manufacturer</option>
                  <option>Healthcare Provider</option>
                  <option>Retail Company</option>
                  <option>Professional Services</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Website</span>
                <input type="url" placeholder="https://company.com" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Corporate Phone</span>
                <input required type="tel" placeholder="+1 (212) 555-0000" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Corporate Email</span>
                <input required type="email" placeholder="finance@company.com" className={fieldClass} />
              </label>
            </>
          ))}

          {section("Corporate Address", (
            <>
              <label className="col-span-2">
                <span className={labelClass}>Street Address</span>
                <input required placeholder="Street and suite number" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>City</span>
                <input required className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>State / Province</span>
                <input required className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>ZIP / Postal Code</span>
                <input required className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Country</span>
                <select required defaultValue="United States" className={fieldClass}>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </label>
            </>
          ))}

          {section("Status & Assignment", (
            <>
              <label>
                <span className={labelClass}>Status</span>
                <select required defaultValue="Active" className={fieldClass}>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Substatus</span>
                <select required defaultValue="Under Review" className={fieldClass}>
                  <option>Under Review</option>
                  <option>Onboarding</option>
                  <option>Approved</option>
                  <option>On Hold</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Opener</span>
                <select required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select an opener</option>
                  <option>Nina Alvarez</option>
                  <option>Sarah Okafor</option>
                  <option>James Patel</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Closer</span>
                <select required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a closer</option>
                  <option>Daniel Reeves</option>
                  <option>Sarah Okafor</option>
                  <option>James Patel</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Tags</span>
                <select defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a tag</option>
                  <option>High Value</option>
                  <option>Corporate</option>
                  <option>Disputed</option>
                  <option>Standard</option>
                  <option>Priority Client</option>
                </select>
              </label>
              <div className="flex h-10 items-center self-end">
                <ToggleSwitch checked={medical} onChange={setMedical} label="Medical company" />
              </div>
            </>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="section-head flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
            <div>
              <h3 className="text-[16px] font-semibold text-brand">Contacts</h3>
              <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Add contact details and identify personal guarantors.</p>
            </div>
            <button type="button" onClick={addContact} className="btn btn-secondary">
              <Icon d={ICONS.plus} size={12} />
              Add Contact
            </button>
          </div>
          <div className="grid grid-cols-3 items-start gap-4 p-5">
            {contacts.map((contact, contactIndex) => (
              <div key={contact.id} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-[var(--foreground)]">Contact {contactIndex + 1}</p>
                  {contacts.length > 1 && (
                    <button type="button" onClick={() => setContacts((current) => current.filter((item) => item.id !== contact.id))} className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10" aria-label="Remove contact">
                      <Icon d={ICONS.trash} size={13} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className={labelClass}>First Name</span>
                    <input required value={contact.firstName} onChange={(event) => updateContact(contact.id, { firstName: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Last Name</span>
                    <input required value={contact.lastName} onChange={(event) => updateContact(contact.id, { lastName: event.target.value })} className={fieldClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Title / Position</span>
                    <input required value={contact.title} onChange={(event) => updateContact(contact.id, { title: event.target.value })} className={fieldClass} />
                  </label>
                  <div className="flex h-10 items-center self-end">
                    <ToggleSwitch
                      checked={contact.personalGuarantor}
                      onChange={(personalGuarantor) => updateContact(contact.id, { personalGuarantor })}
                      label="Personal guarantor"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[var(--foreground)]">Email Addresses</span>
                      <button type="button" onClick={() => updateContact(contact.id, { emails: [...contact.emails, ""] })} className="text-[13px] font-medium text-brand">+ Add email</button>
                    </div>
                    <div className="space-y-2">
                      {contact.emails.map((email, index) => (
                        <input key={index} required type="email" value={email} onChange={(event) => updateContactList(contact.id, "emails", index, event.target.value)} placeholder="contact@company.com" className={fieldClass} />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[var(--foreground)]">Phone Numbers</span>
                      <button type="button" onClick={() => updateContact(contact.id, { phones: [...contact.phones, ""] })} className="text-[13px] font-medium text-brand">+ Add phone</button>
                    </div>
                    <div className="space-y-2">
                      {contact.phones.map((phone, index) => (
                        <input key={index} required type="tel" value={phone} onChange={(event) => updateContactList(contact.id, "phones", index, event.target.value)} placeholder="+1 (212) 555-0000" className={fieldClass} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addContact}
              className="flex min-h-40 flex-col items-center justify-center gap-2 self-stretch rounded-lg border-2 border-dashed border-[var(--border)] text-[14px] font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:text-brand"
            >
              <Icon d={ICONS.plus} size={18} />
              Add another contact
            </button>
          </div>
        </Card>
      </form>
    </main>
  );
}

function CalendarPage() {
  const [view, setView] = useState<"daily" | "monthly">("monthly");
  const [selectedDate, setSelectedDate] = useState("2026-09-14");
  const [calendarReminders, setCalendarReminders] = useState(CALENDAR_REMINDERS);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<ReminderForm>(EMPTY_REMINDER_FORM);
  const [scheduleError, setScheduleError] = useState("");
  const selectedDateLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dailySlots = Array.from({ length: 21 }, (_, index) => {
    const totalMinutes = 8 * 60 + index * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  });
  const firstDayOffset = new Date(2026, 8, 1).getDay();
  const monthCells = Array.from({ length: 35 }, (_, index) => {
    const day = index - firstDayOffset + 1;
    return day >= 1 && day <= 30 ? day : null;
  });

  const addCalendarReminder = (event: React.FormEvent) => {
    event.preventDefault();
    const needsWeekDays = newReminder.repetition === "Weekly" || newReminder.repetition === "Every 2 weeks";
    if (needsWeekDays && newReminder.weekDays.length === 0) {
      setScheduleError("Select at least one day of the week.");
      return;
    }
    if (newReminder.repetition === "Monthly" && newReminder.monthDays.length === 0) {
      setScheduleError("Select at least one day of the month.");
      return;
    }

    const dueDate = new Date(newReminder.dueDate);
    const date = newReminder.dueDate.slice(0, 10);
    const time = dueDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const nextId = calendarReminders.reduce((highest, reminder) => Math.max(highest, reminder.id), 0) + 1;
    setCalendarReminders((current) => [
      ...current,
      {
        id: nextId,
        date,
        time,
        title: newReminder.description,
        client: "Westfield Group",
        priority: newReminder.priority,
      },
    ]);
    setSelectedDate(date);
    setView("daily");
    setNewReminder(EMPTY_REMINDER_FORM);
    setScheduleError("");
    setReminderModalOpen(false);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-brand">
            {view === "monthly" ? "September 2026" : selectedDateLabel}
          </h2>
          <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">
            {view === "monthly" ? "Monthly reminder schedule" : "Daily schedule in 30-minute intervals"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setScheduleError(""); setReminderModalOpen(true); }}
            className="btn btn-primary"
          >
            <Icon d={ICONS.plus} size={13} />
            Add Reminder
          </button>
          <div className="flex items-center gap-0.5 rounded-md bg-[var(--muted)] p-0.5">
            <button
              onClick={() => setView("daily")}
              className={`rounded px-3 py-1.5 text-[14px] font-medium transition-all ${
                view === "daily"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setView("monthly")}
              className={`rounded px-3 py-1.5 text-[14px] font-medium transition-all ${
                view === "monthly"
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {view === "monthly" ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--muted)]/40">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <div key={day} className="px-3 py-2.5 text-center text-[13px] font-semibold uppercase tracking-wider text-brand">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((day, index) => {
              const date = day ? `2026-09-${String(day).padStart(2, "0")}` : "";
              const events = day ? calendarReminders.filter((reminder) => reminder.date === date) : [];
              const isSelected = date === selectedDate;
              return (
                <button
                  key={index}
                  disabled={!day}
                  onClick={() => {
                    if (!day) return;
                    setSelectedDate(date);
                    setView("daily");
                  }}
                  className={`min-h-32 border-b border-r border-[var(--border)] p-2.5 text-left transition-colors ${
                    day ? "hover:bg-[var(--muted)]/50" : "bg-[var(--muted)]/20"
                  } ${isSelected ? "bg-brand/5" : ""} ${(index + 1) % 7 === 0 ? "border-r-0" : ""} ${index >= 28 ? "border-b-0" : ""}`}
                >
                  {day && (
                    <>
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[14px] font-medium ${
                        isSelected ? "bg-brand text-white" : "text-[var(--foreground)]"
                      }`}>
                        {day}
                      </span>
                      <div className="mt-2 space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div key={event.id} className={`truncate rounded border px-1.5 py-1 text-[12px] font-medium ${CALENDAR_PRIORITY_STYLES[event.priority]}`}>
                            {event.time} · {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <p className="px-1 text-[12px] text-[var(--muted-foreground)]">+{events.length - 2} more</p>
                        )}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="section-head border-b border-[var(--border)] px-5 py-3">
            <p className="text-[15px] font-semibold text-[var(--foreground)]">{selectedDateLabel}</p>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">
              {calendarReminders.filter((reminder) => reminder.date === selectedDate).length} reminders scheduled
            </p>
          </div>
          <div>
            {dailySlots.map((slot) => {
              const events = calendarReminders.filter((reminder) => reminder.date === selectedDate && reminder.time === slot);
              return (
                <div key={slot} className="grid min-h-16 grid-cols-[90px_1fr] border-b border-[var(--border)] last:border-b-0">
                  <div className="border-r border-[var(--border)] px-4 py-3 text-right text-[13px] font-medium text-[var(--muted-foreground)]">
                    {slot}
                  </div>
                  <div className="px-4 py-2">
                    {events.map((event) => (
                      <div key={event.id} className={`flex items-center justify-between rounded-md border px-3 py-2 ${CALENDAR_PRIORITY_STYLES[event.priority]}`}>
                        <div>
                          <p className="text-[14px] font-semibold">{event.title}</p>
                          <p className="mt-0.5 text-[12px] opacity-80">{event.client}</p>
                        </div>
                        <Badge label={event.priority} variant={PRIORITY_BADGE[event.priority]} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      <AddReminderModal
        open={reminderModalOpen}
        reminder={newReminder}
        setReminder={setNewReminder}
        scheduleError={scheduleError}
        clearScheduleError={() => setScheduleError("")}
        onClose={() => setReminderModalOpen(false)}
        onSubmit={addCalendarReminder}
      />
    </main>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)] p-6 space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPI_DATA.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <CollectionChart />
        </div>
        <StatusBreakdown />
      </div>

      {/* Table + Agent Performance */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <DebtorsTable />
        </div>
        <AgentPerformance />
      </div>
    </main>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
const NEW_ACCOUNT_OPTIONS = {
  clients: ["Westfield Group", "Harrington & Co.", "Nordic Logistics AB", "Summit Capital LLC", "Calloway Retail"],
  creditors: ["Empire Commercial Holdings", "Atlantic Trust Bank", "Meridian Capital Finance", "Harbor Medical Group"],
  agreements: ["Standard Contingency — 25%", "Legal Contingency — 33%", "Medical Recovery — 30%", "Flat Fee Recovery"],
  statuses: ["Active", "Overdue", "In Dispute", "Promise", "Legal Review", "Resolved"],
  queues: ["New Placements", "Skip Tracing", "Payment Plans", "Legal Review", "Disputes"],
  attorneys: ["Marcus Reid", "Helena Ortiz", "Samuel Grant"],
};

const NEW_ACCOUNT_STEPS = [
  { key: "details", label: "Account Details", sub: "Placement, assignment, and key dates" },
  { key: "debtor", label: "Add Debtor", sub: "Identity, addresses, and contacts" },
  { key: "documents", label: "Documents", sub: "Agreements, statements, and filings" },
  { key: "allocations", label: "Allocations", sub: "Payment allocation rules" },
];

const NEW_ACCOUNT_DOCUMENT_FOLDERS = [
  { name: "Account Agreements", files: [] },
  { name: "Statements & Payments", files: [] },
  { name: "Legal Filings", files: [] },
];

type ContactEntry = { id: number; label: string; value: string };
type AddressEntry = { id: number; address: string; city: string; state: string; zip: string; country: string };
type ContactPerson = {
  title: string;
  firstName: string;
  lastName: string;
  guarantor: boolean;
  addresses: AddressEntry[];
  phones: ContactEntry[];
  emails: ContactEntry[];
};
type NewDebtor = {
  kind: string;
  firstName: string;
  middleName: string;
  lastName: string;
  aka: string;
  ssn: string;
  birthday: string;
  companyName: string;
  fictitiousName: string;
  registeredName: string;
  contactPerson: ContactPerson;
  addresses: AddressEntry[];
  phones: ContactEntry[];
  emails: ContactEntry[];
  attorney: {
    firmName: string; firmTaxId: string; firmEmail: string; firmPhone: string; firmFax: string;
    firmStreet: string; firmCity: string; firmState: string; firmZip: string;
    firmLicensedIn: string[]; firmPracticeAreas: string[];
    firstName: string; lastName: string; phones: string[]; emails: string[];
    address: string; city: string; state: string; zip: string; barNumber: string;
    licensedIn: string[]; practiceAreas: string[];
  };
  employer: { companyName: string; title: string; contactFirstName: string; contactLastName: string; emails: string[]; phones: string[] };
};

const EMPTY_DEBTOR: NewDebtor = {
  kind: "Individual",
  firstName: "", middleName: "", lastName: "", aka: "", ssn: "", birthday: "",
  companyName: "", fictitiousName: "", registeredName: "",
  contactPerson: {
    title: "", firstName: "", lastName: "", guarantor: false,
    addresses: [{ id: 1, address: "", city: "", state: "", zip: "", country: "" }],
    phones: [{ id: 1, label: "Work", value: "" }],
    emails: [{ id: 1, label: "Work", value: "" }],
  },
  addresses: [{ id: 1, address: "", city: "", state: "", zip: "", country: "United States" }],
  phones: [{ id: 1, label: "Mobile", value: "" }],
  emails: [{ id: 1, label: "Personal", value: "" }],
  attorney: {
    firmName: "", firmTaxId: "", firmEmail: "", firmPhone: "", firmFax: "",
    firmStreet: "", firmCity: "", firmState: "", firmZip: "",
    firmLicensedIn: [], firmPracticeAreas: [],
    firstName: "", lastName: "", phones: [""], emails: [""],
    address: "", city: "", state: "", zip: "", barNumber: "",
    licensedIn: [], practiceAreas: [],
  },
  employer: { companyName: "", title: "", contactFirstName: "", contactLastName: "", emails: [""], phones: [""] },
};

const LICENSE_STATES = ["New York", "New Jersey", "Connecticut", "Pennsylvania", "Massachusetts", "California", "Florida", "Texas"];
const PRACTICE_AREAS = ["Commercial Collections", "Consumer Collections", "Creditors' Rights", "Litigation", "Bankruptcy", "Real Estate"];
const PHONE_LABELS = ["Mobile", "Home", "Work", "Other"];
const EMAIL_LABELS = ["Personal", "Work", "Other"];

function DebtorStep({ value, onChange }: { value: NewDebtor; onChange: (value: NewDebtor) => void }) {
  const [drawer, setDrawer] = useState<"attorney" | "employer" | null>(null);
  const update = (changes: Partial<NewDebtor>) => onChange({ ...value, ...changes });
  const updateAttorney = (changes: Partial<NewDebtor["attorney"]>) => update({ attorney: { ...value.attorney, ...changes } });
  const updateEmployer = (changes: Partial<NewDebtor["employer"]>) => update({ employer: { ...value.employer, ...changes } });

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";

  const text = (label: string, input: string, onInput: (next: string) => void, options: { span?: string; placeholder?: string; type?: string; maxLength?: number } = {}) => (
    <label className={options.span ?? ""}>
      <span className={labelClass}>{label}</span>
      {options.type === "date" ? <DateInput value={input} onChange={onInput} className={fieldClass} /> : <input type={options.type ?? "text"} value={input} maxLength={options.maxLength} placeholder={options.placeholder} onChange={(e) => onInput(e.target.value)} className={fieldClass} />}
    </label>
  );

  const removeButton = (label: string, onRemove: () => void) => (
    <button type="button" onClick={onRemove} aria-label={label} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-500/10">
      <Icon d={ICONS.trash} size={15} />
    </button>
  );

  const contactList = (title: string, entries: ContactEntry[], onEntries: (next: ContactEntry[]) => void, labels: string[], type: string, placeholder: string, addLabel: string) => (
    <div>
      <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-brand">{title}</p>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-2">
            <select
              value={entry.label}
              aria-label={`${title} label`}
              onChange={(e) => onEntries(entries.map((row) => (row.id === entry.id ? { ...row, label: e.target.value } : row)))}
              className="h-10 w-32 shrink-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-brand"
            >
              {labels.map((label) => <option key={label} value={label}>{label}</option>)}
            </select>
            <input
              type={type}
              value={entry.value}
              placeholder={placeholder}
              aria-label={title}
              onChange={(e) => onEntries(entries.map((row) => (row.id === entry.id ? { ...row, value: e.target.value } : row)))}
              className={`${fieldClass} min-w-0 flex-1`}
            />
            {entries.length > 1 && removeButton(`Remove ${entry.label}`, () => onEntries(entries.filter((row) => row.id !== entry.id)))}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onEntries([...entries, { id: Date.now(), label: labels[0], value: "" }])} className="mt-2 text-[13px] font-medium text-brand">
        + {addLabel}
      </button>
    </div>
  );

  const addressRows = (entries: AddressEntry[], onEntries: (next: AddressEntry[]) => void, withCountry: boolean) => (
    <div className="space-y-3">
      {entries.map((item, index) => {
        const set = (changes: Partial<AddressEntry>) => onEntries(entries.map((row) => (row.id === item.id ? { ...row, ...changes } : row)));
        return (
          <div key={item.id} className={`grid items-end gap-3 ${withCountry ? "grid-cols-[2.5rem_2fr_1fr_1fr_1fr_1fr_2.5rem]" : "grid-cols-[2.5rem_2fr_1fr_1fr_1fr_2.5rem]"}`}>
            <span className="flex h-10 items-center justify-center rounded-md bg-brand/10 text-[14px] font-semibold text-brand">{index + 1}</span>
            {text("Address", item.address, (address) => set({ address }), { placeholder: "Street and unit" })}
            {text("City", item.city, (city) => set({ city }))}
            {text("State", item.state, (state) => set({ state }), { placeholder: "NY" })}
            {text("ZIP Code", item.zip, (zip) => set({ zip }), { maxLength: 10 })}
            {withCountry && text("Country", item.country, (country) => set({ country }))}
            {entries.length > 1 ? removeButton(`Remove address ${index + 1}`, () => onEntries(entries.filter((row) => row.id !== item.id))) : <span />}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => onEntries([...entries, { id: Date.now(), address: "", city: "", state: "", zip: "", country: withCountry ? "United States" : "" }])}
        className="btn btn-secondary"
      >
        <Icon d={ICONS.plus} size={13} />
        Add Another Address
      </button>
    </div>
  );

  const section = (title: string, children: React.ReactNode, action?: React.ReactNode) => (
    <Card className="overflow-hidden">
      <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );

  const stringList = (label: string, values: string[], onValues: (next: string[]) => void, type: string, placeholder: string) => (
    <div className="col-span-2">
      <span className={labelClass}>{label}</span>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input type={type} value={item} placeholder={placeholder} aria-label={label} onChange={(e) => onValues(values.map((v, i) => (i === index ? e.target.value : v)))} className={fieldClass} />
            {values.length > 1 && removeButton(`Remove ${label}`, () => onValues(values.filter((_, i) => i !== index)))}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onValues([...values, ""])} className="mt-2 text-[13px] font-medium text-brand">
        + Add {type === "email" ? "email" : "phone"}
      </button>
    </div>
  );

  const multi = (label: string, options: string[], selected: string[], onSelected: (next: string[]) => void) => (
    <div className="col-span-2">
      <span className={labelClass}>{label}</span>
      <MultiSelectDropdown label={`Select ${label.toLowerCase()}`} options={options.map((o) => ({ value: o, label: o }))} selected={selected} onChange={onSelected} />
    </div>
  );

  const drawerCard = (title: string, children: React.ReactNode) => (
    <Card className="overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-4 py-3">
        <p className="text-[14px] font-semibold text-[var(--foreground)]">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 p-4">{children}</div>
    </Card>
  );

  const attorneyAdded = Boolean(value.attorney.firmName || value.attorney.firstName || value.attorney.lastName);
  const employerAdded = Boolean(value.employer.companyName);
  const a = value.attorney;
  const e = value.employer;

  const cp = { ...EMPTY_DEBTOR.contactPerson, ...value.contactPerson };
  const updateContactPerson = (changes: Partial<ContactPerson>) => update({ contactPerson: { ...cp, ...changes } });
  const partyButtons = (value.kind === "Individual"
    ? [
        ["attorney", "Attorney Representing Debtor", "Firm and attorney details", ICONS.building, attorneyAdded],
        ["employer", "Verified Employer", "Employment and contact details", ICONS.check, employerAdded],
      ]
    : [["attorney", "Attorney Representing Debtor", "Firm and attorney details", ICONS.building, attorneyAdded]]) as Array<["attorney" | "employer", string, string, string, boolean]>;

  return (
    <div className="space-y-5">
      <Card className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-[16px] font-semibold text-brand">Debtor Type</p>
          <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Choose whether the debtor is a person or a business</p>
        </div>
        <div className="w-72">
          <SegmentedControl label="Debtor type" options={["Individual", "Company"]} value={value.kind} onChange={(kind) => update({ kind })} />
        </div>
      </Card>

      {value.kind === "Individual"
        ? section("Debtor Information", (
            <div className="grid grid-cols-6 gap-4">
              {text("First Name", value.firstName, (firstName) => update({ firstName }), { placeholder: "Gregory" })}
              {text("Middle Name", value.middleName, (middleName) => update({ middleName }))}
              {text("Last Name", value.lastName, (lastName) => update({ lastName }), { placeholder: "Westfield" })}
              {text("AKA", value.aka, (aka) => update({ aka }), { placeholder: "Also known as" })}
              {text("SSN", value.ssn, (ssn) => update({ ssn }), { placeholder: "XXX-XX-XXXX", maxLength: 11 })}
              {text("Birthday", value.birthday, (birthday) => update({ birthday }), { type: "date" })}
            </div>
          ))
        : section("Company Information", (
            <div className="grid grid-cols-3 gap-4">
              {text("Company Name", value.companyName, (companyName) => update({ companyName }), { placeholder: "e.g. Westfield Tower B LLC" })}
              {text("Fictitious Business Name", value.fictitiousName, (fictitiousName) => update({ fictitiousName }), { placeholder: "DBA / trade name" })}
              {text("Registered Business Name", value.registeredName, (registeredName) => update({ registeredName }), { placeholder: "Legal registered name" })}
            </div>
          ))}

      {section("Addresses", addressRows(value.addresses, (addresses) => update({ addresses }), true))}

      {section("Contact Information", (
        <div className="grid grid-cols-2 gap-8">
          {contactList("Phone Numbers", value.phones, (phones) => update({ phones }), PHONE_LABELS, "tel", "+1 (212) 555-0101", "Add phone number")}
          {contactList("Email Addresses", value.emails, (emails) => update({ emails }), EMAIL_LABELS, "email", "name@example.com", "Add email address")}
        </div>
      ))}

      {value.kind === "Company" &&
        section("Contact Person", (
          <div className="space-y-5">
            <div className="grid grid-cols-4 items-end gap-4">
              {text("Title", cp.title, (title) => updateContactPerson({ title }), { placeholder: "e.g. CFO" })}
              {text("First Name", cp.firstName, (firstName) => updateContactPerson({ firstName }))}
              {text("Last Name", cp.lastName, (lastName) => updateContactPerson({ lastName }))}
              <div className="flex h-10 items-center">
                <ToggleSwitch checked={cp.guarantor} onChange={(guarantor) => updateContactPerson({ guarantor })} label="Personal guarantor" />
              </div>
            </div>
            <div className="border-t border-[var(--border)] pt-5">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-brand">Addresses</p>
              {addressRows(cp.addresses, (addresses) => updateContactPerson({ addresses }), false)}
            </div>
            <div className="grid grid-cols-2 gap-8 border-t border-[var(--border)] pt-5">
              {contactList("Phone Numbers", cp.phones, (phones) => updateContactPerson({ phones }), PHONE_LABELS, "tel", "+1 (212) 555-0182", "Add phone number")}
              {contactList("Email Addresses", cp.emails, (emails) => updateContactPerson({ emails }), EMAIL_LABELS, "email", "contact@company.com", "Add email address")}
            </div>
          </div>
        ))}

      <div className="grid grid-cols-2 gap-5">
        {partyButtons.map(([key, title, sub, icon, added]) => (
          <button
            key={key}
            type="button"
            onClick={() => setDrawer(key)}
            className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-left transition-colors hover:border-brand"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Icon d={icon} size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-semibold text-brand">{title}</span>
              <span className="block text-[13px] text-[var(--muted-foreground)]">{sub}</span>
            </span>
            {added ? <Badge label="Added" variant="success" className="text-[13px]" /> : <Badge label="Not added" variant="outline" className="text-[13px]" />}
          </button>
        ))}
      </div>

      {createPortal(
        <>
          <AccountRightDrawer open={drawer === "attorney"} title="Attorney Representing Debtor" subtitle="Add the firm and attorney information" onClose={() => setDrawer(null)}>
            <div className="space-y-4">
              {drawerCard("Firm Information", (
                <>
                  {text("Firm Name", a.firmName, (firmName) => updateAttorney({ firmName }), { span: "col-span-2" })}
                  {text("Tax ID / EIN", a.firmTaxId, (firmTaxId) => updateAttorney({ firmTaxId }))}
                  {text("Email Address", a.firmEmail, (firmEmail) => updateAttorney({ firmEmail }), { type: "email" })}
                  {text("Phone Number", a.firmPhone, (firmPhone) => updateAttorney({ firmPhone }), { type: "tel" })}
                  {text("Fax", a.firmFax, (firmFax) => updateAttorney({ firmFax }), { type: "tel" })}
                  {text("Street Address", a.firmStreet, (firmStreet) => updateAttorney({ firmStreet }), { span: "col-span-2" })}
                  {text("City", a.firmCity, (firmCity) => updateAttorney({ firmCity }))}
                  {text("State", a.firmState, (firmState) => updateAttorney({ firmState }))}
                  {text("ZIP Code", a.firmZip, (firmZip) => updateAttorney({ firmZip }))}
                  {multi("Licensed In", LICENSE_STATES, a.firmLicensedIn, (firmLicensedIn) => updateAttorney({ firmLicensedIn }))}
                  {multi("Practice Areas", PRACTICE_AREAS, a.firmPracticeAreas, (firmPracticeAreas) => updateAttorney({ firmPracticeAreas }))}
                </>
              ))}
              {drawerCard("Attorney Information", (
                <>
                  {text("First Name", a.firstName, (firstName) => updateAttorney({ firstName }))}
                  {text("Last Name", a.lastName, (lastName) => updateAttorney({ lastName }))}
                  {stringList("Phone Numbers", a.phones, (phones) => updateAttorney({ phones }), "tel", "+1 (212) 555-0165")}
                  {stringList("Email Addresses", a.emails, (emails) => updateAttorney({ emails }), "email", "attorney@firm.com")}
                  {text("Address", a.address, (address) => updateAttorney({ address }), { span: "col-span-2" })}
                  {text("City", a.city, (city) => updateAttorney({ city }))}
                  {text("State", a.state, (state) => updateAttorney({ state }))}
                  {text("ZIP Code", a.zip, (zip) => updateAttorney({ zip }))}
                  {text("Bar Number", a.barNumber, (barNumber) => updateAttorney({ barNumber }))}
                  {multi("Licensed In", LICENSE_STATES, a.licensedIn, (licensedIn) => updateAttorney({ licensedIn }))}
                  {multi("Practice Areas", PRACTICE_AREAS, a.practiceAreas, (practiceAreas) => updateAttorney({ practiceAreas }))}
                </>
              ))}
              <div className="flex justify-end">
                <button type="button" onClick={() => setDrawer(null)} className="btn btn-primary">Save Attorney</button>
              </div>
            </div>
          </AccountRightDrawer>

          <AccountRightDrawer open={drawer === "employer"} title="Verified Employer" subtitle="Add the verified employment and contact information" onClose={() => setDrawer(null)}>
            <div className="space-y-4">
              {drawerCard("Employer Information", (
                <>
                  {text("Company Name", e.companyName, (companyName) => updateEmployer({ companyName }), { span: "col-span-2" })}
                  {text("Title", e.title, (title) => updateEmployer({ title }), { span: "col-span-2" })}
                  {text("Contact First Name", e.contactFirstName, (contactFirstName) => updateEmployer({ contactFirstName }))}
                  {text("Contact Last Name", e.contactLastName, (contactLastName) => updateEmployer({ contactLastName }))}
                  {stringList("Email Addresses", e.emails, (emails) => updateEmployer({ emails }), "email", "contact@company.com")}
                  {stringList("Phone Numbers", e.phones, (phones) => updateEmployer({ phones }), "tel", "+1 (212) 555-0182")}
                </>
              ))}
              <div className="flex justify-end">
                <button type="button" onClick={() => setDrawer(null)} className="btn btn-primary">Save Employer</button>
              </div>
            </div>
          </AccountRightDrawer>
        </>,
        document.body
      )}
    </div>
  );
}

function SegmentedControl({ options, value, onChange, label }: { options: string[]; value: string; onChange: (value: string) => void; label: string }) {
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

type InterestEntry = { id: number; calc: string; type: string; rate: string; start: string; amount: string };
type CostEntry = { id: number; amount: string; type: string; note: string };
type PostInterestEntry = { id: number; rate: string; start: string; type: string };
type NewAccountFinancial = {
  kind: string;
  principal: string;
  interests: InterestEntry[];
  costs: CostEntry[];
  linked: string[];
  judgmentAmount: string;
  preRate: string;
  preType: string;
  preStart: string;
  caseNumber: string;
  postEnabled: boolean;
  postInterests: PostInterestEntry[];
};

const EMPTY_FINANCIAL: NewAccountFinancial = {
  kind: "Claim",
  principal: "",
  interests: [],
  costs: [],
  linked: [],
  judgmentAmount: "",
  preRate: "",
  preType: "Simple",
  preStart: "",
  caseNumber: "",
  postEnabled: false,
  postInterests: [{ id: 1, rate: "", start: "", type: "Simple" }],
};

const COST_TYPES = ["Court Costs", "Filing Fee", "Service of Process", "Attorney Fee", "Skip Trace", "Other"];
const INTEREST_TYPES = ["Simple", "Compounding"];

function FinancialDetailsCard({ value, onChange }: { value: NewAccountFinancial; onChange: (value: NewAccountFinancial) => void }) {
  const update = (changes: Partial<NewAccountFinancial>) => onChange({ ...value, ...changes });
  const num = (input: string) => Number(input) || 0;
  const totalInterest = value.interests.reduce((total, item) => total + num(item.amount), 0);
  const totalCosts = value.costs.reduce((total, item) => total + num(item.amount), 0);
  const totalBalance = num(value.principal) + totalInterest + totalCosts;

  const updateInterest = (id: number, changes: Partial<InterestEntry>) =>
    update({ interests: value.interests.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  const updateCost = (id: number, changes: Partial<CostEntry>) =>
    update({ costs: value.costs.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  const updatePost = (id: number, changes: Partial<PostInterestEntry>) =>
    update({ postInterests: value.postInterests.map((item) => (item.id === id ? { ...item, ...changes } : item)) });

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";
  const subheadClass = "text-[13px] font-semibold uppercase tracking-wider text-brand";

  const money = (label: string, input: string, onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">$</span>
        <input type="number" min="0" step="0.01" placeholder="0.00" value={input} onChange={(e) => onInput(e.target.value)} className={`${fieldClass} pl-7`} />
      </div>
    </label>
  );

  const percent = (label: string, input: string, onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <input type="number" min="0" step="0.01" placeholder="0.00" value={input} onChange={(e) => onInput(e.target.value)} className={`${fieldClass} pr-8`} />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[var(--muted-foreground)]">%</span>
      </div>
    </label>
  );

  const dateField = (label: string, input: string, onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <DateInput value={input} onChange={onInput} className={fieldClass} />
    </label>
  );

  const typeSelect = (label: string, input: string, options: string[], onInput: (next: string) => void) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select value={input} onChange={(e) => onInput(e.target.value)} className={fieldClass}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );

  const entryBox = (key: number, title: string, onRemove: () => void, children: React.ReactNode) => (
    <div key={key} className="space-y-3 rounded-md border border-[var(--border)] bg-[var(--muted)]/30 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{title}</span>
        <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-500/10">
          <Icon d={ICONS.trash} size={13} />
        </button>
      </div>
      {children}
    </div>
  );

  const addButton = (label: string, onAdd: () => void) => (
    <button type="button" onClick={onAdd} className="btn btn-secondary w-full">
      <Icon d={ICONS.plus} size={13} />
      {label}
    </button>
  );

  return (
    <Card className="overflow-hidden">
      <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
        <h3 className="text-[16px] font-semibold text-brand">Financial Details</h3>
      </div>
      <div className="space-y-4 p-4">
        <SegmentedControl label="Account kind" options={["Claim", "Judgment"]} value={value.kind} onChange={(kind) => update({ kind })} />

        {value.kind === "Claim" ? (
          <>
            {money("Principal", value.principal, (principal) => update({ principal }))}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-[var(--muted)]/60 px-3 py-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Interest</p>
                <p className="mt-0.5 text-[17px] font-bold text-amber-500">{formatMoney(totalInterest)}</p>
              </div>
              <div className="rounded-md bg-brand/10 px-3 py-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Balance</p>
                <p className="mt-0.5 text-[17px] font-bold text-brand">{formatMoney(totalBalance)}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <p className={subheadClass}>Interest</p>
              {value.interests.map((item, index) =>
                entryBox(item.id, `Interest ${index + 1}`, () => update({ interests: value.interests.filter((row) => row.id !== item.id) }), (
                  <>
                    <SegmentedControl label="Calculation" options={["Flat", "Rate"]} value={item.calc} onChange={(calc) => updateInterest(item.id, { calc })} />
                    {item.calc === "Rate" && (
                      <>
                        {typeSelect("Interest Type", item.type, INTEREST_TYPES, (type) => updateInterest(item.id, { type }))}
                        {percent("Rate", item.rate, (rate) => updateInterest(item.id, { rate }))}
                        {dateField("Start From", item.start, (start) => updateInterest(item.id, { start }))}
                      </>
                    )}
                    {money("Amount", item.amount, (amount) => updateInterest(item.id, { amount }))}
                  </>
                ))
              )}
              {addButton("Add Interest", () =>
                update({ interests: [...value.interests, { id: Date.now(), calc: "Flat", type: "Simple", rate: "", start: "", amount: "" }] })
              )}
            </div>

            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <p className={subheadClass}>Costs / Fees</p>
              {value.costs.map((item, index) =>
                entryBox(item.id, `Cost ${index + 1}`, () => update({ costs: value.costs.filter((row) => row.id !== item.id) }), (
                  <>
                    {money("Amount", item.amount, (amount) => updateCost(item.id, { amount }))}
                    {typeSelect("Type", item.type, COST_TYPES, (type) => updateCost(item.id, { type }))}
                    <label className="block">
                      <span className={labelClass}>Note</span>
                      <input value={item.note} onChange={(e) => updateCost(item.id, { note: e.target.value })} placeholder="Add a note" className={fieldClass} />
                    </label>
                  </>
                ))
              )}
              {addButton("Add Cost / Fee", () =>
                update({ costs: [...value.costs, { id: Date.now(), amount: "", type: COST_TYPES[0], note: "" }] })
              )}
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <span className={labelClass}>Linked Accounts</span>
              <MultiSelectDropdown
                label="Select accounts"
                options={DEBTORS.map((debtor) => ({ value: debtor.id, label: `${debtor.id} · ${debtor.name}` }))}
                selected={value.linked}
                onChange={(linked) => update({ linked })}
              />
              {value.linked.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {value.linked.map((id) => (
                    <span key={id} className="rounded-md bg-brand/10 px-2 py-0.5 text-[12px] font-semibold text-brand">{id}</span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {money("Judgment Amount", value.judgmentAmount, (judgmentAmount) => update({ judgmentAmount }))}
            {percent("Pre-Judgment Rate", value.preRate, (preRate) => update({ preRate }))}
            {typeSelect("Pre-Judgment Interest", value.preType, INTEREST_TYPES, (preType) => update({ preType }))}
            {dateField("Start Date", value.preStart, (preStart) => update({ preStart }))}
            <label className="block">
              <span className={labelClass}>Court Case Number</span>
              <input value={value.caseNumber} onChange={(e) => update({ caseNumber: e.target.value })} placeholder="e.g. 651234/2026" className={fieldClass} />
            </label>

            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <ToggleSwitch checked={value.postEnabled} onChange={(postEnabled) => update({ postEnabled })} label="Apply post-judgment interest" />
              {value.postEnabled && (
                <>
                  {value.postInterests.map((item, index) => {
                    const fields = (
                      <>
                        {percent("Interest Rate", item.rate, (rate) => updatePost(item.id, { rate }))}
                        {dateField("Start Date", item.start, (start) => updatePost(item.id, { start }))}
                        {typeSelect("Interest Type", item.type, INTEREST_TYPES, (type) => updatePost(item.id, { type }))}
                      </>
                    );
                    return value.postInterests.length > 1
                      ? entryBox(item.id, `Rate ${index + 1}`, () => update({ postInterests: value.postInterests.filter((row) => row.id !== item.id) }), fields)
                      : <div key={item.id} className="space-y-3">{fields}</div>;
                  })}
                  {addButton("Add Interest Rate", () =>
                    update({ postInterests: [...value.postInterests, { id: Date.now(), rate: "", start: "", type: "Simple" }] })
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

function AddAccountPage({ onCancel, onCreated }: { onCancel: () => void; onCreated: () => void }) {
  const [step, setStep] = useState(0);
  const [financial, setFinancial] = useState<NewAccountFinancial>(EMPTY_FINANCIAL);
  const [debtor, setDebtor] = useState<NewDebtor>(EMPTY_DEBTOR);
  const [details, setDetails] = useState({
    client: "",
    creditor: "",
    referenceNumber: "",
    agreement: "",
    status: "Active",
    queue: "New Placements",
    accountType: "Commercial",
    medical: "Non-Medical",
    collector: "",
    coCollector: "",
    referringAttorney: "",
    lastServiceDate: "",
    chargedOffDate: "",
    originatedDate: "",
    nextWorkDate: "",
    firstDelinquency: "",
    statuteDate: "",
  });
  const set = (key: keyof typeof details) => (value: string) => setDetails((current) => ({ ...current, [key]: value }));

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-[var(--foreground)]";
  const isLastStep = step === NEW_ACCOUNT_STEPS.length - 1;

  const select = (label: string, key: keyof typeof details, options: string[], placeholder: string, required = false) => (
    <label>
      <span className={labelClass}>{label}{required && <span className="text-red-500"> *</span>}</span>
      <select required={required} value={details[key]} onChange={(e) => set(key)(e.target.value)} className={fieldClass}>
        <option value="" disabled={required}>{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );

  const date = (label: string, key: keyof typeof details) => (
    <label>
      <span className={labelClass}>{label}</span>
      <DateInput value={details[key]} onChange={set(key)} className={fieldClass} />
    </label>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-[var(--background)]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (isLastStep) onCreated();
          else setStep((current) => current + 1);
        }}
        className="space-y-5 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-brand">Add a New Account</h2>
            <p className="mt-0.5 text-[14px] text-[var(--muted-foreground)]">Place a new account and assign it to a collection team.</p>
          </div>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>

        <Card className="px-5 py-4">
          <ol className="flex items-center gap-3">
            {NEW_ACCOUNT_STEPS.map((item, index) => {
              const state = index < step ? "done" : index === step ? "current" : "upcoming";
              return (
                <li key={item.key} className="flex flex-1 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(index)}
                    aria-current={state === "current" ? "step" : undefined}
                    className="group flex items-center gap-3 rounded-md text-left"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-semibold transition-colors ${
                        state === "upcoming"
                          ? "border-[var(--border)] text-[var(--muted-foreground)] group-hover:border-brand group-hover:text-brand"
                          : "border-brand bg-brand text-white"
                      }`}
                    >
                      {state === "done" ? <Icon d={ICONS.check} size={15} /> : index + 1}
                    </span>
                    <span>
                      <span className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Step {index + 1}</span>
                      <span className={`block text-[15px] font-semibold ${state === "upcoming" ? "text-[var(--muted-foreground)] group-hover:text-brand" : "text-brand"}`}>{item.label}</span>
                    </span>
                  </button>
                  {index < NEW_ACCOUNT_STEPS.length - 1 && (
                    <span className={`h-0.5 flex-1 rounded-full ${index < step ? "bg-brand" : "bg-[var(--border)]"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </Card>

        {NEW_ACCOUNT_STEPS[step].key === "details" && (
          <div className="grid grid-cols-[3fr_1fr] items-start gap-5">
          <div className="space-y-5">
            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
                <h3 className="text-[16px] font-semibold text-brand">Placement</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 p-5">
                {select("Client's Name", "client", NEW_ACCOUNT_OPTIONS.clients, "Select a client", true)}
                {select("Creditor", "creditor", NEW_ACCOUNT_OPTIONS.creditors, "Select a creditor", true)}
                <label>
                  <span className={labelClass}>Reference Number</span>
                  <input value={details.referenceNumber} onChange={(e) => set("referenceNumber")(e.target.value)} placeholder="e.g. EMP-2026-0418" className={fieldClass} />
                </label>
                {select("Agreement", "agreement", NEW_ACCOUNT_OPTIONS.agreements, "Select an agreement")}
                {select("Status", "status", NEW_ACCOUNT_OPTIONS.statuses, "Select a status")}
                {select("Queue", "queue", NEW_ACCOUNT_OPTIONS.queues, "Select a queue")}
                <div>
                  <span className={labelClass}>Account Type</span>
                  <SegmentedControl label="Account type" options={["Commercial", "Consumer"]} value={details.accountType} onChange={set("accountType")} />
                </div>
                <div>
                  <span className={labelClass}>Medical</span>
                  <SegmentedControl label="Medical" options={["Medical", "Non-Medical"]} value={details.medical} onChange={set("medical")} />
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
                <h3 className="text-[16px] font-semibold text-brand">Assignment</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 p-5">
                {select("Collector", "collector", ACCOUNT_COLLECTORS, "Select a collector")}
                {select("Co-Collector", "coCollector", ACCOUNT_COLLECTORS, "Not assigned")}
                {select("Referring Attorney", "referringAttorney", NEW_ACCOUNT_OPTIONS.attorneys, "Not assigned")}
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="section-head border-b border-[var(--border)] px-5 py-3.5">
                <h3 className="text-[16px] font-semibold text-brand">Key Dates</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 p-5">
                {date("Last Date of Service", "lastServiceDate")}
                {date("Charged Off Date", "chargedOffDate")}
                {date("Originated Date", "originatedDate")}
                {date("Next Work Date", "nextWorkDate")}
                {date("1st Delinquency", "firstDelinquency")}
                {date("Statute of Limitation Date", "statuteDate")}
              </div>
            </Card>
          </div>
          <FinancialDetailsCard value={financial} onChange={setFinancial} />
          </div>
        )}

        {NEW_ACCOUNT_STEPS[step].key === "debtor" && <DebtorStep value={debtor} onChange={setDebtor} />}

        {NEW_ACCOUNT_STEPS[step].key === "documents" && <DocumentsSection folders={NEW_ACCOUNT_DOCUMENT_FOLDERS} />}

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setStep((current) => current - 1)} disabled={step === 0} className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-40">
            Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[var(--muted-foreground)]">Step {step + 1} of {NEW_ACCOUNT_STEPS.length}</span>
            <button type="submit" className="btn btn-primary">
              {isLastStep ? "Create Account" : "Next"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

type Page = "dashboard" | "calendar" | "add-client" | "client" | "account" | "add-account";

const PAGE_TITLE: Record<Page, { title: string; sub: string }> = {
  "add-account": { title: "Add a New Account", sub: "Account Placement" },
  dashboard: { title: "Dashboard", sub: "Aug 27, 2026 · Week 35" },
  calendar: { title: "Calendar", sub: "Reminder Schedule" },
  "add-client": { title: "Add a Client", sub: "Client Onboarding" },
  client: { title: "Westfield Group", sub: "Client Profile" },
  account: { title: "Account Profile", sub: "DBT-4791" },
};

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [page, setPage] = useState<Page>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleNav = (key: string) => {
    setActiveNav(key);
    if (key === "clients-manage") {
      setPage("client");
    } else if (key === "clients-add") {
      setPage("add-client");
    } else if (key === "collections-manage") {
      setPage("account");
    } else if (key === "collections-add") {
      setPage("add-account");
    } else if (key === "calendar") {
      setPage("calendar");
    } else {
      setPage("dashboard");
    }
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-full overflow-hidden bg-[var(--background)]">
      <Sidebar
        active={activeNav}
        onNav={handleNav}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCalendar={() => handleNav("calendar")}
          calendarActive={page === "calendar"}
          pageTitle={PAGE_TITLE[page].title}
          pageSub={PAGE_TITLE[page].sub}
        />
        {page === "client" && <ClientPage onBack={() => { setPage("dashboard"); setActiveNav("dashboard"); }} />}
        {page === "account" && <AccountPage onBack={() => { setPage("dashboard"); setActiveNav("dashboard"); }} />}
        {page === "add-client" && (
          <AddClientPage
            onCancel={() => { setPage("dashboard"); setActiveNav("dashboard"); }}
            onCreated={() => { setPage("client"); setActiveNav("clients-manage"); }}
          />
        )}
        {page === "add-account" && (
          <AddAccountPage
            onCancel={() => { setPage("dashboard"); setActiveNav("dashboard"); }}
            onCreated={() => { setPage("account"); setActiveNav("collections-manage"); }}
          />
        )}
        {page === "calendar" && <CalendarPage />}
        {page === "dashboard" && <Dashboard />}
      </div>
    </div>
  );
}
