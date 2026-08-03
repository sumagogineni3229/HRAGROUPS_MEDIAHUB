import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import {
  Squares2X2Icon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { db } from "@/lib/db";

const adminNavItems = [
  { label: "Dashboard",         href: "/admin/dashboard",     icon: <Squares2X2Icon className="w-4 h-4" /> },
  { label: "Users",             href: "/admin/users",         icon: <UsersIcon className="w-4 h-4" /> },
  { label: "Listings",          href: "/admin/listings",      icon: <CheckBadgeIcon className="w-4 h-4" /> },
  { label: "Tasks",             href: "/admin/tasks",         icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
  { label: "Transactions",      href: "/admin/transactions",  icon: <CurrencyDollarIcon className="w-4 h-4" /> },
  { label: "Withdrawals",       href: "/admin/withdrawals",   icon: <ArrowDownTrayIcon className="w-4 h-4" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role as string;
  if (role !== "ADMIN") {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, reserved: true, bonus: true, name: true, avatar: true },
  });

  const notificationCount = await db.notification.count({
    where: { userId: session.user.id!, isRead: false },
  });

  const recentNotifications = await db.notification.findMany({
    where: { userId: session.user.id! },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="dashboard-shell">
      <Sidebar navItems={adminNavItems} role="ADMIN" />
      <div className="main-content">
        <TopHeader
          breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }]}
          balance={user?.balance ?? 0}
          reserved={user?.reserved ?? 0}
          bonus={user?.bonus ?? 0}
          userName={user?.name ?? session.user.name ?? ""}
          userRole="Admin"
          userAvatar={user?.avatar ?? session.user.image ?? undefined}
          notificationCount={notificationCount}
          recentNotifications={recentNotifications as any}
        />
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
}
