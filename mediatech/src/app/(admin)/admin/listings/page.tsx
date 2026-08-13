import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon, GlobeAltIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

export const metadata = { title: "Listings Approval - MediaHub Admin" };

interface SearchParams { tab?: string; }

export default async function AdminListingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const tab = params.tab ?? "platforms";

  const [pendingPlatforms, pendingChannels] = await Promise.all([
    db.platform.findMany({
      where: { status: "PENDING" },
      include: { publisher: { select: { name: true, email: true } }, packages: true },
      orderBy: { createdAt: "asc" },
    }),
    db.channel.findMany({
      where: { status: "PENDING" },
      include: { influencer: { select: { name: true, email: true } }, packages: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Platform actions
  async function approvePlatform(formData: FormData) {
    "use server";
    const platformId = formData.get("platformId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    const platform = await db.platform.update({ where: { id: platformId }, data: { status: "ACTIVE" } });
    await db.notification.create({
      data: { userId: platform.publisherId, type: "TASK_UPDATE", title: "Listing approved!", body: `Your website ${platform.url} has been approved and is now live on the marketplace.`, link: "/publisher/platforms" }
    });
    redirect("/admin/listings?tab=platforms");
  }

  async function rejectPlatform(formData: FormData) {
    "use server";
    const platformId = formData.get("platformId") as string;
    const note = formData.get("note") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    const platform = await db.platform.update({ where: { id: platformId }, data: { status: "REJECTED", adminNote: note } });
    await db.notification.create({
      data: { userId: platform.publisherId, type: "SYSTEM", title: "Listing rejected", body: note ? `Your website listing was rejected: ${note}` : "Your website listing was rejected. Please review our guidelines.", link: "/publisher/platforms" }
    });
    redirect("/admin/listings?tab=platforms");
  }

  // Channel actions
  async function approveChannel(formData: FormData) {
    "use server";
    const channelId = formData.get("channelId") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    const channel = await db.channel.update({ where: { id: channelId }, data: { status: "ACTIVE" } });
    await db.notification.create({
      data: { userId: channel.influencerId, type: "TASK_UPDATE", title: "Channel approved!", body: `Your channel @${channel.handle} has been approved and is now live on the marketplace.`, link: "/influencer/channels" }
    });
    redirect("/admin/listings?tab=channels");
  }

  async function rejectChannel(formData: FormData) {
    "use server";
    const channelId = formData.get("channelId") as string;
    const note = formData.get("note") as string;
    const s = await auth();
    if (!s?.user || (s.user as any).role !== "ADMIN") return;
    const { db } = await import("@/lib/db");
    const channel = await db.channel.update({ where: { id: channelId }, data: { status: "REJECTED", adminNote: note } });
    await db.notification.create({
      data: { userId: channel.influencerId, type: "SYSTEM", title: "Channel rejected", body: note ? `Your channel listing was rejected: ${note}` : "Your channel listing was rejected. Please review our guidelines.", link: "/influencer/channels" }
    });
    redirect("/admin/listings?tab=channels");
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Admin &gt; Listings</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Listings Approval Queue</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-app rounded-xl p-1 border border-border" style={{ width: "fit-content" }}>
        <Link href="/admin/listings?tab=platforms" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-inter transition-colors ${tab === "platforms" ? "bg-card text-dark shadow-sm" : "text-muted hover:text-dark"}`}>
          <GlobeAltIcon className="w-4 h-4" />
          Websites
          {pendingPlatforms.length > 0 && <span className="bg-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">{pendingPlatforms.length}</span>}
        </Link>
        <Link href="/admin/listings?tab=channels" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-inter transition-colors ${tab === "channels" ? "bg-card text-dark shadow-sm" : "text-muted hover:text-dark"}`}>
          <DevicePhoneMobileIcon className="w-4 h-4" />
          Channels
          {pendingChannels.length > 0 && <span className="bg-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">{pendingChannels.length}</span>}
        </Link>
      </div>

      {/* Platforms */}
      {tab === "platforms" && (
        <div className="flex flex-col gap-4">
          {pendingPlatforms.length === 0 ? (
            <div className="card bg-card border-base rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <CheckCircleIcon className="w-10 h-10 text-success mb-3" />
              <p className="font-space font-semibold text-dark">All caught up!</p>
              <p className="text-sm text-muted font-inter mt-1">No websites pending review.</p>
            </div>
          ) : pendingPlatforms.map((p: any) => (
            <div key={p.id} className="card bg-card border-base rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <a href={p.url} target="_blank" rel="noreferrer" className="font-space font-bold text-dark text-base hover:text-primary">{p.url}</a>
                  <p className="text-xs text-muted font-inter mt-0.5">by {p.publisher.name ?? p.publisher.email} · submitted {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#FFF8E8] text-warning font-inter flex-shrink-0">PENDING</span>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4 text-center">
                {[["DA", p.da], ["DR", p.dr], ["Traffic", p.traffic.toLocaleString()], ["Niche", p.niche]].map(([label, val]: any) => (
                  <div key={label as string} className="bg-app rounded-lg p-3">
                    <p className="text-xs text-muted font-inter mb-0.5">{label}</p>
                    <p className="text-sm font-bold font-space text-dark">{val}</p>
                  </div>
                ))}
              </div>

              {p.packages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted font-inter mb-2 uppercase tracking-wide">Packages</p>
                  <div className="flex flex-wrap gap-2">
                    {p.packages.map((pkg: any) => (
                      <span key={pkg.id} className="text-xs font-inter px-2.5 py-1 bg-[#EEF0FD] text-primary rounded-full font-semibold">
                        {pkg.type.replace("_", " ")} — ${pkg.price}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 items-end">
                <form action={approvePlatform} className="flex-shrink-0">
                  <input type="hidden" name="platformId" value={p.id} />
                  <button type="submit" className="btn btn-sm font-space font-semibold flex items-center gap-2" style={{ background: "#22c55e", color: "white", borderRadius: "8px", padding: "8px 16px" }}>
                    <CheckCircleIcon className="w-4 h-4" /> Approve
                  </button>
                </form>
                <form action={rejectPlatform} className="flex-1 flex gap-2">
                  <input type="hidden" name="platformId" value={p.id} />
                  <input type="text" name="note" placeholder="Rejection reason (optional)" className="input flex-1 text-sm" />
                  <button type="submit" className="btn btn-sm font-space font-semibold flex items-center gap-2 flex-shrink-0" style={{ background: "#ef4444", color: "white", borderRadius: "8px", padding: "8px 16px" }}>
                    <XCircleIcon className="w-4 h-4" /> Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Channels */}
      {tab === "channels" && (
        <div className="flex flex-col gap-4">
          {pendingChannels.length === 0 ? (
            <div className="card bg-card border-base rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <CheckCircleIcon className="w-10 h-10 text-success mb-3" />
              <p className="font-space font-semibold text-dark">All caught up!</p>
              <p className="text-sm text-muted font-inter mt-1">No channels pending review.</p>
            </div>
          ) : pendingChannels.map((c: any) => (
            <div key={c.id} className="card bg-card border-base rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-space font-bold text-dark text-base">@{c.handle} <span className="text-sm text-muted font-inter">({c.platform})</span></p>
                  <p className="text-xs text-muted font-inter mt-0.5">by {c.influencer.name ?? c.influencer.email} · submitted {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#FFF8E8] text-warning font-inter flex-shrink-0">PENDING</span>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4 text-center">
                {[["Followers", c.followers.toLocaleString()], ["Engagement", `${c.engagement}%`], ["Niche", c.niche], ["Country", c.country]].map(([label, val]: any) => (
                  <div key={label as string} className="bg-app rounded-lg p-3">
                    <p className="text-xs text-muted font-inter mb-0.5">{label}</p>
                    <p className="text-sm font-bold font-space text-dark">{val}</p>
                  </div>
                ))}
              </div>

              {c.packages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted font-inter mb-2 uppercase tracking-wide">Packages</p>
                  <div className="flex flex-wrap gap-2">
                    {c.packages.map((pkg: any) => (
                      <span key={pkg.id} className="text-xs font-inter px-2.5 py-1 bg-[#EEF0FD] text-primary rounded-full font-semibold">
                        {pkg.type} — ${pkg.price}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 items-end">
                <form action={approveChannel} className="flex-shrink-0">
                  <input type="hidden" name="channelId" value={c.id} />
                  <button type="submit" className="btn btn-sm font-space font-semibold flex items-center gap-2" style={{ background: "#22c55e", color: "white", borderRadius: "8px", padding: "8px 16px" }}>
                    <CheckCircleIcon className="w-4 h-4" /> Approve
                  </button>
                </form>
                <form action={rejectChannel} className="flex-1 flex gap-2">
                  <input type="hidden" name="channelId" value={c.id} />
                  <input type="text" name="note" placeholder="Rejection reason (optional)" className="input flex-1 text-sm" />
                  <button type="submit" className="btn btn-sm font-space font-semibold flex items-center gap-2 flex-shrink-0" style={{ background: "#ef4444", color: "white", borderRadius: "8px", padding: "8px 16px" }}>
                    <XCircleIcon className="w-4 h-4" /> Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
