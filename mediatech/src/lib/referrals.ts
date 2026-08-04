import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

/**
 * Automatically releases referral commission (10% of platform fee)
 * to the referrer whenever a referred user completes a task.
 */
export async function processReferralCommission(
  taskId: string,
  sellerId: string,
  platformFee: number
) {
  try {
    // Check if the seller (or advertiser) was referred by someone
    const referral = await db.referral.findUnique({
      where: { referredId: sellerId },
    });

    if (!referral) return;

    // Calculate 10% of platform fee (minimum $0.50 if fee is small)
    const rawCommission = platformFee * 0.1;
    const commission = Math.max(0.5, Math.round(rawCommission * 100) / 100);

    await db.$transaction([
      db.referral.update({
        where: { id: referral.id },
        data: { commission: { increment: commission } },
      }),
      db.user.update({
        where: { id: referral.referrerId },
        data: { balance: { increment: commission } },
      }),
      db.transaction.create({
        data: {
          userId: referral.referrerId,
          taskId: taskId,
          type: "COMMISSION",
          amount: commission,
          note: `Referral commission from task #${taskId.slice(-6).toUpperCase()}`,
        },
      }),
    ]);

    await createNotification({
      userId: referral.referrerId,
      type: "PAYMENT",
      title: "Referral Commission Earned!",
      body: `$${commission.toFixed(2)} referral commission has been added to your balance.`,
      link: "/publisher/referral",
    });
  } catch (err) {
    console.error("[REFERRAL_COMMISSION_ERROR]", err);
  }
}
