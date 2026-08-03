import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Add Website - MediaHub",
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

  let existingPlatform = null;
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
    const traffic = parseInt(formData.get("traffic") as string || "0", 10);
    const price = parseFloat(formData.get("price") as string || "10.00");

    const { db } = await import("@/lib/db");
    
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
          traffic,
        }
      });
      // Update primary package price if exists
      const existingPkg = await db.package.findFirst({
        where: { platformId, type: "ARTICLE_POSTING" }
      });
      if (existingPkg) {
        await db.package.update({
          where: { id: existingPkg.id },
          data: { price }
        });
      }
    } else {
      // Create new website platform list item with initial default package
      await db.platform.create({
        data: {
          publisherId: session.user.id as string,
          url,
          niche,
          country,
          language,
          da,
          traffic,
          status: "PENDING",
          packages: {
            create: {
              type: "ARTICLE_POSTING",
              price,
              turnaround: 3,
              description: "Article Posting content placement package"
            }
          }
        }
      });
    }

    redirect("/publisher/platforms");
  }

  const defaultPrice = existingPlatform?.packages.find((p: any) => p.type === "ARTICLE_POSTING")?.price || 10.00;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="mb-6">
        <Link href="/publisher/platforms" className="text-sm text-primary hover:underline">
          ← Back to Platforms
        </Link>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">
          {existingPlatform ? "Edit website platform" : "Add website platform"}
        </h1>
      </div>

      <div className="card bg-card border-base rounded-lg p-6">
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {existingPlatform && <input type="hidden" name="platformId" value={existingPlatform.id} />}

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Site URL</label>
            <input name="url" type="url" required defaultValue={existingPlatform?.url || ""} placeholder="https://example.com" className="input" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Niche / Category</label>
              <select name="niche" required defaultValue={existingPlatform?.niche || "Technology"} className="input select">
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Country</label>
              <input name="country" type="text" required defaultValue={existingPlatform?.country || ""} placeholder="United States" className="input" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Language</label>
              <input name="language" type="text" required defaultValue={existingPlatform?.language || "English"} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Domain Authority (DA)</label>
              <input name="da" type="number" min="0" max="100" defaultValue={existingPlatform?.da ?? ""} placeholder="30" className="input" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Monthly Organic Traffic</label>
            <input name="traffic" type="number" min="0" defaultValue={existingPlatform?.traffic ?? ""} placeholder="5000" className="input" />
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px' }}>
            <h3 className="font-space font-semibold text-dark text-md mb-3 mt-4">Pricing Package (Article Posting)</h3>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Content Placement Price ($)</label>
              <input name="price" type="number" step="0.01" min="1" required defaultValue={defaultPrice} className="input" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary font-space font-semibold mt-4" style={{ justifyContent: 'center' }}>
            {existingPlatform ? "Save Changes" : "Add Platform"}
          </button>
        </form>
      </div>
    </div>
  );
}
