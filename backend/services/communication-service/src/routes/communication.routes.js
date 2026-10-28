import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as controller from "../controllers/communication.controller.js";

const router = Router();

router.use(auth, rbac(["PARENT", "TEACHER"]));

router.get("/threads", controller.getThread);
router.get("/threads/:id/messages", controller.listMessages);
router.post("/threads/:id/messages", controller.sendMessage);
router.post("/threads/:id/read", controller.markRead);

// No PUT, PATCH or DELETE on purpose: messages are insert-only (audit).

export default router;