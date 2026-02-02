#!/usr/bin/env ts-node

/**
 * Validates that all panorama assets defined in panoramaConfig.ts
 * are accessible (either from R2 or local fallback)
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// Dynamic import of config
async function loadConfig() {
  const configPath = path.join(process.cwd(), "lib", "panoramaConfig.ts");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  // This is a simple approach - in production, you'd want to use ts-node or compile first
  console.log("⚠️  Note: This script requires the project to be built or ts-node installed");
  console.log("For now, it will check local fallback paths only.\n");

  // Import the compiled version if available
  try {
    const { floors } = await import("../lib/panoramaConfig");
    return { floors };
  } catch (error) {
    console.error("Error loading config:", error);
    console.log("\nPlease ensure the project is built: npm run build");
    process.exit(1);
  }
}

async function checkUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.get(url, { method: "HEAD" }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function checkLocalFile(filePath: string): boolean {
  const fullPath = path.join(process.cwd(), "public", filePath);
  return fs.existsSync(fullPath);
}

async function validateAssets() {
  console.log("🔍 Panorama Asset Validator\n");

  const { floors } = await loadConfig();
  const times = ["sunrise", "noon", "sunset", "night"] as const;

  let totalAssets = 0;
  let missingAssets = 0;
  const missingDetails: string[] = [];

  for (const floor of floors) {
    console.log(`\nFloor ${floor.id} (${floor.label}):`);

    for (const time of times) {
      const view = floor.views[time];
      totalAssets++;

      // Check primary URL (skip network check for now, just validate format)
      const primaryValid = view.image.startsWith("http");

      // Check local fallback
      const fallbackValid = view.fallbackLocal
        ? checkLocalFile(view.fallbackLocal)
        : false;

      const status = fallbackValid
        ? "✅"
        : primaryValid
        ? "⚠️  (remote only)"
        : "❌";

      console.log(`  ${status} ${time}: ${view.image}`);

      if (!fallbackValid) {
        if (view.fallbackLocal) {
          console.log(
            `      Missing local: ${view.fallbackLocal}`
          );
          missingDetails.push(
            `Floor ${floor.id} ${time}: ${view.fallbackLocal}`
          );
          missingAssets++;
        }
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total assets: ${totalAssets}`);
  console.log(`   Missing local fallbacks: ${missingAssets}`);

  if (missingAssets > 0) {
    console.log("\n⚠️  Missing assets:");
    missingDetails.forEach((detail) => console.log(`   - ${detail}`));
    console.log("\nRecommendation:");
    console.log("   1. Upload images to R2 bucket (remote access)");
    console.log("   2. Or copy images to public/assets/panoramas/ (local fallback)");
  } else {
    console.log("\n✅ All assets have local fallbacks!");
  }

  console.log("");
}

validateAssets().catch((error) => {
  console.error("Error during validation:", error);
  process.exit(1);
});
