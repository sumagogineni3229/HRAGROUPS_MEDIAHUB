import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Search for Sites - MediaHub",
};

interface SearchParams {
  type?: string;
  query?: string;
  niche?: string;
  country?: string;
}

export default async function AdvertiserSitesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const serviceType = resolvedParams.type || "";
  const query = resolvedParams.query || "";
  const niche = resolvedParams.niche || "";
  const country = resolvedParams.country || "";

  // Fetch approved platforms matching search criteria
  const platforms = await db.platform.findMany({
    where: {
      status: "ACTIVE",
      ...(urlMatches(query)),
      ...(niche ? { niche } : {}),
      ...(country ? { country } : {}),
      ...(serviceType ? {
        packages: {
          some: {
            type: serviceType as any,
            isActive: true
          }
        }
      } : {})
    },
    include: {
      packages: true,
    },
    orderBy: { da: "desc" },
  });

  function urlMatches(searchQuery: string) {
    if (!searchQuery) return {};
    return {
      url: {
        contains: searchQuery,
        mode: "insensitive" as const
      }
    };
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header Row */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-space text-dark">Search for sites</h1>
          <p className="text-sm text-muted font-inter mt-1">Order guest posts, article placements, and context links on high authority sites.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border-base rounded-lg p-1">
          <button className="btn btn-primary btn-sm" style={{ borderRadius: '6px' }}>Verified sites</button>
          <button className="btn btn-ghost btn-sm" style={{ borderRadius: '6px', color: 'var(--color-grey-blue)' }}>All sites</button>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="bg-card border-base rounded-lg p-6 mb-6">
        <form method="GET" action="/advertiser/sites" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Service Tabs */}
          <div className="flex gap-4 pb-2 border-b border-muted">
            <Link 
              href="/advertiser/sites"
              className={`status-tab pb-2 ${!serviceType ? 'active font-bold text-primary' : 'text-muted'}`}
              style={!serviceType ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              All Services
            </Link>
            <Link 
              href="/advertiser/sites?type=ARTICLE_POSTING"
              className={`status-tab pb-2 ${serviceType === 'ARTICLE_POSTING' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={serviceType === 'ARTICLE_POSTING' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              Article Posting
            </Link>
            <Link 
              href="/advertiser/sites?type=LINK_INSERTION"
              className={`status-tab pb-2 ${serviceType === 'LINK_INSERTION' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={serviceType === 'LINK_INSERTION' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              Link Insertion
            </Link>
            <Link 
              href="/advertiser/sites?type=PRESS_RELEASE"
              className={`status-tab pb-2 ${serviceType === 'PRESS_RELEASE' ? 'active font-bold text-primary' : 'text-muted'}`}
              style={serviceType === 'PRESS_RELEASE' ? { borderBottom: '2px solid var(--color-primary)' } : {}}
            >
              Press Release
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                name="query"
                className="input" 
                type="text" 
                placeholder="Site URL contains..." 
                defaultValue={query}
              />
            </div>
            <div>
              <select name="niche" className="input select text-muted" defaultValue={niche}>
                <option value="">Niche: All</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
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
        <span className="font-space font-semibold text-dark text-lg">Results: {platforms.length}</span>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-muted hover:text-dark font-inter">
            <FunnelIcon className="w-4 h-4" /> Save filters
          </button>
          <button className="flex items-center gap-2 text-sm text-muted hover:text-dark font-inter">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export results
          </button>
        </div>
      </div>

      {/* Platforms Search Grid */}
      {platforms.length === 0 ? (
        <div className="card bg-card border-base rounded-lg p-12 text-center">
          <GlobeAltIcon className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="font-space font-semibold text-dark text-lg mb-1">No sites found matching your query</p>
          <p className="text-muted text-sm max-w-sm mx-auto">Try updating niches, locations, or clear filters to search from all platforms.</p>
        </div>
      ) : (
        <div className="platforms-grid flex flex-col gap-6">
          {platforms.map((platform: any) => (
            <div key={platform.id} className="card bg-card border-base rounded-lg p-6 relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-primary font-space font-semibold text-lg hover:underline cursor-pointer">
                      {platform.url}
                    </span>
                    <span className="badge badge-active flex items-center gap-1 text-xs">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-success" /> Verified publisher
                    </span>
                  </div>
                  <span className="text-xs text-muted font-inter">Niche: {platform.niche} | Language: {platform.language} | Location: {platform.country}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    href={`/advertiser/tasks/new?platformId=${platform.id}`}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                    style={{ padding: '6px 14px', borderRadius: '6px' }}
                  >
                    <ShoppingBagIcon className="w-4 h-4" /> Buy post
                  </Link>
                </div>
              </div>

              {/* Stats & Service Pricing Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Col 1: SEO Metrics */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Domain Authority (DA)</span>
                    <span className="text-slate-800 font-bold text-base font-space">{platform.da}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Domain Rating (DR)</span>
                    <span className="text-slate-800 font-bold text-base font-space">{platform.dr}</span>
                  </div>
                </div>

                {/* Col 2: Traffic Metrics */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Monthly Organic Traffic</span>
                    <span className="text-slate-800 font-bold text-base font-space">{platform.traffic.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block mb-1">Google Indexation</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold inline-block">Indexed</span>
                  </div>
                </div>

                {/* Col 3: Pricing Packages */}
                <div className="flex flex-col justify-between">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-medium text-slate-400 block">Available Placements</span>
                  </div>
                  <div className="space-y-2.5">
                    {platform.packages.map((pkg: any) => (
                      <div key={pkg.id} className="flex items-center justify-between text-sm font-inter">
                        <span className="text-slate-600 font-medium">{pkg.type === 'ARTICLE_POSTING' ? 'Article Placement' : pkg.type === 'LINK_INSERTION' ? 'Link Insertion' : 'Press Release'}</span>
                        <span className="font-bold text-slate-900 font-space">${pkg.price.toFixed(2)}</span>
                      </div>
                    ))}
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
