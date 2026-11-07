import axios from "axios";
import Constants from "expo-constants";

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "http://localhost:3001/api";
const baseUrl = configuredBaseUrl.replace(/\/+$/, "");

console.info(`Using API base URL: ${baseUrl}`);

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