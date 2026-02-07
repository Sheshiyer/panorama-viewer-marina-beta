/**
 * Cloudflare R2 configuration for One Marina Panoramas
 * 
 * New bucket structure (simplified):
 * - Bucket name: marina-one-panoramas-v2
 * - Files: floor-44-panoramic.jpg, floor-48-panoramic.jpg, etc.
 * - Total: 9 files (6 panoramic + 3 photo fallbacks)
 */

/**
 * R2 bucket configuration
 * Update these values when deploying to production
 */
export const R2_CONFIG = {
  // Bucket name on Cloudflare R2
  bucketName: "marina-one-panoramas-v2",

  // Public R2 domain (will be set after bucket creation)
  // Format: https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
  publicDomain: process.env.NEXT_PUBLIC_R2_DOMAIN || "",

  // Whether to use R2 URLs or local files
  // Set to false during development, true in production
  useR2: process.env.NEXT_PUBLIC_USE_R2 === "true",

  // Account ID for Cloudflare R2
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
};

/**
 * Get the full R2 URL for a panorama file
 * @param filename - The panorama filename (e.g., "floor-44-panoramic.jpg")
 * @returns Full R2 URL or local path
 */
export function getImageUrl(filename: string): string {
  if (R2_CONFIG.useR2 && R2_CONFIG.publicDomain) {
    return `${R2_CONFIG.publicDomain}/assets/panoramas/${filename}`;
  }
  // Fallback to local files
  return `/assets/panoramas/${filename}`;
}

/**
 * CORS configuration for R2 bucket
 * Allows access from localhost and production domains
 */
export const CORS_CONFIG = {
  AllowedOrigins: [
    "http://localhost:3000",
    "http://localhost:3002",
    "https://panorama-viewer-marina-beta.vercel.app",
    "https://*.vercel.app",
  ],
  AllowedMethods: ["GET", "HEAD"],
  AllowedHeaders: ["*"],
  ExposeHeaders: ["ETag"],
  MaxAgeSeconds: 3600,
};
