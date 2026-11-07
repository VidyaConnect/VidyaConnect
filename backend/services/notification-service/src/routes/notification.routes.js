import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import {
  createAnnouncementNotifications,
  getNotifications,
  markNotificationRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", auth, rbac(["ADMIN", "SCHOOL_ADMIN", "TEACHER", "PARENT", "STUDENT"]), getNotifications);
router.patch("/:id/read", auth, rbac(["ADMIN", "SCHOOL_ADMIN", "TEACHER", "PARENT", "STUDENT"]), markNotificationRead);
router.post("/internal/announcement", createAnnouncementNotifications);

export default router;
