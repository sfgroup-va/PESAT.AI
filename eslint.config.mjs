import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "node_modules/**",
      ".browser-sessions/**",
      ".git-broken-v2/**",
      ".playwright-mcp/**",
      ".superpowers/**",
      ".mimosa/**",
      ".zcode/**",
      ".claude/**",
      "backups/**",
      "**/*.log"
    ]
  },
  ...nextVitals,
  ...nextTs
];

export default eslintConfig;
