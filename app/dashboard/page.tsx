import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import KpiCard from "@/components/KpiCard";
import GlassCard from "@/components/GlassCard";
import SpendTrendChart from "@/components/charts/SpendTrendChart";
import SpendByBuChart from "@/components/charts/SpendByBuChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import { fmt, fmtFull } from "@/lib/utils";
import { TrendingUp, Receipt, Store, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const supabase = await createClient();

  const [
    { data: kpiRaw },
    { data: trendRaw },
    { data: buRaw },
    { data: catRaw },
  ] = await Promise.all([
    supabase.rpc("get_kpi_summary", { months_back: 12 }),
    supabase.rpc("get_monthly_trend", { months_back: 12 }),
    supabase.rpc("get_spend_by_bu",    { months_back: 12 }),
    supabase.rpc("get_spend_by_category", { months_back: 12 }),
  ]);

  const kpi     = (kpiRaw as any) ?? {};
  const trend   = (trendRaw  as any[]) ?? [];
  const buData  = (buRaw     as any[]) ?? [];
  const catData = (catRaw    as any[]) ?? [];

  const totalSpend = Number(kpi.total_spend ?? 0);
  const txCount    = Number(kpi.tx_count    ?? 0);
  const vendorCnt  = Number(kpi.vendor_count ?? 0);
  const companyCnt = Number(kpi.company_count ?? 0);

  const trendMapped = trend.map((r: any) => ({
    month: r.month,
    amount: Number(r.amount) / 1_000_000,
  }));

  const buMapped  = buData.map((r: any)  => ({ ...r, amount: Number(r.amount) / 1_000_000 }));
  const catMapped = catData.map((r: any) => ({ ...r, amount: Number(r.amount) / 1_000_000 }));

  return (
    <div>
      <Header
        title="Spending Overview"
        subtitle="Rolling 12 months · All figures in THB"
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6 stagger">
        <KpiCard
          label="Total Spend"
          value={`฿${fmt(totalSpend)}`}
          sub={fmtFull(totalSpend) + " THB"}
          icon={<TrendingUp size={15} />}
          delay={0}
        />
        <KpiCard
          label="Transactions"
          value={fmtFull(txCount)}
          icon={<Receipt size={15} />}
          accent="#818CF8"
          delay={60}
        />
        <KpiCard
          label="Active Vendors"
          value={fmtFull(vendorCnt)}
          icon={<Store size={15} />}
          accent="#FCD34D"
          delay={120}
        />
        <KpiCard
          label="Companies"
          value={fmtFull(companyCnt)}
          icon={<Building2 size={15} />}
          accent="#FB7185"
          delay={180}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <GlassCard className="xl:col-span-2" delay={240}>
          <div className="text-label mb-4">Monthly Spend Trend</div>
          <SpendTrendChart data={trendMapped} />
        </GlassCard>

        <GlassCard delay={280}>
          <div className="text-label mb-2">Spend by BU</div>
          <SpendByBuChart data={buMapped} />
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <GlassCard delay={320}>
        <div className="text-label mb-4">Top Expense Categories (last 12 months)</div>
        <CategoryBarChart data={catMapped} />
      </GlassCard>
    </div>
  );
}
