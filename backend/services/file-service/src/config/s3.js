import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  endpoint: process.env.AWS_ENDPOINT, // e.g. http://localstack:4566 inside docker network
  forcePathStyle: true, // required for LocalStack
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});

export const S3_BUCKET = process.env.S3_BUCKET_NAME || "vidyaconnect-files-local";