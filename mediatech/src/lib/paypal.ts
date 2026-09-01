export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  env: "SANDBOX" | "PRODUCTION";
  currency: string;
  baseUrl: string;
}

export function getPayPalConfig(): PayPalConfig {
  const env = (process.env.PAYPAL_ENV || "SANDBOX").toUpperCase() as "SANDBOX" | "PRODUCTION";
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
  const currency = process.env.PAYPAL_CURRENCY || "USD";

  const baseUrl =
    env === "PRODUCTION"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  return {
    clientId,
    clientSecret,
    env,
    currency,
    baseUrl,
  };
}

let cachedPayPalToken: {
  token: string;
  expiresAt: number;
} | null = null;

/**
 * Retrieve or refresh PayPal OAuth 2.0 Access Token
 */
export async function getPayPalAuthToken(): Promise<string> {
  const config = getPayPalConfig();

  if (!config.clientId || !config.clientSecret) {
    throw new Error(
      "PayPal credentials not configured. Please provide PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in the .env file."
    );
  }

  const nowSeconds = Math.floor(Date.now() / 1000);

  if (cachedPayPalToken && cachedPayPalToken.expiresAt > nowSeconds + 60) {
    return cachedPayPalToken.token;
  }

  const authString = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authString}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal OAuth Token Error:", response.status, errorText);
    throw new Error(`PayPal authentication failed: HTTP ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const expiresIn = data.expires_in || 3600;

  if (!accessToken) {
    throw new Error("PayPal OAuth response did not contain access_token.");
  }

  cachedPayPalToken = {
    token: accessToken,
    expiresAt: nowSeconds + expiresIn,
  };

  return accessToken;
}

export interface CreatePayPalOrderParams {
  userId: string;
  amountUsd: number;
  returnUrl: string;
  cancelUrl: string;
  note?: string;
}

export interface CreatePayPalOrderResult {
  success: boolean;
  orderId: string;
  checkoutUrl: string;
  amountUsd: number;
}

/**
 * Create a PayPal V2 Checkout Order
 */
export async function createPayPalOrder(params: CreatePayPalOrderParams): Promise<CreatePayPalOrderResult> {
  const config = getPayPalConfig();
  const token = await getPayPalAuthToken();
  const formattedAmount = params.amountUsd.toFixed(2);
  const customReference = `PAYPAL_MT_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: customReference,
        description: params.note || "MediaHub Wallet Top-up",
        custom_id: params.userId,
        amount: {
          currency_code: config.currency,
          value: formattedAmount,
        },
      },
    ],
    application_context: {
      brand_name: "Media Partner Hub",
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
    },
  };

  const response = await fetch(`${config.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    console.error("PayPal Create Order Error:", response.status, data);
    throw new Error(
      (data && (data.message || data.details?.[0]?.description || data.error_description)) ||
        `PayPal order creation failed with status ${response.status}`
    );
  }

  const approveLink = Array.isArray(data.links)
    ? data.links.find((l: any) => l.rel === "approve" || l.rel === "payer-action")
    : null;

  if (!approveLink || !approveLink.href) {
    console.error("PayPal Order missing approve link:", data);
    throw new Error("PayPal API did not return an approval checkout URL.");
  }

  return {
    success: true,
    orderId: data.id,
    checkoutUrl: approveLink.href,
    amountUsd: params.amountUsd,
  };
}

export interface CapturePayPalOrderResult {
  success: boolean;
  orderId: string;
  status: string;
  amountUsd: number;
  payerEmail?: string;
  userId?: string;
  transactionId?: string;
  raw?: any;
}

/**
 * Capture an approved PayPal Order
 */
export async function capturePayPalOrder(orderId: string): Promise<CapturePayPalOrderResult> {
  const config = getPayPalConfig();
  const token = await getPayPalAuthToken();

  const response = await fetch(`${config.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    console.error("PayPal Capture Order Error:", response.status, data);
    // If order was already captured, check its status
    if (data?.details?.[0]?.issue === "ORDER_ALREADY_CAPTURED") {
      const details = await getPayPalOrderDetails(orderId);
      return {
        success: details.status === "COMPLETED",
        orderId,
        status: details.status,
        amountUsd: details.amountUsd,
        userId: details.userId,
        payerEmail: details.payerEmail,
        transactionId: orderId,
        raw: details.raw,
      };
    }

    throw new Error(
      (data && (data.message || data.details?.[0]?.description)) ||
        `PayPal capture failed with status ${response.status}`
    );
  }

  const status = (data.status || "").toUpperCase();
  const isCompleted = status === "COMPLETED";

  const captureUnit = data.purchase_units?.[0]?.payments?.captures?.[0];
  const capturedAmount = captureUnit?.amount?.value ? parseFloat(captureUnit.amount.value) : 0;
  const payerEmail = data.payer?.email_address;
  const customUserId = data.purchase_units?.[0]?.custom_id || data.purchase_units?.[0]?.reference_id;
  const transactionId = captureUnit?.id || orderId;

  return {
    success: isCompleted,
    orderId: data.id,
    status,
    amountUsd: capturedAmount,
    payerEmail,
    userId: customUserId,
    transactionId,
    raw: data,
  };
}

/**
 * Fetch status/details for a PayPal Order
 */
export async function getPayPalOrderDetails(orderId: string): Promise<{
  orderId: string;
  status: string;
  amountUsd: number;
  payerEmail?: string;
  userId?: string;
  raw?: any;
}> {
  const config = getPayPalConfig();
  const token = await getPayPalAuthToken();

  const response = await fetch(`${config.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error(
      (data && (data.message || data.details?.[0]?.description)) ||
        `Failed to fetch PayPal order details (status ${response.status})`
    );
  }

  const purchaseUnit = data.purchase_units?.[0];
  const amountUsd = purchaseUnit?.amount?.value ? parseFloat(purchaseUnit.amount.value) : 0;

  return {
    orderId: data.id,
    status: (data.status || "").toUpperCase(),
    amountUsd,
    payerEmail: data.payer?.email_address,
    userId: purchaseUnit?.custom_id,
    raw: data,
  };
}
