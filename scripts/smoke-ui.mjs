import { chromium } from "playwright";
import fs from "node:fs";

const baseUrl = process.argv[2] || "http://localhost:3000";
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, acceptDownloads: true });
const page = await context.newPage();
const errors = [];
let pdfDownloadOk = false;
let pdfDownloadBytes = 0;
let resultScreenSeen = false;
let pdfExportSeen = false;
let detailTextareaSeen = false;
let shareLinkStateSeen = false;
let discoveryCtaSeen = false;
let discoveryPrefillOk = false;
let resultRecoveryCtaOk = false;

async function clickText(text) {
  await page.getByText(text, { exact: false }).click({ timeout: 15000 });
}

async function clickButton(name) {
  const button = page.getByRole("button", { name });
  await button.first().click({ timeout: 15000 });
}

page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

await page.goto(baseUrl, { waitUntil: "networkidle" });
try {
  await clickButton(/Buktikan Sendiri/i);
  await clickText("Omzet Stagnan");
  await clickButton(/Lanjut/i);
  await page.getByText("Insight singkat", { exact: false }).waitFor({ timeout: 15000 });
  await clickButton(/Lanjut/i);
  await page.getByText("Bagian mana yang paling terasa sekarang?").waitFor({ timeout: 15000 });
  await clickText("Follow-up lead lambat");
  await clickButton(/Lanjut/i);
  await page.getByText("Insight singkat", { exact: false }).waitFor({ timeout: 15000 });
  await clickButton(/Lanjut/i);
  await clickText("Revenue");
  await clickButton(/Lanjut/i);
  await clickText("DFY");
  await clickButton(/Review jawaban/i);
  await clickButton(/Sudah Pas/i);
  await page.getByPlaceholder(/Nama perusahaan/i).fill("Smoke Prefill Co");
  await page.getByPlaceholder(/Nama Anda/i).fill("Smoke Tester");
  await page.getByPlaceholder(/Nomor WhatsApp/i).fill("+628123456789");
  await clickButton(/Susun Hasil & Rencana Saya/i);
  await page.getByText("Hasil Mini Session Pesat.AI").waitFor({ timeout: 20000 });
  resultScreenSeen = true;
  pdfExportSeen = await page.getByRole("button", { name: /Export PDF/i }).isVisible();
  discoveryCtaSeen = await page.getByRole("button", { name: /Ya, Saya Mau Discovery Call/i }).isVisible();
  detailTextareaSeen = await page.getByText("Ceritakan tantangan Anda lebih detail").isVisible();
  shareLinkStateSeen = (await page.getByText("Link aktif setelah DB tersambung").isVisible().catch(() => false)) || (await page.getByText("Copy Link").isVisible().catch(() => false));
  await page.getByPlaceholder(/proses sales kami/i).fill("Smoke test: follow-up WhatsApp sering hilang setelah lead masuk.");
  await page.getByPlaceholder(/proses sales kami/i).blur();
  const [download] = await Promise.all([page.waitForEvent("download", { timeout: 30000 }), clickButton(/Export PDF/i)]);
  const downloadPath = await download.path();
  const suggestedFilename = download.suggestedFilename();
  if (downloadPath) {
    const stat = fs.statSync(downloadPath);
    pdfDownloadBytes = stat.size;
    pdfDownloadOk = suggestedFilename.endsWith(".pdf") && stat.size > 1000;
  }
  await clickButton(/Ya, Saya Mau Discovery Call/i);
  await page.getByText("Diskusikan solusi khusus", { exact: false }).waitFor({ timeout: 15000 });
  const companyValue = await page.locator('input[name="companyName"]').inputValue();
  const nameValue = await page.locator('input[name="name"]').inputValue();
  const waValue = await page.locator('input[name="wa"]').inputValue();
  discoveryPrefillOk = companyValue === "Smoke Prefill Co" && nameValue === "Smoke Tester" && waValue === "+628123456789";
  await page.goto(`${baseUrl}/result/00000000-0000-0000-0000-000000000000`, { waitUntil: "domcontentloaded" });
  await page.getByText(/Hasil tidak ditemukan|Supabase belum terhubung|Hasil mini session belum selesai/i).waitFor({ timeout: 15000 });
  resultRecoveryCtaOk = await page.getByRole("link", { name: /Kembali ke mini session/i }).isVisible();
} catch (error) {
  const bodyText = await page.locator("body").innerText().catch(() => "");
  console.error(JSON.stringify({ baseUrl, error: String(error), bodyText, consoleErrors: errors }, null, 2));
  await browser.close();
  process.exit(1);
}

const unexpectedConsoleErrors = errors.filter(
  (error) => !error.includes("Failed to load resource: the server responded with a status of 503") && !error.includes("Failed to load resource: the server responded with a status of 404")
);
const result = {
  baseUrl,
  hasResult: resultScreenSeen,
  hasDiscoveryCta: discoveryCtaSeen,
  hasPdfExport: pdfExportSeen,
  pdfDownloadOk,
  pdfDownloadBytes,
  discoveryPrefillOk,
  resultRecoveryCtaOk,
  hasDetailTextarea: detailTextareaSeen,
  shareLinkStateShown: shareLinkStateSeen,
  consoleErrors: unexpectedConsoleErrors
};

await browser.close();

if (!result.hasResult || !result.hasDiscoveryCta || !result.hasPdfExport || !result.pdfDownloadOk || !result.discoveryPrefillOk || !result.resultRecoveryCtaOk || !result.hasDetailTextarea || result.consoleErrors.length > 0) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
