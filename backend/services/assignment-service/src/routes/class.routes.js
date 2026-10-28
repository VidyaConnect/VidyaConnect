import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { getTeacherClasses } from "../controllers/class.controller.js";

const router = Router();
router.get("/", auth, rbac(["TEACHER"]), getTeacherClasses);
export default router;
