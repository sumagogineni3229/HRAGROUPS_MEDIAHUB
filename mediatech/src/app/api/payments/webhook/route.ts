import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  checkPhonePePaymentStatus,
  getPhonePeConfig,
  verifyPhonePeWebhookSignature,
} from "@/lib/phonepe";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Payments Webhook endpoint is active." });
}

export async function POST(req: Request) {
  const config = getPhonePeConfig();
  const rawBody = await req.text();
  const headersList = await headers();
  const signatureHeader =
    headersList.get("x-phonepe-checksum-signature") ||
    headersList.get("x-verify");

  try {
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = { response: rawBody };
    }

    let eventData = payload;
    if (payload.response && typeof payload.response === "string") {
      try {
        const decoded = Buffer.from(payload.response, "base64").toString("utf-8");
        eventData = JSON.parse(decoded);
      } catch {
        eventData = payload;
      }
    }

    // Check if this is a PayPal webhook event
    if (eventData.event_type && (eventData.event_type.startsWith("PAYMENT.") || eventData.event_type.startsWith("CHECKOUT."))) {
      const { getPayPalOrderDetails } = await import("@/lib/paypal");
      const resource = eventData.resource || {};
      const orderId =
        resource.supplementary_data?.related_ids?.order_id ||
        resource.id;

      if (orderId) {
        const details = await getPayPalOrderDetails(orderId).catch(() => null);
        const amountUsd = details?.amountUsd || parseFloat(resource.amount?.value || "0");
        const userId = details?.userId || resource.custom_id;

        if (amountUsd > 0) {
          const existingTx = await db.transaction.findFirst({
            where: { note: { contains: orderId } },
          });

          if (!existingTx) {
            let user = null;
            if (userId) {
              user = await db.user.findFirst({
                where: { OR: [{ id: userId }, { id: { contains: userId } }] },
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
      return NextResponse.json({ received: true });
    }

    if (signatureHeader && config.clientSecret) {
      const isValid = verifyPhonePeWebhookSignature(rawBody, signatureHeader);
      if (!isValid && config.env === "PRODUCTION") {
        console.warn("Invalid webhook signature received.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const dataObj = eventData.payload || eventData.data || eventData;
    const merchantOrderId =
      dataObj.merchantOrderId ||
      dataObj.merchantTransactionId ||
      dataObj.orderId;

    if (!merchantOrderId) {
      return NextResponse.json({ error: "Missing merchantOrderId in webhook" }, { status: 400 });
    }

    const statusResult = await checkPhonePePaymentStatus(merchantOrderId);

    if (statusResult.success) {
      const amountPaise =
        statusResult.amount ||
        dataObj.amount ||
        (dataObj.paymentDetails && dataObj.paymentDetails[0]?.amount) ||
        0;

      let amountUsd = 0;
      if (statusResult.data?.metaInfo?.amountUsd) {
        amountUsd = parseFloat(statusResult.data.metaInfo.amountUsd);
      } else if (amountPaise > 0) {
        amountUsd = Number((amountPaise / 100 / config.usdToInrRate).toFixed(2));
      }

      let rawUserId =
        statusResult.data?.metaInfo?.userId ||
        (statusResult.data?.merchantUserId ? statusResult.data.merchantUserId.replace(/^USER_/, "") : "") ||
        (dataObj.merchantUserId ? dataObj.merchantUserId.replace(/^USER_/, "") : "");

      const existingTx = await db.transaction.findFirst({
        where: {
          note: {
            contains: merchantOrderId,
          },
        },
      });

      if (!existingTx && amountUsd > 0) {
        let user = null;
        if (rawUserId) {
          user = await db.user.findFirst({
            where: {
              OR: [
                { id: rawUserId },
                { id: { contains: rawUserId } },
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
                note: `Funds added via PhonePe V2 (Tx: ${merchantOrderId})`,
              },
            }),
            db.notification.create({
              data: {
                userId: user.id,
                type: "PAYMENT",
                title: "Balance Topped Up (PhonePe)",
                body: `$${amountUsd.toFixed(2)} USD (₹${(amountUsd * config.usdToInrRate).toFixed(2)} INR) was added to your wallet.`,
                link: "/advertiser/balance",
              },
            }),
          ]);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Payments webhook error:", err);
    return NextResponse.json({ error: err.message || "Webhook processing error" }, { status: 500 });
  }
}
