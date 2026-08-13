import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

export const metadata = { title: "Withdrawal Approvals - MediaHub Admin" };

interface SearchParams { status?: string; }

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: any }> = {
  PENDING:    { label: "Pending",    bg: "#FFF8E8", color: "#d97706", icon: ClockIcon },
  PROCESSING: { label: "Processing", bg: "#EEF0FD", color: "#3E4FEA", icon: ClockIcon },
  PAID:       { label: "Paid",       bg: "#e8fbee", color: "#16a34a", icon: CheckCircleIcon },
  REJECTED:   { label: "Rejected",   bg: "#fff0f0", color: "#dc2626", icon: XCircleIcon },
};

export default async function AdminWithdrawalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const statusFilter = params.status ?? "PENDING";

  const [withdrawals, counts] = await Promise.all([
    db.withdrawal.findMany({
      where: statusFilter !== "ALL" ? { status: statusFilter as any } : {},
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true, role: true, balance: true, earnings: true, withdrawn: true } } },
    }),
    db.withdrawal.groupBy({ by: ["status"], _count: { id: true }, _sum: { amount: true } }),
  ]);

  // Actions
  async function markPaid(formData: FormData) {
    "use server";
    const withdrawalId = formData.get("withdrawalId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");

    const wd = await db.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!wd || wd.status === "PAID") return; // Guard against double-processing

    // Atomically: mark paid + deduct user balance + increment withdrawn total
    await db.$transaction([
      db.withdrawal.update({ where: { id: withdrawalId }, data: { status: "PAID" } }),
      db.user.update({
        where: { id: wd.userId },
        data: {
          balance:   { decrement: wd.amount },
          withdrawn: { increment: wd.amount },
        },
      }),
    ]);

    await db.notification.create({
      data: {
        userId: wd.userId,
        type: "PAYMENT",
        title: "Payout sent!",
        body: `Your withdrawal of $${wd.amount.toFixed(2)} has been processed and sent to your ${wd.method} account.`,
        link: "/publisher/balance",
      },
    });

    try {
      const { notifyWithdrawalProcessed } = await import("@/lib/notifications");
      await notifyWithdrawalProcessed(wd.userId, wd.amount, wd.method, "PAID", wd.adminNote);
    } catch (err) {
      console.error(err);
    }

    redirect("/admin/withdrawals?status=PAID");
  }

  async function markProcessing(formData: FormData) {
    "use server";
    const withdrawalId = formData.get("withdrawalId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    await db.withdrawal.update({ where: { id: withdrawalId }, data: { status: "PROCESSING" } });
    redirect("/admin/withdrawals?status=PROCESSING");
  }

  async function rejectWithdrawal(formData: FormData) {
    "use server";
    const withdrawalId = formData.get("withdrawalId") as string;
    const note = formData.get("note") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    const wd = await db.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!wd) return;
    await db.$transaction([
      db.withdrawal.update({ where: { id: withdrawalId }, data: { status: "REJECTED", adminNote: note } }),
      // Refund balance back to user
      db.user.update({ where: { id: wd.userId }, data: { balance: { increment: wd.amount } } }),
    ]);
    await db.notification.create({ data: { userId: wd.userId, type: "SYSTEM", title: "Withdrawal request rejected", body: note ? `Your withdrawal was rejected: ${note}. $${wd.amount.toFixed(2)} has been returned to your balance.` : `Your withdrawal of $${wd.amount.toFixed(2)} was rejected. Funds returned to your balance.`, link: "/publisher/balance" } });
    
    try {
      const { notifyWithdrawalProcessed } = await import("@/lib/notifications");
      await notifyWithdrawalProcessed(wd.userId, wd.amount, wd.method, "REJECTED", note);
    } catch (err) {
      console.error(err);
    }

    redirect("/admin/withdrawals?status=REJECTED");
  }

  const pendingCount = counts.find((c: any) => c.status === "PENDING")?._count.id ?? 0;
  const pendingTotal = counts.find((c: any) => c.status === "PENDING")?._sum.amount ?? 0;

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Admin &gt; Withdrawals</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Withdrawal Approvals</h1>
        {pendingCount > 0 && (
          <p className="text-sm font-inter mt-1" style={{ color: "#d97706" }}>
            <strong>{pendingCount} requests</strong> pending — total ${(pendingTotal ?? 0).toFixed(2)}
          </p>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6">
        {["ALL", "PENDING", "PROCESSING", "PAID", "REJECTED"].map((s) => {
          const count = s !== "ALL" ? (counts.find((c: any) => c.status === s)?._count.id ?? 0) : withdrawals.length;
          return (
            <Link key={s} href={`/admin/withdrawals?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-inter transition-colors flex items-center gap-1.5 ${statusFilter === s ? "bg-primary text-white" : "bg-app text-muted border border-border hover:text-dark"}`}>
              {s}
              {s === "PENDING" && count > 0 && <span className="bg-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{count}</span>}
            </Link>
          );
        })}
      </div>

      {/* Withdrawal Cards */}
      <div className="flex flex-col gap-4">
        {withdrawals.length === 0 ? (
          <div className="card bg-card border-base rounded-xl p-12 flex flex-col items-center text-center">
            <CheckCircleIcon className="w-10 h-10 text-success mb-3" />
            <p className="font-space font-semibold text-dark">No withdrawal requests</p>
            <p className="text-sm text-muted font-inter mt-1">in this status</p>
          </div>
        ) : withdrawals.map((wd: any) => {
          const sc = STATUS_CONFIG[wd.status];
          const StatusIcon = sc.icon;
          const isPending = wd.status === "PENDING";
          const isProcessing = wd.status === "PROCESSING";

          return (
            <div key={wd.id} className="card bg-card border-base rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-space font-bold text-dark text-lg">${wd.amount.toFixed(2)}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: sc.bg, color: sc.color }}>
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-sm font-inter text-dark font-semibold">{wd.user.name ?? "—"}</p>
                  <p className="text-xs text-muted font-inter">{wd.user.email} · {wd.user.role}</p>
                  <p className="text-xs text-muted font-inter mt-1">Submitted {new Date(wd.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right text-xs font-inter text-muted">
                  <p>Bal: <strong className="text-dark">${wd.user.balance.toFixed(2)}</strong></p>
                  <p>Earnings: <strong className="text-dark">${wd.user.earnings.toFixed(2)}</strong></p>
                  <p>Withdrawn: <strong className="text-dark">${wd.user.withdrawn.toFixed(2)}</strong></p>
                </div>
              </div>

              <div className="bg-app rounded-lg p-3 mb-4">
                <p className="text-xs font-inter text-muted mb-0.5 uppercase tracking-wide font-semibold">Payout details</p>
                <p className="text-sm font-inter text-dark font-semibold">{wd.method} — {wd.details}</p>
              </div>

              {wd.adminNote && (
                <div className="bg-[#fff0f0] rounded-lg p-3 mb-4">
                  <p className="text-xs text-danger font-inter"><strong>Admin note:</strong> {wd.adminNote}</p>
                </div>
              )}

              {(isPending || isProcessing) && (
                <div className="flex gap-3 flex-wrap">
                  {isPending && (
                    <form action={markProcessing}>
                      <input type="hidden" name="withdrawalId" value={wd.id} />
                      <button type="submit" className="btn btn-sm font-space font-semibold" style={{ background: "#3E4FEA", color: "white", borderRadius: "8px", padding: "8px 16px" }}>
                        Mark Processing
                      </button>
                    </form>
                  )}
                  <form action={markPaid}>
                    <input type="hidden" name="withdrawalId" value={wd.id} />
                    <button type="submit" className="btn btn-sm font-space font-semibold flex items-center gap-2" style={{ background: "#22c55e", color: "white", borderRadius: "8px", padding: "8px 16px" }}>
                      <CheckCircleIcon className="w-4 h-4" /> Mark Paid
                    </button>
                  </form>
                  <form action={rejectWithdrawal} className="flex gap-2 flex-1">
                    <input type="hidden" name="withdrawalId" value={wd.id} />
                    <input type="text" name="note" placeholder="Rejection reason..." className="input flex-1 text-sm" />
                    <button type="submit" className="btn btn-sm font-space font-semibold flex items-center gap-2 flex-shrink-0" style={{ background: "#ef4444", color: "white", borderRadius: "8px", padding: "8px 16px" }}>
                      <XCircleIcon className="w-4 h-4" /> Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
