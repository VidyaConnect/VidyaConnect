import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as fileController from "../controllers/file.controller.js";

const router = Router();

router.post(
  "/upload-url",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "PARENT", "SUPER_ADMIN"]),
  fileController.getUploadUrl
);

router.post(
  "/:fileId/confirm",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "PARENT", "SUPER_ADMIN"]),
  fileController.confirmUpload
);

router.get(
  "/:fileId/download-url",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "PARENT", "STUDENT", "SUPER_ADMIN"]),
  fileController.getDownloadUrl
);

router.get(
  "/:fileId",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "PARENT", "STUDENT", "SUPER_ADMIN"]),
  fileController.getFile
);

router.get(
  "/",
  auth,
  rbac(["TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]),
  fileController.listFiles
);

router.delete(
  "/:fileId",
  auth,
  rbac(["SCHOOL_ADMIN", "SUPER_ADMIN"]),
  fileController.deleteFile
);

export default router;