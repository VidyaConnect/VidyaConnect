import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3.js";

export async function testS3Connection(req, res) {
  try {
    const result = await s3Client.send(new ListBucketsCommand({}));
    res.json({ status: "connected", buckets: result.Buckets });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
}