import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  LinkIcon,
  NewspaperIcon,
  UserGroupIcon,
  FolderOpenIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  WalletIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { db } from "@/lib/db";

const advertiserNavItems = [
  { 
    label: "Search for Sites", 
    href: "/advertiser/sites", 
    icon: <MagnifyingGlassIcon className="w-4 h-4" />,
    subItems: [
      { label: "Article Posting", href: "/advertiser/sites?type=ARTICLE_POSTING" },
      { label: "Link Insertion",  href: "/advertiser/sites?type=LINK_INSERTION" },
      { label: "Press Release",   href: "/advertiser/sites?type=PRESS_RELEASE" },
    ]
  },
  { label: "Search for Influencers", href: "/advertiser/influencers",      icon: <UsersIcon className="w-4 h-4" /> },
  { label: "Media Partner List",     href: "/advertiser/partners",         icon: <UserGroupIcon className="w-4 h-4" /> },
  { label: "My Projects",            href: "/advertiser/projects",         icon: <FolderOpenIcon className="w-4 h-4" /> },
  { label: "Tasks",                  href: "/advertiser/tasks",            icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
  { label: "Content Purchase",       href: "/advertiser/content-purchase", icon: <ShoppingBagIcon className="w-4 h-4" /> },
  { label: "Wallet & Balance",       href: "/advertiser/balance",          icon: <WalletIcon className="w-4 h-4" /> },
];

export default async function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role as string;
  if (role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const activeRole = ((session.user as any).activeRole ?? role) as string;
  if (activeRole !== "ADVERTISER") {
    redirect("/login");
  }

  // Fetch role-isolated wallet balance
  const { getUserRoleWallet } = await import("@/lib/wallet");
  const wallet = await getUserRoleWallet(session.user.id!, "ADVERTISER");

  const user = await db.user.findUnique({
    where: { id: session.user.id! },
    select: { name: true, avatar: true },
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
      <Sidebar navItems={advertiserNavItems} role="ADVERTISER" />
      <div className="main-content">
        <TopHeader
          breadcrumbs={[{ label: "Home", href: "/advertiser/sites" }]}
          balance={wallet.balance}
          reserved={wallet.reserved}
          bonus={wallet.bonus}
          userName={user?.name ?? session.user.name ?? ""}
          userRole="Advertiser"
          userAvatar={user?.avatar ?? session.user.image ?? undefined}
          notificationCount={notificationCount}
          recentNotifications={recentNotifications as any}
          activeRole={(session.user as any).activeRole ?? "ADVERTISER"}
          enabledRoles={(session.user as any).enabledRoles ?? ["ADVERTISER"]}
        />
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
}
