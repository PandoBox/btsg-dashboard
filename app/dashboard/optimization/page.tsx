import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";
import { fmt, fmtFull } from "@/lib/utils";
import { AlertTriangle, TrendingUp, Users, ShoppingBag, Clock, Copy, Tag, HelpCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function InsightCard({
  title,
  headline,
  body,
  amount,
  severity,
  icon,
  delay,
}: {
  title: string;
  headline: string;
  body: string;
  amount?: number;
  severity: "high" | "medium" | "low";
  icon: React.ReactNode;
  delay?: number;
}) {
  const colors = {
    high:   { border: "rgba(251,113,133,0.25)", bg: "rgba(251,113,133,0.06)", icon: "#FB7185", pill: "rgba(251,113,133,0.15)" },
    medium: { border: "rgba(252,211,77,0.25)",  bg: "rgba(252,211,77,0.06)",  icon: "#FCD34D", pill: "rgba(252,211,77,0.15)" },
    low:    { border: "rgba(94,234,212,0.25)",  bg: "rgba(94,234,212,0.06)",  icon: "#5EEAD4", pill: "rgba(94,234,212,0.15)" },
  }[severity];

  const labels = { high: "High impact", medium: "Medium impact", low: "Opportunity" };

  return (
    <div
      className="relative rounded-2xl p-5 fade-up"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        animationDelay: `${delay ?? 0}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl mt-0.5"
            style={{ background: `${colors.icon}22`, color: colors.icon }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-label mb-1">{title}</div>
            <div className="text-sm font-semibold text-white mb-1 leading-snug">{headline}</div>
            <div className="text-xs text-white/50 leading-relaxed">{body}</div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          {amount !== undefined && (
            <div className="text-lg font-light tracking-tight" style={{ color: colors.icon }}>
              ฿{fmt(amount)}M
            </div>
          )}
          <div
            className="mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: colors.pill, color: colors.icon }}
          >
            {labels[severity]}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function OptimizationPage() {
  const supabase = await createClient();

  const [
    { data: maverickRaw },
    { data: tailRaw },
    { data: fragRaw },
    { data: yoyRaw },
    { data: ptRaw },
    { data: dupRaw },
    { data: unclassRaw },
  ] = await Promise.all([
    supabase.rpc("get_maverick_spend",           { months_back: 12 }),
    supabase.rpc("get_tail_spend",               { months_back: 12 }),
    supabase.rpc("get_vendor_fragmentation",     { months_back: 12 }),
    supabase.rpc("get_category_yoy"),
    supabase.rpc("get_payment_terms_analysis",   { months_back: 12 }),
    supabase.rpc("get_duplicate_risk",           { months_back: 12 }),
    supabase.rpc("get_unclassified_spend",       { months_back: 12 }),
  ]);

  const maverick  = (maverickRaw as any[]) ?? [];
  const tail      = (tailRaw    as any)    ?? {};
  const frag      = (fragRaw    as any[])  ?? [];
  const yoy       = (yoyRaw     as any[])  ?? [];
  const pt        = (ptRaw      as any[])  ?? [];
  const dup       = (dupRaw     as any[])  ?? [];
  const unclass   = (unclassRaw as any)    ?? {};

  // Derive insight metrics
  const totalMaverick  = maverick.reduce((s: number, r: any) => s + Number(r.non_po_amount ?? 0), 0);
  const tailAmount     = Number(tail.tail_amount ?? 0);
  const tailVendors    = Number(tail.tail_vendors ?? 0);
  const fragAmount     = frag.slice(0, 3).reduce((s: number, r: any) => s + Number(r.total_amount ?? 0), 0);
  const surgeCat       = yoy.find((r: any) => r.delta_pct && Number(r.delta_pct) > 25);
  const surgeAmt       = surgeCat ? Number(surgeCat.this_year ?? 0) : 0;
  const unspecPt       = pt.find((r: any) => r.payment_terms === "Not Specified");
  const unspecAmt      = unspecPt ? Number(unspecPt.total_amount ?? 0) : 0;
  const dupCount       = dup.length;
  const dupAmount      = dup.slice(0, 5).reduce((s: number, r: any) => s + Number(r.amount ?? 0) * Number(r.occurrence_count ?? 0), 0);
  const unclassAmt     = Number(unclass.unclassified_amount ?? 0);

  const insights = [
    {
      title: "Maverick Spend",
      headline: `฿${fmt(totalMaverick)}M in Non-PO spend on PO-eligible categories`,
      body: `${maverick.slice(0,3).map((r: any) => r.expense_group).join(", ")} are top categories where PO compliance could improve. Redirecting to PO enforces sourcing controls and captures volume discounts.`,
      amount: totalMaverick / 1_000_000,
      severity: totalMaverick > 100_000_000 ? "high" : "medium" as any,
      icon: <AlertTriangle size={15} />,
    },
    {
      title: "Vendor Fragmentation",
      headline: `${frag.slice(0,3).map((r: any) => r.expense_group).join(", ")} have low top-3 concentration`,
      body: `Consolidating spend to fewer preferred vendors in fragmented categories enables volume leverage and simplifies contract management.`,
      amount: fragAmount / 1_000_000,
      severity: "medium" as any,
      icon: <Users size={15} />,
    },
    {
      title: "Tail Spend",
      headline: `${fmtFull(tailVendors)} vendors make up only 20% of spend`,
      body: `฿${fmt(tailAmount)}M distributed across ${fmtFull(tailVendors)} tail vendors. Migrating to P-card, catalog purchasing, or vendor consolidation reduces transaction cost.`,
      amount: tailAmount / 1_000_000,
      severity: tailAmount > 200_000_000 ? "high" : "medium" as any,
      icon: <ShoppingBag size={15} />,
    },
    {
      title: "Payment Terms Leakage",
      headline: `฿${fmt(unspecAmt)}M has no payment terms assigned`,
      body: `Transactions without specified payment terms miss early-payment discount opportunities and reduce working capital visibility. Standard terms should be enforced at PO creation.`,
      amount: unspecAmt / 1_000_000,
      severity: unspecAmt > 50_000_000 ? "high" : "low" as any,
      icon: <Clock size={15} />,
    },
    {
      title: "Category YoY Surge",
      headline: surgeCat
        ? `"${surgeCat.expense_group}" grew ${Number(surgeCat.delta_pct).toFixed(0)}% YoY`
        : "No significant category surge detected",
      body: surgeCat
        ? `This category grew from ฿${fmt(Number(surgeCat.last_year))}M to ฿${fmt(Number(surgeCat.this_year))}M. Validate if growth is planned — or a signal for budget reallocation and demand management.`
        : "All major expense groups are within expected growth bands.",
      amount: surgeAmt > 0 ? surgeAmt / 1_000_000 : undefined,
      severity: surgeAmt > 100_000_000 ? "high" : "low" as any,
      icon: <TrendingUp size={15} />,
    },
    {
      title: "Duplicate Risk",
      headline: `${dupCount} vendor-amount combinations appear 3+ times in a month`,
      body: "Same vendor + same amount repeated in a single month may indicate duplicate invoices or PO-to-payment matching gaps. Review top occurrences with AP team.",
      amount: dupAmount > 0 ? dupAmount / 1_000_000 : undefined,
      severity: dupCount > 20 ? "high" : dupCount > 5 ? "medium" : "low" as any,
      icon: <Copy size={15} />,
    },
    {
      title: "Unclassified Spend",
      headline: `฿${fmt(unclassAmt)}M has no GL/PCA classification`,
      body: "GL accounts not mapped in the PCA master are invisible to category analysis and reporting. Expanding the GL master will improve spend visibility.",
      amount: unclassAmt / 1_000_000,
      severity: unclassAmt > 100_000_000 ? "high" : "medium" as any,
      icon: <HelpCircle size={15} />,
    },
    {
      title: "Vendor Fragmentation Deep-Dive",
      headline: `Top fragmented categories by total spend`,
      body: frag.slice(0, 4)
        .map((r: any) => `${r.expense_group} (${r.vendor_count} vendors, top-3 = ${Number(r.top3_share_pct).toFixed(0)}%)`)
        .join(" · "),
      amount: undefined,
      severity: "low" as any,
      icon: <Tag size={15} />,
    },
  ];

  return (
    <div>
      <Header
        title="Optimization Insights"
        subtitle="Ranked by estimated $ impact · Rolling 12 months"
      />

      <div className="flex flex-col gap-3 stagger">
        {insights.map((ins, i) => (
          <InsightCard key={i} {...ins} delay={i * 50} />
        ))}
      </div>
    </div>
  );
}
