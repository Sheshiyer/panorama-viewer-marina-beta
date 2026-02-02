"use client";

import { useEffect, useRef, useState } from "react";
import { loadPannellum } from "@/lib/pannellumLoader";
import type { FloorConfig } from "@/lib/panoramaConfig.simple";
import { resolveImageUrl } from "@/lib/panoramaConfig.simple";

type PannellumViewer = {
  destroy?: () => void;
  on?: (event: 'load' | 'error', handler: (...args: unknown[]) => void) => void;
  startAutoRotate?: (speed?: number) => void;
  stopAutoRotate?: () => void;
  setHfov?: (hfov: number) => void;
  getHfov?: () => number;
  setYaw?: (yaw: number, animated?: boolean | number) => void;
  setPitch?: (pitch: number, animated?: boolean | number) => void;
  getYaw?: () => number;
};

type Props = {
  floor: FloorConfig;
  timeId: string;
  viewIndex: number;
  onReady?: () => void;
};

export function SimplePanoramaViewer({ floor, timeId, viewIndex, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentHfov, setCurrentHfov] = useState(90);
  const [currentYaw, setCurrentYaw] = useState(0);

  const timeConfig = floor.times.find(t => t.id === timeId) || floor.times[0];
  const view = timeConfig.views[viewIndex] || timeConfig.views[0];

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!view?.image) {
        setError("No panoramic image available for this selection");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const pannellum = await loadPannellum();
        if (!mounted || !containerRef.current) return;

        // CRITICAL: Clear the container manually before Pannellum takes over
        // to prevent React/Pannellum DOM conflicts during unmounting
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Resolve image URL at runtime (supports R2 or local files)
        const imageUrl = resolveImageUrl(view.image);
        console.log('🎬 Loading panorama for', floor.label, '-', timeConfig.label, '-', view.label);
        console.log('📁 Image:', imageUrl);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const viewerConfig: any = {
          type: "equirectangular",
          panorama: imageUrl,
          autoLoad: true,
          autoRotate: view.isPanoramic ? -2 : 0,
          showControls: false,
          hfov: view.hfov ?? 90,
          yaw: view.defaultYaw ?? 0,
          pitch: view.defaultPitch ?? 0,
          dynamic: false,
          hotSpots: view.hotspots?.map(hs => ({
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: hs.type || "info",
            text: hs.text,
            URL: hs.url,
            // Small hack to pass description if needed, though Pannellum default info hotspots 
            // mainly use 'text'. Custom tooltips would be better for description.
          })) || [],
        };

        if (!view.isPanoramic) {
          const haov = 100;
          const vaov = 100 / (floor.floorNumber === 56 ? 1.33 : 1.77);
          
          viewerConfig.haov = haov;
          viewerConfig.vaov = vaov;
          viewerConfig.minYaw = -haov / 2;
          viewerConfig.maxYaw = haov / 2;
          viewerConfig.minPitch = -vaov / 2;
          viewerConfig.maxPitch = vaov / 2;
        }

        if (viewerRef.current?.destroy) {
          viewerRef.current.destroy();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        viewerRef.current = (pannellum as any).viewer(containerRef.current, viewerConfig);

        viewerRef.current?.on?.('error', (err: unknown) => {
          console.error('❌ Pannellum error:', err);
          setError(`Failed to load panorama: ${String(err)}`);
          setLoading(false);
        });

        viewerRef.current?.on?.('load', () => {
          console.log('✅ Panorama loaded successfully!');
          setLoading(false);
          setCurrentHfov(viewerRef.current?.getHfov?.() ?? 90);
          setIsPlaying(view.isPanoramic);
          onReady?.();
        });

      } catch (e: unknown) {
        console.error("Failed to initialize panorama:", e);
        setError("Failed to load panorama engine");
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      if (viewerRef.current?.destroy) {
        viewerRef.current.destroy();
      }
    };
  }, [floor.id, timeId, viewIndex, onReady]);

  useEffect(() => {
    if (!viewerRef.current) return;
    
    const interval = setInterval(() => {
      if (viewerRef.current?.getYaw) {
        setCurrentYaw(viewerRef.current.getYaw());
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [loading]);

  const togglePlayPause = () => {
    if (!viewerRef.current) return;
    
    if (isPlaying) {
      viewerRef.current.stopAutoRotate?.();
      setIsPlaying(false);
    } else {
      viewerRef.current.startAutoRotate?.(-2);
      setIsPlaying(true);
    }
  };

  const zoomIn = () => {
    if (!viewerRef.current) return;
    const newHfov = Math.max(30, currentHfov - 10);
    viewerRef.current.setHfov?.(newHfov);
    setCurrentHfov(newHfov);
  };

  const zoomOut = () => {
    if (!viewerRef.current) return;
    const newHfov = Math.min(120, currentHfov + 10);
    viewerRef.current.setHfov?.(newHfov);
    setCurrentHfov(newHfov);
  };

  const resetView = () => {
    if (!viewerRef.current) return;
    viewerRef.current.setYaw?.(view.defaultYaw ?? 0, true);
    viewerRef.current.setPitch?.(view.defaultPitch ?? 0, true);
    viewerRef.current.setHfov?.(view.hfov ?? 90);
    setCurrentHfov(view.hfov ?? 90);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden bg-[radial-gradient(circle_at_top,_#111827,_#020817)]"
      style={{ minHeight: '500px' }}
    >
      {/* 
        This is the dedicated Pannellum div. 
        It MUST be empty so React doesn't try to manage its children.
      */}
      <div 
        ref={containerRef} 
        className="w-full h-full" 
      />

      {/* 
        All React UI elements below are absolute positioned 
        relative to the parent, NOT inside the Pannellum container.
      */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 z-50 bg-slate-950/20 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading {floor.label}...</p>
          <p className="text-sm text-slate-400 mt-2">
            {view?.isPanoramic ? 'Preparing 360° View' : 'Loading View Detail'}
          </p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-6 z-50 bg-slate-950/80">
          <div className="bg-slate-900/90 p-8 rounded-2xl border border-red-500/20 shadow-2xl">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400 font-medium mb-2">{error}</p>
            <p className="text-slate-400 text-sm">Please try selecting a different floor or time.</p>
          </div>
        </div>
      )}

      {/* Control Panel - Bottom Right (mobile-optimized) */}
      {!loading && !error && (
        <div className="absolute bottom-4 right-3 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 md:gap-3">
          {/* Play/Pause Button - Only show for true panoramics */}
          {view?.isPanoramic && (
            <button
              onClick={togglePlayPause}
              className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-2xl group"
              aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          )}

          {/* Zoom Controls */}
          <div className="flex flex-col gap-1.5 md:gap-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-1.5 md:p-2 shadow-2xl">
            <button
              onClick={zoomIn}
              className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 transition-all flex items-center justify-center group"
              aria-label="Zoom in"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={zoomOut}
              className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 transition-all flex items-center justify-center group"
              aria-label="Zoom out"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <button
              onClick={resetView}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-2xl group"
              title="Reset View"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-2xl group"
              title="Toggle Fullscreen"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Compass - Bottom Left (hidden on mobile) */}
      {!loading && !error && (
        <div className="hidden md:block absolute bottom-12 left-12 z-40 mb-32">
          <div className="relative w-24 h-24 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl overflow-hidden group hover:bg-slate-800/80 transition-all">
            {/* Cardinal directions */}
            <div className="absolute inset-3 border border-white/5 rounded-full" />
            <span className="absolute top-2 text-[10px] font-bold text-white/40">N</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-white/40">S</span>
            <span className="absolute right-2 text-[10px] font-bold text-white/40">E</span>
            <span className="absolute left-2 text-[10px] font-bold text-white/40">W</span>
            
            {/* Needle */}
            <div 
              className="w-1 h-16 relative transition-transform duration-100 ease-out"
              style={{ transform: `rotate(${-currentYaw}deg)` }}
            >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/40 rounded-full" />
            </div>
            
            {/* Center dot */}
            <div className="w-2.5 h-2.5 bg-white rounded-full z-10 shadow-lg border border-slate-950/20" />
            
            {/* Yaw readout on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90">
              <span className="text-xs font-black text-white tabular-nums tracking-tighter">
                {Math.round((currentYaw + 360) % 360)}°
              </span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] ml-1">Viewer Orientation</span>
          </div>
        </div>
      )}
    </div>
  );
}
