// Auto-generated panoramaConfig.ts
// Generated on: 2026-02-01T18:24:26.691Z
// Source: lib/r2-manifest.panoramic.json
// Total floors: 9
// Total views: 108

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
  {
    id: 1,
    label: "44th Floor",
    floorNumber: 44,
    elevation: 154,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/44f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 2,
    label: "48th Floor",
    floorNumber: 48,
    elevation: 167,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/48f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 3,
    label: "52nd Floor",
    floorNumber: 52,
    elevation: 182,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/52f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 4,
    label: "56th Floor",
    floorNumber: 56,
    elevation: 210,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/56f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 5,
    label: "60th Floor",
    floorNumber: 60,
    elevation: 224,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/60f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 6,
    label: "64th Floor",
    floorNumber: 64,
    elevation: 238,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/64f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 7,
    label: "68th Floor",
    floorNumber: 68,
    elevation: 196,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/68f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 8,
    label: "72nd Floor",
    floorNumber: 72,
    elevation: 252,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/72f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
  {
    id: 9,
    label: "75th Floor",
    floorNumber: 75,
    elevation: 266,
    views: {
      sunrise: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/sunrise/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/sunrise/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/sunrise/stadium.jpg",
          direction: "stadium",
        },
      },
      noon: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/noon/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/noon/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/noon/stadium.jpg",
          direction: "stadium",
        },
      },
      sunset: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/sunset/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/sunset/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/sunset/stadium.jpg",
          direction: "stadium",
        },
      },
      night: {
        "central-sea": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/night/central-sea.jpg",
          direction: "central-sea",
        },
        "marine-line": {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/night/marine-line.jpg",
          direction: "marine-line",
        },
        stadium: {
          image: "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev/75f/night/stadium.jpg",
          direction: "stadium",
        },
      },
    },
  },
];

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
