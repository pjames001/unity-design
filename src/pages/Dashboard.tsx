import AgentPerformance from "@/components/dashboard/AgentPerformance";
import CollectionChart from "@/components/dashboard/CollectionChart";
import DebtorsTable from "@/components/dashboard/DebtorsTable";
import KpiCard, { KPI_DATA } from "@/components/dashboard/KpiCard";
import StatusBreakdown from "@/components/dashboard/StatusBreakdown";

export default function Dashboard() {
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
