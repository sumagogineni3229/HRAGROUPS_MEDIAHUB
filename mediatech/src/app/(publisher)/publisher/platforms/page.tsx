import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  FunnelIcon, 
  ArrowDownTrayIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import { PlatformActionsDropdown } from "@/components/publisher/platform-actions-dropdown";
import { PublisherBanners } from "@/components/publisher/publisher-banners";

export const metadata = {
  title: "My Platforms - MediaHub",
};

interface SearchParams {
  status?: string;
  query?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function PublisherPlatformsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentStatusTab = resolvedParams.status || "ALL";
  const urlQuery = resolvedParams.query || "";
  const minPrice = resolvedParams.minPrice || "";
  const maxPrice = resolvedParams.maxPrice || "";

  // Fetch publisher platforms and packages from the database with active filters
  const platforms = await db.platform.findMany({
    where: {
      publisherId: session.user.id,
      ...(currentStatusTab !== "ALL" ? { status: currentStatusTab as any } : {}),
      ...(urlQuery ? {
        url: {
          contains: urlQuery,
          mode: "insensitive" as const
        }
      } : {}),
      ...(minPrice || maxPrice ? {
        packages: {
          some: {
            type: "ARTICLE_POSTING",
            price: {
              ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
              ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
            }
          }
        }
      } : {})
    },
    include: { packages: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <PublisherBanners hasRejectedPlatforms={platforms.some((p: any) => p.status === "REJECTED")} />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-space text-dark">My platforms</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted text-sm">Contributor Status</span>
          <span className="badge badge-active flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4 text-success" /> Successful
          </span>
        </div>
      </div>

      {/* Accordion FAQ Toggle */}
      <details className="faq-details border-base bg-card rounded-lg mb-6">
        <summary className="font-space font-medium p-4 cursor-pointer flex justify-between items-center list-none">
          <div className="flex items-center gap-3">
            <span className="help-icon">?</span>
            <span>How to work with this page</span>
          </div>
          <ChevronRightIcon className="arrow-icon w-4 h-4 transition-transform" />
        </summary>
        <div className="p-4 pt-0 border-t border-muted text-sm text-muted leading-relaxed">
          Here you can list and edit your website platforms. Adding pricing packages enables marketers to buy content placements, link insertions, and press releases. Platform changes will require manual admin moderation.
        </div>
      </details>

      {/* Monetization Action Banner */}
      <div className="monetize-cta-banner rounded-lg p-6 mb-6 flex justify-between items-center bg-green-accent">
        <p className="text-dark font-medium text-lg m-0">
          Want to monetize your site while placing or creating unique and relevant content?
        </p>
        <Link href="/publisher/platforms/new" className="btn btn-dark btn-lg font-space font-semibold" style={{ borderRadius: '8px' }}>
          Add or update websites
        </Link>
      </div>

      {/* Filters & Tabs Section */}
      <div className="bg-card border-base rounded-lg p-6 mb-6">
        {/* Status Tabs */}
        <div className="status-tabs mb-6" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link href="/publisher/platforms?status=ALL" className={`status-tab ${currentStatusTab === 'ALL' ? 'active font-bold' : ''}`}>All (except deleted)</Link>
          <Link href="/publisher/platforms?status=PENDING" className={`status-tab ${currentStatusTab === 'PENDING' ? 'active font-bold' : ''}`}>Pending specification</Link>
          <Link href="/publisher/platforms?status=ACTIVE" className={`status-tab ${currentStatusTab === 'ACTIVE' ? 'active font-bold' : ''}`}>Approved</Link>
          <Link href="/publisher/platforms?status=REJECTED" className={`status-tab ${currentStatusTab === 'REJECTED' ? 'active font-bold' : ''}`}>Rejected</Link>
        </div>

        {/* Filter Inputs Grid Form */}
        <form method="GET" action="/publisher/platforms" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="hidden" name="status" value={currentStatusTab} />
          
          <div className="filter-grid mb-6" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
            <div>
              <input name="query" className="input" type="text" placeholder="Site's URL" defaultValue={urlQuery} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="crowdPost" className="rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="crowdPost" className="text-sm font-inter text-muted">Crowd Post ⓘ</label>
            </div>
            <div>
              <select className="input select text-muted">
                <option value="">Inventory status: Show all</option>
              </select>
            </div>
            <div>
              <select className="input select text-muted">
                <option value="">Site activity: Show all</option>
              </select>
            </div>
          </div>

          <div className="filter-details-row mb-6" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted font-inter">Price ⓘ</span>
              <input name="minPrice" className="input w-24" type="text" placeholder="15" defaultValue={minPrice} />
              <span className="text-muted">-</span>
              <input name="maxPrice" className="input w-24" type="text" placeholder="75,000" defaultValue={maxPrice} />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted font-inter">Link attribution type ⓘ</span>
              <select className="input select w-40">
                <option value="">All types</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted font-inter">Service type ⓘ</span>
              <select className="input select w-56">
                <option value="">Invite Servicetype Ids (all)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-outline" style={{ border: '1.5px solid #3E4FEA', color: '#3E4FEA', fontWeight: 600, width: 'fit-content' }}>
            Apply filters
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-space font-semibold text-dark text-lg">Results: {platforms.length}</span>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-muted hover:text-dark font-inter">
            <FunnelIcon className="w-4 h-4" /> Site activity
          </button>
          <button className="flex items-center gap-2 text-sm text-muted hover:text-dark font-inter">
            <ArrowDownTrayIcon className="w-4 h-4" /> Download websites
          </button>
        </div>
      </div>

      {/* Platforms List */}
      {platforms.length === 0 ? (
        <div className="card empty-state-container">
          <div className="empty-state">
            <GlobeAltIcon className="w-12 h-12 text-muted mb-4" />
            <p className="font-space font-medium text-dark text-lg m-0">No platforms listed yet</p>
            <p className="text-muted max-w-sm text-center">Add your first website to start receiving paid content creation, guest post placement, or link insertion orders.</p>
            <Link href="/publisher/platforms/new" className="btn btn-primary mt-2">
              <PlusIcon className="w-4 h-4" /> Add Website
            </Link>
          </div>
        </div>
      ) : (
        <div className="platforms-grid flex flex-col gap-6">
          {platforms.map((platform: any) => (
            <div key={platform.id} className="card bg-card border-base rounded-lg p-6 relative">
              {/* Top Row: URL, Status, Actions */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <a href={platform.url} target="_blank" rel="noopener noreferrer" className="text-primary font-space font-semibold text-lg hover:underline">
                    {platform.url}
                  </a>
                  <span className="badge badge-pending flex items-center gap-1">
                    Not in inventory
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-success text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-success"></span> Active
                  </span>
                  <Link href={`/publisher/platforms/new?edit=${platform.id}`} className="btn btn-outline flex items-center gap-2 btn-sm text-dark font-inter" style={{ padding: '6px 12px' }}>
                    <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <PlatformActionsDropdown platformId={platform.id} url={platform.url} />
                </div>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                {/* Col 1 */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold block mb-1 text-gray-500" style={{ color: '#64748b' }}>Status</span>
                    <span className="font-bold text-sm" style={{ color: platform.status === "ACTIVE" ? '#059669' : platform.status === "REJECTED" ? '#dc2626' : '#d97706' }}>
                      {platform.status === "ACTIVE" ? "Approved" : platform.status === "REJECTED" ? "Rejected" : "Pending specification"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold block mb-1" style={{ color: '#64748b' }}>Confirmation status</span>
                    <span className="font-bold text-sm" style={{ color: '#d97706' }}>Owner</span>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold block mb-1" style={{ color: '#64748b' }}>Completion rate</span>
                    <span className="font-bold text-sm" style={{ color: '#1e293b' }}>N/A</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold block mb-1" style={{ color: '#64748b' }}>Tasks with initial Domain & Price</span>
                    <span className="font-bold text-sm" style={{ color: '#1e293b' }}>N/A</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold block mb-1" style={{ color: '#64748b' }}>Avg lifetime of links</span>
                    <span className="font-bold text-sm" style={{ color: '#1e293b' }}>N/A</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold block mb-1" style={{ color: '#64748b' }}>TAT</span>
                    <span className="font-bold text-sm" style={{ color: '#1e293b' }}>N/A</span>
                  </div>
                </div>

                {/* Col 3: Packages */}
                <div className="flex flex-col">
                  <div className="border-b border-gray-200 pb-2 mb-3">
                    <span className="text-xs font-semibold block" style={{ color: '#64748b' }}>Article Posting</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium" style={{ color: '#475569' }}>Content placement</span>
                      <span className="font-bold font-space flex items-center gap-1.5" style={{ color: '#0f172a' }}>
                        ${platform.packages.find((p: any) => p.type === "ARTICLE_POSTING")?.price?.toFixed(2) || "10.00"} 
                        <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium" style={{ color: '#475569' }}>Writing & placement</span>
                      <span className="font-bold font-space flex items-center gap-1.5" style={{ color: '#0f172a' }}>
                        ${((platform.packages.find((p: any) => p.type === "ARTICLE_POSTING")?.price || 10.00) + 15).toFixed(2)} 
                        <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium" style={{ color: '#475569' }}>Special topic</span>
                      <span className="font-bold font-space flex items-center gap-1.5" style={{ color: '#0f172a' }}>
                        N/A 
                        <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .faq-details summary::-webkit-details-marker {
          display: none;
        }
        .faq-details[open] .arrow-icon {
          transform: rotate(90deg);
        }
        .help-icon {
          width: 20px;
          height: 20px;
          background: #EEF0FD;
          color: var(--color-primary);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }
        .monetize-cta-banner {
          background-color: #8CF08A;
        }
        .tab-count {
          background: #EEF0FD;
          color: var(--color-grey-blue);
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 10px;
          margin-left: 4px;
        }
        .status-tab.active .tab-count {
          background: var(--color-primary);
          color: white;
        }
        .platforms-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
