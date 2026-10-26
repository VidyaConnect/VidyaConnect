import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { getMe, getMyClass, getNotificationRecipients } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.get("/me/class", auth, rbac(["TEACHER"]), getMyClass);
router.get("/notification-recipients", getNotificationRecipients);

export default router;