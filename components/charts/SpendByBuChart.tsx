"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fmt, buColor } from "@/lib/utils";

interface Row { bu_grouping: string; amount: number }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs">
      <div className="font-semibold text-white mb-0.5">{payload[0].name}</div>
      <div style={{ color: payload[0].payload.fill }}>฿{fmt(payload[0].value)}M</div>
    </div>
  );
};

export default function SpendByBuChart({ data }: { data: Row[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="40%"
          cy="50%"
          innerRadius={60}
          outerRadius={88}
          dataKey="amount"
          nameKey="bu_grouping"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={buColor(d.bu_grouping)} opacity={0.85} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          formatter={(value: string, entry: any) => (
            <span className="text-xs text-white/70">
              {value}
              <span className="ml-2 text-white/40">
                {total > 0 ? ((entry.payload.amount / total) * 100).toFixed(0) : 0}%
              </span>
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
