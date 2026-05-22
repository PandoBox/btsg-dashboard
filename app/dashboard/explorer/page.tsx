"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";
import { fmt, fmtFull } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 50;

interface Row {
  id: number;
  posting_date: string;
  company_code: number;
  transaction_type: string;
  doc_type: string;
  gl_account: number;
  amount: number;
  currency: string;
  bp_code: number;
  memo: string;
  cost_center: number;
}

function InputClass(extra = "") {
  return `rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 outline-none w-full ${extra}`;
}

const STYLE_INPUT = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
};

export default function ExplorerPage() {
  const supabase = createClient();

  const [rows, setRows]   = useState<Row[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage]   = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateFrom, setDateFrom]     = useState("");
  const [dateTo, setDateTo]         = useState("");
  const [txType, setTxType]         = useState("");
  const [glSearch, setGlSearch]     = useState("");
  const [memoSearch, setMemoSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("transactions")
      .select("id,posting_date,company_code,transaction_type,doc_type,gl_account,amount,currency,bp_code,memo,cost_center", { count: "exact" })
      .order("posting_date", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    const d = new Date();
    d.setMonth(d.getMonth() - 12);
    const defaultFrom = d.toISOString().split("T")[0];

    q = q.gte("posting_date", dateFrom || defaultFrom);
    if (dateTo) q = q.lte("posting_date", dateTo);
    if (txType) q = q.eq("transaction_type", txType);
    if (glSearch) q = q.eq("gl_account", Number(glSearch));
    if (memoSearch) q = q.ilike("memo", `%${memoSearch}%`);

    const { data, count: cnt } = await q;
    setRows((data as Row[]) ?? []);
    setCount(cnt ?? 0);
    setLoading(false);
  }, [page, dateFrom, dateTo, txType, glSearch, memoSearch]);

  useEffect(() => { load(); }, [load]);

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    load();
  }

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div>
      <Header title="Transaction Explorer" subtitle={`${fmtFull(count)} rows matching filters`} />

      {/* Filter bar */}
      <GlassCard delay={0} className="mb-4">
        <form onSubmit={handleFilter} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-label">From</label>
            <input type="date" className={InputClass()} style={STYLE_INPUT} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-label">To</label>
            <input type="date" className={InputClass()} style={STYLE_INPUT} value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-label">Type</label>
            <select className={InputClass()} style={STYLE_INPUT} value={txType} onChange={e => setTxType(e.target.value)}>
              <option value="">All</option>
              <option value="PO">PO</option>
              <option value="Non-PO">Non-PO</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-label">GL Account</label>
            <input type="number" placeholder="e.g. 6150000010" className={InputClass()} style={STYLE_INPUT} value={glSearch} onChange={e => setGlSearch(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-label">Memo</label>
            <input type="text" placeholder="search text…" className={InputClass()} style={STYLE_INPUT} value={memoSearch} onChange={e => setMemoSearch(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-all"
              style={{ background: "#5EEAD4", color: "#0A0B14" }}
            >
              <Search size={14} />
              Filter
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Table */}
      <GlassCard delay={120}>
        {loading ? (
          <div className="text-center py-16 text-white/30 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">No transactions found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-label border-b border-white/8">
                    {["Date", "Type", "Doc Type", "GL Account", "Cost Center", "BP Code", "Amount", "Memo"].map(h => (
                      <th key={h} className="text-left pb-2 pr-4 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                      <td className="py-2 pr-4 text-white/60 whitespace-nowrap">{r.posting_date}</td>
                      <td className="py-2 pr-4">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: r.transaction_type === "PO" ? "rgba(94,234,212,0.12)" : "rgba(252,211,77,0.12)",
                            color:      r.transaction_type === "PO" ? "#5EEAD4"               : "#FCD34D",
                          }}
                        >
                          {r.transaction_type}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-white/50">{r.doc_type}</td>
                      <td className="py-2 pr-4 text-white/70 font-mono">{r.gl_account}</td>
                      <td className="py-2 pr-4 text-white/50 font-mono">{r.cost_center}</td>
                      <td className="py-2 pr-4 text-white/50 font-mono">{r.bp_code}</td>
                      <td className={`py-2 pr-4 font-semibold whitespace-nowrap ${Number(r.amount) < 0 ? "text-rose-400" : "text-mint"}`}>
                        {Number(r.amount) < 0 ? "-" : ""}฿{fmt(Math.abs(Number(r.amount)))}
                      </td>
                      <td className="py-2 pr-4 text-white/40 max-w-[200px] truncate">{r.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
              <span className="text-xs text-white/35">
                Page {page + 1} of {totalPages} · {fmtFull(count)} rows
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg transition-all disabled:opacity-25 hover:bg-white/8"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg transition-all disabled:opacity-25 hover:bg-white/8"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
