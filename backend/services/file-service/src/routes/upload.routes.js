import { Router } from "express";
import { getUploadUrl } from "../controllers/upload.controller.js";

const router = Router();

router.post("/upload-url", getUploadUrl);

export default router;