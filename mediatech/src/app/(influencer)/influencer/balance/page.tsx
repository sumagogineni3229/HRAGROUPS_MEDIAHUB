import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BalanceClient } from "@/components/balance/balance-client";
import RequestPayoutClient from "@/components/balance/request-payout-client";

export const metadata = {
  title: "My Balance - MediaHub",
};

interface SearchParams {
  type?: string;
  view?: string;
  action?: string;
  query?: string;
}

export default async function InfluencerBalancePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.type || "ALL";
  const activeView = (resolvedParams.view || "main") as "main" | "reserved" | "bonus";
  const isRequestAction = resolvedParams.action === "request";
  const urlQuery = resolvedParams.query || "";

  const { getUserRoleWallet, getUserRoleTransactions } = await import("@/lib/wallet");
  const wallet = await getUserRoleWallet(session.user.id, "INFLUENCER");

  const balance = wallet.balance;
  const reserved = wallet.reserved;
  const earnings = wallet.earnings;

  const transactions = await getUserRoleTransactions(session.user.id, "INFLUENCER", currentTab, urlQuery);

  async function handleRequestPayoutAction(
    amountValue: number,
    methodLabel: string,
    details: string
  ) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const { db } = await import("@/lib/db");
    const { getUserRoleWallet } = await import("@/lib/wallet");
    const infWallet = await getUserRoleWallet(session.user.id, "INFLUENCER");

    if (infWallet.balance < amountValue) {
      throw new Error("Insufficient Influencer earnings balance");
    }

    // Create a pending influencer withdrawal request
    const wd = await db.withdrawal.create({
      data: {
        userId: session.user.id,
        amount: amountValue,
        method: methodLabel,
        details: `[INFLUENCER] ${details}`,
        status: "PENDING",
      },
    });

    await db.transaction.create({
      data: {
        userId: session.user.id,
        type: "WITHDRAWAL",
        amount: -amountValue,
        note: `Payout via ${methodLabel} (${details})`,
        reference: wd.id,
      },
    });

    // Notify influencer their request was received
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "PAYMENT",
        title: "Withdrawal request submitted",
        body: `Your request to withdraw $${amountValue.toFixed(2)} via ${methodLabel} is being reviewed.`,
        link: "/influencer/balance",
      },
    });

    redirect("/influencer/balance");
  }

  if (isRequestAction) {
    return (
      <RequestPayoutClient
        initialBalance={balance}
        onWithdrawalAction={handleRequestPayoutAction}
        basePath="influencer"
      />
    );
  }

  return (
    <BalanceClient
      initialBalance={balance}
      initialReserved={reserved}
      initialEarnings={earnings}
      transactions={transactions}
      currentTab={currentTab}
      onWithdrawalAction={handleRequestPayoutAction}
      activeBalanceType={activeView}
      basePath="influencer"
    />
  );
}
