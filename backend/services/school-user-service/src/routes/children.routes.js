import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import upload from "../middleware/upload.middleware.js";
import * as controller from "../controllers/linkRequest.controller.js";

const router = Router();

const uploadDocument = (req, res, next) =>
  upload.single("document")(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum size is 5MB."
        : err.message || "Invalid upload.";
    res.status(400).json({ success: false, message });
  });

// Parent
router.post("/link-requests", auth, rbac(["PARENT"]), uploadDocument, controller.create);
router.get("/link-requests", auth, rbac(["PARENT"]), controller.listMine);
router.get("/", auth, rbac(["PARENT"]), controller.listChildren);

// Teacher, school admin, admin (declare /pending before the :id routes)
const reviewers = rbac(["TEACHER", "SCHOOL_ADMIN", "ADMIN"]);
router.get("/link-requests/pending", auth, reviewers, controller.pending);
router.get("/link-requests/:id/document", auth, reviewers, controller.document);
router.patch("/link-requests/:id/approve", auth, reviewers, controller.approve);
router.patch("/link-requests/:id/reject", auth, reviewers, controller.reject);
router.patch("/link-requests/:id/revert", auth, reviewers, controller.revert);

export default router;