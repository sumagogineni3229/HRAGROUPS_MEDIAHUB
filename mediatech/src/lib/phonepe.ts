import crypto from "crypto";

export interface PhonePeConfig {
  clientId: string;
  clientSecret: string;
  clientVersion: string;
  env: "SANDBOX" | "PRODUCTION";
  usdToInrRate: number;
  authUrl: string;
  baseUrl: string;
}

export function getPhonePeConfig(): PhonePeConfig {
  const env = (process.env.PHONEPE_ENV || "SANDBOX").toUpperCase() as "SANDBOX" | "PRODUCTION";
  const clientId = process.env.PHONEPE_CLIENT_ID || "";
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET || "";
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION || "1";
  const usdToInrRate = parseFloat(process.env.PHONEPE_USD_TO_INR_RATE || "95.61");

  const authUrl =
    env === "PRODUCTION"
      ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

  const baseUrl =
    env === "PRODUCTION"
      ? "https://api.phonepe.com/apis/pg"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox";

  return {
    clientId,
    clientSecret,
    clientVersion,
    env,
    usdToInrRate,
    authUrl,
    baseUrl,
  };
}

/**
 * In-memory cache for OAuth 2.0 Access Token
 */
let cachedToken: {
  token: string;
  tokenType: string;
  expiresAt: number; // Unix timestamp in seconds
} | null = null;

/**
 * Retrieve or refresh PhonePe OAuth 2.0 Access Token
 */
export async function getPhonePeAuthToken(): Promise<string> {
  const config = getPhonePeConfig();

  if (
    !config.clientId ||
    !config.clientSecret ||
    config.clientId.includes("SANDBOX_CLIENT_ID") ||
    config.clientSecret.includes("SANDBOX_CLIENT_SECRET")
  ) {
    throw new Error(
      "PhonePe credentials not configured. Please provide your PhonePe V2 PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET in the .env file."
    );
  }

  const nowSeconds = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60-second buffer)
  if (cachedToken && cachedToken.expiresAt > nowSeconds + 60) {
    const prefix = cachedToken.tokenType || "O-Bearer";
    return `${prefix} ${cachedToken.token}`;
  }

  const params = new URLSearchParams();
  params.append("client_id", config.clientId);
  params.append("client_secret", config.clientSecret);
  params.append("client_version", config.clientVersion);
  params.append("grant_type", "client_credentials");

  const response = await fetch(config.authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PhonePe OAuth Token Error:", response.status, errorText);
    throw new Error(`PhonePe authentication failed: HTTP ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const tokenType = data.token_type || "O-Bearer";
  // PhonePe provides expires_at as epoch seconds; fallback to 1 hour if absent
  const expiresAt = data.expires_at || nowSeconds + (data.expires_in || 3600);

  if (!accessToken) {
    throw new Error("PhonePe OAuth response did not contain access_token.");
  }

  cachedToken = {
    token: accessToken,
    tokenType,
    expiresAt,
  };

  return `${tokenType} ${accessToken}`;
}

/**
 * Convert USD to INR paise (PhonePe expects amounts in Paise: 1 INR = 100 Paise)
 */
export function convertUsdToInrPaise(amountUsd: number, rate: number): { inrAmount: number; inrPaise: number } {
  const inrAmount = Number((amountUsd * rate).toFixed(2));
  const inrPaise = Math.round(inrAmount * 100);
  return { inrAmount, inrPaise };
}

export interface InitiatePaymentParams {
  userId: string;
  amountUsd: number;
  redirectUrl: string;
  callbackUrl?: string;
  userPhone?: string;
  note?: string;
}

export interface InitiatePaymentResult {
  success: boolean;
  merchantTransactionId: string;
  checkoutUrl: string;
  inrAmount: number;
  inrPaise: number;
  orderId?: string;
}

/**
 * Initiate PhonePe V2 Standard Checkout Payment
 */
export async function initiatePhonePePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
  const config = getPhonePeConfig();
  const { inrAmount, inrPaise } = convertUsdToInrPaise(params.amountUsd, config.usdToInrRate);
  const merchantOrderId = `MT_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const authHeader = await getPhonePeAuthToken();

  // Ensure redirectUrl has merchantOrderId in query parameters so the callback always knows the exact order ID
  let finalRedirectUrl = params.redirectUrl;
  if (!finalRedirectUrl.includes("merchantOrderId=")) {
    finalRedirectUrl += (finalRedirectUrl.includes("?") ? "&" : "?") + `merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
  }

  const payload = {
    merchantOrderId,
    amount: inrPaise,
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: finalRedirectUrl,
      },
    },
    metaInfo: {
      userId: params.userId,
      amountUsd: String(params.amountUsd),
      note: params.note || "MediaHub Wallet Top-up",
    },
  };

  const payUrl = `${config.baseUrl}/checkout/v2/pay`;

  const response = await fetch(payUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    console.error("PhonePe Checkout API returned error:", response.status, data);
    throw new Error(
      (data && (data.message || data.error_description || data.error)) ||
        `PhonePe initiation failed with status ${response.status}`
    );
  }

  const redirectUrl = data.redirectUrl || data.data?.redirectUrl || data.instrumentResponse?.redirectInfo?.url;

  if (!redirectUrl) {
    console.error("PhonePe V2 Checkout response missing redirectUrl:", data);
    throw new Error(data.message || "PhonePe API response did not return a valid checkout redirect URL");
  }

  return {
    success: true,
    merchantTransactionId: merchantOrderId,
    checkoutUrl: redirectUrl,
    inrAmount,
    inrPaise,
    orderId: data.orderId || data.data?.orderId,
  };
}

/**
 * Check payment status from PhonePe V2 server
 */
export async function checkPhonePePaymentStatus(merchantOrderId: string): Promise<{
  success: boolean;
  state: string;
  code?: string;
  message?: string;
  amount?: number; // amount in paise
  orderId?: string;
  merchantOrderId: string;
  data?: any;
}> {
  const config = getPhonePeConfig();
  const authHeader = await getPhonePeAuthToken();

  const statusUrl = `${config.baseUrl}/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status?details=true&errorContext=true`;

  try {
    const response = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      return {
        success: false,
        state: "FAILED",
        merchantOrderId,
        message: data?.message || `PhonePe status verification returned HTTP ${response.status}`,
        data,
      };
    }

    const state = (data.state || data.status || (data.success ? "COMPLETED" : "FAILED")).toUpperCase();
    const hasCompletedDetail = Array.isArray(data.paymentDetails) && data.paymentDetails.some((p: any) => {
      const pState = (p.state || p.status || "").toUpperCase();
      return pState === "COMPLETED" || pState === "SUCCESS";
    });

    const isCompleted =
      state === "COMPLETED" ||
      state === "SUCCESS" ||
      state === "PAYMENT_SUCCESS" ||
      hasCompletedDetail;

    const detectedAmount =
      data.amount ||
      (Array.isArray(data.paymentDetails) && data.paymentDetails[0]?.amount) ||
      0;

    return {
      success: isCompleted,
      state,
      code: state,
      message: data.message || `Order is in ${state} state`,
      amount: detectedAmount,
      orderId: data.orderId,
      merchantOrderId: data.merchantOrderId || merchantOrderId,
      data,
    };
  } catch (err: any) {
    console.error("PhonePe V2 status check network/system error:", err);
    return {
      success: false,
      state: "NETWORK_ERROR",
      merchantOrderId,
      message: err.message || "Failed to verify payment status with PhonePe server",
    };
  }
}

/**
 * Verify PhonePe Webhook Signature if HMAC header is provided
 */
export function verifyPhonePeWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const config = getPhonePeConfig();
  if (!config.clientSecret) return false;

  try {
    const hmac = crypto.createHmac("sha256", config.clientSecret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}
