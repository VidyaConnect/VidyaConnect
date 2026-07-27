import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as attendanceController from "../controllers/attendance.controller.js";

const router = Router();

router.get(
  "/summary",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN"]),
  attendanceController.getSummary
);

router.get(
  "/roster",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN"]),
  attendanceController.getRoster
);

router.post(
  "/roster/:studentId",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN"]),
  attendanceController.markStudent
);

router.get(
  "/admin/overview",
  auth,
  rbac(["SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attendanceController.getAdminOverview
);

router.get(
  "/admin/classes/:classId/roster",
  auth,
  rbac(["SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attendanceController.getAdminClassRoster
);

router.get(
  "/parent/alert",
  auth,
  rbac(["PARENT"]),
  attendanceController.getParentAlert
);

router.post(
  "/absence/reason",
  auth,
  rbac(["PARENT"]),
  attendanceController.submitAbsenceReason
);

router.post(
  "/absence/document",
  auth,
  rbac(["PARENT"]),
  attendanceController.linkDocument
);

router.get(
  "/history/:studentId",
  auth,
  rbac(["PARENT", "TEACHER", "SCHOOL_ADMIN"]),
  attendanceController.getHistory
);

export default router;