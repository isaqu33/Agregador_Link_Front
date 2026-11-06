import { defineConfig } from "@playwright/test";

// E2E runs against a stack that is already up (front on 3071, API on 3070):
//   docker compose up (API) + docker compose up (front), then `npm run test:e2e`.
export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  expect: { timeout: 30_000 }, // o modo dev compila cada rota na primeira visita
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3071",
    trace: "retain-on-failure",
    locale: "pt-BR",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium", channel: process.env.CI ? undefined : "chrome" } },
  ],
});
