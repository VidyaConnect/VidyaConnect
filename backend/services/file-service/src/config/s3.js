import { S3Client } from "@aws-sdk/client-s3";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
};
const region = process.env.AWS_REGION || "ap-southeast-1";

// File service calls use the Docker network; signed URLs use the browser-facing host.
const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
  region,
  credentials,
  forcePathStyle: true,
});

export const publicS3Client = new S3Client({
  endpoint: process.env.AWS_PUBLIC_ENDPOINT || "http://localhost:4566",
  region,
  credentials,
  forcePathStyle: true,
});

export const S3_BUCKET =
  process.env.S3_BUCKET_NAME || process.env.S3_BUCKET || "vidyaconnect-files-local";

export { s3Client };
export default s3Client;
