import { useState } from "react";
import Card from "@/components/ui/Card";

export const CHART_DATA = {
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

export default function CollectionChart() {
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
