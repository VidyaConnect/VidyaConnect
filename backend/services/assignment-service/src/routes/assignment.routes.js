import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as assignmentController from "../controllers/assignment.controller.js";

const router = Router();
const teachersOnly = [auth, rbac(["TEACHER"])];

router.get("/", ...teachersOnly, assignmentController.listAssignments);
router.get("/:assignmentId", ...teachersOnly, assignmentController.getAssignment);
router.post("/", ...teachersOnly, assignmentController.createAssignment);
router.post("/:assignmentId/publish", ...teachersOnly, assignmentController.publishAssignment);
router.patch("/:assignmentId/status", ...teachersOnly, assignmentController.updateStudentStatus);

export default router;
