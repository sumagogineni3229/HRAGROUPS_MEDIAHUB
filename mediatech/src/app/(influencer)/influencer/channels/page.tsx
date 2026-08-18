import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  PlusIcon,
  DevicePhoneMobileIcon
} from "@heroicons/react/24/outline";
import { ChannelActionsDropdown } from "@/components/influencer/channel-actions-dropdown";
import { getSocialPlatformLabel, getSocialProfileUrl } from "@/lib/social-platforms";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "My Channels - MediaHub",
};

export default async function InfluencerChannelsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch influencer's connected social channels
  const channels = await db.channel.findMany({
    where: { influencerId: session.user.id },
    include: { packages: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-space text-dark">My Channels</h1>
          <p className="text-sm text-muted font-inter mt-1">Manage your connected social accounts and packages.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/influencer/channels/new" className="btn btn-primary font-space">
            <PlusIcon className="w-4 h-4" /> Add Channel
          </Link>
        </div>
      </div>

      {/* Channels List */}
      {channels.length === 0 ? (
        <div className="card bg-card border-base rounded-lg p-6">
          <div className="empty-state py-12 flex flex-col items-center justify-center text-center">
            <DevicePhoneMobileIcon className="w-12 h-12 text-muted mb-4" />
            <p className="font-space font-medium text-dark text-lg mb-1">No channels connected yet</p>
            <p className="text-muted text-sm max-w-sm">Connect your Instagram, TikTok, YouTube, or X channels to start receiving paid collaboration requests.</p>
            <Link href="/influencer/channels/new" className="btn btn-outline mt-4">
              Connect Channel
            </Link>
          </div>
        </div>
      ) : (
        <div className="channels-grid flex flex-col gap-6">
          {channels.map((channel: any) => {
            const isApproved = channel.status === "ACTIVE";
            const isPending = channel.status === "PENDING";
            const isRejected = channel.status === "REJECTED";

            return (
              <div key={channel.id} className="card bg-card border-base rounded-lg p-6 relative shadow-sm hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={getSocialProfileUrl(channel.platform, channel.handle, channel.profileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-space font-bold text-dark text-lg hover:text-primary hover:underline inline-flex items-center gap-1 group"
                        title={`Open ${channel.handle} on ${getSocialPlatformLabel(channel.platform)}`}
                      >
                        <span>{channel.handle}</span>
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wide">
                        {getSocialPlatformLabel(channel.platform)}
                      </span>
                    </div>
                    <span className="text-xs text-muted font-inter">
                      Niche: <span className="capitalize">{channel.niche}</span> | Location: <span className="capitalize">{channel.country}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      isApproved ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                      isRejected ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" :
                      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isApproved ? "bg-emerald-500" : isRejected ? "bg-rose-500" : "bg-amber-500"
                      }`}></span>
                      {isApproved ? "Active" : isRejected ? "Rejected" : "Pending moderation"}
                    </span>

                    <ChannelActionsDropdown
                      channelId={channel.id}
                      platform={channel.platform}
                      handle={channel.handle}
                      profileUrl={channel.profileUrl}
                    />
                  </div>
                </div>

                {/* Data Grid: Perfectly Aligned 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800 items-start">
                  {/* Col 1 */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-medium text-muted block mb-1">Followers</span>
                      <span className="text-dark font-semibold text-base font-space">{channel.followers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted block mb-1">Engagement Rate</span>
                      <span className="text-dark font-semibold text-base font-space">{channel.engagement}%</span>
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-medium text-muted block mb-1">Completion rate</span>
                      <span className="text-dark font-medium text-sm">N/A</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted block mb-1">Status</span>
                      <span className={`font-semibold text-sm ${
                        isApproved ? "text-emerald-600" : isRejected ? "text-rose-600" : "text-amber-600"
                      }`}>
                        {isApproved ? "Approved" : isRejected ? "Rejected" : "Pending moderation"}
                      </span>
                    </div>
                  </div>

                  {/* Col 3: Packages */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted block mb-1">Social Packages</span>
                    <div className="flex flex-col gap-2">
                      {channel.packages && channel.packages.length > 0 ? (
                        channel.packages.map((pkg: any) => (
                          <div key={pkg.id} className="flex justify-between items-center text-sm py-1.5 px-3 bg-white rounded-md border border-slate-200">
                            <span className="text-slate-600 font-medium capitalize">{pkg.type.toLowerCase()} shoutout</span>
                            <span className="font-semibold text-dark font-space">${pkg.price.toFixed(2)}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm italic">No packages configured</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

