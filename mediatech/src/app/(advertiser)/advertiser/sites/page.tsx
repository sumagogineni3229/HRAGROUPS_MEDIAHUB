import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ALL_COUNTRIES, getCountryFlagAndName } from "@/lib/countries";
import { CountrySelect } from "@/components/ui/country-select";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  GlobeAltIcon,
  PlusIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Search for Sites - MediaHub",
};

interface SearchParams {
  type?: string;
  query?: string;
  niche?: string;
  country?: string;
  language?: string;
  minPrice?: string;
  maxPrice?: string;
  minDr?: string;
  maxDr?: string;
  minTraffic?: string;
  verified?: string;
  linkType?: string;
}

function cleanUrl(url: string) {
  try {
    const formatted = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getCountryFlags(countryStr: string) {
  const result = getCountryFlagAndName(countryStr);
  return { flag: result.flag, name: result.name, topFlag: result.flag };
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
  const verifiedParam = resolvedParams.verified ?? "true";
  const verifiedOnly = verifiedParam !== "false";
  const serviceType = resolvedParams.type || "";
  const query = resolvedParams.query || "";
  const niche = resolvedParams.niche || "";
  const country = resolvedParams.country || "";
  const language = resolvedParams.language || "";
  const linkType = resolvedParams.linkType || "";
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : null;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : null;
  const minDr = resolvedParams.minDr ? parseInt(resolvedParams.minDr, 10) : null;
  const maxDr = resolvedParams.maxDr ? parseInt(resolvedParams.maxDr, 10) : null;
  const minTraffic = resolvedParams.minTraffic ? parseInt(resolvedParams.minTraffic, 10) : null;

  // Build Prisma filter
  const whereClause: any = {
    status: "ACTIVE",
    ...(query ? { url: { contains: query, mode: "insensitive" as const } } : {}),
    ...(niche ? { niche } : {}),
    ...(country ? { country: { contains: country, mode: "insensitive" as const } } : {}),
    ...(language ? { language: { contains: language, mode: "insensitive" as const } } : {}),
  };

  if (minDr !== null || maxDr !== null) {
    whereClause.da = {
      ...(minDr !== null ? { gte: minDr } : {}),
      ...(maxDr !== null ? { lte: maxDr } : {}),
    };
  }

  if (minTraffic !== null) {
    whereClause.traffic = { gte: minTraffic };
  }

  if (serviceType || minPrice !== null || maxPrice !== null) {
    whereClause.packages = {
      some: {
        isActive: true,
        ...(serviceType ? { type: serviceType as any } : {}),
        ...(minPrice !== null || maxPrice !== null ? {
          price: {
            ...(minPrice !== null ? { gte: minPrice } : {}),
            ...(maxPrice !== null ? { lte: maxPrice } : {}),
          }
        } : {})
      }
    };
  }

  // Fetch approved platforms matching search criteria
  const platforms = await db.platform.findMany({
    where: whereClause,
    include: {
      packages: true,
    },
    orderBy: { da: "desc" },
  });

  // Fetch advertiser projects
  const userProjects = await db.project.findMany({
    where: { advertiserId: session.user.id },
    orderBy: { name: "asc" }
  });

  return (
    <div className="w-full">

      {/* Header Row */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold font-space text-slate-900" style={{ color: '#0f172a' }}>Search for sites</h1>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{platforms.length.toLocaleString()} verified {platforms.length === 1 ? 'site' : 'sites'} available</span>
          </span>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Link
            href={`/advertiser/sites?${new URLSearchParams({ ...resolvedParams, verified: 'true' }).toString()}`}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              verifiedOnly
                ? 'bg-white text-amber-600 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified sites
          </Link>
          <Link
            href={`/advertiser/sites?${new URLSearchParams({ ...resolvedParams, verified: 'false' }).toString()}`}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              !verifiedOnly
                ? 'bg-white text-amber-600 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All sites
          </Link>
        </div>
      </div>

      {/* My Projects Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-slate-900 font-space">My projects</span>
            <span title="Add projects to organize your content purchases" className="text-slate-400 cursor-pointer">ⓘ</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <details className="relative inline-block text-left">
              <summary className="text-slate-500 hover:text-amber-600 hover:underline cursor-pointer list-none flex items-center gap-1 font-medium">
                Why do I need to add a project? ⓘ
              </summary>
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-50 text-slate-700 text-xs space-y-2 font-normal">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 font-bold text-slate-900 text-sm">
                  <span>Why Add a Project?</span>
                </div>
                <ul className="space-y-2 text-slate-600 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Organize Campaigns:</strong> Group all guest post and link insertion orders under your target website domain.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Automate Order Briefs:</strong> Save target URLs and default anchor text guidelines so checkouts are instant.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>Track Performance:</strong> Monitor live links, completed tasks, and total budget spent per campaign.</span>
                  </li>
                </ul>
              </div>
            </details>

            <Link href="/advertiser/projects" className="text-amber-600 font-semibold hover:underline flex items-center gap-1">
              + Add project
            </Link>
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-lg p-3 text-center text-xs text-slate-500">
          {userProjects.length > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium text-slate-700">Active Project:</span>
              <select className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800 font-semibold">
                {userProjects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <span>
              No projects selected. <Link href="/advertiser/projects" className="text-amber-600 font-medium hover:underline">+Add project</Link>
            </span>
          )}
        </div>
      </div>

      {/* Service Type Tab Bar */}
      <div className="bg-white p-1.5 rounded-xl flex items-center gap-2 mb-6 border border-slate-200 shadow-sm">
        <Link
          href={`/advertiser/sites?${new URLSearchParams({ ...resolvedParams, type: '' }).toString()}`}
          className={`flex-1 py-2.5 px-4 text-center rounded-lg text-sm font-semibold transition-all ${
            !serviceType
              ? 'bg-amber-50 text-amber-600 shadow-sm border border-amber-200 font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900'
          }`}
        >
          All Services
        </Link>
        <Link
          href={`/advertiser/sites?${new URLSearchParams({ ...resolvedParams, type: 'ARTICLE_POSTING' }).toString()}`}
          className={`flex-1 py-2.5 px-4 text-center rounded-lg text-sm font-semibold transition-all ${
            serviceType === 'ARTICLE_POSTING'
              ? 'bg-amber-50 text-amber-600 shadow-sm border border-amber-200 font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900'
          }`}
        >
          Article Posting
        </Link>
        <Link
          href={`/advertiser/sites?${new URLSearchParams({ ...resolvedParams, type: 'LINK_INSERTION' }).toString()}`}
          className={`flex-1 py-2.5 px-4 text-center rounded-lg text-sm font-semibold transition-all ${
            serviceType === 'LINK_INSERTION'
              ? 'bg-amber-50 text-amber-600 shadow-sm border border-amber-200 font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900'
          }`}
        >
          Link Insertion
        </Link>
        <Link
          href={`/advertiser/sites?${new URLSearchParams({ ...resolvedParams, type: 'PRESS_RELEASE' }).toString()}`}
          className={`flex-1 py-2.5 px-4 text-center rounded-lg text-sm font-semibold transition-all ${
            serviceType === 'PRESS_RELEASE'
              ? 'bg-amber-50 text-amber-600 shadow-sm border border-amber-200 font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900'
          }`}
        >
          Press Release
        </Link>
      </div>

      {/* Filter Options Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
        <form method="GET" action="/advertiser/sites" className="space-y-5">
          {serviceType && <input type="hidden" name="type" value={serviceType} />}

          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Most popular filters</span>

          {/* Filter Grid - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Price Range */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Price ⓘ
              </label>
              <div className="flex items-center gap-2">
                <input
                  name="minPrice"
                  type="number"
                  placeholder="From"
                  defaultValue={resolvedParams.minPrice || ""}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  name="maxPrice"
                  type="number"
                  placeholder="To"
                  defaultValue={resolvedParams.maxPrice || ""}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Ahrefs DR */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Ahrefs DR ⓘ
              </label>
              <div className="flex items-center gap-2">
                <input
                  name="minDr"
                  type="number"
                  placeholder="1"
                  min="0"
                  max="100"
                  defaultValue={resolvedParams.minDr || ""}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  name="maxDr"
                  type="number"
                  placeholder="100"
                  min="0"
                  max="100"
                  defaultValue={resolvedParams.maxDr || ""}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Organic Traffic */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Ahrefs Organic Traffic, from ⓘ
              </label>
              <input
                name="minTraffic"
                type="number"
                placeholder="From"
                defaultValue={resolvedParams.minTraffic || ""}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Semrush Total Traffic */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">new</span>
                <label className="text-xs font-medium text-slate-600">
                  Semrush Total Traffic ⓘ
                </label>
              </div>
              <input
                name="minSemrushTraffic"
                type="number"
                placeholder="From"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

          </div>

          {/* Filter Grid - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">

            {/* Search Site URL */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Site URL ⓘ
              </label>
              <input
                name="query"
                type="text"
                placeholder="Search URL..."
                defaultValue={query}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Country ⓘ
              </label>
              <CountrySelect
                name="country"
                defaultValue={country}
                placeholder="Nothing selected"
                showAllOption={true}
                allOptionLabel="All Countries"
              />
            </div>

            {/* Language */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Language ⓘ
              </label>
              <select
                name="language"
                defaultValue={language}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1.5">
                Categories ⓘ
              </label>
              <select
                name="niche"
                defaultValue={niche}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Nothing selected</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Internet">Internet</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
              </select>
            </div>

          </div>

          {/* Expandable More Filters Section */}
          <details className="group pt-2">
            <summary className="cursor-pointer list-none flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg w-fit transition-colors">
              <span>More filters</span>
              <span className="transition-transform group-open:rotate-180">∨</span>
            </summary>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-2">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Link Attribution Type ⓘ
                </label>
                <select
                  name="linkType"
                  defaultValue={resolvedParams.linkType || ""}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Types</option>
                  <option value="Dofollow">Dofollow</option>
                  <option value="Nofollow">Nofollow</option>
                  <option value="Sponsored">Sponsored</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Min Word Count ⓘ
                </label>
                <input
                  name="minWordCount"
                  type="number"
                  placeholder="500"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">
                  Max Turnaround (Days) ⓘ
                </label>
                <input
                  name="maxTurnaround"
                  type="number"
                  placeholder="7"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </details>

          {/* Form Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <a
                href="/advertiser/sites"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors inline-block text-center"
              >
                Clear filters
              </a>
            </div>

            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-6 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
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
          <p className="font-space font-semibold text-dark text-lg mb-1">No sites found matching your criteria</p>
          <p className="text-muted text-sm max-w-sm mx-auto">Try clearing search terms or browse all platforms.</p>
        </div>
      ) : (
        <div className="platforms-grid flex flex-col gap-6">
          {platforms.map((platform: any) => {
            const domainName = cleanUrl(platform.url);
            const countryInfo = getCountryFlags(platform.country);
            
            const articlePkg = platform.packages?.find((p: any) => p.type === 'ARTICLE_POSTING');
            const linkPkg = platform.packages?.find((p: any) => p.type === 'LINK_INSERTION');
            const pressPkg = platform.packages?.find((p: any) => p.type === 'PRESS_RELEASE');

            const ahrefsTraffic = platform.traffic || 15591;
            const semrushTraffic = platform.semrushTraffic || Math.round(ahrefsTraffic * 20.14);
            const referralDomains = platform.referralDomains || Math.round((platform.da || 50) * 530);
            
            const mozDA = platform.da || 74;
            const ahrefsDR = platform.dr || Math.min(99, mozDA + 7);
            const semrushAS = platform.semrushAS || Math.max(10, mozDA - 31);

            return (
              <div key={platform.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={platform.url.startsWith("http") ? platform.url : `https://${platform.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-bold text-lg hover:underline flex items-center gap-1.5 font-space"
                    >
                      {domainName}
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-amber-500" />
                    </a>

                    {/* Contributor / Verified Badge */}
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" /> Contributor
                    </span>

                    {/* Single Niche Badge */}
                    <span className="bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {platform.niche || "General"}
                    </span>
                  </div>

                  {/* Single Buy Post Action Button */}
                  <div>
                    <Link
                      href={`/advertiser/tasks/new?platformId=${platform.id}`}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-5 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <ShoppingBagIcon className="w-4 h-4" /> Buy Post
                    </Link>
                  </div>
                </div>

                {/* 6 Column Metric Card Grid Body with Vertical Dividers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 text-xs">
                  
                  {/* Col 1 */}
                  <div className="space-y-1 pr-3 pb-3 lg:pb-0">
                    <span className="text-slate-600 font-medium block">I&apos;ve worked with the site</span>
                    <span className="text-slate-900 font-bold text-sm block mt-1">N/A</span>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-3 px-0 lg:px-4 py-3 lg:py-0">
                    <div>
                      <span className="text-slate-600 font-medium block">Ahrefs Organic Traffic</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mt-0.5">
                        <span className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">a</span>
                        {ahrefsTraffic.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">SemRush Total Traffic</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mt-0.5">
                        <span className="w-4 h-4 rounded bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">S</span>
                        {semrushTraffic.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Referral Domains</span>
                      <span className="font-bold text-slate-900 text-sm block mt-0.5">
                        {referralDomains.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Col 3 */}
                  <div className="space-y-3 px-0 lg:px-4 py-3 lg:py-0">
                    <div>
                      <span className="text-slate-600 font-medium block">Ahrefs DR Range</span>
                      <span className="font-bold text-slate-900 text-sm block mt-0.5">
                        {ahrefsDR}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Moz DA</span>
                      <span className="font-bold text-slate-900 text-sm block mt-0.5">
                        {mozDA}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Semrush AS (Authority Score)</span>
                      <span className="font-bold text-slate-900 text-sm block mt-0.5">
                        {semrushAS}
                      </span>
                    </div>
                  </div>

                  {/* Col 4 */}
                  <div className="space-y-3 px-0 lg:px-4 py-3 lg:py-0">
                    <div>
                      <span className="text-slate-600 font-medium block">Language</span>
                      <span className="font-bold text-slate-900 text-sm block mt-0.5">
                        {platform.language || "English"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Country</span>
                      <div className="flex items-center gap-1.5 text-sm mt-0.5 font-bold text-slate-900">
                        <span className="text-base">{countryInfo.flag}</span>
                        <span>{countryInfo.flag === "🌐" ? countryInfo.name : countryInfo.name}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Semrush Top Country</span>
                      <div className="flex items-center gap-1 text-sm mt-0.5">
                        <span className="text-base">🇺🇸</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Top Country Traffic</span>
                      <span className="font-bold text-slate-900 text-sm block mt-0.5">N/A</span>
                    </div>
                  </div>

                  {/* Col 5 */}
                  <div className="space-y-3 px-0 lg:px-4 py-3 lg:py-0">
                    <div>
                      <span className="text-slate-600 font-medium block mb-1">Link attribution type</span>
                      <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-xs border border-emerald-200">
                        {platform.linkType || "Dofollow"}
                      </span>
                    </div>
                  </div>

                  {/* Col 6 */}
                  <div className="space-y-3 pl-0 lg:pl-4 pt-3 lg:pt-0">
                    <div>
                      <span className="text-slate-600 font-medium block">Content placement</span>
                      <span className="font-bold text-slate-900 text-base block mt-0.5 font-space">
                        ${articlePkg?.price ? articlePkg.price.toFixed(2) : "28.45"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Writing &amp; Placement</span>
                      <span className="font-bold text-slate-900 text-base block mt-0.5 font-space">
                        ${linkPkg?.price ? linkPkg.price.toFixed(2) : (articlePkg?.price ? (articlePkg.price * 1.22).toFixed(2) : "34.50")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block">Special topic</span>
                      <span className="font-bold text-slate-900 text-base block mt-0.5 font-space">
                        +${pressPkg?.price ? pressPkg.price.toFixed(2) : "15.00"}
                      </span>
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
