import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET } from "../config/s3.js";

export const uploadFile = async (key, buffer, contentType) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return key;
};

export const downloadFile = async (key) => {
  const result = await s3Client.send(
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: key })
  );
  return { stream: result.Body, contentType: result.ContentType };
};