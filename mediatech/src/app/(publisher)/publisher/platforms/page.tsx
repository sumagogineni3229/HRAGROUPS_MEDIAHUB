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
import { PublisherPlatformList } from "@/components/publisher/publisher-platform-list";

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

  const isCompany = session.user.email === "mediahub@publisher.com";

  return (
    <div className="w-full">
      <PublisherBanners hasRejectedPlatforms={platforms.some((p: any) => p.status === "REJECTED")} />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-space text-dark">My platforms</h1>
            {isCompany && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                🏢 MediaHub Company Publisher
              </span>
            )}
          </div>
          {isCompany && (
            <p className="text-xs text-muted font-inter mt-1">
              ✨ Instant Auto-Approval active. You can publish websites directly and choose to set custom fixed rates or hide prices (Request Pricing quote mode).
            </p>
          )}
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
      <PublisherPlatformList platforms={platforms} />


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
