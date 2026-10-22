"use client";

import { useState } from "react";
import { uploadFile as uploadStoredFile } from "../services/fileApi";

interface UseFileUploadReturn {
  uploadFile: (file: File, purpose?: string, scope?: "system") => Promise<{ fileId: string }>;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  async function uploadFile(file: File, purpose?: string, scope?: "system"): Promise<{ fileId: string }> {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const uploaded = await uploadStoredFile(file, purpose, (value) => {
        setProgress(Math.round(value * 0.9));
      }, scope);
      setProgress(95);
      setProgress(100);
      return { fileId: uploaded.fileId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadFile, isUploading, error, progress };
}
