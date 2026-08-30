import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PriceManagementClient } from "@/components/pricing/price-management-client";

export const metadata = {
  title: "Price Management & Client Enquiries - Admin MediaHub",
};

export default async function AdminEnquiriesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

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
      <PriceManagementClient initialEnquiries={enquiries} isCompanyPublisher={false} />
    </div>
  );
}
