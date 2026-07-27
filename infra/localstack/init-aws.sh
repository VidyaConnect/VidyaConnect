#!/bin/bash
# LocalStack initialization script
# This runs when the LocalStack container starts

echo "Creating S3 bucket: vidyaconnect-files"
aws --endpoint-url=http://localhost:4566 s3 mb s3://vidyaconnect-files --region ap-southeast-1

echo "S3 bucket created successfully"