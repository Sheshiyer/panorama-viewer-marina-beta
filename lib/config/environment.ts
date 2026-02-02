/**
 * Environment-based configuration for the Panorama Viewer
 * New simplified setup with marina-one-panoramas-v2 bucket
 */

export type EnvironmentConfig = {
  // Feature flags
  enableAnalytics: boolean;
  enableHotspots: boolean;
  enableAutoRotate: boolean;

  // Asset URLs - New R2 bucket
  useR2: boolean; // Whether to use R2 URLs or local files
  r2Domain: string | null; // Public R2 domain (e.g., https://pub-xxxxx.r2.dev)

  // Analytics configuration
  analyticsEnabled: boolean;
  posthogApiKey: string | null;
  posthogHost: string | null;

  // Performance
  enableImageOptimization: boolean;
  enablePrefetch: boolean;

  // Debug
  debugMode: boolean;
};

/**
 * Get environment configuration with proper defaults
 * Reads from NEXT_PUBLIC_* environment variables
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  // Helper to safely get env vars (works in both server and client)
  const getEnv = (key: string): string | undefined => {
    if (typeof process !== "undefined" && process.env) {
      return process.env[key];
    }
    return undefined;
  };

  const getBoolEnv = (key: string, defaultValue = false): boolean => {
    const value = getEnv(key);
    if (value === undefined) return defaultValue;
    return value === "true" || value === "1";
  };

  return {
    // Feature flags
    enableAnalytics: getBoolEnv("NEXT_PUBLIC_ENABLE_ANALYTICS", false),
    enableHotspots: getBoolEnv("NEXT_PUBLIC_ENABLE_HOTSPOTS", true),
    enableAutoRotate: getBoolEnv("NEXT_PUBLIC_ENABLE_AUTO_ROTATE", true),

    // Asset URLs - New R2 bucket
    useR2: getBoolEnv("NEXT_PUBLIC_USE_R2", false), // Default to local files
    r2Domain: getEnv("NEXT_PUBLIC_R2_DOMAIN") || null, // Set after enabling public access

    // Analytics
    analyticsEnabled: getBoolEnv("NEXT_PUBLIC_ENABLE_ANALYTICS", false),
    posthogApiKey: getEnv("NEXT_PUBLIC_POSTHOG_API_KEY") || null,
    posthogHost: getEnv("NEXT_PUBLIC_POSTHOG_HOST") || "https://app.posthog.com",

    // Performance
    enableImageOptimization: getBoolEnv("NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION", true),
    enablePrefetch: getBoolEnv("NEXT_PUBLIC_ENABLE_PREFETCH", true),

    // Debug
    debugMode: getBoolEnv("NEXT_PUBLIC_DEBUG_MODE", false),
  };
}

/**
 * Type guard to check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Type guard to check if we're in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Log configuration on app start (only in development)
 */
export function logEnvironmentConfig(): void {
  if (!isDevelopment()) return;

  const config = getEnvironmentConfig();
  console.log("[Environment Config]", {
    ...config,
    r2Domain: config.r2Domain || "Using local files",
    posthogApiKey: config.posthogApiKey ? "***" + config.posthogApiKey.slice(-4) : null,
  });
}

// Singleton instance for easy access
export const environment = getEnvironmentConfig();
