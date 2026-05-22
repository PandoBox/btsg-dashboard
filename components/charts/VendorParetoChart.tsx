"use client";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { fmt } from "@/lib/utils";

interface Row { vendor_name: string; amount: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs max-w-[200px]">
      <div className="text-white/50 mb-1 truncate">{label}</div>
      <div className="text-mint font-semibold">฿{fmt(payload[0].value)}M</div>
      {payload[1] && (
        <div className="text-white/40 mt-0.5">Cumul. {payload[1].value?.toFixed(0)}%</div>
      )}
    </div>
  );
};

export default function VendorParetoChart({ data }: { data: Row[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  let cumul = 0;
  const enriched = data.slice(0, 20).map((d) => {
    cumul += d.amount;
    return { ...d, cumul_pct: total > 0 ? (cumul / total) * 100 : 0 };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={enriched} barSize={20} margin={{ top: 4, right: 32, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="vendor_name"
          tick={false}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={(v) => `${fmt(v)}M`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar yAxisId="left" dataKey="amount" radius={[4, 4, 0, 0]}>
          {enriched.map((d, i) => (
            <Cell
              key={i}
              fill={d.cumul_pct <= 80 ? "#5EEAD4" : "rgba(94,234,212,0.25)"}
              opacity={0.85}
            />
          ))}
        </Bar>
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cumul_pct"
          stroke="#FCD34D"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
