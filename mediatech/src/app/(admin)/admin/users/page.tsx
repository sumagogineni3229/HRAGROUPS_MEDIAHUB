import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlassIcon, TrashIcon, NoSymbolIcon, CheckCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

export const metadata = { title: "User Management - MediaHub Admin" };

interface SearchParams { search?: string; role?: string; authType?: string; page?: string; error?: string; }

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const search = params.search ?? "";
  const roleFilter = params.role ?? "";
  const authType = params.authType ?? "";
  const page = parseInt(params.page ?? "1");
  const errorMessage = params.error;
  const perPage = 20;

  const where: any = {
    ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {}),
    ...(roleFilter ? { role: roleFilter } : {}),
    ...(authType === "google"
      ? { accounts: { some: { provider: "google" } } }
      : authType === "manual"
      ? { password: { not: null } }
      : {}),
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        password: true,
        accounts: { select: { provider: true } },
        balance: true,
        earnings: true,
        createdAt: true,
        _count: { select: { advertiserTasks: true, sellerTasks: true, platforms: true, channels: true } }
      },
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  // Server action: Suspend or Unsuspend User
  async function toggleSuspendUser(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) return;

    const newSuspendedState = !targetUser.isSuspended;

    await db.user.update({
      where: { id: userId },
      data: { isSuspended: newSuspendedState },
    });

    await db.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        title: newSuspendedState ? "Account Suspended" : "Account Reactivated",
        body: newSuspendedState
          ? "Your account has been suspended by an administrator. Please contact support if you believe this is an error."
          : "Your account suspension has been lifted. You may now use MediaHub services again.",
        link: "/",
      },
    });

    redirect("/admin/users");
  }

  // Server action: Permanently Delete User and All Details
  async function deleteUser(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;

    if (s.user.id === userId) {
      redirect("/admin/users?error=cannot_delete_self");
    }

    const targetUser = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!targetUser) {
      redirect("/admin/users");
    }

    await db.$transaction(async (tx: any) => {
      // 1. Delete user notifications
      await tx.notification.deleteMany({ where: { userId } });

      // 2. Delete transactions & withdrawals
      await tx.transaction.deleteMany({ where: { userId } });
      await tx.withdrawal.deleteMany({ where: { userId } });

      // 3. Delete saved partners
      await tx.savedPartner.deleteMany({ where: { OR: [{ advertiserId: userId }, { partnerId: userId }] } });

      // 4. Delete referrals
      await tx.referral.deleteMany({ where: { OR: [{ referrerId: userId }, { referredId: userId }] } });

      // 5. Delete messages sent by user or associated with tasks of this user
      await tx.message.deleteMany({ where: { senderId: userId } });

      const userTasks = await tx.task.findMany({
        where: { OR: [{ advertiserId: userId }, { sellerId: userId }] },
        select: { id: true }
      });
      const taskIds = userTasks.map((t: any) => t.id);

      if (taskIds.length > 0) {
        await tx.message.deleteMany({ where: { taskId: { in: taskIds } } });
        await tx.transaction.deleteMany({ where: { taskId: { in: taskIds } } });
        await tx.task.deleteMany({ where: { id: { in: taskIds } } });
      }

      // 6. Delete platforms and their packages
      const platforms = await tx.platform.findMany({ where: { publisherId: userId }, select: { id: true } });
      const platformIds = platforms.map((p: any) => p.id);
      if (platformIds.length > 0) {
        await tx.package.deleteMany({ where: { platformId: { in: platformIds } } });
        await tx.platform.deleteMany({ where: { id: { in: platformIds } } });
      }

      // 7. Delete channels and their channel packages
      const channels = await tx.channel.findMany({ where: { influencerId: userId }, select: { id: true } });
      const channelIds = channels.map((c: any) => c.id);
      if (channelIds.length > 0) {
        await tx.channelPackage.deleteMany({ where: { channelId: { in: channelIds } } });
        await tx.channel.deleteMany({ where: { id: { in: channelIds } } });
      }

      // 8. Delete projects
      await tx.project.deleteMany({ where: { advertiserId: userId } });

      // 9. Delete sessions & accounts
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });

      // 10. Delete user record safely with deleteMany
      await tx.user.deleteMany({ where: { id: userId } });
    });

    redirect("/admin/users");
  }

  const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
    ADVERTISER: { bg: "#EEF0FD", color: "#3E4FEA" },
    PUBLISHER:  { bg: "#e8fbee", color: "#16a34a" },
    INFLUENCER: { bg: "#FFF8E8", color: "#d97706" },
    ADMIN:      { bg: "#fff0f0", color: "#dc2626" },
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Admin &gt; Users</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">User Management</h1>
        <p className="text-sm text-muted font-inter mt-1">{total} users total (Google OAuth & Email/Password Signup)</p>
      </div>

      {errorMessage === "cannot_delete_self" && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-inter">
          You cannot delete your own admin account.
        </div>
      )}

      {/* Filters */}
      <div className="card bg-card border-base rounded-xl p-4 mb-6 flex items-center gap-3 flex-wrap">
        <form method="GET" className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="flex items-center gap-2 bg-app rounded-lg px-3 py-2 border border-border flex-1 min-w-48">
            <MagnifyingGlassIcon className="w-4 h-4 text-muted flex-shrink-0" />
            <input name="search" defaultValue={search} placeholder="Search by name or email..." className="bg-transparent text-sm font-inter text-dark outline-none w-full" />
          </div>
          <select name="role" defaultValue={roleFilter} className="input text-sm" style={{ width: "160px" }}>
            <option value="">All roles</option>
            <option value="ADVERTISER">Advertiser</option>
            <option value="PUBLISHER">Publisher</option>
            <option value="INFLUENCER">Influencer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select name="authType" defaultValue={authType} className="input text-sm" style={{ width: "180px" }}>
            <option value="">All Sign-up Methods</option>
            <option value="manual">Email & Password</option>
            <option value="google">Google Auth</option>
          </select>

          <button type="submit" className="btn btn-primary btn-sm font-space">Filter</button>
          {(search || roleFilter || authType) && <Link href="/admin/users" className="text-sm text-muted font-inter hover:text-dark">Clear</Link>}
        </form>
      </div>

      {/* Table */}
      <div className="card bg-card border-base rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-inter text-sm">
            <thead>
              <tr className="border-b border-border bg-app">
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Sign-up Method</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Role & Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide text-right">Balance</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide text-right">Earnings</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Activity</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Joined</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-muted font-inter text-sm">No users found</td></tr>
              ) : users.map((u: any) => {
                const roleStyle = ROLE_COLORS[u.role] ?? ROLE_COLORS.ADMIN;
                const isGoogle = u.accounts.some((a: any) => a.provider === "google");
                const isManual = !!u.password;

                const activity = u.role === "ADVERTISER"
                  ? `${u._count.advertiserTasks} tasks`
                  : u.role === "PUBLISHER"
                  ? `${u._count.sellerTasks} tasks · ${u._count.platforms} sites`
                  : u.role === "INFLUENCER"
                  ? `${u._count.sellerTasks} tasks · ${u._count.channels} channels`
                  : "Admin";
                return (
                  <tr key={u.id} className={`border-b border-border hover:bg-app transition-colors ${u.isSuspended ? "bg-red-50/40" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#677F9B] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(u.name ?? u.email ?? "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold font-space text-dark text-sm">{u.name ?? "—"}</p>
                          <p className="text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {isGoogle ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium font-inter px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Google OAuth
                        </span>
                      ) : isManual ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium font-inter px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          <KeyIcon className="w-3 h-3 text-slate-500" /> Email & Password
                        </span>
                      ) : (
                        <span className="text-xs text-muted font-inter">Direct Signup</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold font-inter px-2.5 py-1 rounded-full" style={{ background: roleStyle.bg, color: roleStyle.color }}>{u.role}</span>
                        {u.isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold font-inter px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            <NoSymbolIcon className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold font-inter px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircleIcon className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-dark">${u.balance.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-success">${u.earnings.toFixed(2)}</td>
                    <td className="px-5 py-3 text-xs text-muted">{activity}</td>
                    <td className="px-5 py-3 text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Suspend / Unsuspend Button */}
                        <form action={toggleSuspendUser} className="inline">
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium font-inter transition-colors ${
                              u.isSuspended
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                            }`}
                            title={u.isSuspended ? "Reactivate user account" : "Suspend user account"}
                          >
                            {u.isSuspended ? "Unsuspend" : "Suspend"}
                          </button>
                        </form>

                        {/* Delete User Button */}
                        <form
                          action={deleteUser}
                          className="inline"
                        >
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium font-inter bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                            title="Delete user permanently from database"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted font-inter">Page {page} of {totalPages} · {total} results</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/users?search=${search}&role=${roleFilter}&authType=${authType}&page=${page - 1}`} className="btn btn-outline btn-sm font-inter text-xs">← Prev</Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/users?search=${search}&role=${roleFilter}&authType=${authType}&page=${page + 1}`} className="btn btn-outline btn-sm font-inter text-xs">Next →</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
