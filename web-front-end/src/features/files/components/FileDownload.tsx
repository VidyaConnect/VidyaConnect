"use client";

import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { getDownloadUrl } from "../services/fileApi";

interface FileDownloadProps {
  fileId: string;
  fileName: string;
}

export default function FileDownload({ fileId, fileName }: FileDownloadProps) {
  const [isLoading, setIsLoading] = useState<"view" | "download" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openFile = async (mode: "view" | "download") => {
    setIsLoading(mode);
    setError(null);
    try {
      const data = await getDownloadUrl(fileId, { inline: mode === "view" });
      if (mode === "view") {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
        return;
      }
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = data.fileName || fileName;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => openFile("view")}
          disabled={Boolean(isLoading)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary font-semibold border border-primary rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-all"
        >
          <Eye className="w-4 h-4" />
          {isLoading === "view" ? "Opening..." : `View ${fileName}`}
        </button>
        <button
          type="button"
          onClick={() => openFile("download")}
          disabled={Boolean(isLoading)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary font-semibold border border-primary rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-all"
        >
          <Download className="w-4 h-4" />
          {isLoading === "download" ? "Loading..." : "Download"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
