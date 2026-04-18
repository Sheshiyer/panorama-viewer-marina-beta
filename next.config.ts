import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const useR2 = process.env.NEXT_PUBLIC_USE_R2 === "true";
    const r2Domain = process.env.NEXT_PUBLIC_R2_DOMAIN?.replace(/\/$/, "");
    const deprecatedR2Domains = new Set([
      "https://pub-507b01312b8f4e44a3a148147daef174.r2.dev",
    ]);
    const defaultR2Domain = "https://pub-a60895ec562144db98a4a8904819bb76.r2.dev";

    // Protect production from stale env values that still point to deleted R2 domains.
    const safeR2Domain = r2Domain && !deprecatedR2Domains.has(r2Domain) ? r2Domain : defaultR2Domain;

    // Never hardcode a specific R2 domain fallback.
    // If R2 is disabled or domain is not set, serve from local public assets.
    // In local development, always serve local files to avoid R2 path/schema mismatches.
    const assetBase = isDevelopment ? "/assets/panoramas-v2" : (useR2 ? safeR2Domain : "/assets/panoramas-v2");

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