import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Demand - MediaHub",
};

export default async function InfluencerDemandPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Home &gt; Demand</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-2">Open Demand Campaigns</h1>
      </div>

      <div className="card bg-card border-base rounded-lg p-6">
        <div className="empty-state py-12 flex flex-col items-center justify-center text-center">
          <ChartBarIcon className="w-12 h-12 text-muted mb-4" />
          <p className="font-space font-medium text-dark text-lg mb-1">No matches found</p>
          <p className="text-muted text-sm max-w-sm">Generic advertiser shoutout campaigns matching your social profile metrics and niches will appear here.</p>
        </div>
      </div>
    </div>
  );
}
