import express from "express";
import { auth } from "@vidyaconnect/shared";
import { getMyProfileController, updateMyProfileController } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/me", auth, getMyProfileController);
router.put("/me", auth, updateMyProfileController);

export default router;
