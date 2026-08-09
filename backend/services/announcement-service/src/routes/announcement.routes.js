import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import {
  createAnnouncement,
  getParentAnnouncements,
  getParentAnnouncementById,
  markAnnouncementAsViewed,
  getStudentAnnouncements,
  getStudentAnnouncementById,
  markStudentAnnouncementAsViewed,
} from "../controllers/announcement.controller.js";

const router = express.Router();

router.post("/", auth, rbac(["SUPER_ADMIN", "SCHOOL_ADMIN"]), createAnnouncement);

// TEMP: auth disabled for demo — DO NOT COMMIT
router.get("/", getParentAnnouncements);

// TEMP: auth disabled for local testing — DO NOT COMMIT
// NOTE: these must stay ABOVE "/:id" below, or Express will match "student-feed" as an :id value
router.get("/student-feed", getStudentAnnouncements);
router.get("/student-feed/:id", getStudentAnnouncementById);
router.post("/student-feed/:id/view", markStudentAnnouncementAsViewed);

router.get("/:id", auth, rbac(["PARENT"]), getParentAnnouncementById);
router.post("/:id/view", auth, rbac(["PARENT"]), markAnnouncementAsViewed);

export default router;
