import apiClient from "@/services/apiClient";
import type {
  UploadUrlResponse,
  DownloadUrlResponse,
  ConfirmUploadResponse,
  FileMetadata,
} from "../types/file.types";

const FILE_API_BASE = process.env.NEXT_PUBLIC_FILE_API_URL || "http://localhost:3006";

export async function getUploadUrl(payload: {
  fileName: string;
  contentType: string;
  fileSize: number;
  purpose?: string;
}): Promise<UploadUrlResponse> {
  const response = await apiClient.post(`${FILE_API_BASE}/files/upload-url`, payload);
  return response.data.data;
}

export async function confirmUpload(fileId: string): Promise<ConfirmUploadResponse> {
  const response = await apiClient.post(`${FILE_API_BASE}/files/${fileId}/confirm`);
  return response.data.data;
}

export async function getDownloadUrl(fileId: string): Promise<DownloadUrlResponse> {
  const response = await apiClient.get(`${FILE_API_BASE}/files/${fileId}/download-url`);
  return response.data.data;
}

export async function getFileMetadata(fileId: string): Promise<FileMetadata> {
  const response = await apiClient.get(`${FILE_API_BASE}/files/${fileId}`);
  return response.data.data;
}

export async function listFiles(params?: {
  purpose?: string;
  limit?: number;
  offset?: number;
}): Promise<FileMetadata[]> {
  const response = await apiClient.get(`${FILE_API_BASE}/files/`, { params });
  return response.data.data;
}
