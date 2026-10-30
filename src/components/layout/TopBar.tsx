import { useState, useEffect } from "react";
import GlobalSearchModal from "@/components/layout/GlobalSearchModal";
import { Bell, Calendar, Menu, Moon, Search, Sun } from "lucide-react";

export default function TopBar({ theme, toggleTheme, onOpenSidebar, onOpenCalendar, calendarActive, pageTitle, pageSub }: {
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
            <Menu size={16} />
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
            <Search size={15} />
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
            <Calendar size={15} />
          </button>
          <button className="relative p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
          </button>
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
