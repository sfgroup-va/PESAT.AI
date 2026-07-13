// Server-only PayPal helpers. Never import this file into client components.

export const PAYPAL_API_BASE = "https://api-m.paypal.com";

export type PayPalOrder = {
  id: string;
  status: string;
  links?: Array<{ rel: string; href: string; method?: string }>;
};

export type PayPalCapture = {
  id: string;
  status: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount?: { currency_code: string; value: string };
      }>;
    };
    amount?: { currency_code: string; value: string };
    payee?: { email_address?: string };
  }>;
  payer?: {
    email_address?: string;
  };
  payment_source?: unknown;
};

export function getPayPalCredentials(): { clientId: string; secret: string } | null {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() || "";
  const secret = process.env.PAYPAL_SECRET?.trim() || "";
  if (!clientId || !secret) return null;
  return { clientId, secret };
}

export function paypalAuthHeader(clientId: string, secret: string): string {
  const token = Buffer.from(`${clientId}:${secret}`).toString("base64");
  return `Basic ${token}`;
}

export async function paypalRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
    clientId: string;
    secret: string;
  }
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
  const { method = "POST", body, clientId, secret } = options;
  const url = `${PAYPAL_API_BASE}${path}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: paypalAuthHeader(clientId, secret),
        "Accept": "application/json",
        "Prefer": "return=representation"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as unknown) : null;

    if (!response.ok) {
      const errorMessage = extractPayPalError(data) || `PayPal returned ${response.status}`;
      return { ok: false, status: response.status, message: errorMessage };
    }

    return { ok: true, data: data as T };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 500, message: `PayPal request failed: ${message}` };
  }
}

function extractPayPalError(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;
  const message = obj.message;
  if (typeof message === "string") return message;
  const details = obj.details;
  if (Array.isArray(details)) {
    const first = details[0] as { description?: string; issue?: string } | undefined;
    if (first?.description) return first.description;
    if (first?.issue) return first.issue;
  }
  return null;
}

export async function createPayPalOrder(
  clientId: string,
  secret: string,
  {
    amount,
    currency = "USD",
    description,
    payeeEmail,
    brandName,
    returnUrl,
    cancelUrl
  }: {
    amount: string; // formatted value, e.g. "500.00"
    currency?: string;
    description?: string;
    payeeEmail?: string;
    brandName?: string;
    returnUrl?: string;
    cancelUrl?: string;
  }
): Promise<{ ok: true; order: PayPalOrder } | { ok: false; status: number; message: string }> {
  const purchaseUnit: Record<string, unknown> = {
    amount: {
      currency_code: currency,
      value: amount
    }
  };
  if (description) purchaseUnit.description = description;
  if (payeeEmail) purchaseUnit.payee = { email_address: payeeEmail };

  const body: Record<string, unknown> = {
    intent: "CAPTURE",
    purchase_units: [purchaseUnit]
  };

  if (brandName || returnUrl || cancelUrl) {
    body.application_context = {
      brand_name: brandName || "Pesat.AI",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      ...(returnUrl ? { return_url: returnUrl } : {}),
      ...(cancelUrl ? { cancel_url: cancelUrl } : {})
    };
  }

  const result = await paypalRequest<PayPalOrder>("/v2/checkout/orders", {
    body,
    clientId,
    secret
  });

  if (!result.ok) return result;
  return { ok: true, order: result.data };
}

export async function capturePayPalOrder(
  clientId: string,
  secret: string,
  orderId: string
): Promise<{ ok: true; capture: PayPalCapture } | { ok: false; status: number; message: string }> {
  const result = await paypalRequest<PayPalCapture>(`/v2/checkout/orders/${orderId}/capture`, {
    clientId,
    secret
  });
  if (!result.ok) return result;
  return { ok: true, capture: result.data };
}
