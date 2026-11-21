import axios from "axios";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  console.warn("EXPO_PUBLIC_API_BASE_URL is not set. API calls will fail.");
}

export const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Call this after login (with the token) and after logout (with null)
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}