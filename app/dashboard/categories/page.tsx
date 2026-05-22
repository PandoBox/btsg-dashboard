import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";
import { fmt, deltaClass, deltaSign } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const [{ data: yoyRaw }, { data: pcaRaw }] = await Promise.all([
    supabase.rpc("get_category_yoy"),
    supabase.rpc("get_pca_breakdown"),
  ]);

  const yoy = (yoyRaw as any[]) ?? [];
  const pca = (pcaRaw as any[]) ?? [];

  // Group PCA by group → sub-group
  const grouped: Record<string, { subs: Record<string, number>; total: number }> = {};
  for (const r of pca) {
    const g = r.new_group_name || r.group_name || "Other";
    const s = r.new_sub_group_name || r.sub_group_name || "Other";
    if (!grouped[g]) grouped[g] = { subs: {}, total: 0 };
    grouped[g].subs[s] = (grouped[g].subs[s] ?? 0) + Number(r.amount ?? 0);
    grouped[g].total   += Number(r.amount ?? 0);
  }
  const sortedGroups = Object.entries(grouped).sort((a, b) => b[1].total - a[1].total);

  return (
    <div>
      <Header
        title="Category Analysis"
        subtitle="Spend hierarchy from PCA assessment · GL account classification"
      />

      {/* YoY table */}
      <GlassCard delay={0} className="mb-4">
        <div className="text-label mb-4">Expense Group — Year-on-Year</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-label border-b border-white/8">
                <th className="text-left pb-2 font-medium">Expense Group</th>
                <th className="text-right pb-2 font-medium">This Year</th>
                <th className="text-right pb-2 font-medium">Last Year</th>
                <th className="text-right pb-2 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {yoy.slice(0, 15).map((r: any, i: number) => {
                const delta = r.delta_pct ? Number(r.delta_pct) : null;
                return (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                    <td className="py-2.5 text-white/80 font-medium">{r.expense_group ?? "Unclassified"}</td>
                    <td className="py-2.5 text-right text-white">฿{fmt(Number(r.this_year))}M</td>
                    <td className="py-2.5 text-right text-white/50">฿{fmt(Number(r.last_year))}M</td>
                    <td className={`py-2.5 text-right font-medium ${delta !== null ? deltaClass(delta) : "text-white/30"}`}>
                      {delta !== null ? `${deltaSign(delta)}${delta.toFixed(1)}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* PCA hierarchy */}
      <GlassCard delay={120}>
        <div className="text-label mb-4">PCA Spend Hierarchy</div>
        <div className="flex flex-col gap-3">
          {sortedGroups.slice(0, 8).map(([group, data]) => {
            const total = data.total;
            const subs  = Object.entries(data.subs).sort((a, b) => b[1] - a[1]);
            return (
              <div key={group}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-white/90">{group}</span>
                  <span className="text-xs text-white/50">฿{fmt(total)}M</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subs.slice(0, 5).map(([sub, amt]) => (
                    <div
                      key={sub}
                      className="flex items-center gap-2 px-3 py-1 rounded-xl text-xs"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <span className="text-white/70 truncate max-w-[140px]">{sub}</span>
                      <span className="text-white/35">฿{fmt(amt)}M</span>
                    </div>
                  ))}
                  {subs.length > 5 && (
                    <span className="text-xs text-white/30 self-center">+{subs.length - 5} more</span>
                  )}
                </div>
                <div className="mt-2 h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-mint"
                    style={{
                      width: `${sortedGroups[0][1].total > 0 ? (total / sortedGroups[0][1].total) * 100 : 0}%`,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
