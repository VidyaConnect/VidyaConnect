import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as assignmentController from "../controllers/assignment.controller.js";

const router = Router();
const teachersOnly = [auth, rbac(["TEACHER"])];

router.get("/", ...teachersOnly, assignmentController.listAssignments);
router.get("/:assignmentId", ...teachersOnly, assignmentController.getAssignment);
router.post("/", ...teachersOnly, assignmentController.createAssignment);
router.patch("/:assignmentId/students/:studentId/status", ...teachersOnly, assignmentController.updateStudentStatus);
router.patch("/:assignmentId", ...teachersOnly, assignmentController.updateAssignment);
router.post("/:assignmentId/publish", ...teachersOnly, assignmentController.publishAssignment);
router.delete("/:assignmentId", ...teachersOnly, assignmentController.deleteAssignment);
router.patch("/:assignmentId/status", ...teachersOnly, assignmentController.updateStudentStatus);

export default router;
