import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const r2Base = process.env.NEXT_PUBLIC_R2_DOMAIN || "https://pub-507b01312b8f4e44a3a148147daef174.r2.dev";
    return [
      {
        source: "/r2-assets/:path*",
        destination: `${r2Base}/:path*`,
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