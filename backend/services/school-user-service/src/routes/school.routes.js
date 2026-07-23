import express from "express";
import { auth } from "@vidyaconnect/shared";
import { getCurrentSchool } from "../controllers/school.controller.js";

const router = express.Router();

router.get("/me", auth, getCurrentSchool);

export default router;