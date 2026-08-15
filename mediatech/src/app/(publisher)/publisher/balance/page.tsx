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

export default async function PublisherBalancePage({
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
  const wallet = await getUserRoleWallet(session.user.id, "PUBLISHER");

  const balance = wallet.balance;
  const reserved = wallet.reserved;
  const earnings = wallet.earnings;

  const transactions = await getUserRoleTransactions(session.user.id, "PUBLISHER", currentTab, urlQuery);

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
    const pubWallet = await getUserRoleWallet(session.user.id, "PUBLISHER");

    if (pubWallet.balance < amountValue) {
      throw new Error("Insufficient Publisher earnings balance");
    }

    // Create a pending publisher withdrawal request
    const wd = await db.withdrawal.create({
      data: {
        userId: session.user.id,
        amount: amountValue,
        method: methodLabel,
        details: `[PUBLISHER] ${details}`,
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

    // Notify user of submitted request
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "PAYMENT",
        title: "Withdrawal request submitted",
        body: `Your request to withdraw $${amountValue.toFixed(2)} via ${methodLabel} is being reviewed.`,
        link: "/publisher/balance",
      },
    });

    redirect("/publisher/balance");
  }

  if (isRequestAction) {
    return (
      <RequestPayoutClient
        initialBalance={balance}
        onWithdrawalAction={handleRequestPayoutAction}
        basePath="publisher"
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
      basePath="publisher"
    />
  );
}
