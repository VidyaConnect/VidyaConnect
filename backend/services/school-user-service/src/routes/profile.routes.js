import express from "express";
import { auth } from "@vidyaconnect/shared";
import {
  getMyProfileController,
  updateMyProfileController,
  changeMyPasswordController,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/me", auth, getMyProfileController);
router.put("/me", auth, updateMyProfileController);
router.put("/change-password", auth, changeMyPasswordController);

export default router;
