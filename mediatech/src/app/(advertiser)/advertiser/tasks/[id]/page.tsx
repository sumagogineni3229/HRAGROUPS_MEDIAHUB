import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { MessageThread } from "@/components/tasks/message-thread";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Task Detail - MediaHub" };

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  TASK_REVIEW: "Under Review",
  TASK_ACCEPTANCE: "Awaiting Seller Acceptance",
  IN_PROGRESS: "In Progress",
  YOUR_APPROVAL: "Awaiting Your Approval",
  IMPROVEMENT: "Improvement Requested",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-muted",
  TASK_REVIEW: "text-warning",
  TASK_ACCEPTANCE: "text-warning",
  IN_PROGRESS: "text-primary",
  YOUR_APPROVAL: "text-success",
  IMPROVEMENT: "text-danger",
  COMPLETED: "text-success",
  REJECTED: "text-danger",
  ARCHIVED: "text-muted",
};

export default async function AdvertiserTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const task = await db.task.findUnique({
    where: { id },
    include: {
      platform: true,
      channel: true,
      package: true,
      channelPkg: true,
      messages: {
        include: { sender: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!task || task.advertiserId !== session.user.id) notFound();

  // ── Server Actions ────────────────────────────────────────────

  async function handleApprove(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const { db } = await import("@/lib/db");
    const t = await db.task.findUnique({ where: { id } });
    if (!t || t.advertiserId !== s.user.id || t.status !== "YOUR_APPROVAL") return;

    const earnings = t.price * 0.9;
    await db.$transaction([
      db.user.update({ where: { id: t.advertiserId }, data: { reserved: { decrement: t.price } } }),
      db.user.update({ where: { id: t.sellerId }, data: { balance: { increment: earnings }, earnings: { increment: earnings } } }),
      db.task.update({ where: { id }, data: { status: "COMPLETED", completedAt: new Date() } }),
      db.transaction.create({ data: { userId: t.sellerId, taskId: id, type: "EARNING", amount: earnings, note: "Task approved — earnings released" } }),
    ]);

    // Notify seller
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: t.sellerId,
      type: "PAYMENT",
      title: "Payment released — order approved!",
      body: `Your placement was approved. $${earnings.toFixed(2)} has been credited to your balance.`,
      link: t.sellerType === "INFLUENCER" ? `/influencer/tasks/${id}` : `/publisher/tasks/${id}`,
    });

    redirect("/advertiser/tasks?status=COMPLETED");
  }

  async function handleRequestRevision(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const note = formData.get("note") as string;
    const { db } = await import("@/lib/db");
    const t = await db.task.findUnique({ where: { id } });
    if (!t) return;
    await db.task.update({ where: { id }, data: { status: "IMPROVEMENT", contentNotes: note } });

    // Notify seller
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: t.sellerId,
      type: "TASK_UPDATE",
      title: "Revision requested",
      body: `The advertiser requested changes: "${note.slice(0, 100)}${note.length > 100 ? "…" : ""}". Please review and resubmit.`,
      link: t.sellerType === "INFLUENCER" ? `/influencer/tasks/${id}` : `/publisher/tasks/${id}`,
    });

    redirect(`/advertiser/tasks/${id}`);
  }

  async function handleSendMessage(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const content = formData.get("content") as string;
    if (!content?.trim()) return;
    const { db } = await import("@/lib/db");
    await db.message.create({ data: { taskId: id, senderId: s.user.id, content: content.trim() } });
    redirect(`/advertiser/tasks/${id}`);
  }

  const listingName = task.platform?.url ?? task.channel?.handle ?? "Unknown";
  const listingType = task.platform ? "Website Placement" : "Social Shoutout";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <PageHeader
        crumbs={["Home", "Tasks", listingName]}
        title={`Order #${id.slice(-8).toUpperCase()}`}
        action={
          <Link href="/advertiser/tasks" className="btn btn-outline btn-sm flex items-center gap-2 font-inter">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Tasks
          </Link>
        }
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-6">

          {/* Brief Card */}
          <div className="card bg-card border-base rounded-xl p-6">
            <h2 className="font-space font-semibold text-dark text-lg mb-4">Order Brief</h2>

            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
              {task.platform
                ? <GlobeAltIcon className="w-5 h-5 text-primary" />
                : <UserCircleIcon className="w-5 h-5 text-primary" />}
              <div>
                <p className="font-semibold text-dark font-space">{listingName}</p>
                <p className="text-xs text-muted">{listingType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 text-sm font-inter">
              {task.targetUrl && (
                <div>
                  <span className="text-xs text-muted block mb-1">Promoted URL</span>
                  <a href={task.targetUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                    {task.targetUrl}
                  </a>
                </div>
              )}
              {task.anchorText && (
                <div>
                  <span className="text-xs text-muted block mb-1">Anchor Text</span>
                  <span className="text-dark font-medium">{task.anchorText}</span>
                </div>
              )}
              <div>
                <span className="text-xs text-muted block mb-1">Order Value</span>
                <span className="text-dark font-bold font-space">${task.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-1">Placed On</span>
                <span className="text-dark">{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-muted block mb-2">Content Brief &amp; Guidelines</span>
              <div className="bg-app rounded-lg p-4 text-sm font-inter text-dark leading-relaxed whitespace-pre-wrap">
                {task.brief}
              </div>
            </div>

            {task.contentNotes && (
              <div className="mt-4">
                <span className="text-xs text-muted block mb-2">Revision Notes</span>
                <div className="bg-[#FFF4D9] rounded-lg p-4 text-sm font-inter text-dark border border-[#F5A723] leading-relaxed">
                  {task.contentNotes}
                </div>
              </div>
            )}
          </div>

          {/* Deliverable */}
          {task.liveUrl && (
            <div className="card bg-card border-base rounded-xl p-6">
              <h2 className="font-space font-semibold text-dark text-lg mb-3">Submitted Deliverable</h2>
              <a
                href={task.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline font-inter text-sm break-all"
              >
                <GlobeAltIcon className="w-4 h-4 flex-shrink-0" />
                {task.liveUrl}
              </a>
            </div>
          )}

          {/* Approve / Revision Actions */}
          {task.status === "YOUR_APPROVAL" && (
            <div className="card bg-card border-base rounded-xl p-6">
              <h2 className="font-space font-semibold text-dark text-lg mb-4">Review Deliverable</h2>
              <p className="text-sm text-muted font-inter mb-6">
                Confirm the placement meets your brief before releasing payment to the publisher.
              </p>
              <div className="flex gap-3 mb-6">
                <form action={handleApprove} className="flex-1">
                  <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2 font-space font-semibold">
                    <CheckIcon className="w-5 h-5" /> Approve & Release Payment
                  </button>
                </form>
              </div>
              <form action={handleRequestRevision} className="flex gap-3 pt-4 border-t border-dashed border-border">
                <input
                  name="note"
                  type="text"
                  required
                  placeholder="Describe what needs to be fixed..."
                  className="input flex-1"
                />
                <button type="submit" className="btn btn-outline flex items-center gap-2 text-danger font-inter" style={{ borderColor: "var(--color-danger)" }}>
                  <XMarkIcon className="w-4 h-4" /> Request Revision
                </button>
              </form>
            </div>
          )}

          {/* Message Thread */}
          <div className="card bg-card border-base rounded-xl p-6">
            <h2 className="font-space font-semibold text-dark text-lg mb-4">Messages</h2>
            <MessageThread
              messages={task.messages as any}
              currentUserId={session.user.id}
              taskId={id}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="flex flex-col gap-6">
          {/* Status Card */}
          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4">Order Status</h3>
            <div className={`text-lg font-bold font-space ${STATUS_COLORS[task.status] ?? "text-dark"}`}>
              {STATUS_LABELS[task.status] ?? task.status}
            </div>
            <div className="mt-4 flex flex-col gap-3 text-xs font-inter text-muted">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>Placed {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              {task.acceptedAt && (
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-success" />
                  <span>Accepted {new Date(task.acceptedAt).toLocaleDateString()}</span>
                </div>
              )}
              {task.deliveredAt && (
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-primary" />
                  <span>Delivered {new Date(task.deliveredAt).toLocaleDateString()}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-success" />
                  <span>Completed {new Date(task.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financials Card */}
          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4">Financial Summary</h3>
            <div className="flex flex-col gap-3 text-sm font-inter">
              <div className="flex justify-between">
                <span className="text-muted">Order total</span>
                <span className="font-bold text-dark">${task.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Platform fee (10%)</span>
                <span className="text-muted">${(task.price * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-muted">Seller receives</span>
                <span className="font-bold text-success">${(task.price * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Listing details */}
          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4">Listing Details</h3>
            {task.platform && (
              <div className="flex flex-col gap-2 text-xs font-inter">
                <div className="flex justify-between"><span className="text-muted">DA</span><span className="font-semibold text-dark">{task.platform.da}</span></div>
                <div className="flex justify-between"><span className="text-muted">DR</span><span className="font-semibold text-dark">{task.platform.dr}</span></div>
                <div className="flex justify-between"><span className="text-muted">Traffic</span><span className="font-semibold text-dark">{task.platform.traffic.toLocaleString()}/mo</span></div>
                <div className="flex justify-between"><span className="text-muted">Niche</span><span className="font-semibold text-dark">{task.platform.niche}</span></div>
              </div>
            )}
            {task.channel && (
              <div className="flex flex-col gap-2 text-xs font-inter">
                <div className="flex justify-between"><span className="text-muted">Platform</span><span className="font-semibold text-dark">{task.channel.platform}</span></div>
                <div className="flex justify-between"><span className="text-muted">Followers</span><span className="font-semibold text-dark">{task.channel.followers.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted">Engagement</span><span className="font-semibold text-dark">{task.channel.engagement}%</span></div>
                <div className="flex justify-between"><span className="text-muted">Niche</span><span className="font-semibold text-dark">{task.channel.niche}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
