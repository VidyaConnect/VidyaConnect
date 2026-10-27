import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { getMe, getMyClass, getMyClasses } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.get("/me/class", auth, rbac(["TEACHER"]), getMyClass);
router.get("/me/classes", auth, rbac(["TEACHER"]), getMyClasses);

export default router;
