import axios from "axios";
import Constants from "expo-constants";

const baseUrl =
  Constants.manifest?.extra?.apiBaseUrl ||
  process.env.API_BASE_URL ||
  "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});
