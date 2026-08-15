import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BalanceClient } from "@/components/balance/balance-client";

export const metadata = {
  title: "Balance - MediaHub",
};

interface SearchParams {
  type?: string;
  query?: string;
}

export default async function AdvertiserBalancePage({
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
  const urlQuery = resolvedParams.query || "";

  // Fetch advertiser balance details
  const advertiser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, reserved: true, bonus: true }
  });

  const balance = advertiser?.balance ?? 0;
  const reserved = advertiser?.reserved ?? 0;
  const bonus = advertiser?.bonus ?? 0;

  // Fetch transaction history
  const transactions = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      ...(currentTab !== "ALL" ? { type: currentTab as any } : {}),
      ...(urlQuery ? {
        note: {
          contains: urlQuery,
          mode: "insensitive" as const
        }
      } : {})
    },
    orderBy: { createdAt: "desc" },
  });

  // Server Action to add funds to balance
  async function handleAddFundsAction(amountValue: number, methodLabel: string) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const depositValue = amountValue;
    if (depositValue < 5) throw new Error("Minimum deposit is $5.00");

    // Initialize PhonePe / MediaHub Payments Gateway
    const { initiatePhonePePayment } = await import("@/lib/phonepe");
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/api/payments/phonepe/callback?userId=${encodeURIComponent(session.user.id)}&amount=${depositValue}`;
    const callbackUrl = `${baseUrl}/api/payments/phonepe/webhook`;

    try {
      const result = await initiatePhonePePayment({
        userId: session.user.id,
        amountUsd: depositValue,
        redirectUrl,
        callbackUrl,
      });

      if (result.checkoutUrl) {
        return { url: result.checkoutUrl };
      }
      return { error: "Failed to generate PhonePe checkout URL" };
    } catch (err: any) {
      console.error("PhonePe initiation error:", err);
      return { error: err.message || "Failed to initialize PhonePe payment gateway" };
    }
  }

  return (
    <BalanceClient
      initialBalance={balance}
      initialReserved={reserved}
      initialEarnings={bonus}
      transactions={transactions}
      currentTab={currentTab}
      onAddFundsAction={handleAddFundsAction}
      basePath="advertiser"
    />
  );
}
