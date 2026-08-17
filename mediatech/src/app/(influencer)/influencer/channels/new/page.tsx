import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

import { INFLUENCER_CATEGORIES } from "@/lib/categories";
import { SearchableSelect } from "@/components/ui/searchable-select";

export const metadata = {
  title: "Manage Channel - MediaHub",
};

const AVAILABLE_PACKAGES = [
  { type: "POST", label: "Dedicated Feed Post", defaultPrice: 25, defaultTurnaround: 3, description: "Dedicated feed post placement" },
  { type: "STORY", label: "Social Story / Slide", defaultPrice: 15, defaultTurnaround: 1, description: "Temporary story slot" },
  { type: "REEL", label: "Video Reel / Short", defaultPrice: 50, defaultTurnaround: 5, description: "Short-form video placement (Reel/TikTok/Short)" },
  { type: "VIDEO", label: "Long-form Video", defaultPrice: 150, defaultTurnaround: 7, description: "Dedicated or integrated long-form video placement" },
  { type: "REVIEW", label: "Product Review", defaultPrice: 100, defaultTurnaround: 7, description: "Detailed review of your service/product" },
];

interface SearchParams {
  edit?: string;
}

export default async function NewChannelPage({
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

  let existingChannel: any = null;
  if (editId) {
    existingChannel = await db.channel.findFirst({
      where: { id: editId, influencerId: session.user.id },
      include: { packages: true },
    });
  }

  // Server action to save the social channel
  async function handleSubmit(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const channelId = formData.get("channelId") as string;
    const platform = formData.get("platform") as any; // SocialPlatform enum
    const handle = formData.get("handle") as string;
    const followers = parseInt(formData.get("followers") as string || "0", 10);
    const engagement = parseFloat(formData.get("engagement") as string || "0.0");
    const niche = formData.get("niche") as string;
    const country = formData.get("country") as string;

    const { db } = await import("@/lib/db");

    let savedChannelId = channelId;

    if (channelId) {
      // Update existing channel
      await db.channel.update({
        where: { id: channelId, influencerId: session.user.id },
        data: {
          platform,
          handle,
          followers,
          engagement,
          niche,
          country,
        },
      });
    } else {
      // Create new channel
      const created = await db.channel.create({
        data: {
          influencerId: session.user.id,
          platform,
          handle,
          followers,
          engagement,
          niche,
          country,
          status: "PENDING",
        },
      });
      savedChannelId = created.id;
    }

    // Process packages
    const existingPackages = channelId
      ? await db.channelPackage.findMany({ where: { channelId } })
      : [];

    for (const pkg of AVAILABLE_PACKAGES) {
      const active = formData.get(`pkg_active_${pkg.type}`) === "on";
      const price = parseFloat(formData.get(`pkg_price_${pkg.type}`) as string || pkg.defaultPrice.toString());
      const turnaround = parseInt(formData.get(`pkg_turnaround_${pkg.type}`) as string || pkg.defaultTurnaround.toString(), 10);

      const existingPkg = existingPackages.find((p: any) => p.type === pkg.type);

      if (active) {
        if (existingPkg) {
          await db.channelPackage.update({
            where: { id: existingPkg.id },
            data: { price, turnaround, isActive: true },
          });
        } else {
          await db.channelPackage.create({
            data: {
              channelId: savedChannelId,
              type: pkg.type as any,
              price,
              turnaround,
              description: pkg.description,
              isActive: true,
            },
          });
        }
      } else {
        if (existingPkg) {
          // Delete or disable
          await db.channelPackage.delete({
            where: { id: existingPkg.id },
          });
        }
      }
    }

    redirect("/influencer/channels");
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div className="mb-6">
        <Link href="/influencer/channels" className="text-sm text-primary hover:underline">
          ← Back to Channels
        </Link>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">
          {existingChannel ? "Edit Social Channel" : "Connect Social Channel"}
        </h1>
      </div>

      <div className="card bg-card border-base rounded-lg p-6">
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {existingChannel && <input type="hidden" name="channelId" value={existingChannel.id} />}

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Social Platform</label>
            <select name="platform" required defaultValue={existingChannel?.platform || "INSTAGRAM"} className="input select">
              <option value="INSTAGRAM">Instagram</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="TIKTOK">TikTok</option>
              <option value="X">X (formerly Twitter)</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="LINKEDIN">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-dark block mb-2 font-inter">Channel Handle / Username</label>
            <input name="handle" type="text" required placeholder="@username" defaultValue={existingChannel?.handle || ""} className="input" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Followers Count</label>
              <input name="followers" type="number" min="0" required placeholder="5000" defaultValue={existingChannel?.followers || ""} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Engagement Rate (%)</label>
              <input name="engagement" type="number" step="0.01" min="0" max="100" required placeholder="3.5" defaultValue={existingChannel?.engagement || ""} className="input" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Niche / Category</label>
              <SearchableSelect
                name="niche"
                options={INFLUENCER_CATEGORIES}
                defaultValue={existingChannel?.niche || INFLUENCER_CATEGORIES[0]}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2 font-inter">Country</label>
              <input name="country" type="text" required placeholder="United States" defaultValue={existingChannel?.country || ""} className="input" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '10px' }}>
            <h3 className="font-space font-semibold text-dark text-md mb-2">Package Builder</h3>
            <p className="text-xs text-muted font-inter mb-4">Select and price the services you want to offer to brand collaborations.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {AVAILABLE_PACKAGES.map((pkg) => {
                const matchedPkg = existingChannel?.packages?.find((p: any) => p.type === pkg.type && p.isActive);
                const isChecked = !!matchedPkg || (pkg.type === "POST" && !existingChannel); // Default POST to active for new channels

                return (
                  <div key={pkg.type} className="border-base rounded-lg p-4 bg-app flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer font-space font-semibold text-dark text-sm">
                        <input
                          type="checkbox"
                          name={`pkg_active_${pkg.type}`}
                          defaultChecked={isChecked}
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        {pkg.label}
                      </label>
                      <span className="text-xs text-muted font-inter">{pkg.description}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="text-xs font-semibold text-muted block mb-1 font-inter">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          name={`pkg_price_${pkg.type}`}
                          defaultValue={matchedPkg?.price || pkg.defaultPrice}
                          className="input text-sm"
                          style={{ padding: '6px 12px' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted block mb-1 font-inter">Turnaround Time (Days)</label>
                        <input
                          type="number"
                          min="1"
                          name={`pkg_turnaround_${pkg.type}`}
                          defaultValue={matchedPkg?.turnaround || pkg.defaultTurnaround}
                          className="input text-sm"
                          style={{ padding: '6px 12px' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary font-space font-semibold mt-4" style={{ justifyContent: 'center' }}>
            {existingChannel ? "Save Changes" : "Connect Channel"}
          </button>
        </form>
      </div>
    </div>
  );
}

