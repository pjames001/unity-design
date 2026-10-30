import Card from "@/components/ui/Card";
import { ArrowDown, ArrowUp, Clock, DollarSign, TrendingUp, Users } from "lucide-react";

export const KPI_DATA = [
  {
    label: "Total Collected",
    value: "$4,827,350",
    change: "+12.4%",
    changeDir: "up",
    sub: "vs last month",
    color: "emerald",
    icon: DollarSign,
  },
  {
    label: "Active Debtors",
    value: "1,284",
    change: "+8",
    changeDir: "up",
    sub: "this week",
    color: "blue",
    icon: Clock,
  },
  {
    label: "New Leads",
    value: "342",
    change: "-5.2%",
    changeDir: "down",
    sub: "vs last month",
    color: "amber",
    icon: Users,
  },
  {
    label: "Collection Rate",
    value: "68.3%",
    change: "+2.1%",
    changeDir: "up",
    sub: "30-day avg",
    color: "violet",
    icon: TrendingUp,
  },
];

export default function KpiCard({ label, value, change, changeDir, sub, color, icon: KpiIcon }: typeof KPI_DATA[0]) {
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
          <KpiIcon size={14} />
        </span>
      </div>
      <p className={`text-2xl font-semibold tracking-tight mb-1 ${colorMap[color]}`}>{value}</p>
      <div className="flex items-center gap-1.5">
        <span className={`text-[14px] font-medium flex items-center gap-0.5 ${changeDir === "up" ? "text-emerald-500" : "text-red-500"}`}>
          {changeDir === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {change}
        </span>
        <span className="text-[14px] text-[var(--muted-foreground)]">{sub}</span>
      </div>
    </Card>
  );
}
