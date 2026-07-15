# VidyaConnect Local Development Startup Guide

This guide provides step-by-step instructions for engineers to clone, configure, and spin up the complete VidyaConnect microservices ecosystem on a local machine for development and testing.

---

## Prerequisites

Before starting, ensure you have the following software installed on your local system:

*   **Docker & Docker Compose:** To run containerized dependencies (PostgreSQL, Keycloak, Nginx, LocalStack).
*   **Git:** To clone the repository.
*   **Node.js (v18 or higher):** For running front-end and backend Node-based services locally.
*   **PostgreSQL Client (Optional):** Such as pgAdmin or DBeaver.

---

## 1. Cloning the Repository

```bash
```
git clone [https://github.com/VidyaConnect/VidyaConnect.git](https://github.com/VidyaConnect/VidyaConnect.git)
cd VidyaConnect



## 2. Environment Variables Configuration
Locate the environmental templates in the root directory or inside the respective services:

Copy .env.example to .env in the root folder.

Update the template variables to match your local setup credentials.




## 3. Launching Infrastructure Containers
To spin up the shared local infrastructure, run the following command from the repository root:


docker-compose up -d

### Verification of Services

| Service | Local URL / Port | Purpose |
| :--- | :--- | :--- |
| **Nginx Reverse Proxy** | `http://localhost:80` | Routes API requests to correct backend microservices |
| **PostgreSQL Database** | `localhost:5432` | Shared transactional database storage |
| **Keycloak IAM** | `http://localhost:8080` | Manages authentication realms, clients, and roles |
| **LocalStack** | `http://localhost:4566` | Simulates AWS S3 and SNS nodes locally |




## 4. Launching Backend Microservices
Navigate to the targeted backend microservice directory (e.g., backend/school-ops-service):

cd backend/school-ops-service
npm install
npm run dev




## 5. Launching Front-End Shells
Web Administration Portal (web-front-end)

  cd web-front-end
  npm install
  npm run dev

Access at: http://localhost:3000


Mobile App (mobile-front-end)

   cd mobile-front-end
   npm install
   npm start



