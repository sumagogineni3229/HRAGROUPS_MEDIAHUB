import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserGroupIcon, GlobeAltIcon, DevicePhoneMobileIcon, BookmarkSlashIcon } from "@heroicons/react/24/outline";

export const metadata = { title: "Media Partner List - MediaHub" };

interface SearchParams { type?: string; }

export default async function AdvertiserPartnersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const typeFilter = params.type ?? "ALL";

  const saved = await db.savedPartner.findMany({
    where: {
      advertiserId: session.user.id,
      ...(typeFilter !== "ALL" ? { partnerType: typeFilter as any } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch partner details
  const partnerIds = saved.map((s: any) => s.partnerId);
  const [publishers, influencers] = await Promise.all([
    db.user.findMany({
      where: { id: { in: partnerIds }, role: "PUBLISHER" },
      select: { id: true, name: true, email: true, platforms: { select: { url: true, da: true, traffic: true, niche: true, status: true }, take: 1 } },
    }),
    db.user.findMany({
      where: { id: { in: partnerIds }, role: "INFLUENCER" },
      select: { id: true, name: true, email: true, channels: { select: { handle: true, platform: true, followers: true, engagement: true, niche: true, status: true }, take: 1 } },
    }),
  ]);

  const publisherMap = Object.fromEntries(publishers.map((p: any) => [p.id, p]));
  const influencerMap = Object.fromEntries(influencers.map((i: any) => [i.id, i]));

  async function removePartner(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    const savedId = formData.get("savedId") as string;
    const { db } = await import("@/lib/db");
    await db.savedPartner.delete({ where: { id: savedId, advertiserId: s.user.id } });
    redirect("/advertiser/partners");
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Home &gt; Media Partner List</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Media Partner List</h1>
        <p className="text-sm text-muted font-inter mt-1">Saved publishers and influencers you work with regularly</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-app rounded-xl p-1 border border-border" style={{ width: "fit-content" }}>
        {["ALL", "PUBLISHER", "INFLUENCER"].map((t) => (
          <Link key={t} href={`/advertiser/partners?type=${t}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold font-inter transition-colors ${typeFilter === t ? "bg-card text-dark shadow-sm" : "text-muted hover:text-dark"}`}>
            {t === "ALL" ? "All Partners" : t === "PUBLISHER" ? "Publishers" : "Influencers"}
          </Link>
        ))}
      </div>

      {saved.length === 0 ? (
        <div className="card bg-card border-base rounded-xl p-16 flex flex-col items-center text-center">
          <UserGroupIcon className="w-14 h-14 text-muted mb-4" />
          <p className="font-space font-semibold text-dark text-xl mb-2">No saved partners yet</p>
          <p className="text-muted font-inter text-sm mb-6 max-w-sm">
            Save publishers and influencers you work with regularly for quick access.
            Browse the marketplace to find partners.
          </p>
          <div className="flex gap-3">
            <Link href="/advertiser/sites" className="btn btn-primary font-space font-semibold" style={{ borderRadius: "8px", padding: "10px 20px" }}>Browse Publishers</Link>
            <Link href="/advertiser/influencers" className="btn btn-outline font-space font-semibold" style={{ borderRadius: "8px", padding: "10px 20px" }}>Browse Influencers</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {saved.map((s: any) => {
            const pub = publisherMap[s.partnerId];
            const inf = influencerMap[s.partnerId];
            const site = pub?.platforms[0];
            const channel = inf?.channels[0];

            return (
              <div key={s.id} className="card bg-card border-base rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.partnerType === "PUBLISHER" ? "#e8fbee" : "#EEF0FD" }}>
                    {s.partnerType === "PUBLISHER"
                      ? <GlobeAltIcon className="w-5 h-5 text-success" />
                      : <DevicePhoneMobileIcon className="w-5 h-5 text-primary" />}
                  </div>
                  <form action={removePartner}>
                    <input type="hidden" name="savedId" value={s.id} />
                    <button type="submit" className="text-muted hover:text-danger transition-colors" title="Remove from saved">
                      <BookmarkSlashIcon className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                <p className="font-space font-bold text-dark text-base mb-0.5">{pub?.name ?? inf?.name ?? "Unknown"}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full font-inter mb-3 inline-block" style={{ background: s.partnerType === "PUBLISHER" ? "#e8fbee" : "#EEF0FD", color: s.partnerType === "PUBLISHER" ? "#16a34a" : "#3E4FEA" }}>
                  {s.partnerType}
                </span>

                {site && (
                  <div className="bg-app rounded-lg p-3 mt-2 text-xs font-inter">
                    <p className="font-semibold text-dark mb-1">{site.url}</p>
                    <div className="flex gap-3 text-muted">
                      <span>DA {site.da}</span>
                      <span>·</span>
                      <span>{site.traffic.toLocaleString()} visits</span>
                      <span>·</span>
                      <span>{site.niche}</span>
                    </div>
                  </div>
                )}

                {channel && (
                  <div className="bg-app rounded-lg p-3 mt-2 text-xs font-inter">
                    <p className="font-semibold text-dark mb-1">@{channel.handle} ({channel.platform})</p>
                    <div className="flex gap-3 text-muted">
                      <span>{(channel.followers / 1000).toFixed(0)}K followers</span>
                      <span>·</span>
                      <span>{channel.engagement}% eng.</span>
                      <span>·</span>
                      <span>{channel.niche}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                  <p className="text-xs text-muted font-inter">Saved {new Date(s.createdAt).toLocaleDateString()}</p>
                  <Link
                    href={`/advertiser/tasks/new?${s.partnerType === "PUBLISHER" ? "publisherId" : "influencerId"}=${s.partnerId}`}
                    className="text-xs text-primary font-semibold font-inter hover:underline"
                  >
                    Place order →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
