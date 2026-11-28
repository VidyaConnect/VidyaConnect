import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { schoolConsentSummary } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/school-summary", auth, rbac(["SCHOOL_ADMIN"]), schoolConsentSummary);

export default router;
