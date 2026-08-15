import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { initiatePhonePePayment } from "@/lib/phonepe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, phone, note } = await req.json();
    const amountUsd = parseFloat(amount);

    if (isNaN(amountUsd) || amountUsd < 5) {
      return NextResponse.json({ error: "Minimum top-up amount is $5.00 USD" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/api/payments/phonepe/callback?userId=${encodeURIComponent(session.user.id)}&amount=${amountUsd}`;
    const callbackUrl = `${baseUrl}/api/payments/phonepe/webhook`;

    const result = await initiatePhonePePayment({
      userId: session.user.id,
      amountUsd,
      redirectUrl,
      callbackUrl,
      userPhone: phone,
      note,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("PhonePe initiation API error:", err);
    return NextResponse.json({ error: err.message || "Failed to initiate PhonePe payment" }, { status: 400 });
  }
}
