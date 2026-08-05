#!/bin/bash
awslocal s3 mb s3://vidyaconnect-files-local --region ap-southeast-1
awslocal s3api put-bucket-cors --bucket vidyaconnect-files-local --cors-configuration '{
  "CORSRules": [{
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "AllowedHeaders": ["*"]
  }]
}'
echo "Bucket vidyaconnect-files-local created successfully."