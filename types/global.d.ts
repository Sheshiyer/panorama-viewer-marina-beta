/**
 * Global type definitions for the Panorama Viewer application
 */

// Extend HTMLElement for custom event listeners
declare global {
  interface WindowEventMap {
    'panorama:ready': CustomEvent<{ floorId: number; timeKey: string }>;
    'panorama:sceneChange': CustomEvent<{ floorId: number; timeKey: string }>;
    'panorama:hotspotClick': CustomEvent<{ hotspotId: string }>;
  }
}

export {};
