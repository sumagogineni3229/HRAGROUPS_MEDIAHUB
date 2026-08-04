import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Task Oversight - MediaHub Admin" };

interface SearchParams { status?: string; page?: string; }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  DRAFT:          { bg: "#f1f5f9", color: "#64748b" },
  TASK_REVIEW:    { bg: "#FFF8E8", color: "#d97706" },
  TASK_ACCEPTANCE:{ bg: "#FFF8E8", color: "#d97706" },
  IN_PROGRESS:    { bg: "#EEF0FD", color: "#3E4FEA" },
  YOUR_APPROVAL:  { bg: "#e8fbee", color: "#16a34a" },
  IMPROVEMENT:    { bg: "#fff0f0", color: "#dc2626" },
  COMPLETED:      { bg: "#e8fbee", color: "#16a34a" },
  REJECTED:       { bg: "#fff0f0", color: "#dc2626" },
};

const TABS = ["ALL", "IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT", "COMPLETED", "REJECTED"];

export default async function AdminTasksPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const statusFilter = params.status ?? "ALL";
  const page = parseInt(params.page ?? "1");
  const perPage = 20;

  const where: any = statusFilter !== "ALL" ? { status: statusFilter } : {};

  const [tasks, total] = await Promise.all([
    db.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        advertiser: { select: { name: true, email: true } },
        seller: { select: { name: true, email: true } },
        platform: { select: { url: true } },
        channel: { select: { handle: true, platform: true } },
      },
    }),
    db.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  // Admin actions
  async function forceComplete(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) return;
    const earnings = task.price * 0.9;
    await db.$transaction([
      db.user.update({ where: { id: task.advertiserId }, data: { reserved: { decrement: task.price } } }),
      db.user.update({ where: { id: task.sellerId }, data: { balance: { increment: earnings }, earnings: { increment: earnings } } }),
      db.task.update({ where: { id: taskId }, data: { status: "COMPLETED", completedAt: new Date() } }),
      db.transaction.create({ data: { userId: task.sellerId, taskId, type: "EARNING", amount: earnings, note: "Force completed by admin" } }),
    ]);
    // Process referral commission if seller was referred
    const { processReferralCommission } = await import("@/lib/referrals");
    await processReferralCommission(taskId, task.sellerId, task.platformFee || task.price * 0.1);

    await db.notification.create({ data: { userId: task.sellerId, type: "PAYMENT", title: "Payment released by admin", body: `$${earnings.toFixed(2)} has been credited to your balance. Task was force-completed by an administrator.`, link: task.sellerType === "INFLUENCER" ? `/influencer/tasks/${taskId}` : `/publisher/tasks/${taskId}` } });
    await db.notification.create({ data: { userId: task.advertiserId, type: "TASK_UPDATE", title: "Task force-completed", body: "Your task was force-completed by an administrator.", link: `/advertiser/tasks/${taskId}` } });
    redirect("/admin/tasks");
  }

  async function forceRefund(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) return;
    await db.$transaction([
      db.user.update({ where: { id: task.advertiserId }, data: { balance: { increment: task.price }, reserved: { decrement: task.price } } }),
      db.task.update({ where: { id: taskId }, data: { status: "REJECTED" } }),
      db.transaction.create({ data: { userId: task.advertiserId, taskId, type: "REFUND", amount: task.price, note: "Force refunded by admin" } }),
    ]);
    await db.notification.create({ data: { userId: task.advertiserId, type: "PAYMENT", title: "Refund issued by admin", body: `$${task.price.toFixed(2)} has been refunded to your balance by an administrator.`, link: `/advertiser/tasks/${taskId}` } });
    redirect("/admin/tasks");
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Admin &gt; Tasks</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Task Oversight</h1>
        <p className="text-sm text-muted font-inter mt-1">{total} tasks</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 flex-wrap mb-6">
        {TABS.map((s) => (
          <Link key={s} href={`/admin/tasks?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-inter transition-colors ${statusFilter === s ? "bg-primary text-white" : "bg-app text-muted border border-border hover:text-dark"}`}>
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="card bg-card border-base rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-inter text-sm">
            <thead>
              <tr className="border-b border-border bg-app">
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Task</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Advertiser</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Seller</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase text-right">Price</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted text-sm">No tasks found</td></tr>
              ) : tasks.map((t: any) => {
                const sc = STATUS_COLORS[t.status] ?? STATUS_COLORS.DRAFT;
                const listing = t.platform?.url ?? (t.channel ? `@${t.channel.handle} (${t.channel.platform})` : "—");
                const canAct = !["COMPLETED", "REJECTED"].includes(t.status);
                return (
                  <tr key={t.id} className="border-b border-border hover:bg-app transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-xs font-semibold text-dark font-space truncate max-w-[180px]">{listing}</p>
                      <p className="text-xs text-muted">{t.id.slice(-8)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-semibold text-dark">{t.advertiser.name ?? "—"}</p>
                      <p className="text-xs text-muted">{t.advertiser.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-semibold text-dark">{t.seller.name ?? "—"}</p>
                      <p className="text-xs text-muted">{t.sellerType}</p>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-dark">${t.price.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>{t.status.replace("_", " ")}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      {canAct ? (
                        <div className="flex gap-2">
                          <form action={forceComplete}>
                            <input type="hidden" name="taskId" value={t.id} />
                            <button type="submit" className="text-xs text-success font-semibold hover:underline font-inter" title="Release funds to seller">Complete</button>
                          </form>
                          <span className="text-muted">·</span>
                          <form action={forceRefund}>
                            <input type="hidden" name="taskId" value={t.id} />
                            <button type="submit" className="text-xs text-danger font-semibold hover:underline font-inter" title="Refund to advertiser">Refund</button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-muted font-inter">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted font-inter">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && <Link href={`/admin/tasks?status=${statusFilter}&page=${page - 1}`} className="btn btn-outline btn-sm text-xs">← Prev</Link>}
              {page < totalPages && <Link href={`/admin/tasks?status=${statusFilter}&page=${page + 1}`} className="btn btn-outline btn-sm text-xs">Next →</Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
