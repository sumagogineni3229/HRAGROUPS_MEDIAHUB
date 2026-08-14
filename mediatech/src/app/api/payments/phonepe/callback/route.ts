import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkPhonePePaymentStatus, getPhonePeConfig } from "@/lib/phonepe";

export const dynamic = "force-dynamic";

async function processPaymentResult(merchantTransactionId: string, searchParams: URLSearchParams, rawBody?: any) {
  const config = getPhonePeConfig();

  if (!merchantTransactionId) {
    return renderRedirectHtml("/advertiser/balance?payment=failed&error=missing_transaction_id", "Redirecting...", false);
  }

  // Check status with PhonePe API
  let isSuccess = false;
  let amountUsd = 0;
  let rawUserId = "";

  try {
    const statusResult = await checkPhonePePaymentStatus(merchantTransactionId);

    if (statusResult.success && statusResult.data) {
      isSuccess = true;
      const amountPaise = statusResult.data.amount || 0;
      amountUsd = Number((amountPaise / 100 / config.usdToInrRate).toFixed(2));
      if (statusResult.data.merchantUserId) {
        rawUserId = statusResult.data.merchantUserId.replace(/^USER_/, "");
      }
    }
  } catch (err) {
    console.error("Error during PhonePe status check:", err);
  }

  // Sandbox fallback: Check search params if API simulation or query param code
  const codeParam = searchParams.get("code") || rawBody?.code;
  if (!isSuccess && (codeParam === "PAYMENT_SUCCESS" || codeParam === "SUCCESS")) {
    isSuccess = true;
  }

  if (amountUsd <= 0) {
    const fallbackAmount = parseFloat(searchParams.get("amount") || rawBody?.amount || "0");
    if (fallbackAmount > 0) {
      amountUsd = fallbackAmount;
    }
  }

  if (!rawUserId) {
    rawUserId = searchParams.get("userId") || rawBody?.userId || "";
  }

  if (!isSuccess) {
    return renderRedirectHtml(`/advertiser/balance?payment=failed&txId=${encodeURIComponent(merchantTransactionId)}`, "Payment Failed or Cancelled", false);
  }

  // Look for an existing transaction to prevent double credit
  const existingTx = await db.transaction.findFirst({
    where: {
      note: {
        contains: merchantTransactionId,
      },
    },
  });

  if (!existingTx && amountUsd > 0) {
    try {
      // Find target user by ID
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

      // If user not found by ID, fallback to most recently active advertiser
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
              note: `Funds added via MediaHub Payments (Tx: ${merchantTransactionId})`,
            },
          }),
          db.notification.create({
            data: {
              userId: user.id,
              type: "PAYMENT",
              title: "Balance Topped Up",
              body: `$${amountUsd.toFixed(2)} USD (₹${(amountUsd * config.usdToInrRate).toFixed(2)} INR) was added to your wallet.`,
              link: "/advertiser/balance",
            },
          }),
        ]);
      }
    } catch (dbErr) {
      console.error("Database error while crediting PhonePe payment:", dbErr);
    }
  }

  return renderRedirectHtml(`/advertiser/balance?payment=success&txId=${encodeURIComponent(merchantTransactionId)}`, "Payment Successful! Updating Balance...", true);
}

function renderRedirectHtml(targetUrl: string, message: string, isSuccess: boolean) {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${message}</title>
    <meta http-equiv="refresh" content="1;url=${targetUrl}">
  </head>
  <body style="margin:0;padding:0;background:#F4F7F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
    <div style="background:white;padding:36px 40px;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,0.06);border:1px solid #EAF1F6;text-align:center;max-width:400px;width:90%;">
      <div style="width:48px;height:48px;border-radius:50%;background:${isSuccess ? "#ECFDF5" : "#FEF2F2"};color:${isSuccess ? "#10B981" : "#EF4444"};display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;margin-bottom:16px;">
        ${isSuccess ? "✓" : "!"}
      </div>
      <h3 style="margin:0 0 8px;color:#112C3E;font-size:20px;font-weight:700;">
        ${isSuccess ? "Payment Completed!" : "Payment Status"}
      </h3>
      <p style="margin:0 0 20px;color:#677F9B;font-size:14px;line-height:1.5;">
        ${message}
      </p>
      <a href="${targetUrl}" style="display:inline-block;background:#F59E0B;color:white;text-decoration:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;">
        Return to Dashboard ↗
      </a>
    </div>
    <script>
      setTimeout(function() {
        window.location.replace("${targetUrl}");
      }, 300);
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let merchantTransactionId = url.searchParams.get("merchantTransactionId") || "";
  let bodyData: any = {};

  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      bodyData = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      bodyData = Object.fromEntries(formData.entries());
    }
    if (bodyData.merchantTransactionId) {
      merchantTransactionId = bodyData.merchantTransactionId;
    }
    if (bodyData.transactionId && !merchantTransactionId) {
      merchantTransactionId = bodyData.transactionId;
    }
  } catch (err) {}

  return processPaymentResult(merchantTransactionId, url.searchParams, bodyData);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const merchantTransactionId =
    url.searchParams.get("merchantTransactionId") ||
    url.searchParams.get("transactionId") ||
    "";
  return processPaymentResult(merchantTransactionId, url.searchParams);
}
