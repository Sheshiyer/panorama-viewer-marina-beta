"use client";

import { useEffect, useRef, useState } from "react";
import { loadPannellum } from "@/lib/pannellumLoader";
import type { FloorConfig, TimeKey, ViewDirection } from "@/lib/panoramaConfig";
import { resolveView } from "@/lib/viewResolver";
import { ViewPlaceholder } from "./ViewPlaceholder";

// Type for Pannellum viewer instance
type PannellumViewer = {
  loadScene?: (id: string, pitch?: number, yaw?: number, hfov?: number) => void;
  addScene?: (id: string, config: unknown) => void;
  getConfig?: () => { scenes?: Record<string, unknown> };
  getYaw?: () => number;
  getPitch?: () => number;
  getHfov?: () => number;
  destroy?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on?: (event: 'load' | 'error' | 'scenechange', handler: (...args: any[]) => void) => void;
};

type Props = {
  floors: FloorConfig[];
  activeFloor: number;
  activeTime: TimeKey;
  activeDirection: ViewDirection;
  onReady?: (instance?: unknown) => void;
  onFallback?: (reason: string) => void;
};

export function PanoramaViewer({ floors, activeFloor, activeTime, activeDirection, onReady, onFallback }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const lastSceneRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Preload and resolve an Image element with crossOrigin + extension/local fallbacks + timeout
  const preloadImage = (url: string, timeoutMs?: number) => {
    const isRemote = /^https?:\/\//i.test(url);
    const t = timeoutMs ?? (isRemote ? 180000 : 60000);
    return new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      const timer = setTimeout(() => {
        console.warn(`Image load timeout (${t}ms): ${url}`);
        resolve(null);
      }, t);

      if (isRemote) {
        img.crossOrigin = "anonymous";
      }

      img.onload = () => {
        clearTimeout(timer);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };

      img.src = url;
    });
  };

  const resolvePanoramaImage = async (view: { image: string; fallbackLocal?: string }): Promise<HTMLImageElement> => {
    const url = view.image;
    const isR2 = /r2\.dev|r2\.cloudflarestorage\.com/i.test(url);
    const primary = await preloadImage(url);
    if (primary) return primary;
    if (!isR2) {
      const altUrl = url.endsWith(".jpg") || url.endsWith(".jpeg")
        ? url.replace(/\.jpe?g$/i, ".png")
        : url.endsWith(".png")
        ? url.replace(/\.png$/i, ".jpg")
        : url;
      if (altUrl !== url) {
        const alt = await preloadImage(altUrl);
        if (alt) return alt;
      }
    }
    if (view.fallbackLocal) {
      const local = await preloadImage(view.fallbackLocal);
      if (local) return local;
    }
    const img = new Image();
    if (/^https?:\/\//i.test(url)) {
      img.crossOrigin = "anonymous";
    }
    img.src = url;
    console.warn("Panorama asset missing or failed to preload:", url);
    return img;
  };

  const buildSceneConfig = (
    view: {
      multiRes?: { basePath: string; path: string; fallbackPath?: string; extension: string; tileResolution: number; maxLevel: number; cubeResolution: number };
      image?: string;
      hfov?: number;
      defaultYaw?: number;
      defaultPitch?: number;
    },
    imageEl?: HTMLImageElement | HTMLCanvasElement,
    panoramaUrl?: string
  ) => {
    // Prefer multi-resolution tiles (fast loading, progressive detail)
    if (view.multiRes) {
      return {
        type: "multires",
        multiRes: {
          basePath: view.multiRes.basePath,
          path: view.multiRes.path,
          fallbackPath: view.multiRes.fallbackPath,
          extension: view.multiRes.extension,
          tileResolution: view.multiRes.tileResolution,
          maxLevel: view.multiRes.maxLevel,
          cubeResolution: view.multiRes.cubeResolution,
        },
        hfov: view.hfov ?? 90,
        yaw: view.defaultYaw ?? 0,
        pitch: view.defaultPitch ?? 0,
        autoLoad: true,
        showControls: false,
      } as const;
    }

    // Single equirectangular: preloaded Image (local) or URL (remote — let Pannellum fetch)
    if (imageEl) {
      return {
        type: "equirectangular",
        panorama: imageEl,
        dynamic: true,
        dynamicUpdate: false,
        hfov: view.hfov ?? 90,
        yaw: view.defaultYaw ?? 0,
        pitch: view.defaultPitch ?? 0,
        autoLoad: true,
        showControls: false,
      } as const;
    }
    if (panoramaUrl) {
      return {
        type: "equirectangular",
        panorama: panoramaUrl,
        hfov: view.hfov ?? 90,
        yaw: view.defaultYaw ?? 0,
        pitch: view.defaultPitch ?? 0,
        autoLoad: true,
        showControls: false,
      } as const;
    }

    return null;
  };

  // init once
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const pannellum = await loadPannellum();
        if (!mounted || !containerRef.current) return;



      // Build scenes - START WITH JUST THE INITIAL SCENE
      const scenes: Record<string, unknown> = {};
      
      // Get initial scene
      const initFloor = floors.find((f) => f.id === activeFloor);
      if (!initFloor) {
        throw new Error(`Floor ${activeFloor} not found`);
      }
      
      const initView = initFloor.views[activeTime]?.[activeDirection];
      if (!initView || !initView.image) {
        throw new Error(`No view found for floor ${activeFloor}, ${activeTime}, ${activeDirection}`);
      }
      
      const initId = `floor-${activeFloor}-${activeTime}-${activeDirection}`;
      const initUrl = initView.image;
      
      console.log('Building initial scene only:', initId);
      console.log('Image URL:', initUrl);
      
      // Build only the initial scene to start
      const sceneConfig = buildSceneConfig(initView, undefined, initUrl);
      if (sceneConfig) {
        scenes[initId] = sceneConfig;
        console.log('Scene config:', sceneConfig);
      } else {
        throw new Error('Failed to build scene config');
      }

      // Resolve the initial view
      const floorCfg = floors.find((f) => f.id === activeFloor);
      if (!floorCfg) {
        throw new Error(`Floor ${activeFloor} not found in configuration`);
      }

      const { view: resolvedView, fallbackReason } = resolveView(
        activeFloor,
        activeTime,
        activeDirection,
        floorCfg.views
      );

      if (!resolvedView) {
        setError(fallbackReason || "No views available");
        return;
      }

      if (fallbackReason) {
        onFallback?.(fallbackReason);
      }

      const firstId = `floor-${activeFloor}-${activeTime}-${activeDirection}`;
      
      console.log('Initializing Pannellum viewer');
      console.log('Container dimensions:', containerRef.current?.offsetWidth, 'x', containerRef.current?.offsetHeight);
      console.log('Scene count:', Object.keys(scenes).length);
      console.log('First scene ID:', firstId);
      
      viewerRef.current = (pannellum as unknown as { viewer: (container: HTMLElement, config: unknown) => PannellumViewer }).viewer(containerRef.current!, {
        default: {
          firstScene: firstId,
          sceneFadeDuration: 800,
        },
        scenes,
      });

      // Add error handler
      viewerRef.current.on?.('error', (err: unknown) => {
        console.error('Pannellum error event:', err);
        setError(`Panorama failed to load: ${String(err)}`);
      });

      // Add load handler
      viewerRef.current.on?.('load', () => {
        console.log('✅ Pannellum loaded successfully!');
      });

      lastSceneRef.current = firstId;
      onReady?.(viewerRef.current);
      } catch (e: unknown) {
        console.error("Failed to initialize panorama viewer:", e);
        setError("Failed to load panorama engine. Please check your network.");
      }
    })();

    return () => {
      mounted = false;
      if (viewerRef.current?.destroy) viewerRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // switch scenes when floor/time/direction changes
  useEffect(() => {
    const v = viewerRef.current;
    if (!v) return;

    const targetId = `floor-${activeFloor}-${activeTime}-${activeDirection}`;
    if (targetId === lastSceneRef.current) return;

    // Resolve the view using resolveView
    const floorCfg = floors.find((f) => f.id === activeFloor);
    if (!floorCfg) {
      console.error("Floor config missing for", activeFloor);
      setError(`Floor ${activeFloor} not found`);
      return;
    }

    const { view: resolvedView, fallbackReason } = resolveView(
      activeFloor,
      activeTime,
      activeDirection,
      floorCfg.views
    );

    if (!resolvedView) {
      console.error("No view available for", { activeFloor, activeTime, activeDirection });
      setError(fallbackReason || "No views available");
      return;
    }

    if (fallbackReason) {
      onFallback?.(fallbackReason);
    }

    // preserve yaw/pitch/fov
    const yaw = v.getYaw?.() ?? 0;
    const pitch = v.getPitch?.() ?? 0;
    const hfov = v.getHfov?.() ?? 90;

    // Ensure the target scene exists; if missing add it dynamically from config
    const cfg = v.getConfig?.();
    const hasScene = !!cfg?.scenes?.[targetId];
    if (!hasScene) {
      // Build a dynamic scene on demand
      if (resolvedView.multiRes) {
        // MultiRes: instant config, no preload needed
        const sceneConfig = buildSceneConfig(resolvedView);
        if (sceneConfig) {
          try {
            v.addScene?.(targetId, sceneConfig);
            console.debug("Added missing multires scene", { targetId });
            v.loadScene?.(targetId, pitch, yaw, hfov);
            lastSceneRef.current = targetId;
          } catch (e) {
            console.error("Failed adding multires scene", e);
          }
        }
      } else if (resolvedView.image) {
        const url = resolvedView.image;
        const imgUrl = url ?? resolvedView.image;
        const isRemote = /^https?:\/\//i.test(imgUrl);
        if (isRemote) {
          const sceneConfig = buildSceneConfig(resolvedView, undefined, imgUrl);
          if (sceneConfig) {
            try {
              v.addScene?.(targetId, sceneConfig);
              v.loadScene?.(targetId, pitch, yaw, hfov);
              lastSceneRef.current = targetId;
            } catch (e) {
              console.error("Failed adding scene", e);
            }
          }
        } else {
          resolvePanoramaImage({ ...resolvedView, image: imgUrl })
            .then((img) => {
              const sceneConfig = buildSceneConfig(resolvedView, img);
              if (sceneConfig) {
                try {
                  v.addScene?.(targetId, sceneConfig);
                  v.loadScene?.(targetId, pitch, yaw, hfov);
                  lastSceneRef.current = targetId;
                } catch (e) {
                  console.error("Failed adding scene", e);
                }
              }
            })
            .catch((e) => {
              console.error("Failed to resolve panorama image for scene", targetId, e);
            });
        }
      }
      // Defer further processing until the scene is added and loaded
      return;
    }

    console.debug("Switching scene", { targetId, yaw, pitch, hfov });
    try {
      // Use Pannellum's documented signature: (id, pitch?, yaw?, hfov?, fadeDuration?)
      v.loadScene?.(targetId, pitch, yaw, hfov);
    } catch (e) {
      console.error("loadScene error with preserved view values, retrying default", e);
      try {
        v.loadScene?.(targetId);
      } catch (err) {
        console.error("loadScene default retry failed", err);
        setError("Failed to load the selected panorama scene.");
        return;
      }
    }

    lastSceneRef.current = targetId;
  }, [activeFloor, activeTime, activeDirection, floors, onFallback]);

  // Check if we should show ViewPlaceholder
  const floorCfg = floors.find((f) => f.id === activeFloor);
  const { view: currentView } = floorCfg
    ? resolveView(activeFloor, activeTime, activeDirection, floorCfg.views)
    : { view: null };

  if (!currentView) {
    return <ViewPlaceholder time={activeTime} direction={activeDirection} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full rounded-3xl overflow-hidden bg-[radial-gradient(circle_at_top,_#111827,_#020817)]"
      style={{ minHeight: '400px' }}
      aria-label="360 degree panoramic building view"
      role="img"
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-sm text-slate-200 bg-slate-900/60 z-50">
          <div>
            <p className="mb-2 font-medium">{error}</p>
            <p className="opacity-80">Try reloading the page or checking if the CDN is blocked. We now try multiple sources automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
}
