#!/bin/bash
# LocalStack initialization script
# This runs when the LocalStack container starts

BUCKET_NAME="${FILES_BUCKET:-vidyaconnect-files}"
echo "Creating S3 bucket: ${BUCKET_NAME}"
aws --endpoint-url=http://localhost:4566 s3 mb "s3://${BUCKET_NAME}" --region ap-southeast-1 2>/dev/null || true

cat >/tmp/vidyaconnect-s3-cors.json <<'EOF'
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:3000"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
EOF
aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors \
  --bucket "${BUCKET_NAME}" \
  --cors-configuration file:///tmp/vidyaconnect-s3-cors.json \
  --region ap-southeast-1

echo "S3 bucket ${BUCKET_NAME} is ready for browser uploads"
