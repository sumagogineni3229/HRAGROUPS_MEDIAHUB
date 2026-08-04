import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Stripe Webhook endpoint is active. Use POST for webhook payloads." });
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe signatureHeader", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const metadata = session.metadata;

    if (metadata && metadata.userId && metadata.amount) {
      const userId = metadata.userId;
      const amount = parseFloat(metadata.amount);

      try {
        await db.$transaction([
          db.user.update({
            where: { id: userId },
            data: { balance: { increment: amount } },
          }),
          db.transaction.create({
            data: {
              userId,
              type: "TOPUP",
              amount,
              note: `Funds added via Credit Card (Stripe Session: ${session.id})`,
            },
          }),
        ]);

        await db.notification.create({
          data: {
            userId,
            type: "PAYMENT",
            title: "Balance topped up",
            body: `$${amount.toFixed(2)} was successfully added to your balance via Credit Card.`,
            link: "/advertiser/balance",
          },
        });
      } catch (dbErr) {
        console.error("Database update failed on Stripe webhook:", dbErr);
        return new NextResponse("Database Error", { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
