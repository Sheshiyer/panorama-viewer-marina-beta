// Simple panoramaConfig.ts - One panoramic image per floor
// Using standardized assets from R2 bucket (v2)

import { environment } from "./config/environment";

export type TimeKey = "morning" | "noon" | "evening" | "night";

export type HotspotConfig = {
  pitch: number;
  yaw: number;
  text: string;
  description?: string;
  type?: "info" | "scene" | "link";
  url?: string;
};

export type ViewConfig = {
  label: string;
  image: string;
  isPanoramic: boolean;
  defaultYaw?: number;
  defaultPitch?: number;
  hfov?: number;
  viewingAngle?: number;
  hotspots?: HotspotConfig[];
};

export type TimeConfig = {
  id: TimeKey;
  label: string;
  views: ViewConfig[];
};

export type FloorConfig = {
  id: number;
  label: string;
  floorNumber: number;
  elevation: number;
  times: TimeConfig[];
};

/**
 * Helper to get the correct image URL based on environment settings.
 * If NEXT_PUBLIC_USE_R2 is true, it replaces the local path with the R2 domain.
 * 
 * NOTE: This is called at module load time, so we store the local path.
 * Use resolveImageUrl() at runtime to get the actual URL.
 */
function getImageUrl(localPath: string): string {
  // Always return local path - resolution happens at runtime
  return localPath;
}

/**
 * Runtime function to resolve image URL based on current environment.
 * Call this in components/hooks, NOT at module initialization.
 */
export function resolveImageUrl(localPath: string): string {
  // Always use the local proxy path which maps to R2 via next.config.ts rewrites
  // This avoids CORS issues by keeping requests same-origin
  return `/r2-assets${localPath}`;
}

export const floors: FloorConfig[] = [
  {
    id: 1,
    label: "44th Floor",
    floorNumber: 44,
    elevation: 154,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/44f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/44f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/44f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/44f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/44f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/44f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/44f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/44f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/44f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/44f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/44f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/44f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 2,
    label: "48th Floor",
    floorNumber: 48,
    elevation: 167,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/48f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/48f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/48f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/48f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/48f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/48f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/48f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/48f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/48f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/48f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/48f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/48f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 3,
    label: "52nd Floor",
    floorNumber: 52,
    elevation: 182,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/52f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/52f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/52f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/52f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/52f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/52f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/52f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/52f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/52f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/52f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/52f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/52f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 4,
    label: "56th Floor",
    floorNumber: 56,
    elevation: 196,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/56f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/56f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/56f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/56f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/56f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/56f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/56f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/56f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/56f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/56f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/56f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/56f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 5,
    label: "60th Floor",
    floorNumber: 60,
    elevation: 210,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/60f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/60f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/60f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/60f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/60f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/60f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/60f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/60f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/60f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/60f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/60f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/60f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 6,
    label: "64th Floor",
    floorNumber: 64,
    elevation: 224,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/64f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/64f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/64f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/64f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/64f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/64f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/64f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/64f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/64f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/64f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/64f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/64f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 7,
    label: "68th Floor",
    floorNumber: 68,
    elevation: 238,

    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/68f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/68f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/68f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/68f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/68f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/68f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/68f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/68f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/68f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/68f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/68f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/68f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 8,
    label: "72nd Floor",
    floorNumber: 72,
    elevation: 252,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/72f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/72f/sunrise/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/72f/sunrise/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/72f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/72f/noon/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/72f/noon/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/72f/sunset/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/72f/sunset/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/72f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/72f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/72f/night/central-sea.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/72f/night/marine-line.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 9,
    label: "74th Floor",
    floorNumber: 74,
    elevation: 266,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/75f/sunrise/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/75f/sunrise/central-sea.jpg"), isPanoramic: true },
          {
            label: "Bandra-Worli Sea Link View", viewingAngle: 315,
            image: getImageUrl("/75f/sunrise/marine-line.jpg"),
            isPanoramic: true,
          },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/75f/noon/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/75f/noon/central-sea.jpg"), isPanoramic: true },
          {
            label: "Bandra-Worli Sea Link View", viewingAngle: 315,
            image: getImageUrl("/75f/noon/marine-line.jpg"),
            isPanoramic: true,
          },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/75f/sunset/stadium.jpg"), isPanoramic: true },
          {
            label: "Sea View", viewingAngle: 270,
            image: getImageUrl("/75f/sunset/central-sea.jpg"),
            isPanoramic: true,
          },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/75f/sunset/marine-line.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/75f/night/stadium.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/75f/night/central-sea.jpg"), isPanoramic: true },
          {
            label: "Bandra-Worli Sea Link View", viewingAngle: 315,
            image: getImageUrl("/75f/night/marine-line.jpg"),
            isPanoramic: true,
          },
        ]
      }
    ]
  },
];

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
