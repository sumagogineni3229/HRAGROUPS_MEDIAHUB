import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminListingsClient } from "./admin-listings-client";

export const metadata = { title: "Listings Approval - MediaHub Admin" };

interface SearchParams {
  tab?: string;
}

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const params = await searchParams;
  const tab = params.tab ?? "platforms";

  const [pendingPlatforms, pendingChannels] = await Promise.all([
    db.platform.findMany({
      where: { status: "PENDING" },
      include: { publisher: { select: { name: true, email: true } }, packages: true },
      orderBy: { createdAt: "asc" },
    }),
    db.channel.findMany({
      where: { status: "PENDING" },
      include: { influencer: { select: { name: true, email: true } }, packages: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <AdminListingsClient
      pendingPlatforms={pendingPlatforms}
      pendingChannels={pendingChannels}
      tab={tab}
    />
  );
}
