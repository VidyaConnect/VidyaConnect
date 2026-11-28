// backend/services/report-service/src/routes/report.routes.js
import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import {
  superAdminSummary,
  schoolAdminAttendance,
  schoolAdminAccounts,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/super-admin/summary", auth, rbac(["ADMIN"]), superAdminSummary);
router.get("/school-admin/attendance", auth, rbac(["SCHOOL_ADMIN"]), schoolAdminAttendance);
router.get("/school-admin/accounts", auth, rbac(["SCHOOL_ADMIN"]), schoolAdminAccounts);

export default router;
