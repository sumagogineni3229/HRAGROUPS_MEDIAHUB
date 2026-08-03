import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export const metadata = { title: "Content Purchase - MediaHub" };

interface SearchParams { niche?: string; priceMin?: string; priceMax?: string; }

export default async function AdvertiserContentPurchasePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const nicheFilter = params.niche ?? "";
  const priceMin = parseFloat(params.priceMin ?? "0");
  const priceMax = parseFloat(params.priceMax ?? "9999");

  // Fetch article posting + link insertion packages with their platform
  const packages = await db.package.findMany({
    where: {
      isActive: true,
      platform: { status: "ACTIVE" },
      price: { gte: priceMin || 0, lte: priceMax || 9999 },
      ...(nicheFilter ? { platform: { niche: { contains: nicheFilter, mode: "insensitive" }, status: "ACTIVE" } } : {}),
    },
    include: { platform: { select: { url: true, da: true, dr: true, traffic: true, niche: true, country: true, language: true, publisherId: true } } },
    orderBy: { price: "asc" },
    take: 50,
  });

  const niches = await db.platform.findMany({
    where: { status: "ACTIVE" },
    select: { niche: true },
    distinct: ["niche"],
    orderBy: { niche: "asc" },
  });

  const TYPE_LABELS: Record<string, string> = {
    ARTICLE_POSTING: "Article Posting",
    LINK_INSERTION: "Link Insertion",
    PRESS_RELEASE: "Press Release",
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Home &gt; Content Purchase</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Content Purchase</h1>
        <p className="text-sm text-muted font-inter mt-1">Buy article writing, link insertion, and press release placements</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "260px 1fr" }}>
        {/* Filter Sidebar */}
        <div>
          <form method="GET" className="card bg-card border-base rounded-xl p-5 flex flex-col gap-4 sticky top-4">
            <h3 className="font-space font-semibold text-dark text-sm">Filters</h3>

            <div>
              <label className="text-xs font-semibold text-muted font-inter block mb-1.5 uppercase tracking-wide">Niche</label>
              <select name="niche" defaultValue={nicheFilter} className="input text-sm">
                <option value="">All niches</option>
                {niches.map((n: any) => <option key={n.niche} value={n.niche}>{n.niche}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted font-inter block mb-1.5 uppercase tracking-wide">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" name="priceMin" defaultValue={priceMin || ""} placeholder="Min" className="input text-sm" />
                <input type="number" name="priceMax" defaultValue={priceMax === 9999 ? "" : priceMax} placeholder="Max" className="input text-sm" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary font-space font-semibold text-sm" style={{ borderRadius: "8px", justifyContent: "center" }}>
              Apply Filters
            </button>
            {(nicheFilter || priceMin || priceMax < 9999) && (
              <Link href="/advertiser/content-purchase" className="text-xs text-center text-muted font-inter hover:text-dark">Clear filters</Link>
            )}
          </form>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted font-inter"><strong className="text-dark">{packages.length}</strong> packages available</p>
          </div>

          {packages.length === 0 ? (
            <div className="card bg-card border-base rounded-xl p-16 flex flex-col items-center text-center">
              <ShoppingBagIcon className="w-14 h-14 text-muted mb-4" />
              <p className="font-space font-semibold text-dark text-xl mb-2">No packages found</p>
              <p className="text-muted font-inter text-sm">Try adjusting your filters or browse all sites.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {packages.map((pkg: any) => (
                <div key={pkg.id} className="card bg-card border-base rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a href={pkg.platform.url} target="_blank" rel="noreferrer" className="font-space font-bold text-dark hover:text-primary text-sm truncate">{pkg.platform.url}</a>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EEF0FD] text-primary font-inter flex-shrink-0">{TYPE_LABELS[pkg.type]}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted font-inter flex-wrap">
                      <span>DA {pkg.platform.da}</span>
                      <span>·</span>
                      <span>{pkg.platform.traffic.toLocaleString()} visits/mo</span>
                      <span>·</span>
                      <span>{pkg.platform.niche}</span>
                      <span>·</span>
                      <span>{pkg.platform.country}</span>
                      {pkg.turnaround && <><span>·</span><span>{pkg.turnaround}d turnaround</span></>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <p className="text-xl font-bold font-space text-dark">${pkg.price}</p>
                    <Link
                      href={`/advertiser/tasks/new?platformId=${pkg.platformId}&packageId=${pkg.id}`}
                      className="btn btn-primary btn-sm font-space font-semibold"
                      style={{ borderRadius: "8px", padding: "8px 16px" }}
                    >
                      Buy now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
