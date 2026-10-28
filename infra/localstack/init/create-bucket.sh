#!/bin/bash

BUCKET_NAME="${FILES_BUCKET:-vidyaconnect-files-local}"
awslocal s3 mb "s3://${BUCKET_NAME}" --region ap-southeast-1 2>/dev/null || true
cat >/tmp/vidyaconnect-s3-cors.json <<'EOF'
{
  "CORSRules": [
    {
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedOrigins": ["http://localhost:3000"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
EOF
awslocal s3api put-bucket-cors \
  --bucket "${BUCKET_NAME}" \
  --cors-configuration file:///tmp/vidyaconnect-s3-cors.json \
  --region ap-southeast-1
echo "Bucket ${BUCKET_NAME} is ready for browser uploads."
