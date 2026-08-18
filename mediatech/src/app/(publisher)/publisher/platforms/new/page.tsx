import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CountrySelect } from "@/components/ui/country-select";

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

  // Server action to save or update the platform
  async function handleSubmit(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const platformId = formData.get("platformId") as string;
    const url = formData.get("url") as string;
    const niche = formData.get("niche") as string;
    const country = formData.get("country") as string;
    const language = formData.get("language") as string;
    const da = parseInt(formData.get("da") as string || "0", 10);
    const dr = parseInt(formData.get("dr") as string || "0", 10);
    const traffic = parseInt(formData.get("traffic") as string || "0", 10);
    
    const placementPrice = parseFloat(formData.get("placementPrice") as string || "28.45");
    const writingPrice = parseFloat(formData.get("writingPrice") as string || "34.50");
    const specialTopicPrice = parseFloat(formData.get("specialTopicPrice") as string || "15.00");

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
        }
      });
    } else {
      // Create new website platform
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
          status: "PENDING",
        }
      });
      targetPlatformId = created.id;
    }

    // Upsert Packages: ARTICLE_POSTING
    const existingArticlePkg = await db.package.findFirst({
      where: { platformId: targetPlatformId, type: "ARTICLE_POSTING" }
    });
    if (existingArticlePkg) {
      await db.package.update({
        where: { id: existingArticlePkg.id },
        data: { price: placementPrice }
      });
    } else {
      await db.package.create({
        data: {
          platformId: targetPlatformId,
          type: "ARTICLE_POSTING",
          price: placementPrice,
          turnaround: 3,
          description: "Content placement package"
        }
      });
    }

    // Upsert Packages: LINK_INSERTION
    const existingLinkPkg = await db.package.findFirst({
      where: { platformId: targetPlatformId, type: "LINK_INSERTION" }
    });
    if (existingLinkPkg) {
      await db.package.update({
        where: { id: existingLinkPkg.id },
        data: { price: writingPrice }
      });
    } else {
      await db.package.create({
        data: {
          platformId: targetPlatformId,
          type: "LINK_INSERTION",
          price: writingPrice,
          turnaround: 3,
          description: "Writing & Placement package"
        }
      });
    }

    // Upsert Packages: PRESS_RELEASE
    const existingPressPkg = await db.package.findFirst({
      where: { platformId: targetPlatformId, type: "PRESS_RELEASE" }
    });
    if (existingPressPkg) {
      await db.package.update({
        where: { id: existingPressPkg.id },
        data: { price: specialTopicPrice }
      });
    } else {
      await db.package.create({
        data: {
          platformId: targetPlatformId,
          type: "PRESS_RELEASE",
          price: specialTopicPrice,
          turnaround: 5,
          description: "Special topic / Press release package"
        }
      });
    }

    redirect("/publisher/platforms");
  }

  const defaultPlacementPrice = existingPlatform?.packages?.find((p: any) => p.type === "ARTICLE_POSTING")?.price || 28.45;
  const defaultWritingPrice = existingPlatform?.packages?.find((p: any) => p.type === "LINK_INSERTION")?.price || 34.50;
  const defaultSpecialTopicPrice = existingPlatform?.packages?.find((p: any) => p.type === "PRESS_RELEASE")?.price || 15.00;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="mb-6">
        <Link href="/publisher/platforms" className="text-sm text-primary hover:underline">
          ← Back to Platforms
        </Link>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">
          {existingPlatform ? "Edit website platform" : "Add website platform"}
        </h1>
        <p className="text-sm text-muted font-inter mt-1">List your website details, traffic metrics, country, language, and placement pricing.</p>
      </div>

      <div className="card bg-card border-base rounded-lg p-6">
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {existingPlatform && <input type="hidden" name="platformId" value={existingPlatform.id} />}

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Site URL</label>
            <input name="url" type="url" required defaultValue={existingPlatform?.url || ""} placeholder="https://techbullion.com" className="input" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Niche / Category</label>
              <select name="niche" required defaultValue={existingPlatform?.niche || "Technology"} className="input select">
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Internet">Internet</option>
                <option value="Health">Health</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Language</label>
              <input name="language" type="text" required defaultValue={existingPlatform?.language || "English"} placeholder="English, Spanish..." className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Link Attribution Type</label>
              <select name="linkType" defaultValue={existingPlatform?.linkType || "Dofollow"} className="input select">
                <option value="Dofollow">Dofollow</option>
                <option value="Nofollow">Nofollow</option>
                <option value="Sponsored">Sponsored</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Moz DA</label>
              <input name="da" type="number" min="0" max="100" defaultValue={existingPlatform?.da ?? "74"} placeholder="74" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Ahrefs DR</label>
              <input name="dr" type="number" min="0" max="100" defaultValue={existingPlatform?.dr ?? "81"} placeholder="81" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Organic Traffic</label>
              <input name="traffic" type="number" min="0" defaultValue={existingPlatform?.traffic ?? "15591"} placeholder="15591" className="input" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '4px' }}>
            <h3 className="font-space font-semibold text-dark text-md mb-3">Service & Placement Pricing ($)</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label className="text-xs font-medium text-muted block mb-1 font-inter">Content Placement ($)</label>
                <input name="placementPrice" type="number" step="0.01" min="1" required defaultValue={defaultPlacementPrice} className="input" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1 font-inter">Writing & Placement ($)</label>
                <input name="writingPrice" type="number" step="0.01" min="1" required defaultValue={defaultWritingPrice} className="input" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1 font-inter">Special Topic ($)</label>
                <input name="specialTopicPrice" type="number" step="0.01" min="0" required defaultValue={defaultSpecialTopicPrice} className="input" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary font-space font-semibold mt-4" style={{ justifyContent: 'center' }}>
            {existingPlatform ? "Save Changes" : "Add Website Platform"}
          </button>
        </form>
      </div>
    </div>
  );
}
