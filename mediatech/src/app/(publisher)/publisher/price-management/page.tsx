import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PriceManagementClient } from "@/components/pricing/price-management-client";

export const metadata = {
  title: "Price Management & Quote Requests - MediaHub",
};

export default async function PublisherPriceManagementPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const isCompanyPublisher = session.user.email === "mediahub@publisher.com";
  const role = (session.user as any).role;
  const isAdmin = role === "ADMIN";

  // Only allowed for MediaHub Company Publisher or Admin
  if (!isCompanyPublisher && !isAdmin) {
    redirect("/publisher/platforms");
  }

  // Fetch all pricing requests for unpriced/custom platforms
  const rawEnquiries = await db.enquiry.findMany({
    where: { type: "PRICING_REQUEST" },
    include: {
      platform: {
        select: {
          id: true,
          url: true,
          niche: true,
          da: true,
          dr: true,
          country: true,
          packages: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enquiries = rawEnquiries.map((e: any) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div className="w-full">
      <PriceManagementClient initialEnquiries={enquiries} isCompanyPublisher={isCompanyPublisher} />
    </div>
  );
}
