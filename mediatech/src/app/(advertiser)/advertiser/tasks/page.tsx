import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  ClipboardIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Tasks - MediaHub",
};

interface AdvertiserTasksPageProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  ALL:             { label: "All Sent Tasks",       bg: "#f3f4f6", color: "#374151" },
  TASK_REVIEW:     { label: "Reviewing",            bg: "#eef2ff", color: "#4f46e5" },
  TASK_ACCEPTANCE: { label: "Awaiting Acceptance", bg: "#fffbe6", color: "#d97706" },
  IN_PROGRESS:     { label: "In Progress",          bg: "#e0f2fe", color: "#0284c7" },
  YOUR_APPROVAL:   { label: "Waiting Approval",     bg: "#fef3c7", color: "#b45309" },
  IMPROVEMENT:     { label: "Revisions Requested",  bg: "#fff0f0", color: "#dc2626" },
  COMPLETED:       { label: "Completed",            bg: "#e8fbee", color: "#16a34a" },
  REJECTED:        { label: "Declined",             bg: "#fef2f2", color: "#991b1b" },
};

export default async function AdvertiserTasksPage({ searchParams }: AdvertiserTasksPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.status || "ALL";

  // Fetch advertiser tasks
  const tasks = await db.task.findMany({
    where: {
      advertiserId: session.user.id,
      ...(currentTab !== "ALL" ? { status: currentTab as any } : {}),
    },
    include: {
      platform: true,
      channel: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Server actions for approvals
  async function handleApprove(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const { db } = await import("@/lib/db");

    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task || task.status !== "YOUR_APPROVAL") return;

    const publisherEarnings = task.price * 0.9;

    // Transaction: Release escrow, credit publisher wallet earnings
    await db.$transaction([
      db.user.update({
        where: { id: task.advertiserId },
        data: { reserved: { decrement: task.price } }
      }),
      db.user.update({
        where: { id: task.sellerId },
        data: { 
          balance: { increment: publisherEarnings },
          earnings: { increment: publisherEarnings }
        }
      }),
      db.task.update({
        where: { id: taskId },
        data: { 
          status: "COMPLETED", 
          completedAt: new Date()
        }
      })
    ]);

    // Process referral commission if seller was referred
    const { processReferralCommission } = await import("@/lib/referrals");
    await processReferralCommission(taskId, task.sellerId, task.platformFee || task.price * 0.1);

    redirect("/advertiser/tasks?status=COMPLETED");
  }

  async function handleImprovement(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const note = formData.get("note") as string;
    const { db } = await import("@/lib/db");

    await db.task.update({
      where: { id: taskId },
      data: { 
        status: "TASK_ACCEPTANCE", // Moves task back to revisions
        contentNotes: note
      }
    });

    redirect("/advertiser/tasks?status=TASK_ACCEPTANCE");
  }

  const tabs = [
    { key: "ALL", label: "All Sent Tasks" },
    { key: "TASK_REVIEW", label: "Reviewing" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "YOUR_APPROVAL", label: "Waiting for Approval" },
    { key: "COMPLETED", label: "Completed" },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-6 font-inter">
        <span className="text-xs text-muted">Home &gt; Tasks</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Sent Placements Orders</h1>
      </div>

      <div className="bg-card border-base rounded-xl p-6">
        {/* Status Tabs Navigation */}
        <div className="flex gap-6 mb-6 pb-2 border-b border-border overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <a
                key={tab.key}
                href={`/advertiser/tasks?status=${tab.key}`}
                className={`text-sm font-inter font-medium pb-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "text-primary border-b-2 border-primary font-semibold"
                    : "text-muted hover:text-dark"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state py-12 flex flex-col items-center justify-center text-center">
            <div className="empty-state-icons flex gap-4 mb-4 text-muted">
              <DocumentTextIcon className="w-10 h-10" />
              <ClipboardIcon className="w-10 h-10" />
              <BriefcaseIcon className="w-10 h-10" />
            </div>
            <p className="font-space font-medium text-dark text-lg mb-1">No tasks found.</p>
            <p className="text-muted text-sm max-w-sm">No placement orders match this status filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {tasks.map((task: any) => {
              const statusCfg = STATUS_CONFIG[task.status] || {
                label: task.status,
                bg: "#f3f4f6",
                color: "#4b5563",
              };

              const platformUrl = task.platformId ? task.platform?.url : task.channel?.handle;

              return (
                <div
                  key={task.id}
                  className="bg-card border border-border rounded-xl p-6 transition-all hover:shadow-sm"
                >
                  {/* Top Row: URL, Status, View Action */}
                  <div className="flex justify-between items-center mb-4 gap-4">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-muted font-inter block mb-1 font-medium">
                        Placement Platform
                      </span>
                      <Link
                        href={`/advertiser/tasks/${task.id}`}
                        className="font-space font-semibold text-primary hover:underline text-base truncate block max-w-xl"
                      >
                        {platformUrl}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold font-inter"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                      <Link
                        href={`/advertiser/tasks/${task.id}`}
                        className="text-xs text-primary font-semibold hover:underline font-inter flex items-center gap-1"
                      >
                        View &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Order Specifications Grid Box */}
                  <div className="bg-[#F8FAFC] border border-border rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-inter">
                    <div className="min-w-0">
                      <span className="text-muted block mb-1 font-medium">Promoted URL</span>
                      <a
                        href={task.targetUrl || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium break-all block"
                      >
                        {task.targetUrl}
                      </a>
                    </div>
                    <div>
                      <span className="text-muted block mb-1 font-medium">Anchor Text</span>
                      <span className="text-dark font-semibold text-sm">
                        {task.anchorText}
                      </span>
                    </div>
                  </div>

                  {/* Live Deliverable Box */}
                  {task.liveUrl && (
                    <div className="bg-[#F0FDFA] border border-[#CCFBF1] p-4 rounded-lg text-xs font-inter mb-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-[#0F766E] block mb-0.5">
                          Live Deliverable Link:
                        </span>
                        <a
                          href={task.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium break-all block"
                        >
                          {task.liveUrl}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Approvals actions */}
                  {task.status === "YOUR_APPROVAL" && (
                    <div className="flex flex-col gap-4 pt-4 border-t border-border mt-2">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-xs text-muted font-inter">
                          Confirm if link insertion meets anchor instructions before releasing payouts.
                        </span>
                        <div className="flex gap-2 flex-shrink-0">
                          <form action={handleApprove}>
                            <input type="hidden" name="taskId" value={task.id} />
                            <button type="submit" className="btn btn-primary flex items-center gap-1 btn-sm">
                              <CheckIcon className="w-4 h-4" /> Approve Placement
                            </button>
                          </form>
                        </div>
                      </div>

                      <form action={handleImprovement} className="flex gap-2 pt-2 border-t border-dashed border-border">
                        <input type="hidden" name="taskId" value={task.id} />
                        <input 
                          name="note" 
                          type="text" 
                          required 
                          placeholder="State what needs revision (e.g., Change anchor location)..." 
                          className="input flex-1" 
                        />
                        <button type="submit" className="btn btn-outline flex items-center gap-1 btn-sm text-danger" style={{ borderColor: 'var(--color-danger)' }}>
                          Request Revisions
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
