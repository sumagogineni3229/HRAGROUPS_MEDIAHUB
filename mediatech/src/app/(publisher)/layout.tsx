import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import {
  Squares2X2Icon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ShareIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { db } from "@/lib/db";

const publisherNavItems = [
  { label: "My Platforms",     href: "/publisher/platforms", icon: <Squares2X2Icon className="w-4 h-4" /> },
  { label: "Demand",           href: "/publisher/demand",    icon: <ChartBarIcon className="w-4 h-4" /> },
  { label: "Tasks",            href: "/publisher/tasks",     icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
  { label: "Referral Program", href: "/publisher/referral",  icon: <ShareIcon className="w-4 h-4" /> },
];

export default async function PublisherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role as string;
  if (role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const activeRole = ((session.user as any).activeRole ?? role) as string;
  if (activeRole !== "PUBLISHER") {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, reserved: true, bonus: true, earnings: true, name: true, avatar: true },
  });

  const pendingTasks = await db.task.aggregate({
    where: {
      sellerId: session.user.id,
      sellerType: "PUBLISHER",
      status: { in: ["TASK_ACCEPTANCE", "TASK_REVIEW", "IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT"] },
    },
    _sum: { sellerEarning: true },
  });
  const reservedBalance = (pendingTasks._sum.sellerEarning ?? 0) + (user?.reserved ?? 0);

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
      <Sidebar navItems={publisherNavItems} role="PUBLISHER" />
      <div className="main-content">
        <TopHeader
          breadcrumbs={[{ label: "Home", href: "/publisher/platforms" }]}
          balance={user?.balance ?? 0}
          reserved={reservedBalance}
          bonus={user?.bonus ?? 0}
          userName={user?.name ?? session.user.name ?? ""}
          userRole="Publisher"
          userAvatar={user?.avatar ?? session.user.image ?? undefined}
          notificationCount={notificationCount}
          recentNotifications={recentNotifications as any}
          activeRole={(session.user as any).activeRole ?? "PUBLISHER"}
          enabledRoles={(session.user as any).enabledRoles ?? ["PUBLISHER"]}
        />
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
}
