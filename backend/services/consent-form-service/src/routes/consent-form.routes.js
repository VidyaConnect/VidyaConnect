import express from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import {
  close,
  create,
  detail,
  list,
  publish,
  respond,
  responses,
  update,
} from "../controllers/consent-form.controller.js";

const router = express.Router();
const STAFF = ["SCHOOL_ADMIN", "TEACHER"];

router.get("/", auth, rbac(STAFF), list);
router.post("/", auth, rbac(STAFF), create);
router.get("/:id", auth, rbac(STAFF), detail);
router.patch("/:id", auth, rbac(STAFF), update);
router.post("/:id/publish", auth, rbac(STAFF), publish);
router.post("/:id/close", auth, rbac(STAFF), close);
router.get("/:id/responses", auth, rbac(STAFF), responses);
router.post("/:id/response", auth, rbac(["PARENT"]), respond);

export default router;
