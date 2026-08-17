"use client";

import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { getDownloadUrl } from "../services/fileApi";

interface FileDownloadProps {
  fileId: string;
  fileName: string;
}

export default function FileDownload({ fileId, fileName }: FileDownloadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDownloadUrl(fileId);
      window.open(data.downloadUrl, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary font-semibold border border-primary rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-all"
      >
        <Download className="w-4 h-4" />
        {isLoading ? "Loading..." : fileName}
        <ExternalLink className="w-3 h-3" />
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
