import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import AddClientPage from "@/pages/AddClientPage";
import CalendarPage from "@/pages/CalendarPage";
import Dashboard from "@/pages/Dashboard";
import AccountPage from "@/pages/account/AccountPage";
import AddAccountPage from "@/pages/add-account/AddAccountPage";
import ClientPage from "@/pages/client/ClientPage";

export type Page = "dashboard" | "calendar" | "add-client" | "client" | "account" | "add-account";

export const PAGE_TITLE: Record<Page, { title: string; sub: string }> = {
  "add-account": { title: "Add a New Account", sub: "Account Placement" },
  dashboard: { title: "Dashboard", sub: "Aug 27, 2026 · 13:54" },
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
