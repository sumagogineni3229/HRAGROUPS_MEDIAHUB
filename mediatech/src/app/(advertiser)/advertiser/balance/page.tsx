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

  // Fetch advertiser role-isolated wallet details
  const { getUserRoleWallet, getUserRoleTransactions } = await import("@/lib/wallet");
  const wallet = await getUserRoleWallet(session.user.id, "ADVERTISER");

  const balance = wallet.balance;
  const reserved = wallet.reserved;
  const bonus = wallet.bonus;

  // Fetch role-isolated transaction history
  const transactions = await getUserRoleTransactions(session.user.id, "ADVERTISER", currentTab, urlQuery);

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
