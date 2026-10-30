import { useState } from "react";
import Card from "@/components/ui/Card";

export const COLLECTORS = [
  { name: "Sarah Okafor", metric: 74, value: "$842K", label: "Rate" },
  { name: "Daniel Reeves", metric: 69, value: "$712K", label: "Rate" },
  { name: "James Patel", metric: 81, value: "$610K", label: "Rate" },
  { name: "Nina Alvarez", metric: 65, value: "$389K", label: "Rate" },
];

export const SALESPEOPLE = [
  { name: "Ethan Rousseau", metric: 88, value: "52 leads", label: "Conv." },
  { name: "Layla Andersen", metric: 76, value: "44 leads", label: "Conv." },
  { name: "Marcus Tan", metric: 63, value: "31 leads", label: "Conv." },
  { name: "Priya Nwosu", metric: 71, value: "38 leads", label: "Conv." },
];

export const GRADIENT_COLORS = [
  "from-brand/60 to-indigo-600/60",
  "from-violet-500/60 to-purple-600/60",
  "from-emerald-500/60 to-teal-600/60",
  "from-amber-500/60 to-orange-600/60",
];

export default function AgentPerformance() {
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
