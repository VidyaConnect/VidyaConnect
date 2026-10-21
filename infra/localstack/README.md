# LocalStack S3 for local file storage

The local Compose stack mounts `init-aws.sh` into LocalStack's ready hooks. It creates the `vidyaconnect-files` bucket and configures CORS for browser uploads from `http://localhost:3000`.

Start or rebuild the services after changing Compose environment values:

```powershell
docker compose -f infra/docker/docker-compose.local.yml up --build -d localstack file-service web-admin
docker compose -f infra/docker/docker-compose.local.yml ps
docker compose -f infra/docker/docker-compose.local.yml logs --tail 100 localstack file-service
```

Check health and bucket state:

```powershell
Invoke-RestMethod http://localhost:3006/health
docker exec vidyaconnect-localstack awslocal s3 ls
docker exec vidyaconnect-localstack awslocal s3api get-bucket-cors --bucket vidyaconnect-files
```

The file service uses `http://localstack:4566` for its own S3 operations and signs browser URLs for `http://localhost:4566`. Keep both endpoints pointed at the same LocalStack instance. Browser uploads use `PUT`; the bucket CORS rules allow `PUT`, `GET`, and `HEAD` from the web app.

To test from a logged-in feature page, upload a small PDF/image, save the resulting `fileId` on the feature record, then request a download using that ID. Verify metadata through File Service and check that cross-school access returns `403`.
