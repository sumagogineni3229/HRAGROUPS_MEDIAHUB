import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  UsersIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import { INFLUENCER_CATEGORIES } from "@/lib/categories";
import { SearchableSelect } from "@/components/ui/searchable-select";

export const metadata = {
  title: "Search for Influencers - MediaHub",
};

interface SearchParams {
  platform?: string;
  query?: string;
  niche?: string;
  country?: string;
}

export default async function AdvertiserInfluencersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const platform = resolvedParams.platform || "";
  const query = resolvedParams.query || "";
  const niche = resolvedParams.niche || "";
  const country = resolvedParams.country || "";

  // Fetch approved influencer channels matching search criteria
  const channels = await db.channel.findMany({
    where: {
      status: "ACTIVE",
      ...(query ? {
        handle: {
          contains: query,
          mode: "insensitive" as const
        }
      } : {}),
      ...(niche ? { niche } : {}),
      ...(country ? { country } : {}),
      ...(platform ? { platform: platform as any } : {})
    },
    include: {
      packages: true,
    },
    orderBy: { followers: "desc" },
  });

  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-space text-dark">Search for influencers</h1>
          <p className="text-sm text-muted font-inter mt-1">Book sponsored shoutouts, reviews, or dedicated placements from creators.</p>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="bg-card border-base rounded-lg p-6 mb-6">
        <form method="GET" action="/advertiser/influencers" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Social Platform Selection tabs */}
          <div className="flex flex-wrap gap-4 pb-2 border-b border-muted">
            <Link 
              href="/advertiser/influencers"
              className={`status-tab pb-2 ${!platform ? 'active font-bold text-primary' : 'text-muted'}`}
              style={!platform ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              All Platforms
            </Link>
            <Link 
              href="/advertiser/influencers?platform=INSTAGRAM"
              className={`status-tab pb-2 ${platform === 'INSTAGRAM' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={platform === 'INSTAGRAM' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              Instagram
            </Link>
            <Link 
              href="/advertiser/influencers?platform=TIKTOK"
              className={`status-tab pb-2 ${platform === 'TIKTOK' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={platform === 'TIKTOK' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              TikTok
            </Link>
            <Link 
              href="/advertiser/influencers?platform=YOUTUBE"
              className={`status-tab pb-2 ${platform === 'YOUTUBE' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={platform === 'YOUTUBE' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              YouTube
            </Link>
            <Link 
              href="/advertiser/influencers?platform=X"
              className={`status-tab pb-2 ${platform === 'X' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={platform === 'X' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              X (Twitter)
            </Link>
            <Link 
              href="/advertiser/influencers?platform=FACEBOOK"
              className={`status-tab pb-2 ${platform === 'FACEBOOK' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={platform === 'FACEBOOK' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              Facebook
            </Link>
            <Link 
              href="/advertiser/influencers?platform=LINKEDIN"
              className={`status-tab pb-2 ${platform === 'LINKEDIN' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={platform === 'LINKEDIN' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              LinkedIn
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <input 
                name="query"
                className="input" 
                type="text" 
                placeholder="Search creator handle..." 
                defaultValue={query}
              />
            </div>
            <div>
              <SearchableSelect
                name="niche"
                options={["", ...INFLUENCER_CATEGORIES]}
                defaultValue={niche}
                placeholder="Niche: All"
              />
            </div>
            <div>
              <input 
                name="country" 
                className="input" 
                type="text" 
                placeholder="Country" 
                defaultValue={country}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              Apply filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-space font-semibold text-dark text-lg">Results: {channels.length}</span>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-muted hover:text-dark font-inter">
            <FunnelIcon className="w-4 h-4" /> Save filters
          </button>
          <button className="flex items-center gap-2 text-sm text-muted hover:text-dark font-inter">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export results
          </button>
        </div>
      </div>

      {/* Influencers Search Grid */}
      {channels.length === 0 ? (
        <div className="card bg-card border-base rounded-lg p-12 text-center">
          <UsersIcon className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="font-space font-semibold text-dark text-lg mb-1">No creators found matching criteria</p>
          <p className="text-muted text-sm max-w-sm mx-auto">Try clearing search terms or browse all social platforms.</p>
        </div>
      ) : (
        <div className="platforms-grid flex flex-col gap-6">
          {channels.map((channel: any) => (
            <div key={channel.id} className="card bg-card border-base rounded-lg p-6 relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-primary font-space font-semibold text-lg hover:underline cursor-pointer">
                      {channel.handle}
                    </span>
                    <span className="badge badge-paused text-xs">
                      {channel.platform}
                    </span>
                  </div>
                  <span className="text-xs text-muted font-inter">Niche: {channel.niche} | Location: {channel.country}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    href={`/advertiser/tasks/new?channelId=${channel.id}`}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                    style={{ padding: '6px 14px', borderRadius: '6px' }}
                  >
                    <ShoppingBagIcon className="w-4 h-4" /> Book shoutout
                  </Link>
                </div>
              </div>

              {/* Stats & Service Pricing Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800 items-start">
                {/* Col 1 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs font-medium text-muted block mb-1">Followers</span>
                    <span className="text-dark font-semibold text-base font-space">{channel.followers.toLocaleString()}</span>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs font-medium text-muted block mb-1">Engagement Rate</span>
                    <span className="text-dark font-semibold text-base font-space">{channel.engagement}%</span>
                  </div>
                </div>

                {/* Col 3: Pricing Packages */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted block mb-1">Available Placements</span>
                  <div className="flex flex-col gap-2">
                    {channel.packages && channel.packages.length > 0 ? (
                      channel.packages.map((pkg: any) => (
                        <Link 
                          key={pkg.id} 
                          href={`/advertiser/tasks/new?channelId=${channel.id}&packageId=${pkg.id}`}
                          className="flex justify-between items-center text-sm py-1.5 px-3 bg-white hover:bg-primary/5 rounded-md border border-slate-200 hover:border-primary/50 transition-colors group"
                        >
                          <span className="text-slate-600 group-hover:text-primary font-medium capitalize">
                            {pkg.type.toLowerCase()} placement
                          </span>
                          <span className="font-semibold text-dark group-hover:text-primary font-space">
                            ${pkg.price.toFixed(2)}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm italic">No packages listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
