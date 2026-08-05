import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { createAnnouncement } from "../controllers/announcement.controller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  rbac(["SUPER_ADMIN", "SCHOOL_ADMIN"]),
  createAnnouncement
);

export default router;