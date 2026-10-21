import { test, expect } from "@playwright/test";

const WEB_URL = process.env.WEB_URL || "http://localhost:3009";

test.describe("Attendance Pages - UI Smoke Test @ui", () => {
  test.use({ baseURL: WEB_URL });

  test("Landing page loads", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBeLessThan(500);
    await expect(page).toHaveTitle(/VidyaConnect/i);
  });

  test("Teacher attendance page renders", async ({ page }) => {
    const res = await page.goto("/attendance/teacher");
    expect(res?.status()).toBeLessThan(500);

    const heading = page.locator("h1, h2, [class*='heading'], [class*='title']").first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test("School admin attendance page renders", async ({ page }) => {
    const res = await page.goto("/attendance/school-admin");
    expect(res?.status()).toBeLessThan(500);

    const heading = page.locator("h1, h2, [class*='heading'], [class*='title']").first();
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test("Teacher attendance page has student roster area", async ({ page }) => {
    await page.goto("/attendance/teacher");
    await page.waitForLoadState("networkidle");

    const body = page.locator("body");
    await expect(body).toBeVisible();

    const text = await body.textContent();
    const hasAttendanceContent =
      text?.includes("Present") ||
      text?.includes("Absent") ||
      text?.includes("Attendance") ||
      text?.includes("student") ||
      text?.includes("Loading");
    expect(hasAttendanceContent).toBeTruthy();
  });

  test("Admin attendance page has overview stats", async ({ page }) => {
    await page.goto("/attendance/school-admin");
    await page.waitForLoadState("networkidle");

    const body = page.locator("body");
    await expect(body).toBeVisible();

    const text = await body.textContent();
    const hasOverviewContent =
      text?.includes("Present") ||
      text?.includes("Absent") ||
      text?.includes("Late") ||
      text?.includes("Not Marked") ||
      text?.includes("Attendance") ||
      text?.includes("Loading");
    expect(hasOverviewContent).toBeTruthy();
  });

  test("Teacher attendance page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/attendance/teacher");
    await page.waitForLoadState("networkidle");

    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("404")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("Admin attendance page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/attendance/school-admin");
    await page.waitForLoadState("networkidle");

    const criticalErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("404")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("Navigation between attendance pages works", async ({ page }) => {
    await page.goto("/attendance/teacher");
    await page.waitForLoadState("networkidle");

    await page.goto("/attendance/school-admin");
    await page.waitForLoadState("networkidle");

    const body = page.locator("body");
    const text = await body.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });
});
