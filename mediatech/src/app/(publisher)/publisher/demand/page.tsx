import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  GlobeAltIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  SparklesIcon,
  ArrowUpRightIcon,
  PlusIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Website & Publisher Progress - MediaHub",
};

export default async function PublisherDemandPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const publisherId = session.user.id;

  // Fetch publisher user stats
  const publisher = await db.user.findUnique({
    where: { id: publisherId },
    select: { balance: true, reserved: true, earnings: true, createdAt: true },
  });

  // Fetch all listed platforms with their packages and tasks
  const platforms = await db.platform.findMany({
    where: { publisherId },
    include: {
      packages: true,
      tasks: {
        select: {
          id: true,
          status: true,
          price: true,
          sellerEarning: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch task counts
  const totalTasks = await db.task.count({
    where: { sellerId: publisherId, sellerType: "PUBLISHER" },
  });

  const completedTasksCount = await db.task.count({
    where: { sellerId: publisherId, sellerType: "PUBLISHER", status: "COMPLETED" },
  });

  const activeTasksCount = await db.task.count({
    where: {
      sellerId: publisherId,
      sellerType: "PUBLISHER",
      status: { in: ["TASK_ACCEPTANCE", "TASK_REVIEW", "IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT"] },
    },
  });

  const totalPlatforms = platforms.length;
  const approvedPlatforms = platforms.filter((p) => p.status === "ACTIVE").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 100;
  const lifetimeEarnings = publisher?.earnings ?? 0;

  // Level & Milestone Progress Calculation
  let tierLabel = "Starter Publisher";
  let targetEarnings = 100;
  if (lifetimeEarnings >= 500) {
    tierLabel = "Pro Publisher";
    targetEarnings = 2000;
  } else if (lifetimeEarnings >= 100) {
    tierLabel = "Verified Partner";
    targetEarnings = 500;
  }

  const progressPercent = Math.min(100, Math.round((lifetimeEarnings / targetEarnings) * 100));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb & Title */}
      <div className="mb-6 font-inter text-xs text-muted">
        <span>Home &gt; Publisher Progress &amp; Performance</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-space text-dark">Website &amp; Publisher Progress</h1>
          <p className="text-sm text-muted font-inter mt-1">
            Track real-time performance, active orders, and growth metrics for your listed websites.
          </p>
        </div>
        <Link
          href="/publisher/platforms/new"
          className="btn btn-primary font-space font-semibold flex items-center gap-2"
          style={{ borderRadius: "8px", padding: "10px 20px" }}
        >
          <PlusIcon className="w-4 h-4" /> Add Website
        </Link>
      </div>

      {/* Publisher Level & Milestone Banner */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EEF0FD] flex items-center justify-center text-primary">
              <TrophyIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-space font-bold text-dark text-lg">{tierLabel}</span>
                <span className="bg-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full font-inter">
                  Level {lifetimeEarnings >= 500 ? "3" : lifetimeEarnings >= 100 ? "2" : "1"}
                </span>
              </div>
              <p className="text-xs text-muted font-inter mt-0.5">
                Earn ${targetEarnings} to unlock higher partner visibility on the advertiser marketplace.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted block font-inter">Lifetime Earnings Goal</span>
            <span className="font-space font-bold text-dark text-xl">
              ${lifetimeEarnings.toFixed(2)} <span className="text-muted text-sm font-normal">/ ${targetEarnings}.00</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F1F5F9] rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-muted font-inter mt-2">
          <span>{progressPercent}% Complete</span>
          <span>Next Goal: ${targetEarnings}.00</span>
        </div>
      </div>

      {/* Performance Summary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted font-inter font-medium">Listed Websites</span>
            <GlobeAltIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-bold font-space text-dark block">{totalPlatforms}</span>
          <span className="text-xs text-success font-inter font-medium mt-1 block">
            {approvedPlatforms} approved &amp; active
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted font-inter font-medium">Completed Orders</span>
            <CheckCircleIcon className="w-5 h-5 text-success" />
          </div>
          <span className="text-2xl font-bold font-space text-dark block">{completedTasksCount}</span>
          <span className="text-xs text-muted font-inter mt-1 block">
            out of {totalTasks} total orders
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted font-inter font-medium">Active In-Progress</span>
            <ClockIcon className="w-5 h-5 text-warning" />
          </div>
          <span className="text-2xl font-bold font-space text-dark block">{activeTasksCount}</span>
          <span className="text-xs text-muted font-inter mt-1 block">
            awaiting deliverable or review
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted font-inter font-medium">Success Rate</span>
            <SparklesIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-bold font-space text-dark block">{completionRate}%</span>
          <span className="text-xs text-success font-inter font-medium mt-1 block">
            High publisher trust score
          </span>
        </div>
      </div>

      {/* Websites Progress & Activity Table */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-space font-bold text-dark text-lg">Your Website Performance</h3>
            <p className="text-xs text-muted font-inter mt-0.5">
              Detailed breakdown of orders and revenue generated by each website platform.
            </p>
          </div>
          <Link
            href="/publisher/platforms"
            className="text-xs text-primary font-semibold hover:underline font-inter flex items-center gap-1"
          >
            Manage All Websites &rarr;
          </Link>
        </div>

        {platforms.length === 0 ? (
          <div className="py-12 text-center text-muted font-inter text-sm">
            <GlobeAltIcon className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="font-space font-semibold text-dark text-base mb-1">No websites added yet</p>
            <p className="text-xs max-w-sm mx-auto mb-4">Add your website to start receiving paid article posting and link insertion orders.</p>
            <Link href="/publisher/platforms/new" className="btn btn-primary btn-sm font-space">
              Add Your First Website
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-inter text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Website URL</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Posting Price</th>
                  <th className="py-3 px-4 font-semibold text-center">Completed Orders</th>
                  <th className="py-3 px-4 font-semibold text-right">Revenue Generated</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((platform) => {
                  const completedSiteTasks = platform.tasks.filter((t) => t.status === "COMPLETED");
                  const siteEarnings = completedSiteTasks.reduce((sum, t) => sum + (t.sellerEarning || t.price * 0.9), 0);
                  const postingPackage = platform.packages.find((p) => p.type === "ARTICLE_POSTING");
                  const price = postingPackage?.price ?? 10.0;

                  return (
                    <tr key={platform.id} className="border-b border-border hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-4 font-semibold text-primary font-space">
                        <a href={platform.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
                          {platform.url}
                          <ArrowUpRightIcon className="w-3.5 h-3.5 text-muted" />
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: platform.status === "ACTIVE" ? "#e8fbee" : platform.status === "REJECTED" ? "#fef2f2" : "#fffbe6",
                            color: platform.status === "ACTIVE" ? "#16a34a" : platform.status === "REJECTED" ? "#dc2626" : "#d97706",
                          }}
                        >
                          {platform.status === "ACTIVE" ? "Approved" : platform.status === "REJECTED" ? "Rejected" : "Pending Approval"}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold font-space text-dark">
                        ${price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-dark">
                        {completedSiteTasks.length}
                      </td>
                      <td className="py-4 px-4 text-right font-bold font-space text-success">
                        ${siteEarnings.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/publisher/platforms/new?edit=${platform.id}`}
                          className="text-xs text-primary font-semibold hover:underline font-inter"
                        >
                          Edit &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
