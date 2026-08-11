import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { s3Client, S3_BUCKET } from "../config/s3.js";

const URL_EXPIRY_SECONDS = 300; // 5 minutes

export async function getUploadUrl(req, res) {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        error: "fileName and fileType are required",
      });
    }

    const fileExtension = fileName.includes(".")
      ? fileName.substring(fileName.lastIndexOf("."))
      : "";
    const key = `uploads/${randomUUID()}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: URL_EXPIRY_SECONDS,
    });

    return res.status(200).json({
      uploadUrl,
      key,
      expiresIn: URL_EXPIRY_SECONDS,
    });
  } catch (error) {
    console.error("Failed to generate signed upload URL:", error);
    return res.status(500).json({
      error: "Failed to generate upload URL",
    });
  }
}