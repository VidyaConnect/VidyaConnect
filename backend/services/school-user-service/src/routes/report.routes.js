// backend/services/school-user-service/src/routes/report.routes.js
import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { systemSummary } from "../controllers/report.controller.js";

const router = express.Router();

// Platform-wide numbers: super admin only
router.get("/system-summary", auth, rbac(["ADMIN"]), systemSummary);

export default router;
