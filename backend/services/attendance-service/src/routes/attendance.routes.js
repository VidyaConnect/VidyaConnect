import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as attendanceController from "../controllers/attendance.controller.js";

const router = Router();

router.post(
  "/",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attendanceController.markAttendance
);

router.get(
  "/class/:classId",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attendanceController.getAttendanceByClass
);

router.get(
  "/student/:studentId",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "PARENT", "STUDENT", "SUPER_ADMIN"]),
  attendanceController.getStudentAttendance
);

router.post(
  "/absence-response",
  auth,
  rbac(["PARENT", "SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attendanceController.submitAbsenceResponse
);

router.get(
  "/absence-response/:studentId",
  auth,
  rbac(["PARENT", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attendanceController.getAbsenceResponses
);

export default router;
