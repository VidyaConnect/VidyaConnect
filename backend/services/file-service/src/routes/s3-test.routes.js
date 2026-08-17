import express from "express";
import { testS3Connection } from "../controllers/s3-test.controller.js";

const router = express.Router();

router.get("/", testS3Connection);

export default router;