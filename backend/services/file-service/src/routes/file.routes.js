import { Router } from "express";
import { auth, rbac } from "@vidyaconnect/shared";
import * as fileController from "../controllers/file.controller.js";
import attachSchoolContext from "../middleware/attachSchoolContext.js";

const router = Router();

router.post(
  "/upload-url",
  auth,
  rbac(["ADMIN", "TEACHER", "SCHOOL_ADMIN", "PARENT", "SUPER_ADMIN"]),
  attachSchoolContext,
  fileController.getUploadUrl
);

router.post(
  "/:fileId/confirm",
  auth,
  rbac(["ADMIN", "TEACHER", "SCHOOL_ADMIN", "PARENT", "SUPER_ADMIN"]),
  attachSchoolContext,
  fileController.confirmUpload
);

router.get(
  "/:fileId/download-url",
  auth,
  rbac(["ADMIN", "TEACHER", "SCHOOL_ADMIN", "PARENT", "STUDENT", "SUPER_ADMIN"]),
  attachSchoolContext,
  fileController.getDownloadUrl
);

router.get(
  "/:fileId",
  auth,
  rbac(["ADMIN", "TEACHER", "SCHOOL_ADMIN", "PARENT", "STUDENT", "SUPER_ADMIN"]),
  attachSchoolContext,
  fileController.getFile
);

router.get(
  "/",
  auth,
  rbac(["ADMIN", "TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attachSchoolContext,
  fileController.listFiles
);

router.delete(
  "/:fileId",
  auth,
  rbac(["SCHOOL_ADMIN", "SUPER_ADMIN"]),
  attachSchoolContext,
  fileController.deleteFile
);

export default router;
