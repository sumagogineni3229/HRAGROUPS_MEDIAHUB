import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { MessageThread } from "@/components/tasks/message-thread";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Task Detail - Influencer" };

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  TASK_REVIEW: "Under Review",
  TASK_ACCEPTANCE: "Awaiting Your Acceptance",
  IN_PROGRESS: "In Progress",
  YOUR_APPROVAL: "Submitted — Awaiting Brand Review",
  IMPROVEMENT: "Revision Requested",
  COMPLETED: "Completed",
  REJECTED: "Declined",
  ARCHIVED: "Archived",
};

const STATUS_COLORS: Record<string, string> = {
  TASK_ACCEPTANCE: "text-warning",
  IN_PROGRESS: "text-primary",
  YOUR_APPROVAL: "text-success",
  IMPROVEMENT: "text-danger",
  COMPLETED: "text-success",
  REJECTED: "text-danger",
};

export default async function InfluencerTaskDetailPage({
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
      channel: true,
      channelPkg: true,
      messages: {
        include: { sender: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!task || task.sellerId !== session.user.id) notFound();

  // ── Server Actions ────────────────────────────────────────────

  async function handleAccept(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const { db } = await import("@/lib/db");
    const t = await db.task.findUnique({ where: { id } });
    if (!t) return;
    await db.task.update({ where: { id }, data: { status: "IN_PROGRESS", acceptedAt: new Date() } });

    const { createNotification } = await import("@/lib/notifications");
    const influencer = await db.user.findUnique({ where: { id: s.user.id }, select: { name: true } });
    await createNotification({
      userId: t.advertiserId,
      type: "TASK_UPDATE",
      title: "Brand deal accepted",
      body: `${influencer?.name ?? "The influencer"} accepted your brand deal and is now creating the content.`,
      link: `/advertiser/tasks/${id}`,
    });

    redirect(`/influencer/tasks/${id}`);
  }

  async function handleReject(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const { db } = await import("@/lib/db");
    const t = await db.task.findUnique({ where: { id } });
    if (!t) return;
    await db.$transaction([
      db.user.update({ where: { id: t.advertiserId }, data: { reserved: { decrement: t.price }, balance: { increment: t.price } } }),
      db.task.update({ where: { id }, data: { status: "REJECTED" } }),
    ]);

    const { createNotification } = await import("@/lib/notifications");
    const influencer = await db.user.findUnique({ where: { id: s.user.id }, select: { name: true } });
    await createNotification({
      userId: t.advertiserId,
      type: "TASK_UPDATE",
      title: "Brand deal declined",
      body: `${influencer?.name ?? "The influencer"} declined your brand deal. Your funds have been refunded.`,
      link: `/advertiser/tasks/${id}`,
    });

    redirect("/influencer/tasks");
  }

  async function handleSubmitDeliverable(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const liveUrl = formData.get("liveUrl") as string;
    if (!liveUrl) return;
    const { db } = await import("@/lib/db");
    const t = await db.task.findUnique({ where: { id } });
    if (!t) return;
    await db.task.update({ where: { id }, data: { status: "YOUR_APPROVAL", liveUrl, deliveredAt: new Date() } });

    const { createNotification } = await import("@/lib/notifications");
    const influencer = await db.user.findUnique({ where: { id: s.user.id }, select: { name: true } });
    await createNotification({
      userId: t.advertiserId,
      type: "TASK_UPDATE",
      title: "Content submitted — review needed",
      body: `${influencer?.name ?? "The influencer"} submitted the content. Please review and approve or request revisions.`,
      link: `/advertiser/tasks/${id}`,
    });

    redirect(`/influencer/tasks/${id}`);
  }

  async function handleSendMessage(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const content = formData.get("content") as string;
    if (!content?.trim()) return;
    const { db } = await import("@/lib/db");
    await db.message.create({ data: { taskId: id, senderId: s.user.id, content: content.trim() } });
    redirect(`/influencer/tasks/${id}`);
  }

  const channelLabel = task.channel
    ? `@${task.channel.handle} (${task.channel.platform})`
    : "Unknown Channel";

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <PageHeader
        crumbs={["Home", "Tasks", channelLabel]}
        title={`Brand Deal #${id.slice(-8).toUpperCase()}`}
        action={
          <Link href="/influencer/tasks" className="btn btn-outline btn-sm flex items-center gap-2 font-inter">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Tasks
          </Link>
        }
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* ── LEFT ── */}
        <div className="flex flex-col gap-6">
          {/* Campaign Brief */}
          <div className="card bg-card border-base rounded-xl p-6">
            <h2 className="font-space font-semibold text-dark text-lg mb-4">Campaign Brief</h2>

            {task.channel && (
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <DevicePhoneMobileIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-dark font-space">@{task.channel.handle}</p>
                  <p className="text-xs text-muted">{task.channel.platform} · {task.channel.followers.toLocaleString()} followers</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-6 text-sm font-inter">
              {task.targetUrl && (
                <div>
                  <span className="text-xs text-muted block mb-1">Brand / Promoted URL</span>
                  <a href={task.targetUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{task.targetUrl}</a>
                </div>
              )}
              {task.channelPkg && (
                <div>
                  <span className="text-xs text-muted block mb-1">Deliverable Type</span>
                  <span className="font-medium text-dark">{task.channelPkg.type}</span>
                </div>
              )}
              <div>
                <span className="text-xs text-muted block mb-1">Your Earnings</span>
                <span className="font-bold text-success font-space">${(task.price * 0.9).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-xs text-muted block mb-1">Received</span>
                <span className="text-dark">{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-muted block mb-2">Campaign Brief &amp; Instructions</span>
              <div className="bg-app rounded-lg p-4 text-sm font-inter text-dark leading-relaxed whitespace-pre-wrap">
                {task.brief}
              </div>
            </div>

            {task.contentNotes && (
              <div className="mt-4">
                <span className="text-xs text-muted block mb-2">Revision Request from Brand</span>
                <div className="bg-[#FFF4D9] rounded-lg p-4 text-sm font-inter text-dark border border-[#F5A723] leading-relaxed">
                  {task.contentNotes}
                </div>
              </div>
            )}
          </div>

          {/* Accept / Decline */}
          {(task.status === "TASK_ACCEPTANCE" || task.status === "TASK_REVIEW") && (
            <div className="card bg-card border-base rounded-xl p-6">
              <h2 className="font-space font-semibold text-dark text-lg mb-3">New Brand Deal — Accept?</h2>
              <p className="text-sm text-muted font-inter mb-6">
                Review the campaign brief and decide whether to accept this brand collaboration.
              </p>
              <div className="flex gap-3">
                <form action={handleAccept} className="flex-1">
                  <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2 font-space font-semibold">
                    <CheckIcon className="w-5 h-5" /> Accept Deal
                  </button>
                </form>
                <form action={handleReject}>
                  <button type="submit" className="btn btn-outline flex items-center gap-2 text-danger font-inter" style={{ borderColor: "var(--color-danger)" }}>
                    <XMarkIcon className="w-4 h-4" /> Decline
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Submit deliverable */}
          {(task.status === "IN_PROGRESS" || task.status === "IMPROVEMENT") && (
            <div className="card bg-card border-base rounded-xl p-6">
              <h2 className="font-space font-semibold text-dark text-lg mb-3">Submit Your Content</h2>
              <p className="text-sm text-muted font-inter mb-6">
                Paste the link to your published post, reel, or video for the brand to review.
              </p>
              <form action={handleSubmitDeliverable} className="flex gap-3">
                <input
                  name="liveUrl"
                  type="url"
                  required
                  placeholder="https://instagram.com/p/..."
                  className="input flex-1"
                />
                <button type="submit" className="btn btn-primary flex items-center gap-2 font-space font-semibold">
                  <CheckIcon className="w-4 h-4" /> Submit
                </button>
              </form>
            </div>
          )}

          {task.liveUrl && (
            <div className="card bg-card border-base rounded-xl p-6">
              <h2 className="font-space font-semibold text-dark text-lg mb-3">Submitted Content Link</h2>
              <a href={task.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline font-inter text-sm break-all">
                <GlobeAltIcon className="w-4 h-4 flex-shrink-0" />
                {task.liveUrl}
              </a>
            </div>
          )}

          {/* Message Thread */}
          <div className="card bg-card border-base rounded-xl p-6">
            <h2 className="font-space font-semibold text-dark text-lg mb-4">Messages with Brand</h2>
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
          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4">Deal Status</h3>
            <div className={`text-lg font-bold font-space ${STATUS_COLORS[task.status] ?? "text-dark"}`}>
              {STATUS_LABELS[task.status] ?? task.status}
            </div>
            <div className="mt-4 flex flex-col gap-3 text-xs font-inter text-muted">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>Received {new Date(task.createdAt).toLocaleDateString()}</span>
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
                  <span>Submitted {new Date(task.deliveredAt).toLocaleDateString()}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-success" />
                  <span>Approved {new Date(task.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-card border-base rounded-xl p-6">
            <h3 className="font-space font-semibold text-dark text-sm mb-4">Earnings</h3>
            <div className="flex flex-col gap-3 text-sm font-inter">
              <div className="flex justify-between">
                <span className="text-muted">Deal value</span>
                <span className="font-bold text-dark">${task.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Platform fee (10%)</span>
                <span className="text-muted">-${(task.price * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-muted font-semibold">Your earnings</span>
                <span className="font-bold text-success">${(task.price * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
