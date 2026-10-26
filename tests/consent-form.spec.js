
import { test, expect } from "@playwright/test";

test("Consent Form Service health check", async ({ request }) => {
  const response = await request.get("http://localhost:3005/health");

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.service).toBe("consent-form-service");
  expect(body.status).toBe("UP");
});

test("Consent Forms API rejects requests without authorization", async ({ request }) => {
  const response = await request.get(
    "http://localhost:3005/api/consent-forms"
  );

  expect(response.status()).toBe(401);

  const body = await response.json();

  expect(body.success).toBe(false);
  expect(body.message).toBe("No authorization header provided");
});

test("Unknown consent form endpoint returns 404", async ({ request }) => {
  const response = await request.get(
    "http://localhost:3005/api/consent-forms/unknown-route/test"
  );

  expect(response.status()).toBe(404);

  const body = await response.text();
  expect(body).toContain("Cannot GET /api/consent-forms/unknown-route/test");
});

test("Unsupported HTTP method returns 404", async ({ request }) => {
  const response = await request.put(
    "http://localhost:3005/api/consent-forms"
  );

  expect(response.status()).toBe(404);

  const body = await response.text();
  expect(body).toContain("Cannot PUT /api/consent-forms");
});
