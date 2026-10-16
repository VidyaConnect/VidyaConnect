import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
} from "../controllers/announcement.controller.js";

const router = express.Router();

const ALL_ROLES = ["ADMIN", "SCHOOL_ADMIN", "TEACHER", "PARENT", "STUDENT"];
const MANAGE_ROLES = ["ADMIN", "SCHOOL_ADMIN"];

router.post("/", auth, rbac(MANAGE_ROLES), createAnnouncement);
router.get("/", auth, rbac(ALL_ROLES), getAllAnnouncements);
router.get("/:id", auth, rbac(ALL_ROLES), getAnnouncementById);
router.put("/:id", auth, rbac(MANAGE_ROLES), updateAnnouncement);
router.delete("/:id", auth, rbac(MANAGE_ROLES), deleteAnnouncement);


export default router;