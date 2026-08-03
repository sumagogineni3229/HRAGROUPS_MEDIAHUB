import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InformationCircleIcon, UserGroupIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import CopyLinkButton from "./copy-link-button";

export const metadata = { title: "Referral Program - MediaHub" };

export default async function PublisherReferralPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const referralLink = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/register?ref=${session.user.id}`;

  const referrals = await db.referral.findMany({
    where: { referrerId: session.user.id },
    include: { referred: { select: { name: true, email: true, createdAt: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalCommission = referrals.reduce((sum: number, r: any) => sum + r.commission, 0);
  const paidCommission = referrals.filter((r: any) => r.isPaid).reduce((sum: number, r: any) => sum + r.commission, 0);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div className="mb-6">
        <span className="text-xs text-muted font-inter">Home &gt; Referral Program</span>
        <h1 className="text-2xl font-bold font-space text-dark mt-1">Referral Program</h1>
      </div>

      {/* Promo Banner */}
      <div className="rounded-xl p-6 mb-6 flex justify-between items-center" style={{ background: "linear-gradient(135deg, #8CF08A 0%, #6EE7B7 100%)" }}>
        <div>
          <p className="text-dark font-bold text-xl font-space mb-1">Earn 10% commission — unlimited!</p>
          <p className="text-dark font-inter text-sm opacity-80">Refer publishers and earn on every completed task they receive.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: UserGroupIcon, label: "Total Referrals", value: referrals.length, color: "#3E4FEA" },
          { icon: CurrencyDollarIcon, label: "Total Earned", value: `$${totalCommission.toFixed(2)}`, color: "#22c55e" },
          { icon: CurrencyDollarIcon, label: "Paid Out", value: `$${paidCommission.toFixed(2)}`, color: "#d97706" },
        ].map((s: any) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card bg-card border-base rounded-xl p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18` }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold font-space" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-muted font-inter mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Copy Link */}
      <div className="card bg-card border-base rounded-xl p-6 mb-6">
        <h3 className="font-space font-semibold text-dark mb-1">Your Referral Link</h3>
        <p className="text-sm text-muted font-inter mb-4">Share this link with other publishers to start earning commissions automatically.</p>
        <CopyLinkButton link={referralLink} />
      </div>

      {/* How it works */}
      <div className="card bg-card border-base rounded-xl p-6 mb-6">
        <h3 className="font-space font-semibold text-dark text-sm mb-5">Getting started is as easy as 1-2-3</h3>
        <div className="flex flex-col gap-3 font-inter text-sm">
          {[
            "Share your referral link with other website owners who want to monetize their traffic.",
            "When they sign up using your link and add their site to the marketplace, they&apos;re tracked as your referral.",
            "Earn 10% of the platform&apos;s commission for every completed task they receive — forever.",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-app border border-border">
              <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold font-space flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-dark" dangerouslySetInnerHTML={{ __html: step }} />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-xl mb-6 border border-primary bg-[#EEF0FD]">
        <InformationCircleIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm font-inter text-dark">
          Commissions are automatically tracked and credited when tasks are completed. You get <strong>10% of the platform fee</strong> — not the seller's earnings.
        </p>
      </div>

      {/* Referral List */}
      {referrals.length > 0 && (
        <div className="card bg-card border-base rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-space font-semibold text-dark text-sm">Your Referrals ({referrals.length})</h3>
          </div>
          <table className="w-full text-left font-inter text-sm">
            <thead>
              <tr className="bg-app border-b border-border">
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Joined</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase text-right">Commission</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r: any) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-app">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-dark">{r.referred.name ?? "—"}</p>
                    <p className="text-xs text-muted">{r.referred.email}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">{r.referred.role}</td>
                  <td className="px-5 py-3 text-xs text-muted">{new Date(r.referred.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right font-bold text-success">${r.commission.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.isPaid ? "bg-[#e8fbee] text-success" : "bg-[#FFF8E8] text-warning"}`}>
                      {r.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
