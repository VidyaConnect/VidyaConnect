// school-user-service/src/routes/school.routes.js
import express from "express";
import { auth } from "@vidyaconnect/shared";
import { getCurrentSchool, register } from "../controllers/school.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/me", auth, getCurrentSchool);

router.post("/register", (req, res, next) => {
  upload.single("verificationDoc")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message === "File too large"
          ? "File must be under 10MB."
          : err.message,
      });
    }
    next();
  });
}, register);

export default router;