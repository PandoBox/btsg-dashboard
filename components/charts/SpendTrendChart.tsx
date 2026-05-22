"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { fmt } from "@/lib/utils";

interface Row { month: string; amount: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs">
      <div className="text-white/50 mb-1">{label}</div>
      <div className="font-semibold text-mint">฿{fmt(payload[0].value, 1)}M</div>
    </div>
  );
};

export default function SpendTrendChart({ data }: { data: Row[] }) {
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="month"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${fmt(v)}M`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.amount === max ? "#5EEAD4" : "rgba(94,234,212,0.25)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
