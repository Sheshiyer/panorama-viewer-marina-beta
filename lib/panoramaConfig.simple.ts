// Simple panoramaConfig.ts - Full 108-slot UI matrix for One Marina panoramas
// All assets served from AshwinSheth R2 custom domain.

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

const DEFAULT_R2_DOMAIN = "https://360viewmarina.shethdevelopers.com";
const BLOCKED_ASSET_DOMAINS = new Set([
  "https://onemarina.shethdevelopers.com",
]);

function getImageUrl(localPath: string): string {
  return localPath;
}

export function resolveImageUrl(localPath: string): string {
  const normalizedPath = localPath.startsWith("/") ? localPath : `/${localPath}`;
  const configuredDomain = process.env.NEXT_PUBLIC_R2_DOMAIN?.replace(/\/$/, "");
  const domain = configuredDomain && !BLOCKED_ASSET_DOMAINS.has(configuredDomain)
    ? configuredDomain
    : DEFAULT_R2_DOMAIN;

  return `${domain}${normalizedPath}`;
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/154-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/154-central-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/154-marine-line-facin-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/154-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/154-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/154-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/154-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/154-central-sea-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/154-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/154-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/154-central-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/154-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/167-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/167-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/167-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/167-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/167-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/167-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/167-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/167-central-sea-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/167-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/167-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/167-central-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/167-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/182-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/182-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/182-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/182-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/182-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/182-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/182-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/182-central-sea-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/182-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/182-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/182-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/182-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/196-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/196-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/196-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/196-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/196-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/196-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/196-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/196-sea-facing-views-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/196-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/196-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/196-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/196-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/210-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/210-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/210-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/210-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/210-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/210-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/210-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/210-central-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/210-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/210-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/210-central-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/210-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/224-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/224-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/224-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/224-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/224-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/224-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/224-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/224-central-sea-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/224-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/224-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/224-central-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/224-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/238-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/238-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/238-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/238-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/238-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/238-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/238-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/238-central-sea-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/238-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/238-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/238-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/238-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/252-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/252-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/252-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/252-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/252-central-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/252-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/252-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/252-central-sea-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/252-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/252-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/252-central-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/252-marine-line-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
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
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/266-stadium-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/266-central-sea-facing-morning-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/266-marine-line-facing-morning-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "noon",
        label: "Noon",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/266-stadium-facing-day-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/266-sea-facing-day-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/266-marine-line-facing-day-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "evening",
        label: "Evening",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/266-stadium-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/266-central-sea-facing-evening-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/266-marine-line-facing-evening-view.jpg"), isPanoramic: true },
        ]
      },
      {
        id: "night",
        label: "Night",
        views: [
          { label: "Stadium View", viewingAngle: 135, image: getImageUrl("/266-stadium-facing-night-view.jpg"), isPanoramic: true },
          { label: "Sea View", viewingAngle: 270, image: getImageUrl("/266-sea-facing-night-view.jpg"), isPanoramic: true },
          { label: "Bandra-Worli Sea Link View", viewingAngle: 315, image: getImageUrl("/266-marine-facing-night-view.jpg"), isPanoramic: true },
        ]
      },
    ]
  }
];

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
