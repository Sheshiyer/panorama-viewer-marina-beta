#!/usr/bin/env ts-node
/**
 * Auto-generate panoramaConfig.ts from validated panoramic images.
 * Uses the filtered R2 manifest to create a complete config with all available views.
 *
 * This script:
 * 1. Reads lib/r2-manifest.panoramic.json (validated panoramic images only)
 * 2. Groups images by floor/time/direction
 * 3. Generates a complete panoramaConfig.ts with all available views
 * 4. Uses single equirectangular images (not multi-res tiles)
 *
 * Usage:
 *   npm run generate-config
 */

import * as fs from "fs";
import * as path from "path";

interface FloorViews {
  [time: string]: {
    [direction: string]: string; // URL
  };
}

interface FloorData {
  floorNumber: number;
  label: string;
  elevation: number;
  views: FloorViews;
}

// Floor to elevation mapping
const FLOOR_ELEVATION: Record<number, number> = {
  44: 154,
  48: 167,
  52: 182,
  56: 210,
  60: 224,
  64: 238,
  68: 196,
  72: 252,
  75: 266,
};

function parseManifestKey(key: string): { floor: number; time: string; direction: string } | null {
  // Expected format: "44f/noon/central-sea"
  const match = key.match(/^(\d+)f\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const floor = parseInt(match[1], 10);
  const time = match[2];
  const direction = match[3];

  return { floor, time, direction };
}

function main() {
  console.log('🔨 Generating panoramaConfig.ts from validated panoramic images...\n');

  // Load validated manifest
  const manifestPath = path.resolve(__dirname, '../lib/r2-manifest.panoramic.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ r2-manifest.panoramic.json not found. Run: npm run validate-panoramas');
    process.exit(1);
  }

  const manifest: Record<string, string> = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`Found ${Object.keys(manifest).length} panoramic images\n`);

  // Group by floor
  const floorMap = new Map<number, FloorData>();

  for (const [key, url] of Object.entries(manifest)) {
    const parsed = parseManifestKey(key);
    if (!parsed) {
      console.warn(`⚠️  Skipping invalid key: ${key}`);
      continue;
    }

    const { floor, time, direction } = parsed;

    if (!floorMap.has(floor)) {
      floorMap.set(floor, {
        floorNumber: floor,
        label: `${floor}${getOrdinalSuffix(floor)} Floor`,
        elevation: FLOOR_ELEVATION[floor] || 0,
        views: {},
      });
    }

    const floorData = floorMap.get(floor)!;
    if (!floorData.views[time]) {
      floorData.views[time] = {};
    }
    floorData.views[time][direction] = url;
  }

  // Generate TypeScript config
  const floors = Array.from(floorMap.values()).sort((a, b) => a.floorNumber - b.floorNumber);

  let configContent = `// Auto-generated panoramaConfig.ts
// Generated on: ${new Date().toISOString()}
// Source: lib/r2-manifest.panoramic.json
// Total floors: ${floors.length}
// Total views: ${Object.keys(manifest).length}

export type TimeKey = "sunrise" | "noon" | "sunset" | "night";
export type ViewDirection = "central-sea" | "marine-line" | "stadium";

export type MultiResConfig = {
  basePath: string;
  path: string;
  fallbackPath?: string;
  extension: string;
  tileResolution: number;
  maxLevel: number;
  cubeResolution: number;
};

export type ViewConfig = {
  multiRes?: MultiResConfig;
  image?: string;
  alternates?: string[];
  fallbackLocal?: string;
  defaultYaw?: number;
  defaultPitch?: number;
  hfov?: number;
  direction?: ViewDirection;
};

export type FloorConfig = {
  id: number;
  label: string;
  floorNumber: number;
  elevation?: number;
  views: Partial<Record<TimeKey, Partial<Record<ViewDirection, ViewConfig>>>>;
};

export const floors: FloorConfig[] = [
`;

  floors.forEach((floor, index) => {
    const id = index + 1;
    configContent += `  {
    id: ${id},
    label: "${floor.label}",
    floorNumber: ${floor.floorNumber},
    elevation: ${floor.elevation},
    views: {
`;

    const times = Object.keys(floor.views).sort((a, b) => {
      const timeOrder = ['sunrise', 'noon', 'sunset', 'night'];
      return timeOrder.indexOf(a) - timeOrder.indexOf(b);
    });

    times.forEach((time) => {
      const directions = floor.views[time];
      configContent += `      ${time}: {
`;

      Object.entries(directions).forEach(([direction, url]) => {
        const dirKey = direction === 'central-sea' ? '"central-sea"' :
                       direction === 'marine-line' ? '"marine-line"' :
                       'stadium';

        configContent += `        ${dirKey}: {
          image: "${url}",
          direction: "${direction}",
        },
`;
      });

      configContent += `      },
`;
    });

    configContent += `    },
  },
`;
  });

  configContent += `];

// Helper to get floor by number
export function getFloorByNumber(floorNumber: number): FloorConfig | undefined {
  return floors.find(f => f.floorNumber === floorNumber);
}

// Helper to get all available times for a floor
export function getAvailableTimes(floorNumber: number): TimeKey[] {
  const floor = getFloorByNumber(floorNumber);
  return floor ? Object.keys(floor.views) as TimeKey[] : [];
}

// Helper to get all available directions for a floor/time
export function getAvailableDirections(floorNumber: number, time: TimeKey): ViewDirection[] {
  const floor = getFloorByNumber(floorNumber);
  const timeViews = floor?.views[time];
  return timeViews ? Object.keys(timeViews) as ViewDirection[] : [];
}

// Viewer defaults for Pannellum configuration
export const viewerDefaults = {
  defaultHfov: 90,
  minHfov: 50,
  maxHfov: 120,
  autoRotate: -2,
  autoRotateSpeed: -2,
  autoRotateYaw: 0,
  autoRotatePitch: 0,
  autoRotateHfov: 90,
  inactivityTimeoutMs: 8000,
};
`;

  // Write to file
  const outputPath = path.resolve(__dirname, '../lib/panoramaConfig.ts');
  fs.writeFileSync(outputPath, configContent, 'utf8');

  console.log('✅ Generated lib/panoramaConfig.ts');
  console.log(`\n📊 Summary:`);
  console.log(`   Floors configured: ${floors.length}`);
  console.log(`   Total views: ${Object.keys(manifest).length}`);
  
  floors.forEach(floor => {
    const viewCount = Object.values(floor.views).reduce((sum, dirs) => sum + Object.keys(dirs).length, 0);
    console.log(`   - Floor ${floor.floorNumber}: ${viewCount} views`);
  });

  console.log('\n✨ Done! The config now uses full R2 images (not multi-res tiles).');
  console.log('   To generate tiles later, run: ./scripts/generate-tiles.sh');
}

function getOrdinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

main();
