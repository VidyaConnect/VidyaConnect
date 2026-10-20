import express from "express";
import { auth } from "@vidyaconnect/shared";
import { getMyProfileController } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/me", auth, getMyProfileController);

export default router;
