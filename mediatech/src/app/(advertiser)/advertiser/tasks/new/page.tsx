import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NewTaskForm } from "@/components/advertiser/new-task-form";

export const metadata = {
  title: "New Placement Order - MediaHub",
};

interface PageProps {
  searchParams: Promise<{ platformId?: string; channelId?: string; packageId?: string }>;
}

export default async function NewTaskPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { platformId, channelId, packageId } = await searchParams;

  let platform: any = null;
  let channel: any = null;
  let availablePackages: any[] = [];

  // Retrieve selected platform or influencer details
  if (platformId) {
    platform = await db.platform.findUnique({
      where: { id: platformId },
      include: { packages: true },
    });
    if (platform && platform.status !== "ACTIVE") platform = null;
    availablePackages = platform?.packages?.filter((p: any) => p.isActive) || [];
  } else if (channelId) {
    channel = await db.channel.findUnique({
      where: { id: channelId },
      include: { packages: true },
    });
    if (channel && channel.status !== "ACTIVE") channel = null;
    availablePackages = channel?.packages?.filter((p: any) => p.isActive) || [];
  }

  if (!platform && !channel) {
    redirect("/advertiser/sites");
  }

  if (availablePackages.length === 0) {
    redirect(channel ? "/advertiser/influencers?error=no_packages" : "/advertiser/sites?error=no_packages");
  }

  // Determine initial selected package
  const initialPackage =
    availablePackages.find((p) => p.id === packageId) ||
    availablePackages.find((p) => p.type === "POST" || p.type === "ARTICLE_POSTING") ||
    availablePackages[0];

  // Fetch advertiser projects
  const projects = await db.project.findMany({
    where: { advertiserId: session.user.id },
    orderBy: { name: "asc" },
  });

  // Fetch advertiser wallet details
  const advertiser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true },
  });

  const walletBalance = advertiser?.balance ?? 0;

  // Server action to create order task
  async function handleCreateOrder(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const rawPackageIds = (formData.get("packageIds") as string) || (formData.get("packageId") as string) || initialPackage.id;
    const packageIdList = rawPackageIds.split(",").filter(Boolean);

    const targetUrl = formData.get("targetUrl") as string;
    const anchorText = formData.get("anchorText") as string;
    const brief = formData.get("brief") as string;
    const projectId = formData.get("projectId") as string;
    const newProjectName = formData.get("newProjectName") as string;

    const { db } = await import("@/lib/db");

    // Fetch the selected packages to ensure real-time price accuracy
    const selectedPkgs = await db.package.findMany({
      where: { id: { in: packageIdList }, isActive: true },
    });

    if (selectedPkgs.length === 0) {
      throw new Error("No valid packages selected.");
    }

    const totalOrderPrice = selectedPkgs.reduce((acc, p) => acc + p.price, 0);

    // Fetch user and check balance
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true, reserved: true },
    });

    if (!user || user.balance < totalOrderPrice) {
      redirect("/advertiser/balance?error=insufficient_funds");
    }

    // Resolve or create project
    let resolvedProjectId: string | null = null;
    if (projectId === "NEW" && newProjectName?.trim()) {
      const createdProj = await db.project.create({
        data: {
          advertiserId: session.user.id,
          name: newProjectName.trim(),
        },
      });
      resolvedProjectId = createdProj.id;
    } else if (projectId && projectId !== "NEW") {
      resolvedProjectId = projectId;
    }

    const sellerId = platform ? platform.publisherId : channel ? channel.influencerId : "";
    const sellerType = platform ? "PUBLISHER" : "INFLUENCER";

    // Begin transaction: deduct balance, reserve funds, create tasks for all selected packages
    const transactionOperations: any[] = [
      db.user.update({
        where: { id: session.user.id },
        data: {
          balance: { decrement: totalOrderPrice },
          reserved: { increment: totalOrderPrice },
        },
      }),
    ];

    // Create a task for each selected package
    for (const pkg of selectedPkgs) {
      transactionOperations.push(
        db.task.create({
          data: {
            advertiserId: session.user.id,
            sellerId,
            sellerType,
            platformId: platformId || null,
            channelId: channelId || null,
            packageId: pkg.id,
            projectId: resolvedProjectId,
            brief,
            anchorText,
            targetUrl,
            price: pkg.price,
            platformFee: pkg.price * 0.1,
            sellerEarning: pkg.price * 0.9,
            status: "TASK_REVIEW",
          },
        })
      );
    }

    const results = await db.$transaction(transactionOperations);
    const createdTasks = results.slice(1);

    // Record the PAYMENT transactions for Advertiser transaction history
    for (const task of createdTasks) {
      const matchedPkg = selectedPkgs.find((p) => p.id === task.packageId);
      await db.transaction.create({
        data: {
          userId: session.user.id,
          taskId: task.id,
          type: "PAYMENT",
          amount: -task.price,
          note: platform
            ? `Order for ${matchedPkg?.type || "Placement"} on ${platform.name || platform.url}`
            : `Order for ${matchedPkg?.type || "Placement"} with @${channel?.handle}`,
        },
      });
    }

    // Notify the seller
    const { createNotification } = await import("@/lib/notifications");
    const packageSummaryText = selectedPkgs.map((p) => p.type).join(", ");
    if (platform) {
      await createNotification({
        userId: platform.publisherId,
        type: "TASK_UPDATE",
        title: "New placement order received",
        body: `You have new placement orders (${packageSummaryText}) for ${platform.url}. Review and accept to get started.`,
        link: `/publisher/tasks`,
      });
    } else if (channel) {
      await createNotification({
        userId: channel.influencerId,
        type: "TASK_UPDATE",
        title: "New brand deal received",
        body: `You have new brand deal requests (${packageSummaryText}) for @${channel.handle}. Review and accept to begin.`,
        link: `/influencer/tasks`,
      });
    }

    redirect("/advertiser/tasks");
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          href={channel ? "/advertiser/influencers" : "/advertiser/sites"}
          className="text-sm text-primary hover:underline"
        >
          ← Back to {channel ? "Influencers" : "Marketplace"}
        </Link>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">
          Create Placement Order
        </h1>
      </div>

      <NewTaskForm
        platform={platform}
        channel={channel}
        packages={availablePackages}
        initialPackageId={initialPackage.id}
        projects={projects}
        walletBalance={walletBalance}
        handleCreateOrder={handleCreateOrder}
      />
    </div>
  );
}
