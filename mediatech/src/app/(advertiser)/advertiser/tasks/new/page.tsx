import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBagIcon, GlobeAltIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { ProjectSelectListener } from "@/components/advertiser/project-select-listener";

export const metadata = {
  title: "New Placement Order - MediaHub",
};

interface PageProps {
  searchParams: Promise<{ platformId?: string; channelId?: string }>;
}

export default async function NewTaskPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { platformId, channelId } = await searchParams;

  let platform: any = null;
  let channel: any = null;
  let targetPrice = 0;

  // Retrieve selected platform or influencer details
  if (platformId) {
    platform = await db.platform.findUnique({
      where: { id: platformId },
      include: { packages: true },
    });
    // Guard: only allow orders on ACTIVE platforms
    if (platform && platform.status !== "ACTIVE") platform = null;
    const mainPkg = platform?.packages.find((p: any) => p.isActive && p.type === "ARTICLE_POSTING")
      ?? platform?.packages.find((p: any) => p.isActive);  // fallback to first active pkg
    targetPrice = mainPkg?.price ?? 0;
  } else if (channelId) {
    channel = await db.channel.findUnique({
      where: { id: channelId },
      include: { packages: true },
    });
    // Guard: only allow orders on ACTIVE channels
    if (channel && channel.status !== "ACTIVE") channel = null;
    const mainPkg = channel?.packages.find((p: any) => p.isActive && p.type === "POST")
      ?? channel?.packages.find((p: any) => p.isActive);  // fallback to first active pkg
    targetPrice = mainPkg?.price ?? 0;
  }

  if (!platform && !channel) {
    redirect("/advertiser/sites");
  }

  // Guard: cannot place a $0 order
  if (targetPrice <= 0) {
    redirect("/advertiser/sites?error=no_packages");
  }

  // Fetch advertiser projects
  const projects = await db.project.findMany({
    where: { advertiserId: session.user.id },
    orderBy: { name: "asc" }
  });

  // Fetch advertiser wallet details
  const advertiser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true }
  });

  const walletBalance = advertiser?.balance ?? 0;
  const insuﬃcientFunds = walletBalance < targetPrice;

  // Server action to create order task
  async function handleCreateOrder(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const targetUrl = formData.get("targetUrl") as string;
    const anchorText = formData.get("anchorText") as string;
    const brief = formData.get("brief") as string;
    const projectId = formData.get("projectId") as string;
    const newProjectName = formData.get("newProjectName") as string;

    const { db } = await import("@/lib/db");

    // Fetch user and check balance again
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true, reserved: true }
    });

    if (!user || user.balance < targetPrice) {
      redirect("/advertiser/balance?error=insufficient_funds");
    }

    // Resolve or create project
    let resolvedProjectId: string | null = null;
    if (projectId === "NEW" && newProjectName?.trim()) {
      const createdProj = await db.project.create({
        data: {
          advertiserId: session.user.id,
          name: newProjectName.trim(),
        }
      });
      resolvedProjectId = createdProj.id;
    } else if (projectId && projectId !== "NEW") {
      resolvedProjectId = projectId;
    }

    // Begin transaction: deduct balance, reserve funds, create task
    const [, task] = await db.$transaction([
      db.user.update({
        where: { id: session.user.id },
        data: {
          balance: { decrement: targetPrice },
          reserved: { increment: targetPrice }
        }
      }),
      db.task.create({
        data: {
          advertiserId: session.user.id,
          sellerId: platform ? platform.publisherId : (channel ? channel.influencerId : ""),
          sellerType: platform ? "PUBLISHER" : "INFLUENCER",
          platformId: platformId || null,
          channelId: channelId || null,
          projectId: resolvedProjectId,
          brief,
          anchorText,
          targetUrl,
          price: targetPrice,
          platformFee: targetPrice * 0.1,
          sellerEarning: targetPrice * 0.9,
          status: "TASK_REVIEW"
        }
      })
    ]);

    // Notify the seller
    const { createNotification } = await import("@/lib/notifications");
    if (platform) {
      await createNotification({
        userId: platform.publisherId,
        type: "TASK_UPDATE",
        title: "New placement order received",
        body: `You have a new order for ${platform.url}. Review and accept it to get started.`,
        link: `/publisher/tasks/${task.id}`,
      });
    } else if (channel) {
      await createNotification({
        userId: channel.influencerId,
        type: "TASK_UPDATE",
        title: "New brand deal received",
        body: `You have a new brand deal request for @${channel.handle}. Review and accept to begin.`,
        link: `/influencer/tasks/${task.id}`,
      });
    }

    redirect("/advertiser/tasks");
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="mb-6">
        <Link href="/advertiser/sites" className="text-sm text-primary hover:underline">
          ← Back to Marketplace
        </Link>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">Create Placement Order</h1>
      </div>

      {/* Product Summary Card */}
      <div className="card bg-card border-base rounded-lg p-6 mb-6">
        <h3 className="font-space font-semibold text-dark text-md mb-4">Placement Summary</h3>
        <div className="flex justify-between items-center text-sm font-inter">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {platform ? <GlobeAltIcon className="w-5 h-5 text-primary" /> : <UserCircleIcon className="w-5 h-5 text-primary" />}
              <span className="font-semibold text-dark">{platform ? platform.url : channel?.handle}</span>
            </div>
            <span className="text-muted">Type: {platform ? "Website Placement" : "Social Shoutout"}</span>
          </div>
          <div className="text-right">
            <span className="text-muted block text-xs">Total cost</span>
            <span className="text-dark font-bold text-lg font-space">${targetPrice.toFixed(2)}</span>
          </div>
        </div>

        {insuﬃcientFunds && (
          <div className="banner banner-promo rounded-lg mt-4 flex items-center justify-between" style={{ backgroundColor: '#FFF4D9' }}>
            <span className="text-xs text-dark font-inter">
              Your wallet balance (${walletBalance.toFixed(2)}) is insufficient. Please <Link href="/advertiser/balance" className="text-primary font-semibold hover:underline">top up balance</Link> before booking.
            </span>
          </div>
        )}
      </div>

      {/* Brief Form */}
      <div className="card bg-card border-base rounded-lg p-6">
        <form action={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Campaign / Project</label>
            <select name="projectId" className="input select" defaultValue="">
              <option value="">No Campaign (General Task)</option>
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              <option value="NEW">+ Create New Project</option>
            </select>
          </div>

          <div id="new-project-field" style={{ display: 'none' }}>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">New Project Name *</label>
            <input name="newProjectName" type="text" placeholder="e.g. Autumn Link-Building Campaign" className="input" />
          </div>

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Target Promoted URL</label>
            <input name="targetUrl" type="url" required placeholder="https://yourbrand.com/landing-page" className="input" />
          </div>

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Anchor Text</label>
            <input name="anchorText" type="text" required placeholder="Best marketing tools" className="input" />
          </div>

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Content Brief & Guidelines</label>
            <textarea 
              name="brief" 
              required 
              rows={5}
              placeholder="Provide writing guidelines, target keywords, topics to cover, or specific instructions for the publisher." 
              className="input"
              style={{ resize: 'vertical', fontFamily: 'var(--font-inter)' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={insuﬃcientFunds}
            className="btn btn-primary font-space font-semibold mt-4" 
            style={{ justifyContent: 'center' }}
          >
            Confirm & Place Order
          </button>
        </form>
      </div>

      <ProjectSelectListener />
    </div>
  );
}
