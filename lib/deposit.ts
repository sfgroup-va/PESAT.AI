// Deposit page model and sanitizers. Keep server/client types strict and
// never expose paypal_email (seller email) or the PayPal secret in public APIs.

export type DepositPageConfig = {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // stored in cents, e.g. 50000 = $500.00
  paypalEmail: string;
  paypalClientId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicDepositConfig = {
  title: string;
  subtitle: string;
  amount: number;
  paypalClientId: string;
};

export type DepositTransaction = {
  id: string;
  paypalOrderId: string;
  payerEmail: string | null;
  amount: number;
  currency: string;
  status: "CREATED" | "CAPTURED" | "FAILED";
  rawData: unknown;
  createdAt: string;
  updatedAt: string;
};

export type DepositPageInput = {
  title?: string;
  subtitle?: string;
  amount?: number; // cents
  paypalEmail?: string;
  paypalClientId?: string;
  isPublished?: boolean;
};

export const DEFAULT_DEPOSIT_TITLE = "Deposit untuk Memulai";
export const DEFAULT_DEPOSIT_SUBTITLE =
  "Lengkapi deposit $500 untuk memulai sesi bersama Pesat AI.";
export const DEFAULT_DEPOSIT_AMOUNT = 50000; // $500.00

export function sanitizeDepositPage(input: unknown): DepositPageConfig {
  const obj =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const rawAmount = Number(obj.amount ?? DEFAULT_DEPOSIT_AMOUNT);
  const amount = Number.isFinite(rawAmount) && rawAmount > 0 ? Math.round(rawAmount) : DEFAULT_DEPOSIT_AMOUNT;

  return {
    id: typeof obj.id === "string" && obj.id.trim() ? obj.id.trim() : "default",
    title:
      typeof obj.title === "string" && obj.title.trim()
        ? obj.title.trim().slice(0, 120)
        : DEFAULT_DEPOSIT_TITLE,
    subtitle:
      typeof obj.subtitle === "string" && obj.subtitle.trim()
        ? obj.subtitle.trim().slice(0, 320)
        : DEFAULT_DEPOSIT_SUBTITLE,
    amount,
    paypalEmail:
      typeof obj.paypal_email === "string"
        ? obj.paypal_email.trim().slice(0, 320)
        : typeof obj.paypalEmail === "string"
          ? obj.paypalEmail.trim().slice(0, 320)
          : "",
    paypalClientId:
      typeof obj.paypal_client_id === "string"
        ? obj.paypal_client_id.trim()
        : typeof obj.paypalClientId === "string"
          ? obj.paypalClientId.trim()
          : "",
    isPublished: obj.is_published === true || obj.isPublished === true,
    createdAt: typeof obj.created_at === "string" ? obj.created_at : "",
    updatedAt: typeof obj.updated_at === "string" ? obj.updated_at : ""
  };
}

export function toPublicDepositConfig(config: DepositPageConfig): PublicDepositConfig {
  return {
    title: config.title,
    subtitle: config.subtitle,
    amount: config.amount,
    paypalClientId: config.paypalClientId
  };
}

export function formatDepositAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function centsToPayPalValue(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function sanitizeDepositPageInput(body: unknown): DepositPageInput | null {
  if (typeof body !== "object" || body === null) return null;
  const obj = body as Record<string, unknown>;
  const out: DepositPageInput = {};

  if (typeof obj.title === "string") out.title = obj.title.trim().slice(0, 120);
  if (typeof obj.subtitle === "string") out.subtitle = obj.subtitle.trim().slice(0, 320);

  if (typeof obj.amount === "number") {
    const cents = Math.round(obj.amount);
    if (cents > 0) out.amount = cents;
  }

  if (typeof obj.paypalEmail === "string") {
    out.paypalEmail = obj.paypalEmail.trim().slice(0, 320);
  }
  if (typeof obj.paypalClientId === "string") {
    out.paypalClientId = obj.paypalClientId.trim();
  }
  if (typeof obj.isPublished === "boolean") {
    out.isPublished = obj.isPublished;
  }

  return out;
}

export function sanitizeDepositTransaction(row: unknown): DepositTransaction {
  const obj =
    typeof row === "object" && row !== null
      ? (row as Record<string, unknown>)
      : {};

  const statusRaw =
    typeof obj.status === "string" ? obj.status.toUpperCase() : "CREATED";
  const status: DepositTransaction["status"] =
    statusRaw === "CAPTURED" || statusRaw === "FAILED" ? statusRaw : "CREATED";

  return {
    id: typeof obj.id === "string" ? obj.id : "",
    paypalOrderId:
      typeof obj.paypal_order_id === "string"
        ? obj.paypal_order_id
        : typeof obj.paypalOrderId === "string"
          ? obj.paypalOrderId
          : "",
    payerEmail:
      typeof obj.payer_email === "string"
        ? obj.payer_email
        : typeof obj.payerEmail === "string"
          ? obj.payerEmail
          : null,
    amount: Number(obj.amount) || 0,
    currency:
      typeof obj.currency === "string" ? obj.currency.toUpperCase() : "USD",
    status,
    rawData: obj.raw_data ?? obj.rawData ?? {},
    createdAt: typeof obj.created_at === "string" ? obj.created_at : "",
    updatedAt: typeof obj.updated_at === "string" ? obj.updated_at : ""
  };
}
