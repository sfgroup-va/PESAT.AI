// Server-only deposit data access. Import only inside API routes / server components.
import { getDb, missingDbMessage } from "@/lib/db";
import { sanitizeDepositPage, sanitizeDepositTransaction, type DepositPageConfig, type DepositTransaction } from "@/lib/deposit";

export { missingDbMessage };

export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: 503 | 404 | 500; message: string };

export async function loadDepositConfig(): Promise<DbResult<DepositPageConfig>> {
  const sql = getDb();
  if (!sql) {
    return { ok: false, status: 503, message: missingDbMessage() };
  }
  try {
    const rows = (await sql`
      SELECT id, title, subtitle, amount, paypal_email, paypal_client_id, is_published, created_at, updated_at
      FROM deposit_pages
      WHERE id = 'default'
      LIMIT 1
    `) as unknown as Array<Record<string, unknown>>;
    const row = rows[0];
    if (!row) {
      return { ok: false, status: 404, message: "Deposit page config not found." };
    }
    const config = sanitizeDepositPage(row);
    if (!config.isPublished) {
      return { ok: false, status: 404, message: "Deposit page is not published." };
    }
    return { ok: true, data: config };
  } catch (err: unknown) {
    return { ok: false, status: 500, message: String(err) };
  }
}

export async function loadDepositConfigAdmin(): Promise<DbResult<DepositPageConfig>> {
  const sql = getDb();
  if (!sql) {
    return { ok: false, status: 503, message: missingDbMessage() };
  }
  try {
    const rows = (await sql`
      SELECT id, title, subtitle, amount, paypal_email, paypal_client_id, is_published, created_at, updated_at
      FROM deposit_pages
      WHERE id = 'default'
      LIMIT 1
    `) as unknown as Array<Record<string, unknown>>;
    const row = rows[0];
    if (!row) {
      return { ok: false, status: 404, message: "Deposit page config not found." };
    }
    return { ok: true, data: sanitizeDepositPage(row) };
  } catch (err: unknown) {
    return { ok: false, status: 500, message: String(err) };
  }
}

export async function updateDepositConfig(input: {
  title?: string;
  subtitle?: string;
  amount?: number;
  paypalEmail?: string;
  paypalClientId?: string;
  isPublished?: boolean;
}): Promise<DbResult<DepositPageConfig>> {
  const sql = getDb();
  if (!sql) {
    return { ok: false, status: 503, message: missingDbMessage() };
  }
  try {
    await sql`
      UPDATE deposit_pages
      SET
        title = COALESCE(${input.title ?? null}, title),
        subtitle = COALESCE(${input.subtitle ?? null}, subtitle),
        amount = COALESCE(${input.amount ?? null}, amount),
        paypal_email = COALESCE(${input.paypalEmail ?? null}, paypal_email),
        paypal_client_id = COALESCE(${input.paypalClientId ?? null}, paypal_client_id),
        is_published = COALESCE(${input.isPublished ?? null}, is_published)
      WHERE id = 'default'
    `;
    return loadDepositConfigAdmin();
  } catch (err: unknown) {
    return { ok: false, status: 500, message: String(err) };
  }
}

export async function toggleDepositPublished(): Promise<DbResult<DepositPageConfig>> {
  const sql = getDb();
  if (!sql) {
    return { ok: false, status: 503, message: missingDbMessage() };
  }
  try {
    await sql`
      UPDATE deposit_pages
      SET is_published = NOT is_published
      WHERE id = 'default'
    `;
    return loadDepositConfigAdmin();
  } catch (err: unknown) {
    return { ok: false, status: 500, message: String(err) };
  }
}

export async function insertDepositTransaction(order: {
  paypalOrderId: string;
  amount: number;
  currency?: string;
  status?: "CREATED" | "CAPTURED" | "FAILED";
  rawData?: unknown;
}): Promise<DbResult<DepositTransaction>> {
  const sql = getDb();
  if (!sql) {
    return { ok: false, status: 503, message: missingDbMessage() };
  }
  try {
    const rows = (await sql`
      INSERT INTO deposit_transactions (paypal_order_id, amount, currency, status, raw_data)
      VALUES (
        ${order.paypalOrderId},
        ${order.amount},
        ${order.currency ?? "USD"},
        ${order.status ?? "CREATED"},
        ${JSON.stringify(order.rawData ?? {})}::jsonb
      )
      ON CONFLICT (paypal_order_id) DO UPDATE
      SET amount = EXCLUDED.amount,
          currency = EXCLUDED.currency,
          status = EXCLUDED.status,
          raw_data = EXCLUDED.raw_data,
          updated_at = now()
      RETURNING *
    `) as unknown as Array<Record<string, unknown>>;
    return { ok: true, data: sanitizeDepositTransaction(rows[0]) };
  } catch (err: unknown) {
    return { ok: false, status: 500, message: String(err) };
  }
}

export async function updateDepositTransaction(
  paypalOrderId: string,
  patch: {
    status?: "CREATED" | "CAPTURED" | "FAILED";
    payerEmail?: string | null;
    rawData?: unknown;
  }
): Promise<DbResult<DepositTransaction>> {
  const sql = getDb();
  if (!sql) {
    return { ok: false, status: 503, message: missingDbMessage() };
  }
  try {
    const rows = (await sql`
      UPDATE deposit_transactions
      SET
        status = COALESCE(${patch.status ?? null}, status),
        payer_email = COALESCE(${patch.payerEmail ?? null}, payer_email),
        raw_data = COALESCE(${patch.rawData ? JSON.stringify(patch.rawData) : null}::jsonb, raw_data),
        updated_at = now()
      WHERE paypal_order_id = ${paypalOrderId}
      RETURNING *
    `) as unknown as Array<Record<string, unknown>>;
    if (!rows[0]) {
      return { ok: false, status: 404, message: "Transaction not found." };
    }
    return { ok: true, data: sanitizeDepositTransaction(rows[0]) };
  } catch (err: unknown) {
    return { ok: false, status: 500, message: String(err) };
  }
}

export async function listDepositTransactions(): Promise<DbResult<DepositTransaction[]>> {
  const sql = getDb();
  if (!sql) {
    return { ok: false, status: 503, message: missingDbMessage() };
  }
  try {
    const rows = (await sql`
      SELECT *
      FROM deposit_transactions
      ORDER BY created_at DESC
      LIMIT 500
    `) as unknown as Array<Record<string, unknown>>;
    return { ok: true, data: rows.map(sanitizeDepositTransaction) };
  } catch (err: unknown) {
    return { ok: false, status: 500, message: String(err) };
  }
}
