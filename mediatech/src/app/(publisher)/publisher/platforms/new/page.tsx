import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CountrySelect } from "@/components/ui/country-select";
import { WEBSITE_CATEGORIES } from "@/lib/categories";

export const metadata = {
  title: "Add Website Platform - MediaHub",
};

interface SearchParams {
  edit?: string;
}

export default async function NewPlatformPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { edit: editId } = await searchParams;
  const { db } = await import("@/lib/db");

  let existingPlatform: any = null;
  if (editId) {
    existingPlatform = await db.platform.findUnique({
      where: { id: editId },
      include: { packages: true }
    });
  }

  const isCompanyPublisher = session?.user?.email === "mediahub@publisher.com";

  // Server action to save or update the platform
  async function handleSubmit(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const isCompany = session.user.email === "mediahub@publisher.com";
    const platformId = formData.get("platformId") as string;
    const url = formData.get("url") as string;
    const niche = formData.get("niche") as string;
    const country = formData.get("country") as string;
    const language = formData.get("language") as string;
    const da = parseInt((formData.get("da") as string) || "0", 10);
    const dr = parseInt((formData.get("dr") as string) || "0", 10);
    const traffic = parseInt((formData.get("traffic") as string) || "0", 10);
    const turnaround = parseInt((formData.get("turnaround") as string) || "3", 10);

    const isRequestPricing = isCompany && formData.get("pricingMode") === "REQUEST_PRICING";

    const placementPrice = !isRequestPricing && formData.get("placementPrice")
      ? parseFloat(formData.get("placementPrice") as string)
      : 0;
    const writingPrice = !isRequestPricing && formData.get("writingPrice")
      ? parseFloat(formData.get("writingPrice") as string)
      : 0;
    const specialTopicPrice = !isRequestPricing && formData.get("specialTopicPrice")
      ? parseFloat(formData.get("specialTopicPrice") as string)
      : 0;

    const { db } = await import("@/lib/db");

    let targetPlatformId = platformId;

    if (platformId) {
      // Update existing website platform
      await db.platform.update({
        where: { id: platformId },
        data: {
          url,
          niche,
          country,
          language,
          da,
          dr,
          traffic,
          ...(isCompany ? { status: "ACTIVE" } : {}),
        },
      });
    } else {
      // Create new website platform (Instant ACTIVE for MediaHub company publisher, PENDING for normal publishers)
      const created = await db.platform.create({
        data: {
          publisherId: session.user.id as string,
          url,
          niche,
          country,
          language,
          da,
          dr,
          traffic,
          status: isCompany ? "ACTIVE" : "PENDING",
        },
      });
      targetPlatformId = created.id;
    }

    if (isRequestPricing) {
      // For MediaHub Company Publisher with Request Pricing enabled: delete packages so pricing is hidden on advertiser marketplace
      await db.package.deleteMany({
        where: { platformId: targetPlatformId },
      });
    } else {
      // Upsert Packages: ARTICLE_POSTING
      const existingArticlePkg = await db.package.findFirst({
        where: { platformId: targetPlatformId, type: "ARTICLE_POSTING" },
      });
      if (existingArticlePkg) {
        await db.package.update({
          where: { id: existingArticlePkg.id },
          data: { price: placementPrice, turnaround, isActive: placementPrice > 0 },
        });
      } else if (placementPrice > 0) {
        await db.package.create({
          data: {
            platformId: targetPlatformId,
            type: "ARTICLE_POSTING",
            price: placementPrice,
            turnaround,
            description: "Content placement package",
            isActive: true,
          },
        });
      }

      // Upsert Packages: LINK_INSERTION
      const existingLinkPkg = await db.package.findFirst({
        where: { platformId: targetPlatformId, type: "LINK_INSERTION" },
      });
      if (existingLinkPkg) {
        await db.package.update({
          where: { id: existingLinkPkg.id },
          data: { price: writingPrice, turnaround, isActive: writingPrice > 0 },
        });
      } else if (writingPrice > 0) {
        await db.package.create({
          data: {
            platformId: targetPlatformId,
            type: "LINK_INSERTION",
            price: writingPrice,
            turnaround,
            description: "Writing & Placement package",
            isActive: true,
          },
        });
      }

      // Upsert Packages: PRESS_RELEASE
      const existingPressPkg = await db.package.findFirst({
        where: { platformId: targetPlatformId, type: "PRESS_RELEASE" },
      });
      if (existingPressPkg) {
        await db.package.update({
          where: { id: existingPressPkg.id },
          data: { price: specialTopicPrice, turnaround: Math.max(turnaround, 3), isActive: specialTopicPrice > 0 },
        });
      } else if (specialTopicPrice > 0) {
        await db.package.create({
          data: {
            platformId: targetPlatformId,
            type: "PRESS_RELEASE",
            price: specialTopicPrice,
            turnaround: Math.max(turnaround, 3),
            description: "Special topic / Press release package",
            isActive: true,
          },
        });
      }
    }

    redirect("/publisher/platforms");
  }

  const defaultPlacementPrice =
    existingPlatform?.packages?.find((p: any) => p.type === "ARTICLE_POSTING")?.price ?? "";
  const defaultWritingPrice =
    existingPlatform?.packages?.find((p: any) => p.type === "LINK_INSERTION")?.price ?? "";
  const defaultSpecialTopicPrice =
    existingPlatform?.packages?.find((p: any) => p.type === "PRESS_RELEASE")?.price ?? "";

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="mb-6">
        <Link href="/publisher/platforms" className="text-sm text-primary hover:underline">
          ← Back to Platforms
        </Link>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">
          {existingPlatform ? "Edit website platform" : "Add website platform"}
        </h1>
        <p className="text-sm text-muted font-inter mt-1">
          List your website details, metrics, and specify your service rates.
        </p>
      </div>

      <div className="card bg-card border-base rounded-xl p-6 shadow-sm">
        <form action={handleSubmit} className="flex flex-col gap-5">
          {existingPlatform && <input type="hidden" name="platformId" value={existingPlatform.id} />}

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Site URL</label>
            <input
              name="url"
              type="url"
              required
              defaultValue={existingPlatform?.url || ""}
              placeholder="https://techbullion.com"
              className="input"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">
                Niche / Category
              </label>
              <select
                name="niche"
                required
                defaultValue={existingPlatform?.niche || "Technology"}
                className="input select"
              >
                {WEBSITE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Country</label>
              <CountrySelect
                name="country"
                defaultValue={existingPlatform?.country || "United States"}
                placeholder="Select Country..."
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Language</label>
              <input
                name="language"
                type="text"
                required
                defaultValue={existingPlatform?.language || "English"}
                placeholder="English, Spanish..."
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">
                Link Attribution Type
              </label>
              <select
                name="linkType"
                defaultValue={existingPlatform?.linkType || "Dofollow"}
                className="input select"
              >
                <option value="Dofollow">Dofollow</option>
                <option value="Nofollow">Nofollow</option>
                <option value="Sponsored">Sponsored</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Moz DA</label>
              <input
                name="da"
                type="number"
                min="0"
                max="100"
                defaultValue={existingPlatform?.da ?? ""}
                placeholder="e.g. 50"
                required
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Ahrefs DR</label>
              <input
                name="dr"
                type="number"
                min="0"
                max="100"
                defaultValue={existingPlatform?.dr ?? ""}
                placeholder="e.g. 55"
                required
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">
                Organic Traffic
              </label>
              <input
                name="traffic"
                type="number"
                min="0"
                defaultValue={existingPlatform?.traffic ?? ""}
                placeholder="e.g. 10000"
                required
                className="input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">
                TAT (Days)
              </label>
              <input
                name="turnaround"
                type="number"
                min="1"
                max="60"
                defaultValue={existingPlatform?.packages?.[0]?.turnaround ?? 3}
                placeholder="3"
                required
                className="input"
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="border-t border-slate-200 pt-5 mt-2 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-space font-semibold text-dark text-md">Pricing & Marketplace Settings</h3>
                {isCompanyPublisher && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    🏢 MediaHub Company Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-muted font-inter mt-0.5">
                {isCompanyPublisher
                  ? "Choose whether to publish with upfront pricing or hide pricing (Request Pricing quote mode)."
                  : "Set the pricing for each service package on your website."}
              </p>
            </div>

            {/* ONLY visible to MediaHub Company Publisher */}
            {isCompanyPublisher && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="pricingMode"
                    value="FIXED_PRICING"
                    defaultChecked={existingPlatform ? existingPlatform.packages?.some((p: any) => p.price > 0) : true}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="block text-xs font-bold text-dark">Fixed Public Pricing</span>
                    <span className="block text-[11px] text-muted leading-tight mt-0.5">
                      Display prices in the marketplace so advertisers can order directly.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="pricingMode"
                    value="REQUEST_PRICING"
                    defaultChecked={existingPlatform ? !existingPlatform.packages?.some((p: any) => p.price > 0) : false}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-amber-900">Hide Price (Request Pricing Only)</span>
                    <span className="block text-[11px] text-amber-700 leading-tight mt-0.5">
                      Hide public rates and show "Request Pricing" button for custom quotes.
                    </span>
                  </div>
                </label>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              {isCompanyPublisher && (
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Service Rates (USD $) - <i>Ignored if "Hide Price" is selected</i>
                </span>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1 font-inter">
                    Content Placement ($)
                  </label>
                  <input
                    name="placementPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={defaultPlacementPrice}
                    placeholder="e.g. 50.00"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1 font-inter">
                    Writing & Placement ($)
                  </label>
                  <input
                    name="writingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={defaultWritingPrice}
                    placeholder="e.g. 75.00"
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted block mb-1 font-inter">
                    Special Topic ($)
                  </label>
                  <input
                    name="specialTopicPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={defaultSpecialTopicPrice}
                    placeholder="e.g. 100.00"
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary font-space font-semibold mt-2"
            style={{ justifyContent: "center" }}
          >
            {existingPlatform ? "Save Changes" : "Add Website Platform"}
          </button>
        </form>
      </div>
    </div>
  );
}
