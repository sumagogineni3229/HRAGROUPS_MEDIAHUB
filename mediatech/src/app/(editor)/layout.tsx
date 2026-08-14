import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import {
  DocumentTextIcon,
  PencilSquareIcon,
  Squares2X2Icon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { db } from "@/lib/db";

const editorNavItems = [
  { label: "Dashboard",       href: "/editor/dashboard", icon: <Squares2X2Icon className="w-4 h-4" /> },
  { label: "Interface Pages", href: "/editor/pages",     icon: <DocumentTextIcon className="w-4 h-4" /> },
  { label: "Blog Editor",     href: "/editor/blogs",     icon: <PencilSquareIcon className="w-4 h-4" /> },
];

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role as string;
  if (role !== "EDITOR" && role !== "ADMIN") {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, reserved: true, bonus: true, name: true, avatar: true },
  });

  return (
    <div className="dashboard-shell">
      <Sidebar navItems={editorNavItems} role="EDITOR" />
      <div className="main-content">
        <TopHeader
          breadcrumbs={[{ label: "Editor Dashboard", href: "/editor/pages" }]}
          userName={session.user.name ?? "Editor User"}
          userRole="EDITOR"
          activeRole="EDITOR"
          userAvatar={user?.avatar ?? undefined}
          notificationCount={0}
          recentNotifications={[]}
          showWallet={false}
          showRoleSwitcher={false}
        />
        <div className="p-6 font-inter w-full min-h-screen">{children}</div>
      </div>
    </div>
  );
}
