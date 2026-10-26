// src/services/apiClient.ts
import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// These requests must never carry a token or trigger a refresh
const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/register/school-admin",
  "/auth/register/parent",
];

function isPublic(url?: string) {
  return PUBLIC_PATHS.some((path) => url?.includes(path));
}

// 1. Attach the login token to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && !isPublic(config.url)) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

// 2. If the token has expired, get a new one once and repeat the request
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    // Plain axios, so this call does not go through the interceptors again
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    const data = response.data.data;
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  } catch {
    return null; // refresh token expired or revoked
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isPublic(original.url)
    ) {
      original._retried = true;
      refreshing = refreshing ?? refreshAccessToken().finally(() => (refreshing = null));
      const newToken = await refreshing;

      if (newToken) {
        original.headers.set("Authorization", `Bearer ${newToken}`);
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;