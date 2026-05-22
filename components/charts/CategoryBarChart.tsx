"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { fmt, CHART_COLORS } from "@/lib/utils";

interface Row { expense_group: string; amount: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs">
      <div className="text-white/50 mb-1 max-w-[160px] truncate">{label}</div>
      <div className="font-semibold text-mint">฿{fmt(payload[0].value)}M</div>
    </div>
  );
};

export default function CategoryBarChart({ data }: { data: Row[] }) {
  const top10 = data.slice(0, 10);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={top10}
        layout="vertical"
        barSize={14}
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={(v) => `${fmt(v)}M`}
        />
        <YAxis
          type="category"
          dataKey="expense_group"
          width={130}
          tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={(v: string) => v?.length > 18 ? v.slice(0, 17) + "…" : v}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
          {top10.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} opacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
