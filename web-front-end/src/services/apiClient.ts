// src/services/apiClient.ts
import axios from "axios";

// ASSUMPTION — CONFIRM WITH SEHAJINIE / TEAM:
// - Exact base URL (might change if backend splits into separate services)
// - Whether this should come from an environment variable (recommended: .env.local)
const API_BASE_URL = "http://localhost:5000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // ASSUMPTION: if backend uses httpOnly cookies for the JWT, uncomment this
  // so the browser sends/receives cookies automatically:
  // withCredentials: true,
});

export default apiClient;