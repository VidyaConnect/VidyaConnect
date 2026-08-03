import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import {
  createAnnouncement,
  getParentAnnouncements,
  getParentAnnouncementById,
  markAnnouncementAsViewed,
} from "../controllers/announcement.controller.js";

const router = express.Router();

router.post("/", auth, rbac(["SUPER_ADMIN", "SCHOOL_ADMIN"]), createAnnouncement);

router.get("/", auth, rbac(["PARENT"]), getParentAnnouncements);
router.get("/:id", auth, rbac(["PARENT"]), getParentAnnouncementById);
router.post("/:id/view", auth, rbac(["PARENT"]), markAnnouncementAsViewed);

export default router;
