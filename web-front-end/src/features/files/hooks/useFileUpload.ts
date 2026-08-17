"use client";

import { useState } from "react";
import { getUploadUrl, confirmUpload } from "../services/fileApi";

interface UseFileUploadReturn {
  uploadFile: (file: File, purpose?: string) => Promise<{ fileId: string }>;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  async function uploadFile(file: File, purpose?: string): Promise<{ fileId: string }> {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const uploadData = await getUploadUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        purpose,
      });

      setProgress(30);

      const xhr = new XMLHttpRequest();
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(30 + Math.round((e.loaded / e.total) * 50));
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("PUT", uploadData.uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setProgress(80);

      await confirmUpload(uploadData.fileId);

      setProgress(100);
      return { fileId: uploadData.fileId };
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
