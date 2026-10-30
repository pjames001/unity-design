import { useState, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import { Search, X } from "lucide-react";

export const SEARCH_NAMES = [
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

export const SEARCH_RESULTS = Array.from({ length: 100 }, (_, index) => {
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

export const SEARCH_STATUS_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
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

export const SEARCH_TYPE_BADGE: Record<string, "default" | "success" | "warning" | "danger" | "info" | "outline"> = {
  Lead: "info",
  Client: "success",
  Account: "warning",
  Attorney: "default",
};

export default function GlobalSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              <X size={15} />
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
                      <Search size={13} />
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
                      <Search size={16} />
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
