import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as eventController from "../controller/event.controller.js";

const router = Router();

const ALL_ROLES = ["ADMIN", "SCHOOL_ADMIN", "TEACHER", "PARENT"];
const PUBLISHERS = ["ADMIN", "SCHOOL_ADMIN", "TEACHER"];

router.get("/events", auth, rbac(ALL_ROLES), eventController.listEvents);

router.post(
  "/events/conflicts",
  auth,
  rbac(PUBLISHERS),
  eventController.checkConflicts
);

router.post("/events", auth, rbac(PUBLISHERS), eventController.createEvent);

router.put("/events/:id", auth, rbac(PUBLISHERS), eventController.updateEvent);

router.delete(
  "/events/:id",
  auth,
  rbac(PUBLISHERS),
  eventController.deleteEvent
);

export default router;