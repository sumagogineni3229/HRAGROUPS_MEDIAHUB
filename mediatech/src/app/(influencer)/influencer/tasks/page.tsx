import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DocumentTextIcon,
  BriefcaseIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Tasks - MediaHub",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function InfluencerTasksPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.status || "ALL";

  const tasks = await db.task.findMany({
    where: {
      sellerId: session.user.id,
      sellerType: "INFLUENCER",
      ...(currentTab !== "ALL" ? { status: currentTab as any } : {}),
    },
    include: {
      channel: true,
      channelPkg: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const tabConfig = [
    { key: "ALL", label: "All Tasks" },
    { key: "TASK_ACCEPTANCE", label: "New Offers" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "YOUR_APPROVAL", label: "Under Review" },
    { key: "IMPROVEMENT", label: "Revision" },
    { key: "COMPLETED", label: "Completed" },
    { key: "REJECTED", label: "Declined" },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Home &gt; Tasks</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">Brand Deals</h1>
      </div>

      <div className="bg-card border-base rounded-lg p-6">
        {/* Status Tabs */}
        <div
          className="status-tabs mb-6 flex gap-4 flex-wrap"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {tabConfig.map((tab) => (
            <Link
              key={tab.key}
              href={`/influencer/tasks?status=${tab.key}`}
              className={`status-tab pb-2 font-inter text-sm ${
                currentTab === tab.key
                  ? "font-bold text-primary"
                  : "text-muted hover:text-dark"
              }`}
              style={
                currentTab === tab.key
                  ? { borderBottom: "2px solid var(--color-primary)" }
                  : {}
              }
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state py-12 flex flex-col items-center justify-center text-center">
            <div className="empty-state-icons flex gap-4 mb-4 text-muted">
              <DocumentTextIcon className="w-10 h-10" />
              <ClipboardIcon className="w-10 h-10" />
              <BriefcaseIcon className="w-10 h-10" />
            </div>
            <p className="font-space font-medium text-dark text-lg mb-1">No tasks in this view.</p>
            <p className="text-muted text-sm max-w-sm">
              Brand deals and shoutout orders will appear here once advertisers place orders on your channels.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="card bg-card border-base rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-muted block mb-1">Channel</span>
                    <Link
                      href={`/influencer/tasks/${task.id}`}
                      className="font-space font-bold text-primary hover:underline"
                    >
                      {task.channel
                        ? `@${task.channel.handle} (${task.channel.platform})`
                        : "Unknown Channel"}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-pending text-xs">{task.status}</span>
                    <Link
                      href={`/influencer/tasks/${task.id}`}
                      className="text-xs text-primary hover:underline font-inter"
                    >
                      View →
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-muted text-sm font-inter">
                  <div>
                    <span className="text-xs text-muted block mb-1">Deal Type</span>
                    <span className="text-dark font-medium">
                      {task.channelPkg?.type ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block mb-1">Your Earnings</span>
                    <span className="font-bold text-success">${(task.price * 0.9).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block mb-1">Placed On</span>
                    <span className="text-muted">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
