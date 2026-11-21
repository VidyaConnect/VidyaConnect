import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", service: "calendar-service" });
});

export default router;