import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import { getMe, getMyClass } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.get("/me/class", auth, rbac(["TEACHER"]), getMyClass);

export default router;