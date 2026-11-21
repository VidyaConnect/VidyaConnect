import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import {
  getMe,
  getMyClass,
  getMyChildrenClasses,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.get("/me/class", auth, rbac(["TEACHER"]), getMyClass);
router.get("/me/children-classes", auth, rbac(["PARENT"]), getMyChildrenClasses);

export default router;