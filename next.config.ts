import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const useR2 = process.env.NEXT_PUBLIC_USE_R2 === "true";
    const r2Domain = process.env.NEXT_PUBLIC_R2_DOMAIN?.replace(/\/$/, "");

    // Never hardcode a specific R2 domain fallback.
    // If R2 is disabled or domain is not set, serve from local public assets.
    // In local development, always serve local files to avoid R2 path/schema mismatches.
    const assetBase = isDevelopment ? "/assets/panoramas-v2" : (useR2 && r2Domain ? r2Domain : "/assets/panoramas-v2");

    return [
      {
        source: "/r2-assets/:path*",
        destination: `${assetBase}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/r2-assets/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;