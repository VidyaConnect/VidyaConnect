import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/announcements/:path*",
        destination: "http://announcement-service:3002/api/announcements/:path*",
      },
      {
        source: "/api/attendance/:path*",
        destination: "http://attendance-service:3003/api/attendance/:path*",
      },
      {
        source: "/api/consent-forms/:path*",
        destination: "http://consent-form-service:3005/api/consent-forms/:path*",
      },
      {
        source: "/api/files/:path*",
        destination: "http://file-service:3006/api/files/:path*",
      },
      // general fallback, must stay last
      {
        source: "/api/:path*",
        destination: "http://school-user-service:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;