import { spawnSync } from "node:child_process";

// Use the right npm binary per platform (npm.cmd on Windows, npm on Linux/macOS CI).
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const checks = [
  { name: "test:admin-summary", command: [npm, "run", "test:admin-summary"], json: true },
  { name: "test:rule-engine", command: [npm, "run", "test:rule-engine"], json: true },
  { name: "test:result-normalizer", command: [npm, "run", "test:result-normalizer"], json: true },
  { name: "test:solutions", command: [npm, "run", "test:solutions"], json: true },
  { name: "test:supabase-schema", command: [npm, "run", "test:supabase-schema"], json: true },
  { name: "test:transition-facts", command: [npm, "run", "test:transition-facts"], json: true },
  { name: "test:validation", command: [npm, "run", "test:validation"], json: true },
  { name: "audit:requirements", command: [npm, "run", "audit:requirements"], json: true },
  { name: "lint", command: [npm, "run", "lint"], json: false },
  { name: "typecheck", command: [npm, "run", "typecheck"], json: false }
];

function runCommand(command, args) {
  if (process.platform === "win32") {
    return spawnSync("cmd.exe", ["/d", "/s", "/c", [command, ...args].join(" ")], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: false
    });
  }

  return spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: false
  });
}

function parseJsonOutput(output) {
  const start = output.indexOf("{");
  if (start < 0) return null;
  return JSON.parse(output.slice(start));
}

const results = [];

for (const check of checks) {
  const [command, ...args] = check.command;
  const result = runCommand(command, args);

  const output = `${result.stdout || ""}\n${result.stderr || ""}`.trim();
  let parsed = null;
  if (check.json && result.status === 0) {
    parsed = parseJsonOutput(output);
  }

  results.push({
    name: check.name,
    ok: result.status === 0,
    exitCode: result.status,
    error: result.error?.message,
    evidence: parsed
  });

  if (result.status !== 0) {
    break;
  }
}

const failed = results.filter((result) => !result.ok).map((result) => result.name);
const requirementAudit = results.find((result) => result.name === "audit:requirements")?.evidence || null;

const payload = {
  ok: failed.length === 0 && Boolean(requirementAudit?.ok),
  failed,
  checks: results,
  requirementAudit
};

console.log(JSON.stringify(payload, null, 2));

if (!payload.ok) {
  process.exit(1);
}
