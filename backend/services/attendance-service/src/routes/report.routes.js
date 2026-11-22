// backend/services/attendance-service/src/routes/report.routes.js
import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { schoolSummary } from "../controllers/report.controller.js";

const router = Router();

router.get("/school-summary", auth, rbac(["SCHOOL_ADMIN"]), schoolSummary);

export default router;
