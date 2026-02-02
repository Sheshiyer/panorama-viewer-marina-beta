// Simple panoramaConfig.ts - One panoramic image per floor
// Using local files from public/assets/panoramas/

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
  // Check environment at runtime
  const useR2 = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_USE_R2 === 'true'
    : process.env.NEXT_PUBLIC_USE_R2 === 'true';
  const r2Domain = process.env.NEXT_PUBLIC_R2_DOMAIN;
  
  if (useR2 && r2Domain) {
    return `${r2Domain}${localPath}`;
  }
  return localPath;
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
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-44-morning-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-44-morning-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-44-morning-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-44-noon-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-44-noon-marine.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-44-evening-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-44-evening-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-44-evening-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-44-night-marine.jpg"), isPanoramic: true },
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
        views: [{ label: "Sea View", image: getImageUrl("/assets/panoramas/floor-48-morning-sea.jpg"), isPanoramic: false }]
      },
      {
        id: "noon",
        label: "Noon",
        views: [{ label: "Sea View", image: getImageUrl("/assets/panoramas/floor-48-noon-sea.jpg"), isPanoramic: true }]
      },
      {
        id: "evening",
        label: "Evening",
        views: [{ label: "Sea View", image: getImageUrl("/assets/panoramas/floor-48-evening-sea.jpg"), isPanoramic: true }]
      },
      {
        id: "night",
        label: "Night",
        views: [{ label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-48-night-stadium.jpg"), isPanoramic: true }]
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
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-52-morning-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-52-morning-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-52-morning-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-52-noon-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-52-noon-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-52-noon-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-52-evening-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-52-evening-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-52-night-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-52-night-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-52-night-stadium.jpg"), isPanoramic: false },
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
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-56-morning-sea.jpg"), isPanoramic: false },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-56-morning-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-56-morning-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-56-noon-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-56-noon-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-56-noon-stadium.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-56-evening-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-56-evening-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-56-evening-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-56-night-sea.jpg"), isPanoramic: false },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-56-night-stadium.jpg"), isPanoramic: true },
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
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-60-morning-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-60-morning-marine.jpg"), isPanoramic: false },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-60-morning-stadium.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-60-noon-sea.jpg"), isPanoramic: false },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-60-noon-marine.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-60-evening-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-60-evening-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-60-evening-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-60-night-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-60-night-stadium.jpg"), isPanoramic: true },
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
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-64-morning-marine.jpg"), isPanoramic: false },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-64-morning-stadium.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-64-noon-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-64-noon-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-64-noon-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-64-evening-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-64-evening-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-64-night-stadium.jpg"), isPanoramic: false }
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
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-68-morning-sea.jpg"), isPanoramic: false },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-68-morning-marine.jpg"), isPanoramic: false },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-68-morning-stadium.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-68-noon-sea.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-68-evening-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-68-evening-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-68-evening-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-68-night-sea.jpg"), isPanoramic: false },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-68-night-marine.jpg"), isPanoramic: true },
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
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-72-morning-marine.jpg"), isPanoramic: false },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-72-morning-stadium.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-72-noon-marine.jpg"), isPanoramic: false },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-72-noon-stadium.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-72-evening-sea.jpg"), isPanoramic: true },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-72-evening-marine.jpg"), isPanoramic: false },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-72-evening-stadium.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-72-night-marine.jpg"), isPanoramic: true },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-72-night-stadium.jpg"), isPanoramic: true },
        ]
      }
    ]
  },
  {
    id: 9,
    label: "75th Floor",
    floorNumber: 75,
    elevation: 266,
    times: [
      {
        id: "morning",
        label: "Morning",
        views: [
          { 
            label: "Marine View", 
            image: getImageUrl("/assets/panoramas/floor-75-morning-marine.jpg"), 
            isPanoramic: false,
            hotspots: [
              { pitch: -5, yaw: 0, text: "Sewri Harbor", description: "The bustling eastern waterfront of Mumbai." }
            ]
          },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-75-morning-stadium.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-75-noon-sea.jpg"), isPanoramic: false },
          { 
            label: "Marine View", 
            image: getImageUrl("/assets/panoramas/floor-75-noon-marine.jpg"), 
            isPanoramic: true,
            hotspots: [
              { pitch: -2, yaw: -15, text: "Atal Setu (MTHL)", description: "India's longest sea bridge." },
              { pitch: -4, yaw: 25, text: "Sewri Fort", description: "Historic 17th-century fortification." }
            ]
          },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { 
            label: "Sea View", 
            image: getImageUrl("/assets/panoramas/floor-75-evening-sea.jpg"), 
            isPanoramic: true,
            hotspots: [
              { pitch: -3, yaw: -10, text: "Atal Setu (MTHL)", description: "Stunning night view of the sea link." },
              { pitch: -10, yaw: -40, text: "Sewri Mudflats", description: "Famous for flamingo sightings." },
              { pitch: 0, yaw: 180, text: "CST Station Way", description: "The path leading to South Mumbai's heritage core." }
            ]
          },
          { label: "Marine View", image: getImageUrl("/assets/panoramas/floor-75-evening-marine.jpg"), isPanoramic: false },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Sea View", image: getImageUrl("/assets/panoramas/floor-75-night-sea.jpg"), isPanoramic: true },
          { 
            label: "Marine View", 
            image: getImageUrl("/assets/panoramas/floor-75-night-marine.jpg"), 
            isPanoramic: true,
            hotspots: [
              { pitch: 5, yaw: 45, text: "Harbor Lights", description: "Ship lights illuminating the Arabian Sea." }
            ]
          },
          { label: "Stadium View", image: getImageUrl("/assets/panoramas/floor-75-night-stadium.jpg"), isPanoramic: true },
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
