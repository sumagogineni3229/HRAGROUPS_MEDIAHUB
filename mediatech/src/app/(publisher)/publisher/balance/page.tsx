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

  const publisher = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, reserved: true, earnings: true },
  });

  const balance = publisher?.balance ?? 0;
  const reserved = publisher?.reserved ?? 0;
  const earnings = publisher?.earnings ?? 0;

  const transactions = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      ...(currentTab !== "ALL" ? { type: currentTab as any } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  async function handleRequestPayoutAction(
    amountValue: number,
    methodLabel: string,
    details: string
  ) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const { db } = await import("@/lib/db");

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });

    if (!user || user.balance < amountValue) {
      throw new Error("Insufficient funds");
    }

    // Create a pending withdrawal request — balance is held but NOT deducted yet.
    // Admin processes it and marks PAID, at which point withdrawn is incremented.
    await db.$transaction([
      db.withdrawal.create({
        data: {
          userId: session.user.id,
          amount: amountValue,
          method: methodLabel,
          details,
          status: "PENDING",
        },
      }),
      db.transaction.create({
        data: {
          userId: session.user.id,
          type: "WITHDRAWAL",
          amount: -amountValue,
          note: `Withdrawal request submitted via ${methodLabel}`,
        },
      }),
    ]);

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
