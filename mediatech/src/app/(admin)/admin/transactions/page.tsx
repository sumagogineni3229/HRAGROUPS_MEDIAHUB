import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Transaction Log - MediaHub Admin" };

interface SearchParams { type?: string; page?: string; }

const TYPE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  TOPUP:      { label: "Top-Up",    bg: "#e8fbee", color: "#16a34a" },
  PAYMENT:    { label: "Payment",   bg: "#fff0f0", color: "#dc2626" },
  EARNING:    { label: "Earning",   bg: "#EEF0FD", color: "#3E4FEA" },
  WITHDRAWAL: { label: "Withdrawal",bg: "#FFF8E8", color: "#d97706" },
  BONUS:      { label: "Bonus",     bg: "#e8fbee", color: "#16a34a" },
  REFUND:     { label: "Refund",    bg: "#EEF0FD", color: "#3E4FEA" },
  COMMISSION: { label: "Commission",bg: "#f1f5f9", color: "#64748b" },
};

export default async function AdminTransactionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const typeFilter = params.type ?? "ALL";
  const page = parseInt(params.page ?? "1");
  const perPage = 25;

  const where: any = typeFilter !== "ALL" ? { type: typeFilter } : {};

  const [transactions, total, totals] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { user: { select: { name: true, email: true, role: true } } },
    }),
    db.transaction.count({ where }),
    db.transaction.groupBy({ by: ["type"], _sum: { amount: true }, _count: { id: true } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  // Summary stats
  const revenue = totals.find((t: any) => t.type === "TOPUP")?._sum.amount ?? 0;
  const payouts = totals.find((t: any) => t.type === "WITHDRAWAL")?._sum.amount ?? 0;
  const refunds = totals.find((t: any) => t.type === "REFUND")?._sum.amount ?? 0;
  const earnings = totals.find((t: any) => t.type === "EARNING")?._sum.amount ?? 0;

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Admin &gt; Transactions</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Transaction Log</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Total Revenue", value: revenue, color: "#22c55e" },
          { label: "Total Earnings Paid", value: earnings, color: "#3E4FEA" },
          { label: "Total Withdrawn", value: payouts, color: "#d97706" },
          { label: "Total Refunds", value: refunds, color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="card bg-card border-base rounded-xl p-4">
            <p className="text-xs font-inter text-muted mb-1">{s.label}</p>
            <p className="text-xl font-bold font-space" style={{ color: s.color }}>${s.value.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Type Tabs */}
      <div className="flex gap-1 flex-wrap mb-4">
        {["ALL", ...Object.keys(TYPE_CONFIG)].map((t) => (
          <Link key={t} href={`/admin/transactions?type=${t}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-inter transition-colors ${typeFilter === t ? "bg-primary text-white" : "bg-app text-muted border border-border hover:text-dark"}`}>
            {t === "ALL" ? "All" : TYPE_CONFIG[t].label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="card bg-card border-base rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-inter text-sm">
            <thead>
              <tr className="border-b border-border bg-app">
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Description</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted text-sm">No transactions found</td></tr>
              ) : transactions.map((tx: any) => {
                const cfg = TYPE_CONFIG[tx.type] ?? TYPE_CONFIG.COMMISSION;
                const isPositive = ["TOPUP", "EARNING", "BONUS", "REFUND"].includes(tx.type);
                return (
                  <tr key={tx.id} className="border-b border-border hover:bg-app transition-colors">
                    <td className="px-5 py-3 text-xs text-muted">{new Date(tx.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-semibold text-dark">{tx.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{tx.user.role}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted">{tx.note ?? "—"}</td>
                    <td className={`px-5 py-3 text-right font-bold text-sm ${isPositive ? "text-success" : "text-danger"}`}>
                      {isPositive ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted font-inter">Page {page} of {totalPages} · {total} records</p>
            <div className="flex gap-2">
              {page > 1 && <Link href={`/admin/transactions?type=${typeFilter}&page=${page - 1}`} className="btn btn-outline btn-sm text-xs">← Prev</Link>}
              {page < totalPages && <Link href={`/admin/transactions?type=${typeFilter}&page=${page + 1}`} className="btn btn-outline btn-sm text-xs">Next →</Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
