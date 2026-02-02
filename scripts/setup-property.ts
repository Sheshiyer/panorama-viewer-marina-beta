#!/usr/bin/env ts-node

/**
 * Interactive script to set up a new property configuration
 * Prompts for property details and generates initial panoramaConfig.ts
 */

import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

interface PropertySetup {
  name: string;
  floorCount: number;
  floorIds: number[];
  r2BaseUrl: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function setupProperty() {
  console.log("\n🏢 Panorama Viewer Property Setup\n");
  console.log("This wizard will help you configure a new property.\n");

  // Property name
  const name = await question("Property name (e.g., 'Skyline Tower'): ");
  if (!name.trim()) {
    console.error("Error: Property name is required");
    rl.close();
    return;
  }

  // Floor count
  const floorCountStr = await question("Number of floors with panoramas: ");
  const floorCount = parseInt(floorCountStr, 10);
  if (isNaN(floorCount) || floorCount < 1) {
    console.error("Error: Invalid floor count");
    rl.close();
    return;
  }

  // Floor IDs
  const floorIdsStr = await question(
    `Floor numbers (comma-separated, e.g., '6,11,16,21'): `
  );
  const floorIds = floorIdsStr
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));

  if (floorIds.length !== floorCount) {
    console.error(`Error: Expected ${floorCount} floor numbers, got ${floorIds.length}`);
    rl.close();
    return;
  }

  // R2 Base URL
  const r2BaseUrl = await question(
    "Cloudflare R2 base URL (e.g., 'https://pub-xxx.r2.dev/panoramas'): "
  );
  if (!r2BaseUrl.startsWith("https://")) {
    console.error("Error: R2 URL must start with https://");
    rl.close();
    return;
  }

  rl.close();

  const setup: PropertySetup = {
    name,
    floorCount,
    floorIds,
    r2BaseUrl,
  };

  console.log("\n✅ Configuration Summary:");
  console.log(JSON.stringify(setup, null, 2));

  generateConfig(setup);
}

function generateConfig(setup: PropertySetup) {
  const times = ["sunrise", "noon", "sunset", "night"];
  const timeFolders = {
    sunrise: "morning",
    noon: "afternoon",
    sunset: "evening",
    night: "night",
  } as const;

  const floorsConfig = setup.floorIds
    .map((floorId) => {
      const floorStr = String(floorId).padStart(2, "0");
      const views = times
        .map((time) => {
          const folder = timeFolders[time as keyof typeof timeFolders];
          return `      ${time}: {
        // ${folder}
        image: "${setup.r2BaseUrl}/${folder}/floor-${floorStr}.jpg",
        fallbackLocal: "/assets/panoramas/${folder}/floor-${floorStr}.jpg",
      }`;
        })
        .join(",\n");

      return `  {
    id: ${floorId},
    label: "${floorId}${getOrdinalSuffix(floorId)} Floor",
    views: {
${views}
    },
  }`;
    })
    .join(",\n");

  const configContent = `// TimeKey maps to viewer-friendly labels while aligning to bucket folders:
// sunrise -> morning, noon -> afternoon, sunset -> evening, night -> night
export type TimeKey = "sunrise" | "noon" | "sunset" | "night";

export type ViewConfig = {
  image: string;
  alternates?: string[];
  fallbackLocal?: string;
  defaultYaw?: number;
  defaultPitch?: number;
  hfov?: number;
};

export type FloorConfig = {
  id: number;
  label: string;
  views: Record<TimeKey, ViewConfig>;
};

export const floors: FloorConfig[] = [
${floorsConfig}
];

export const viewerDefaults = {
  autoLoad: true,
  minHfov: 50,
  maxHfov: 120,
  defaultHfov: 90,
  autoRotate: 0,
  inactivityTimeoutMs: 8000,
  autoRotateSpeed: -2,
  autoRotateYaw: 0,
  autoRotatePitch: 0,
  autoRotateHfov: 95,
  compass: false,
};

export const branding = {
  logo: "/next.svg",
  appTitle: "${setup.name} Panorama Viewer",
};
`;

  const outputPath = path.join(process.cwd(), "lib", "panoramaConfig.generated.ts");
  fs.writeFileSync(outputPath, configContent, "utf-8");

  console.log(`\n✅ Generated configuration file: ${outputPath}`);
  console.log("\nNext steps:");
  console.log("1. Review the generated file");
  console.log("2. Copy it to lib/panoramaConfig.ts (or merge with existing)");
  console.log("3. Upload panorama images to R2 bucket");
  console.log("4. Run 'npm run validate-assets' to check for missing images");
}

function getOrdinalSuffix(n: number): string {
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "th";
  }

  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

setupProperty().catch((error) => {
  console.error("Error during setup:", error);
  rl.close();
  process.exit(1);
});
