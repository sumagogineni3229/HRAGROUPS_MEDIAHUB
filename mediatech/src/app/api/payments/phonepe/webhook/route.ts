import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { generateChecksum, getPhonePeConfig } from "@/lib/phonepe";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "PhonePe Webhook endpoint is active." });
}

export async function POST(req: Request) {
  const config = getPhonePeConfig();
  const rawBody = await req.text();
  const headersList = await headers();
  const xVerify = headersList.get("x-verify");

  try {
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = { response: rawBody };
    }

    const base64Response = payload.response;
    if (!base64Response) {
      return NextResponse.json({ error: "Missing response payload" }, { status: 400 });
    }

    // Verify SHA256 checksum if X-VERIFY header is present
    if (xVerify) {
      const expectedChecksum = generateChecksum(base64Response, "", config.saltKey, config.saltIndex);
      if (xVerify !== expectedChecksum && config.env === "PRODUCTION") {
        console.error("Invalid PhonePe webhook signature:", { received: xVerify, expected: expectedChecksum });
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const decodedString = Buffer.from(base64Response, "base64").toString("utf-8");
    const data = JSON.parse(decodedString);

    if (data.success && data.code === "PAYMENT_SUCCESS") {
      const paymentData = data.data;
      const merchantTransactionId = paymentData.merchantTransactionId;
      const amountPaise = paymentData.amount || 0;
      const amountUsd = Number((amountPaise / 100 / config.usdToInrRate).toFixed(2));
      const merchantUserId = paymentData.merchantUserId; // e.g. "USER_..."
      const rawUserId = merchantUserId ? merchantUserId.replace(/^USER_/, "") : "";

      // Check if transaction was already processed
      const existingTx = await db.transaction.findFirst({
        where: {
          note: {
            contains: merchantTransactionId,
          },
        },
      });

      if (!existingTx && amountUsd > 0) {
        // Find user by matching ID
        const user = await db.user.findFirst({
          where: {
            id: {
              contains: rawUserId,
            },
          },
        });

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
                note: `Funds added via PhonePe Webhook (Tx: ${merchantTransactionId})`,
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
    console.error("PhonePe Webhook processing error:", err);
    return NextResponse.json({ error: err.message || "Webhook processing error" }, { status: 500 });
  }
}
