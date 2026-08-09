import express from "express";
import { auth } from "@vidyaconnect/shared";
import { getMe } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", auth, getMe);

export default router;
