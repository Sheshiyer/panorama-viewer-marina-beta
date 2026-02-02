/**
 * TypeScript definitions for Pannellum 2.5.6
 * https://pannellum.org/documentation/overview/
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace Pannellum {
  export interface ViewerConfig {
    type?: "equirectangular" | "cubemap" | "multires";
    panorama?: string | HTMLImageElement;
    dynamic?: boolean;
    dynamicUpdate?: boolean;
    hfov?: number;
    minHfov?: number;
    maxHfov?: number;
    pitch?: number;
    minPitch?: number;
    maxPitch?: number;
    yaw?: number;
    minYaw?: number;
    maxYaw?: number;
    autoLoad?: boolean;
    autoRotate?: number;
    autoRotateInactivityDelay?: number;
    autoRotateStopDelay?: number;
    showControls?: boolean;
    showFullscreenCtrl?: boolean;
    showZoomCtrl?: boolean;
    mouseZoom?: boolean;
    doubleClickZoom?: boolean;
    draggable?: boolean;
    disableKeyboardCtrl?: boolean;
    crossOrigin?: "anonymous" | "use-credentials";
    hotSpots?: HotSpot[];
    hotSpotDebug?: boolean;
    backgroundColor?: [number, number, number];
    compass?: boolean;
    northOffset?: number;
    title?: string;
    author?: string;
    orientationOnByDefault?: boolean;
    showControls?: boolean;
    capturedKeyNumbers?: number[];
    escapeHTML?: boolean;
  }

  export interface HotSpot {
    pitch: number;
    yaw: number;
    type?: "scene" | "info" | "custom";
    text?: string;
    URL?: string;
    sceneId?: string;
    targetPitch?: number;
    targetYaw?: number;
    targetHfov?: number;
    id?: string;
    cssClass?: string;
    createTooltipFunc?: (hotSpotDiv: HTMLElement, args?: any) => HTMLElement;
    createTooltipArgs?: any;
    clickHandlerFunc?: (evt: MouseEvent, args?: any) => boolean;
    clickHandlerArgs?: any;
    scale?: boolean;
  }

  export interface SceneConfig extends ViewerConfig {
    firstScene?: string;
    sceneFadeDuration?: number;
  }

  export interface MultiSceneConfig {
    default?: {
      firstScene: string;
      sceneFadeDuration?: number;
      autoLoad?: boolean;
      [key: string]: any;
    };
    scenes: Record<string, ViewerConfig>;
  }

  export interface ViewerInstance {
    // View control methods
    getPitch(): number;
    setPitch(pitch: number, animated?: boolean, callback?: () => void, callbackArgs?: any): ViewerInstance;
    getPitchBounds(): [number, number];
    setPitchBounds(bounds: [number, number]): ViewerInstance;

    getYaw(): number;
    setYaw(yaw: number, animated?: boolean, callback?: () => void, callbackArgs?: any): ViewerInstance;
    getYawBounds(): [number, number];
    setYawBounds(bounds: [number, number]): ViewerInstance;

    getHfov(): number;
    setHfov(hfov: number, animated?: boolean, callback?: () => void, callbackArgs?: any): ViewerInstance;
    getHfovBounds(): [number, number];
    setHfovBounds(bounds: [number, number]): ViewerInstance;

    lookAt(pitch: number, yaw: number, hfov?: number, animated?: boolean, callback?: () => void, callbackArgs?: any): ViewerInstance;

    // Auto-rotation methods
    startAutoRotate(speed?: number, pitch?: number): ViewerInstance;
    stopAutoRotate(): ViewerInstance;

    // Orientation methods
    startOrientation(): void;
    stopOrientation(): void;
    isOrientationActive(): boolean;
    isOrientationSupported(): boolean;

    // Scene methods
    loadScene(sceneId: string, pitch?: number, yaw?: number, hfov?: number, fadeDuration?: number): ViewerInstance;
    getScene(): string;
    addScene(sceneId: string, config: ViewerConfig): ViewerInstance;
    removeScene(sceneId: string): boolean;

    // Hotspot methods
    addHotSpot(hotspot: HotSpot, sceneId?: string): ViewerInstance;
    removeHotSpot(hotspotId: string, sceneId?: string): boolean;

    // Utility methods
    toggleFullscreen(): void;
    isFullscreen(): boolean;
    getConfig(): MultiSceneConfig | ViewerConfig;
    destroy(): void;
    resize(): void;

    // Event listeners
    on(type: string, listener: (...args: any[]) => void): ViewerInstance;
    off(type: string, listener?: (...args: any[]) => void): ViewerInstance;

    // Mouse position
    mouseEventToCoords(event: MouseEvent): [number, number] | undefined;
  }

  export function viewer(container: HTMLElement | string, config: ViewerConfig | MultiSceneConfig): ViewerInstance;
}

// Augment the global Window type
declare global {
  interface Window {
    pannellum: typeof Pannellum;
  }
}

export = Pannellum;
export as namespace Pannellum;
