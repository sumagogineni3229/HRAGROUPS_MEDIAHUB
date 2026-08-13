import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  UsersIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const metadata = { title: "Admin Dashboard - MediaHub" };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const [
    totalUsers,
    totalAdvertisers,
    totalPublishers,
    totalInfluencers,
    totalTasks,
    activeTasks,
    completedTasks,
    pendingPlatforms,
    pendingChannels,
    pendingWithdrawals,
    totalRevenue,
    recentTasks,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "ADVERTISER" } }),
    db.user.count({ where: { role: "PUBLISHER" } }),
    db.user.count({ where: { role: "INFLUENCER" } }),
    db.task.count(),
    db.task.count({ where: { status: { in: ["IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT"] } } }),
    db.task.count({ where: { status: "COMPLETED" } }),
    db.platform.count({ where: { status: "PENDING" } }),
    db.channel.count({ where: { status: "PENDING" } }),
    db.withdrawal.count({ where: { status: "PENDING" } }),
    db.transaction.aggregate({ where: { type: "TOPUP" }, _sum: { amount: true } }),
    db.task.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { advertiser: { select: { name: true } }, seller: { select: { name: true } } } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
  ]);

  const pendingApprovals = pendingPlatforms + pendingChannels;

  const statCards = [
    { label: "Total Users", value: totalUsers, sub: `${totalAdvertisers} adv · ${totalPublishers} pub · ${totalInfluencers} inf`, icon: UsersIcon, color: "#3E4FEA", bg: "#EEF0FD", href: "/admin/users" },
    { label: "Total Revenue", value: `$${(totalRevenue._sum.amount ?? 0).toFixed(0)}`, sub: "All-time top-ups", icon: CurrencyDollarIcon, color: "#22c55e", bg: "#e8fbee", href: "/admin/transactions" },
    { label: "Active Tasks", value: activeTasks, sub: `${completedTasks} completed · ${totalTasks} total`, icon: ClipboardDocumentListIcon, color: "#f59e0b", bg: "#FFF8E8", href: "/admin/tasks" },
    { label: "Pending Approvals", value: pendingApprovals, sub: `${pendingPlatforms} sites · ${pendingChannels} channels`, icon: CheckBadgeIcon, color: pendingApprovals > 0 ? "#ef4444" : "#22c55e", bg: pendingApprovals > 0 ? "#fff0f0" : "#e8fbee", href: "/admin/listings" },
    { label: "Pending Withdrawals", value: pendingWithdrawals, sub: "Awaiting approval", icon: ArrowDownTrayIcon, color: pendingWithdrawals > 0 ? "#f59e0b" : "#22c55e", bg: pendingWithdrawals > 0 ? "#FFF8E8" : "#e8fbee", href: "/admin/withdrawals" },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Admin &gt; Dashboard</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Admin Dashboard</h1>
      </div>

      {/* Alerts */}
      {(pendingApprovals > 0 || pendingWithdrawals > 0) && (
        <div className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ background: "#FFF8E8", border: "1px solid #F5A72340" }}>
          <ExclamationTriangleIcon className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-sm font-inter text-dark">
            {pendingApprovals > 0 && <span><strong>{pendingApprovals} listings</strong> awaiting approval. </span>}
            {pendingWithdrawals > 0 && <span><strong>{pendingWithdrawals} withdrawal requests</strong> pending. </span>}
            <Link href="/admin/listings" className="text-primary font-semibold hover:underline">Review now →</Link>
          </p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="card bg-card border-base rounded-xl p-5 hover:shadow-md transition-shadow" style={{ textDecoration: "none" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold font-space text-dark mb-0.5">{card.value}</p>
              <p className="text-xs font-semibold font-space text-dark mb-1">{card.label}</p>
              <p className="text-xs font-inter text-muted">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Recent Tasks */}
        <div className="card bg-card border-base rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-space font-semibold text-dark text-sm">Recent Tasks</h2>
            <Link href="/admin/tasks" className="text-xs text-primary font-inter hover:underline">View all</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentTasks.length === 0 ? (
              <p className="text-sm text-muted font-inter text-center py-4">No tasks yet</p>
            ) : recentTasks.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-xs font-semibold font-space text-dark">{t.advertiser.name} → {t.seller.name}</p>
                  <p className="text-xs text-muted font-inter">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-dark font-space">${t.price.toFixed(0)}</span>
                  <span className="text-xs font-inter px-2 py-0.5 rounded-full" style={{
                    background: t.status === "COMPLETED" ? "#e8fbee" : t.status === "REJECTED" ? "#fff0f0" : "#FFF8E8",
                    color: t.status === "COMPLETED" ? "#16a34a" : t.status === "REJECTED" ? "#dc2626" : "#d97706",
                  }}>{t.status.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Users */}
        <div className="card bg-card border-base rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-space font-semibold text-dark text-sm">New Users</h2>
            <Link href="/admin/users" className="text-xs text-primary font-inter hover:underline">View all</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted font-inter text-center py-4">No users yet</p>
            ) : recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-xs font-semibold font-space text-dark">{u.name ?? u.email}</p>
                  <p className="text-xs text-muted font-inter">{u.email}</p>
                </div>
                <span className="text-xs font-inter px-2 py-0.5 rounded-full bg-[#EEF0FD] text-primary font-semibold">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
