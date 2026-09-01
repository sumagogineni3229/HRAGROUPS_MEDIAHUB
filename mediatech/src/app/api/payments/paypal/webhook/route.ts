import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPayPalConfig, getPayPalOrderDetails } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "PayPal Webhook endpoint is active." });
}

export async function POST(req: Request) {
  try {
    const event = await req.json().catch(() => null);

    if (!event || !event.event_type) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const eventType = event.event_type;

    // Handle Completed Payments / Captures
    if (eventType === "PAYMENT.CAPTURE.COMPLETED" || eventType === "CHECKOUT.ORDER.APPROVED") {
      const resource = event.resource || {};
      const orderId =
        resource.supplementary_data?.related_ids?.order_id ||
        resource.id;

      if (orderId) {
        // Fetch verified order details from PayPal
        const details = await getPayPalOrderDetails(orderId).catch(() => null);
        const amountUsd = details?.amountUsd || parseFloat(resource.amount?.value || "0");
        const userId = details?.userId || resource.custom_id;

        if (amountUsd > 0) {
          const existingTx = await db.transaction.findFirst({
            where: {
              note: {
                contains: orderId,
              },
            },
          });

          if (!existingTx) {
            let user = null;
            if (userId) {
              user = await db.user.findFirst({
                where: {
                  OR: [
                    { id: userId },
                    { id: { contains: userId } },
                  ],
                },
              });
            }

            if (!user) {
              user = await db.user.findFirst({
                where: { role: { in: ["ADVERTISER", "ADMIN"] } },
                orderBy: { updatedAt: "desc" },
              });
            }

            if (user) {
              await db.$transaction([
                db.user.update({
                  where: { id: user.id },
                  data: { balance: { increment: amountUsd } },
                }),
                db.transaction.create({
                  data: {
                    userId: user.id,
                    type: "TOPUP",
                    amount: amountUsd,
                    note: `Funds added via PayPal Webhook (${orderId})`,
                  },
                }),
                db.notification.create({
                  data: {
                    userId: user.id,
                    type: "PAYMENT",
                    title: "Balance Topped Up (PayPal Webhook)",
                    body: `$${amountUsd.toFixed(2)} USD was added to your wallet.`,
                    link: "/advertiser/balance",
                  },
                }),
              ]);
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("PayPal Webhook Error:", err);
    return NextResponse.json({ error: err.message || "PayPal Webhook processing error" }, { status: 500 });
  }
}
