const baseUrl = process.argv[2] || "http://127.0.0.1:3000";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: response.status, body, headers: Object.fromEntries(response.headers.entries()), text };
}

const home = await request("/");
const robots = await request("/robots.txt");
const sitemap = await request("/sitemap.xml");
const health = await request("/api/health");
const validSession = await request("/api/session", {
  method: "POST",
  body: JSON.stringify({
    answers: {
      mainChallenges: ["revenue"]
    }
  })
});
const invalidSession = await request("/api/session", {
  method: "POST",
  body: "{"
});
const validResult = await request("/api/result", {
  method: "POST",
  body: JSON.stringify({
    answers: {
      mainChallenges: ["revenue"],
      detailChallenges: ["follow_up"],
      impactLevel: "revenue",
      adoptionStyle: "dfy",
      detailNote: "Lead banyak masuk dari WhatsApp."
    },
    contact: {
      companyName: "Test Co",
      name: "Tester",
      wa: "+628123456789"
    }
  })
});
const invalidResult = await request("/api/result", {
  method: "POST",
  body: JSON.stringify({
    answers: {
      mainChallenges: ["fake_cluster"],
      detailChallenges: [],
      impactLevel: "bad",
      adoptionStyle: "bad"
    }
  })
});
const invalidResultJson = await request("/api/result", {
  method: "POST",
  body: "{"
});
// When DB is connected, the shared result session should be retrievable (200).
// When DB is missing, /api/result/[id] returns 503.
const shareResultUnavailable = await request(`/api/result/${validResult.body?.sessionId || "00000000-0000-0000-0000-000000000000"}`);
const validEvent = await request("/api/event", {
  method: "POST",
  body: JSON.stringify({
    type: "screen_view",
    screen: "s1",
    metadata: {
      source: "smoke-test",
      selectedCount: 1,
      ignoredNested: { value: true }
    }
  })
});
const invalidEvent = await request("/api/event", {
  method: "POST",
  body: JSON.stringify({
    type: "bad",
    screen: "unknown_screen"
  })
});
const invalidDiscovery = await request("/api/discovery", {
  method: "POST",
  body: JSON.stringify({
    companyName: "",
    name: "",
    wa: ""
  })
});
const invalidDiscoveryJson = await request("/api/discovery", {
  method: "POST",
  body: "{"
});
const invalidDiscoveryWa = await request("/api/discovery", {
  method: "POST",
  body: JSON.stringify({
    companyName: "Test Co",
    name: "Tester",
    wa: "123",
    employeeCount: "10-50",
    yearlyRevenue: "1-5 miliar"
  })
});
const unauthorizedAdmin = await request("/api/admin/summary", {
  method: "POST",
  body: JSON.stringify({ password: "wrong-password" })
});
const validDiscovery = await request("/api/discovery", {
  method: "POST",
  body: JSON.stringify({
    companyName: "Test Co",
    name: "Tester",
    wa: "+628123456789",
    employeeCount: "10-50",
    yearlyRevenue: "1-5 miliar",
    summary: validResult.body?.headline || "Smoke test"
  })
});
const discoveryUrl = typeof validDiscovery.body?.whatsappUrl === "string" ? new URL(validDiscovery.body.whatsappUrl) : null;
const discoveryText = discoveryUrl?.searchParams.get("text") || "";

const result = {
  baseUrl,
  homeOk: home.status === 200,
  securityHeadersOk:
    home.headers["x-content-type-options"] === "nosniff" &&
    home.headers["x-frame-options"] === "DENY" &&
    home.headers["referrer-policy"] === "strict-origin-when-cross-origin" &&
    typeof home.headers["permissions-policy"] === "string" &&
    home.headers["permissions-policy"].includes("camera=()") &&
    home.headers["permissions-policy"].includes("microphone=()"),
  robotsOk: robots.status === 200 && typeof robots.text === "string" && robots.text.includes("Disallow: /admin") && robots.text.includes("Sitemap:"),
  sitemapOk: sitemap.status === 200 && typeof sitemap.text === "string" && sitemap.text.includes("<loc>https://pesat.ai"),
  healthOk: health.status === 200 && health.body?.ok === true,
  healthReadyFlagOk: typeof health.body?.ready === "boolean",
  healthEnvShapeOk:
    typeof health.body?.env?.openai === "boolean" &&
    typeof health.body?.env?.database === "boolean" &&
    typeof health.body?.env?.adminPassword === "boolean" &&
    typeof health.body?.env?.openaiModel === "string" &&
    typeof health.body?.env?.siteUrl === "string",
  healthBlockersShapeOk: Array.isArray(health.body?.blockers),
  validSessionOk: validSession.status === 200 && typeof validSession.body?.sessionId === "string",
  invalidSessionRejected: invalidSession.status === 400,
  validResultOk: validResult.status === 200 && validResult.body?.solutions?.length >= 3 && validResult.body?.solutions?.length <= 4,
  invalidResultRejected: invalidResult.status === 400,
  invalidResultJsonRejected: invalidResultJson.status === 400,
  shareResultUnavailableOk: [200, 404, 503].includes(shareResultUnavailable.status),
  validEventOk: validEvent.status === 200,
  invalidEventRejected: invalidEvent.status === 400,
  invalidDiscoveryRejected: invalidDiscovery.status === 400,
  invalidDiscoveryJsonRejected: invalidDiscoveryJson.status === 400,
  invalidDiscoveryWaRejected: invalidDiscoveryWa.status === 400,
  unauthorizedAdminRejected: unauthorizedAdmin.status === 401,
  validDiscoveryOk: validDiscovery.status === 200 && typeof validDiscovery.body?.whatsappUrl === "string",
  discoveryWhatsappTargetOk: discoveryUrl?.origin === "https://wa.me" && discoveryUrl.pathname === "/6281290401240",
  discoveryWhatsappMessageOk: discoveryText.includes("Halo Pesat.AI") && discoveryText.includes("Perusahaan: Test Co") && discoveryText.includes("Nama: Tester") && discoveryText.includes("WA: +628123456789") && discoveryText.includes(validResult.body?.headline || "Smoke test"),
  persisted: {
    result: Boolean(validResult.body?.persisted),
    discovery: Boolean(validDiscovery.body?.persisted)
  },
  llmFallback: Boolean(validResult.body?.llmFallback)
};

const ok =
  result.healthOk &&
  result.homeOk &&
  result.securityHeadersOk &&
  result.robotsOk &&
  result.sitemapOk &&
  result.healthReadyFlagOk &&
  result.healthEnvShapeOk &&
  result.healthBlockersShapeOk &&
  result.validSessionOk &&
  result.invalidSessionRejected &&
  result.validResultOk &&
  result.invalidResultRejected &&
  result.invalidResultJsonRejected &&
  result.shareResultUnavailableOk &&
  result.validEventOk &&
  result.invalidEventRejected &&
  result.invalidDiscoveryRejected &&
  result.invalidDiscoveryJsonRejected &&
  result.invalidDiscoveryWaRejected &&
  result.unauthorizedAdminRejected &&
  result.validDiscoveryOk &&
  result.discoveryWhatsappTargetOk &&
  result.discoveryWhatsappMessageOk;

if (!ok) {
  console.error(
    JSON.stringify(
      {
        ok,
        result,
        responses: {
          health,
          home: { status: home.status, headers: home.headers },
          robots: { status: robots.status, text: robots.text },
          sitemap: { status: sitemap.status, text: sitemap.text },
          validSession,
          invalidSession,
          validResult,
          invalidResult,
          invalidResultJson,
          shareResultUnavailable,
          validEvent,
          invalidEvent,
          invalidDiscovery,
          invalidDiscoveryJson,
          invalidDiscoveryWa,
          unauthorizedAdmin,
          validDiscovery
        }
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log(JSON.stringify({ ok, ...result }, null, 2));
