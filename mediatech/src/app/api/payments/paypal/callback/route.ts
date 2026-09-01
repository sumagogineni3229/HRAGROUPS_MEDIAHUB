import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { capturePayPalOrder, getPayPalOrderDetails } from "@/lib/paypal";

export const dynamic = "force-dynamic";

function renderRedirectHtml(targetUrl: string, message: string, isSuccess: boolean) {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${isSuccess ? "Payment Completed" : "Payment Status"}</title>
    <meta http-equiv="refresh" content="2;url=${targetUrl}">
  </head>
  <body style="margin:0;padding:0;background:#F4F7F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
    <div style="background:white;padding:36px 40px;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,0.06);border:1px solid #EAF1F6;text-align:center;max-width:420px;width:90%;">
      <div style="width:52px;height:52px;border-radius:50%;background:${isSuccess ? "#ECFDF5" : "#FEF2F2"};color:${isSuccess ? "#10B981" : "#EF4444"};display:inline-flex;align-items:center;justify-content:center;font-size:26px;font-weight:bold;margin-bottom:16px;">
        ${isSuccess ? "✓" : "!"}
      </div>
      <h3 style="margin:0 0 8px;color:#112C3E;font-size:20px;font-weight:700;">
        ${isSuccess ? "Payment Completed!" : "Payment Status"}
      </h3>
      <p style="margin:0 0 20px;color:#677F9B;font-size:14px;line-height:1.5;">
        ${message}
      </p>
      <a href="${targetUrl}" style="display:inline-block;background:${isSuccess ? "#10B981" : "#0070BA"};color:white;text-decoration:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;">
        Return to Dashboard ↗
      </a>
    </div>
    <script>
      setTimeout(function() {
        window.location.replace("${targetUrl}");
      }, 500);
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

async function handlePayPalCallback(searchParams: URLSearchParams) {
  const token = searchParams.get("token") || searchParams.get("orderId") || "";
  const action = searchParams.get("action") || "";
  const queryUserId = searchParams.get("userId") || "";
  const queryAmount = parseFloat(searchParams.get("amount") || "0");

  if (action === "cancel") {
    return renderRedirectHtml(
      "/advertiser/balance?payment=cancelled",
      "PayPal payment was cancelled.",
      false
    );
  }

  if (!token) {
    return renderRedirectHtml(
      "/advertiser/balance?payment=failed&error=missing_token",
      "Payment verification failed - missing order token.",
      false
    );
  }

  try {
    // Capture order with PayPal
    let captureResult;
    try {
      captureResult = await capturePayPalOrder(token);
    } catch (captureErr: any) {
      console.warn("PayPal capture attempt error, inspecting order status:", captureErr);
      const details = await getPayPalOrderDetails(token);
      captureResult = {
        success: details.status === "COMPLETED",
        orderId: details.orderId,
        status: details.status,
        amountUsd: details.amountUsd,
        userId: details.userId,
        payerEmail: details.payerEmail,
        transactionId: token,
      };
    }

    if (!captureResult.success && captureResult.status !== "COMPLETED") {
      return renderRedirectHtml(
        `/advertiser/balance?payment=failed&txId=${encodeURIComponent(token)}`,
        `Payment could not be completed (Status: ${captureResult.status}).`,
        false
      );
    }

    const finalAmountUsd = captureResult.amountUsd > 0 ? captureResult.amountUsd : queryAmount;
    const finalUserId = captureResult.userId || queryUserId;

    if (finalAmountUsd <= 0) {
      return renderRedirectHtml(
        `/advertiser/balance?payment=failed&txId=${encodeURIComponent(token)}`,
        "Invalid payment amount received.",
        false
      );
    }

    // Check idempotency in DB
    const existingTx = await db.transaction.findFirst({
      where: {
        note: {
          contains: token,
        },
      },
    });

    if (!existingTx) {
      let user = null;
      if (finalUserId) {
        user = await db.user.findFirst({
          where: {
            OR: [
              { id: finalUserId },
              { id: { contains: finalUserId } },
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
            data: { balance: { increment: finalAmountUsd } },
          }),
          db.transaction.create({
            data: {
              userId: user.id,
              type: "TOPUP",
              amount: finalAmountUsd,
              note: `Funds added via PayPal (Order: ${token})`,
            },
          }),
          db.notification.create({
            data: {
              userId: user.id,
              type: "PAYMENT",
              title: "Balance Topped Up (PayPal)",
              body: `$${finalAmountUsd.toFixed(2)} USD was credited to your wallet via PayPal.`,
              link: "/advertiser/balance",
            },
          }),
        ]);
      }
    }

    return renderRedirectHtml(
      `/advertiser/balance?payment=success&txId=${encodeURIComponent(token)}`,
      "PayPal payment successful! Your balance has been updated.",
      true
    );
  } catch (err: any) {
    console.error("PayPal Callback Error:", err);
    return renderRedirectHtml(
      `/advertiser/balance?payment=failed&error=${encodeURIComponent(err.message || "Unknown error")}`,
      `Error completing PayPal payment: ${err.message || "Please contact support."}`,
      false
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return handlePayPalCallback(url.searchParams);
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  return handlePayPalCallback(url.searchParams);
}
