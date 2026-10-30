import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { ACCOUNT_DETAILS, ACCOUNT_SESSIONS } from "@/data/account";
import { formatDuration } from "@/utils/format";
import { Clock, Download } from "lucide-react";

export const SESSION_DEPARTMENTS: Record<string, { color: string; badge: "default" | "success" | "warning" | "danger" | "info" | "outline" }> = {
  Collections: { color: "var(--brand)", badge: "info" },
  Legal: { color: "var(--st-violet)", badge: "default" },
  Accounting: { color: "var(--st-green)", badge: "success" },
  "Customer Service": { color: "var(--st-amber)", badge: "warning" },
};

export default function AccountSessions() {
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
                <Clock size={22} />
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
              <Download size={14} />
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
