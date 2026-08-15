import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkPhonePePaymentStatus, getPhonePeConfig } from "@/lib/phonepe";

export const dynamic = "force-dynamic";

async function processPaymentResult(merchantOrderId: string, searchParams: URLSearchParams, rawBody?: any) {
  const config = getPhonePeConfig();

  if (!merchantOrderId) {
    return renderRedirectHtml("/advertiser/balance?payment=failed&error=missing_transaction_id", "Payment Failed - Missing Transaction ID", false);
  }

  // Strict server-side status verification using PhonePe V2 Status API
  let isSuccess = false;
  let amountUsd = 0;
  let targetUserId = "";

  try {
    const statusResult = await checkPhonePePaymentStatus(merchantOrderId);

    if (statusResult.success) {
      isSuccess = true;
      const amountPaise = statusResult.amount || statusResult.data?.amount || 0;
      
      // Calculate USD amount from paise or metaInfo
      if (statusResult.data?.metaInfo?.amountUsd) {
        amountUsd = parseFloat(statusResult.data.metaInfo.amountUsd);
      } else if (amountPaise > 0) {
        amountUsd = Number((amountPaise / 100 / config.usdToInrRate).toFixed(2));
      }

      if (statusResult.data?.metaInfo?.userId) {
        targetUserId = statusResult.data.metaInfo.userId;
      } else if (statusResult.data?.merchantUserId) {
        targetUserId = statusResult.data.merchantUserId.replace(/^USER_/, "");
      }
    } else {
      console.warn("PhonePe V2 Status Verification did not succeed:", {
        merchantOrderId,
        state: statusResult.state,
        message: statusResult.message,
      });
    }
  } catch (err) {
    console.error("Error during PhonePe V2 status verification:", err);
  }

  // Fallback to URL searchParams for target user if not in status metaInfo
  if (!targetUserId) {
    targetUserId = searchParams.get("userId") || rawBody?.userId || "";
  }

  // If amount was not extracted from status response, fallback to param amount only if verified success
  if (isSuccess && amountUsd <= 0) {
    const paramAmount = parseFloat(searchParams.get("amount") || rawBody?.amount || "0");
    if (paramAmount > 0) {
      amountUsd = paramAmount;
    }
  }

  if (!isSuccess) {
    return renderRedirectHtml(
      `/advertiser/balance?payment=failed&txId=${encodeURIComponent(merchantOrderId)}`,
      "Payment Failed or Incomplete. If debited, please contact support with your Transaction ID.",
      false
    );
  }

  // Look for an existing transaction to ensure idempotency and prevent duplicate credits
  const existingTx = await db.transaction.findFirst({
    where: {
      note: {
        contains: merchantOrderId,
      },
    },
  });

  if (!existingTx && amountUsd > 0) {
    try {
      let user = null;
      if (targetUserId) {
        user = await db.user.findFirst({
          where: {
            OR: [
              { id: targetUserId },
              { id: { contains: targetUserId } },
            ],
          },
        });
      }

      // If user not found by explicit ID, fallback to active advertiser
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
              body: `$${amountUsd.toFixed(2)} USD (₹${(amountUsd * config.usdToInrRate).toFixed(2)} INR) was credited to your wallet.`,
              link: "/advertiser/balance",
            },
          }),
        ]);
      }
    } catch (dbErr) {
      console.error("Database error while crediting PhonePe payment:", dbErr);
    }
  }

  return renderRedirectHtml(
    `/advertiser/balance?payment=success&txId=${encodeURIComponent(merchantOrderId)}`,
    "Payment Successful! Your balance has been updated.",
    true
  );
}

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
      <a href="${targetUrl}" style="display:inline-block;background:${isSuccess ? "#10B981" : "#F59E0B"};color:white;text-decoration:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;">
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

export async function POST(req: Request) {
  const url = new URL(req.url);
  let merchantOrderId =
    url.searchParams.get("merchantOrderId") ||
    url.searchParams.get("merchantTransactionId") ||
    url.searchParams.get("transactionId") ||
    url.searchParams.get("orderId") ||
    url.searchParams.get("id") ||
    "";
  let bodyData: any = {};

  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      bodyData = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      bodyData = Object.fromEntries(formData.entries());
    }
    if (bodyData.merchantOrderId) {
      merchantOrderId = bodyData.merchantOrderId;
    } else if (bodyData.merchantTransactionId) {
      merchantOrderId = bodyData.merchantTransactionId;
    } else if (bodyData.transactionId) {
      merchantOrderId = bodyData.transactionId;
    } else if (bodyData.orderId) {
      merchantOrderId = bodyData.orderId;
    }
  } catch (err) {}

  console.log("PhonePe Callback POST received:", { merchantOrderId, searchParams: Object.fromEntries(url.searchParams.entries()), bodyData });
  return processPaymentResult(merchantOrderId, url.searchParams, bodyData);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const merchantOrderId =
    url.searchParams.get("merchantOrderId") ||
    url.searchParams.get("merchantTransactionId") ||
    url.searchParams.get("transactionId") ||
    url.searchParams.get("orderId") ||
    url.searchParams.get("id") ||
    "";
  console.log("PhonePe Callback GET received:", { merchantOrderId, searchParams: Object.fromEntries(url.searchParams.entries()) });
  return processPaymentResult(merchantOrderId, url.searchParams);
}
