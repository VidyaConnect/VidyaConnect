import { defineConfig, devices } from "@playwright/test";

const ATTENDANCE_API = process.env.ATTENDANCE_API_URL || "http://localhost:3003";
const WEB_URL = process.env.WEB_URL || "http://localhost:3009";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: ATTENDANCE_API,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "api-tests",
      testMatch: /.*-api\.spec\.ts/,
      use: {
        baseURL: ATTENDANCE_API,
      },
    },
    {
      name: "ui-tests",
      testMatch: /.*-ui\.spec\.ts/,
      use: {
        baseURL: WEB_URL,
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
