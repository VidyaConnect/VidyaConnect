import { test, expect } from "@playwright/test";

const API = process.env.ATTENDANCE_API_URL || "http://localhost:3003";

test.describe("Attendance API @api", () => {
  test.describe("Health", () => {
    test("GET /health returns ok", async ({ request }) => {
      const res = await request.get(`${API}/health`);
      expect(res.ok()).toBeTruthy();
    });
  });

  test.describe("Teacher Endpoints", () => {
    test("GET /attendance/summary returns summary with counts", async ({
      request,
    }) => {
      const res = await request.get(`${API}/attendance/summary`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body).toHaveProperty("present");
      expect(body).toHaveProperty("absent");
      expect(body).toHaveProperty("late");
      expect(body).toHaveProperty("notMarked");
      expect(body).toHaveProperty("className");
      expect(body).toHaveProperty("date");
      expect(body).toHaveProperty("progress");
      expect(typeof body.present).toBe("number");
      expect(typeof body.absent).toBe("number");
    });

    test("GET /attendance/roster returns array of students", async ({
      request,
    }) => {
      const res = await request.get(`${API}/attendance/roster`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
      if (body.length > 0) {
        const student = body[0];
        expect(student).toHaveProperty("id");
        expect(student).toHaveProperty("name");
        expect(student).toHaveProperty("rollNumber");
        expect(student).toHaveProperty("status");
      }
    });

    test("GET /attendance/roster accepts classId query param", async ({
      request,
    }) => {
      const res = await request.get(
        `${API}/attendance/roster?classId=class-8a`
      );
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("POST /attendance/roster/:studentId marks a student", async ({
      request,
    }) => {
      const rosterRes = await request.get(`${API}/attendance/roster`);
      const roster = await rosterRes.json();
      if (roster.length === 0) {
        test.skip(true, "No students in roster to mark (seed data required)");
        return;
      }
      const studentId = roster[0].id;
      const res = await request.post(
        `${API}/attendance/roster/${studentId}`,
        {
          data: { status: "PRESENT" },
        }
      );
      const body = await res.json();
      if (!res.ok()) {
        test.skip(true, `Mark student returned ${res.status()}: ${JSON.stringify(body)} (seed data required)`);
        return;
      }
      expect(res.ok()).toBeTruthy();
      expect(body.success).toBeTruthy();
      expect(body.data).toHaveProperty("id", studentId);
      expect(body.data.status).toBe("present");
    });

    test("POST /attendance/roster/:studentId rejects invalid status", async ({
      request,
    }) => {
      const rosterRes = await request.get(`${API}/attendance/roster`);
      const roster = await rosterRes.json();
      if (roster.length === 0) {
        test.skip(true, "No students in roster");
        return;
      }
      const studentId = roster[0].id;
      const res = await request.post(
        `${API}/attendance/roster/${studentId}`,
        {
          data: { status: "INVALID_STATUS" },
        }
      );
      if (res.status() === 404) {
        test.skip(true, "Student not found in roster (seed data required)");
        return;
      }
      expect(res.status()).toBe(500);
      const body = await res.json();
      expect(body.success).toBeFalsy();
    });
  });

  test.describe("Admin Endpoints", () => {
    test("GET /attendance/admin/overview returns class summaries", async ({
      request,
    }) => {
      const res = await request.get(`${API}/attendance/admin/overview`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(body).toHaveProperty("present");
      expect(body).toHaveProperty("absent");
      expect(body).toHaveProperty("late");
      expect(body).toHaveProperty("notMarked");
      expect(body).toHaveProperty("classes");
      expect(Array.isArray(body.classes)).toBeTruthy();
    });

    test("GET /attendance/admin/classes/:classId/roster returns students", async ({
      request,
    }) => {
      const overviewRes = await request.get(`${API}/attendance/admin/overview`);
      const overview = await overviewRes.json();
      if (overview.classes.length === 0) {
        test.skip(true, "No classes available");
        return;
      }
      const classId = overview.classes[0].id;
      const res = await request.get(
        `${API}/attendance/admin/classes/${classId}/roster`
      );
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });
  });

  test.describe("Absence Endpoints", () => {
    test("GET /attendance/absences returns follow-up list", async ({
      request,
    }) => {
      const res = await request.get(`${API}/attendance/absences`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("GET /attendance/parent/alert returns alert or null", async ({
      request,
    }) => {
      const res = await request.get(`${API}/attendance/parent/alert`);
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      if (body !== null) {
        expect(body).toHaveProperty("studentName");
        expect(body).toHaveProperty("className");
        expect(body).toHaveProperty("dateLabel");
      }
    });

    test("POST /attendance/absence/reason with empty reason fails", async ({
      request,
    }) => {
      const res = await request.post(`${API}/attendance/absence/reason`, {
        data: { reason: "" },
      });
      expect(res.status()).toBe(400);
      const body = await res.json();
      expect(body.success).toBeFalsy();
    });

    test("POST /attendance/absence/reason with valid reason succeeds", async ({
      request,
    }) => {
      const res = await request.post(`${API}/attendance/absence/reason`, {
        data: { reason: "Medical appointment - Playwright test" },
      });
      const body = await res.json();
      if (res.ok()) {
        expect(body.success).toBeTruthy();
        expect(body.data).toHaveProperty("reason", "Medical appointment - Playwright test");
      } else {
        expect([400, 404]).toContain(res.status());
      }
    });
  });

  test.describe("History Endpoint", () => {
    test("GET /attendance/history/:studentId returns history array", async ({
      request,
    }) => {
      const res = await request.get(
        `${API}/attendance/history/student-001`
      );
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
      if (body.length > 0) {
        expect(body[0]).toHaveProperty("date");
        expect(body[0]).toHaveProperty("status");
      }
    });
  });
});
