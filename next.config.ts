import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const r2Base = process.env.NEXT_PUBLIC_R2_BASE_URL || "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev";
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