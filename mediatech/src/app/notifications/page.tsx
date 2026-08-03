import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BellIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Notifications - MediaHub",
};

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  TASK_UPDATE: { icon: ClipboardDocumentListIcon, color: "text-primary", bg: "bg-[#EEF0FD]" },
  PAYMENT:     { icon: CurrencyDollarIcon,        color: "text-success",  bg: "bg-[#e8fbee]" },
  MESSAGE:     { icon: ChatBubbleLeftIcon,         color: "text-primary",  bg: "bg-[#EEF0FD]" },
  SYSTEM:      { icon: InformationCircleIcon,      color: "text-muted",    bg: "bg-app" },
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Mark all as read server action
  async function markAllRead() {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const { db } = await import("@/lib/db");
    await db.notification.updateMany({
      where: { userId: s.user.id, isRead: false },
      data: { isRead: true },
    });
    redirect("/notifications");
  }

  // Mark single as read
  async function markOneRead(formData: FormData) {
    "use server";
    const notifId = formData.get("notifId") as string;
    const link = formData.get("link") as string;
    const s = await auth();
    if (!s?.user?.id) return;
    const { db } = await import("@/lib/db");
    await db.notification.update({ where: { id: notifId }, data: { isRead: true } });
    redirect(link || "/notifications");
  }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const role = (session.user as any).role as string;
  const balanceHref =
    role === "ADVERTISER"
      ? "/advertiser/balance"
      : role === "PUBLISHER"
      ? "/publisher/balance"
      : "/influencer/balance";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs text-muted font-inter block mb-1">Home &gt; Notifications</span>
          <h1 className="text-2xl font-bold font-space text-dark flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-semibold text-white bg-primary rounded-full px-2.5 py-0.5 font-inter">
                {unreadCount} new
              </span>
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button
              type="submit"
              className="btn btn-outline btn-sm flex items-center gap-2 font-inter text-primary"
              style={{ borderColor: "var(--color-primary)" }}
            >
              <CheckIcon className="w-4 h-4" />
              Mark all as read
            </button>
          </form>
        )}
      </div>

      {/* Notifications list */}
      <div className="card bg-card border-base rounded-xl overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <BellIcon className="w-12 h-12 text-muted mb-4" />
            <p className="font-space font-semibold text-dark text-lg mb-1">All caught up!</p>
            <p className="text-muted text-sm max-w-xs font-inter">
              You have no notifications. Activity on your tasks and account will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notif: any) => {
              const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.SYSTEM;
              const Icon = cfg.icon;
              return (
                <form key={notif.id} action={markOneRead} className="w-full">
                  <input type="hidden" name="notifId" value={notif.id} />
                  <input type="hidden" name="link" value={notif.link ?? ""} />
                  <button
                    type="submit"
                    className={`w-full text-left flex items-start gap-4 px-6 py-4 transition-colors hover:bg-app ${
                      !notif.isRead ? "bg-[#F8F9FF]" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold font-space ${!notif.isRead ? "text-dark" : "text-muted"}`}>
                          {notif.title}
                        </p>
                        <span className="text-xs text-muted font-inter flex-shrink-0">
                          {new Date(notif.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted font-inter mt-0.5 leading-relaxed">
                        {notif.body}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!notif.isRead && (
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                    )}
                  </button>
                </form>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
