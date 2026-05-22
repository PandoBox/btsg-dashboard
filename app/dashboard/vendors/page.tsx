import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";
import VendorParetoChart from "@/components/charts/VendorParetoChart";
import { fmt, fmtFull } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const supabase = await createClient();

  const [{ data: vendorRaw }, { data: concRaw }] = await Promise.all([
    supabase.rpc("get_top_vendors",          { months_back: 12, limit_n: 20 }),
    supabase.rpc("get_vendor_concentration", { months_back: 12 }),
  ]);

  const vendors = (vendorRaw as any[]) ?? [];
  const conc    = (concRaw   as any)   ?? {};

  const vendorMapped = vendors.map((r: any) => ({
    vendor_name: r.vendor_name,
    amount:      Number(r.amount) / 1_000_000,
    tx_count:    Number(r.tx_count),
  }));

  const top10Share = Number(conc.top10_share_pct ?? 0);
  const vendorCount = Number(conc.vendor_count ?? 0);

  return (
    <div>
      <Header
        title="Vendor Analysis"
        subtitle="Rolling 12 months · Top 20 vendors by spend"
      />

      {/* Concentration KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-4 stagger">
        <GlassCard delay={0} className="text-center">
          <div className="text-label mb-2">Active Vendors</div>
          <div className="text-value-sm">{fmtFull(vendorCount)}</div>
        </GlassCard>
        <GlassCard delay={60} className="text-center">
          <div className="text-label mb-2">Top 10 Concentration</div>
          <div
            className="text-value-sm"
            style={{ color: top10Share > 70 ? "#FB7185" : top10Share > 50 ? "#FCD34D" : "#5EEAD4" }}
          >
            {top10Share.toFixed(1)}%
          </div>
          <div className="text-xs text-white/35 mt-1">of total spend</div>
        </GlassCard>
        <GlassCard delay={120} className="text-center">
          <div className="text-label mb-2">Tail Vendors</div>
          <div className="text-value-sm text-white/60">{fmtFull(Math.max(vendorCount - 10, 0))}</div>
          <div className="text-xs text-white/35 mt-1">outside top 10</div>
        </GlassCard>
      </div>

      {/* Pareto chart */}
      <GlassCard delay={180} className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-label">Pareto — Top 20 Vendors</div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "#5EEAD4" }} />
              Top 80% spend
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 inline-block" style={{ background: "#FCD34D" }} />
              Cumulative %
            </span>
          </div>
        </div>
        <VendorParetoChart data={vendorMapped} />
      </GlassCard>

      {/* Vendor table */}
      <GlassCard delay={240}>
        <div className="text-label mb-4">Top 20 Vendors by Spend</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-label border-b border-white/8">
                <th className="text-left pb-2 w-6">#</th>
                <th className="text-left pb-2">Vendor</th>
                <th className="text-right pb-2">Spend (฿M)</th>
                <th className="text-right pb-2">Transactions</th>
                <th className="text-right pb-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {vendorMapped.map((v, i) => {
                const totalSpend = vendorMapped.reduce((s, x) => s + x.amount, 0);
                const share = totalSpend > 0 ? (v.amount / totalSpend) * 100 : 0;
                return (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                    <td className="py-2.5 text-white/25 text-xs">{i + 1}</td>
                    <td className="py-2.5 text-white/85 max-w-[200px] truncate font-medium">{v.vendor_name}</td>
                    <td className="py-2.5 text-right text-mint font-semibold">฿{v.amount.toFixed(1)}M</td>
                    <td className="py-2.5 text-right text-white/50">{fmtFull(v.tx_count)}</td>
                    <td className="py-2.5 text-right text-white/40">{share.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
