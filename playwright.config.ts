import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/dispatch",
  workers: 1,
  timeout: 90_000,
  reporter: "line",
  use: { browserName: "chromium", baseURL: "http://127.0.0.1:3000" },
});