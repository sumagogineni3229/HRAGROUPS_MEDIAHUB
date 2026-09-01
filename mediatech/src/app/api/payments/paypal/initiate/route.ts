import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPayPalOrder } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, note } = await req.json();
    const amountUsd = parseFloat(amount);

    if (isNaN(amountUsd) || amountUsd < 5) {
      return NextResponse.json({ error: "Minimum top-up amount is $5.00 USD" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/api/payments/paypal/callback?userId=${encodeURIComponent(session.user.id)}&amount=${amountUsd}&action=success`;
    const cancelUrl = `${baseUrl}/api/payments/paypal/callback?userId=${encodeURIComponent(session.user.id)}&amount=${amountUsd}&action=cancel`;

    const result = await createPayPalOrder({
      userId: session.user.id,
      amountUsd,
      returnUrl,
      cancelUrl,
      note: note || "MediaHub Wallet Top-up",
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("PayPal initiation API error:", err);
    return NextResponse.json({ error: err.message || "Failed to initiate PayPal payment" }, { status: 400 });
  }
}
