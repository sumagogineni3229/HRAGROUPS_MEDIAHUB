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

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdvertiserTasksPage({ searchParams }: PageProps) {
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

    const platformFee = task.price * 0.1;
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Home &gt; Tasks</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">Sent Placements Orders</h1>
      </div>

      <div className="bg-card border-base rounded-lg p-6">
        <div className="status-tabs mb-6" style={{ borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px' }}>
          <a href="/advertiser/tasks?status=ALL" className={`status-tab pb-2 ${currentTab === 'ALL' ? 'active font-bold text-primary' : 'text-muted'}`} style={currentTab === 'ALL' ? { borderBottom: '2px solid var(--color-primary)' } : {}}>
            All Sent Tasks
          </a>
          <a href="/advertiser/tasks?status=TASK_REVIEW" className={`status-tab pb-2 ${currentTab === 'TASK_REVIEW' ? 'active font-bold text-primary' : 'text-muted'}`} style={currentTab === 'TASK_REVIEW' ? { borderBottom: '2px solid var(--color-primary)' } : {}}>
            Reviewing
          </a>
          <a href="/advertiser/tasks?status=IN_PROGRESS" className={`status-tab pb-2 ${currentTab === 'IN_PROGRESS' ? 'active font-bold text-primary' : 'text-muted'}`} style={currentTab === 'IN_PROGRESS' ? { borderBottom: '2px solid var(--color-primary)' } : {}}>
            In Progress
          </a>
          <a href="/advertiser/tasks?status=YOUR_APPROVAL" className={`status-tab pb-2 ${currentTab === 'YOUR_APPROVAL' ? 'active font-bold text-primary' : 'text-muted'}`} style={currentTab === 'YOUR_APPROVAL' ? { borderBottom: '2px solid var(--color-primary)' } : {}}>
            Waiting for Approval
          </a>
          <a href="/advertiser/tasks?status=COMPLETED" className={`status-tab pb-2 ${currentTab === 'COMPLETED' ? 'active font-bold text-primary' : 'text-muted'}`} style={currentTab === 'COMPLETED' ? { borderBottom: '2px solid var(--color-primary)' } : {}}>
            Completed
          </a>
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
          <div className="tasks-list flex flex-col gap-4">
            {tasks.map((task: any) => (
              <div key={task.id} className="card bg-card border-base rounded-lg p-6 relative">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xs text-muted block mb-1">Placement Platform</span>
                    <Link href={`/advertiser/tasks/${task.id}`} className="font-space font-semibold text-primary hover:underline text-sm">
                      {task.platformId ? task.platform?.url : task.channel?.handle}
                    </Link>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="badge badge-pending text-xs">{task.status}</span>
                    <Link href={`/advertiser/tasks/${task.id}`} className="text-xs text-primary hover:underline font-inter">View →</Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-muted mb-4 text-sm font-inter">
                  <div>
                    <span className="text-xs text-muted block mb-1">Promoted URL</span>
                    <a href={task.targetUrl || ""} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {task.targetUrl}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-muted block mb-1">Anchor Text</span>
                    <span className="text-dark font-medium">{task.anchorText}</span>
                  </div>
                </div>

                {task.liveUrl && (
                  <div className="bg-app p-4 rounded-lg text-sm font-inter mb-4">
                    <strong>Live Deliverable Link:</strong>{" "}
                    <a href={task.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {task.liveUrl}
                    </a>
                  </div>
                )}

                {/* Approvals actions */}
                {task.status === "YOUR_APPROVAL" && (
                  <div className="flex flex-col gap-4 pt-4 border-t border-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted font-inter">Confirm if link insertion meets anchor instructions before releasing payouts.</span>
                      <div className="flex gap-2">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
