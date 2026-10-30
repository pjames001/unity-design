import { useState } from "react";
import { Briefcase, ChevronDown, Clock, House, IdCard, Settings, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavChild = { key: string; label: string; badge?: number };

export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: House },
  {
    key: "leads",
    label: "Leads",
    icon: Users,
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
    icon: Briefcase,
    children: [
      { key: "clients-add", label: "Add a Client" },
      { key: "clients-upload", label: "Upload Clients" },
      { key: "clients-manage", label: "Manage Clients" },
    ],
  },
  {
    key: "collections",
    label: "Collections",
    icon: Clock,
    badge: 8,
    children: [
      { key: "collections-add", label: "Add New Account" },
      { key: "collections-manage", label: "Manage Accounts" },
    ],
  },
  {
    key: "hr",
    label: "HR",
    icon: IdCard,
    children: [
      { key: "hr-employees", label: "Employees" },
      { key: "hr-departments", label: "Departments" },
      { key: "hr-payroll", label: "Payroll" },
    ],
  },
];

export function NavGroup({
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
          <item.icon size={15} />
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && !hasChildren && (
          <span className="text-[10px] bg-brand text-white px-1.5 py-0.5 rounded font-semibold">{item.badge}</span>
        )}
        {hasChildren && (
          <span className={`text-[var(--muted-foreground)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <ChevronDown size={13} />
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

export default function Sidebar({ active, onNav, open, onClose }: {
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
            <X size={15} />
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
              <span className="text-[var(--muted-foreground)] shrink-0"><Settings size={15} /></span>
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
              <ChevronDown size={13} />
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
