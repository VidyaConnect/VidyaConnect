# Local Docker Development

## Prerequisites

- Docker Desktop installed
- Docker Compose available

## Start the environment

docker compose -f infra/docker/docker-compose.local.yml up

## Start with rebuild

docker compose -f infra/docker/docker-compose.local.yml up --build

## Stop the environment

docker compose -f infra/docker/docker-compose.local.yml down

## Check running containers

docker ps

## View logs

docker compose -f infra/docker/docker-compose.local.yml logs

## Remove containers

docker compose -f infra/docker/docker-compose.local.yml down -v

| Service | Purpose | Default Port |
|---------|---------|-------------:|
| PostgreSQL | Stores application data | 5432 |
| Keycloak | Authentication and authorization | 8080 |
| Nginx | Reverse proxy | 80 |
| LocalStack | Local AWS services (S3) | 4566 |
| Web Admin | Placeholder frontend | 3000 |
| School User Service | Backend API | 3001 |
| Announcement Service | Backend API | 3002 |
| Attendance Service | Backend API | 3003 |
| Assignment Service | Backend API | 3004 |
| Consent Form Service | Backend API | 3005 |
| File Service | Backend API | 3006 |
| Notification Service | Backend API | 3007 |
| Report Service | Backend API | 3008 |