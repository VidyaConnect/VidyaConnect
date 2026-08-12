import express  from "express";

import { getDownloadUrl } from "../controllers/download.controller.js";

const router = express.Router();

router.get("/download-url", getDownloadUrl);

export default router;