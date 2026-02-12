"use client";

import { useEffect, useRef, useState } from "react";
import { loadPannellum } from "@/lib/pannellumLoader";
import type { FloorConfig } from "@/lib/panoramaConfig.simple";
import { resolveImageUrl } from "@/lib/panoramaConfig.simple";
import { glass } from "@/lib/ui";

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
  const [controlsExpanded, setControlsExpanded] = useState(false);

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

        // Detect mobile device for better panorama FOV
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

        // Mobile-optimized FOV to prevent black bars
        const mobileHfov = 120; // Wider FOV for mobile portrait
        const desktopHfov = view.hfov ?? 90;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const viewerConfig: any = {
          type: "equirectangular",
          panorama: imageUrl,
          autoLoad: true,
          autoRotate: view.isPanoramic ? -2 : 0,
          showControls: false,
          hfov: isMobile ? mobileHfov : desktopHfov,
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
          const haov = isMobile ? 120 : 100;
          const vaov = haov / (floor.floorNumber === 56 ? 1.33 : 1.77);

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
          <img
            src="/ONE_MARINA_LOGO_PNG.png"
            alt="One Marina"
            className="object-contain drop-shadow-2xl h-64 md:h-[28rem] w-auto mb-8 animate-in fade-in duration-500"
          />
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

      {/* Control Panel - Bottom Right (collapsible on mobile) */}
      {!loading && !error && (
        <>
          {/* Mobile: Collapsible Controls */}
          <div className="md:hidden absolute bottom-4 right-3 z-50 flex flex-col gap-2">
            {/* Main Play/Pause Button - Always visible */}
            {view?.isPanoramic && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="w-12 h-12 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-2xl"
                aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            )}

            {/* Toggle Button for More Controls */}
            <button
              onClick={() => setControlsExpanded(!controlsExpanded)}
              className="w-12 h-12 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-2xl"
              aria-label="More controls"
            >
              <svg className={`w-5 h-5 text-white transition-transform ${controlsExpanded ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Expandable Controls */}
            {controlsExpanded && (
              <div className="flex flex-col gap-2 animate-in slide-in-from-right-5 fade-in duration-200">
                {/* Zoom Controls */}
                <div className="flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 shadow-2xl">
                  <button
                    onClick={zoomIn}
                    className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 transition-all flex items-center justify-center"
                    aria-label="Zoom in"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={zoomOut}
                    className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 transition-all flex items-center justify-center"
                    aria-label="Zoom out"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>

                {/* Additional Controls */}
                <button
                  onClick={resetView}
                  className="w-12 h-12 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-2xl"
                  title="Reset View"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="w-12 h-12 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-2xl"
                  title="Toggle Fullscreen"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Desktop: Always Visible Controls */}
          <div className="hidden md:flex absolute bottom-6 right-6 z-50 flex-col gap-4">
            {/* Play/Pause Button - Only show for true panoramics */}
            {view?.isPanoramic && (
              <button
                onClick={togglePlayPause}
                className={`w-12 h-12 rounded-full ${glass} flex items-center justify-center hover:bg-slate-800/90 transition-all duration-500 shadow-2xl group border border-amber-400/20`}
                aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                {/* Subtle Glow */}
                <div className="absolute inset-0 rounded-full bg-amber-400/0 group-hover:bg-amber-400/5 blur-md transition-all duration-500" />
              </button>
            )}

            {/* Zoom Controls */}
            <div className={`flex flex-col ${glass} rounded-2xl overflow-hidden shadow-2xl border border-amber-400/20`}>
              <button
                onClick={zoomIn}
                className="w-12 h-10 hover:bg-white/10 transition-all flex items-center justify-center group border-b border-white/5"
                aria-label="Zoom in"
              >
                <svg className="w-5 h-5 text-white group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={zoomOut}
                className="w-12 h-10 hover:bg-white/10 transition-all flex items-center justify-center group"
                aria-label="Zoom out"
              >
                <svg className="w-5 h-5 text-white group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex flex-col gap-4">
              <button
                onClick={resetView}
                className={`w-12 h-12 rounded-full ${glass} flex items-center justify-center hover:bg-slate-800/90 transition-all duration-500 shadow-2xl group border border-amber-400/20`}
                title="Reset View"
              >
                <svg className="w-5 h-5 text-white group-hover:text-amber-400 group-hover:rotate-180 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <button
                onClick={toggleFullscreen}
                className={`w-12 h-12 rounded-full ${glass} flex items-center justify-center hover:bg-slate-800/90 transition-all duration-500 shadow-2xl group border border-amber-400/20`}
                title="Toggle Fullscreen"
              >
                <svg className="w-5 h-5 text-white group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Compass - Bottom Left */}
      {!loading && !error && (
        <div className="hidden md:block absolute bottom-12 left-12 z-40 mb-32">
          {/* Main Compass Container with Glass & Gold theme */}
          <div className={`relative w-28 h-28 ${glass} rounded-full flex items-center justify-center p-1 group hover:bg-slate-800/80 transition-all duration-500 shadow-[0_22px_70px_rgba(0,0,0,0.7)]`}>
            {/* Gold highlight ring */}
            <div className="absolute inset-0 rounded-full border border-amber-400/20 pointer-events-none" />

            {/* Rotating Dial Container */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${-((view.viewingAngle || 0) - currentYaw)}deg)` }}
            >
              {/* Dial Background with Tick Marks */}
              <div className="absolute inset-2 rounded-full border border-white/5 opacity-40">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 left-1/2 -ml-[0.5px] w-[1px] h-2 bg-white/30 origin-[0_46px]"
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  />
                ))}
              </div>

              {/* Cardinal directions with premium typography */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-black tracking-widest text-amber-400 drop-shadow-md">N</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-widest text-white/50">S</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold tracking-widest text-white/50">E</span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold tracking-widest text-white/50">W</span>

              {/* High-detail Needle (Inside rotating dial) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-16 relative">
                  {/* North (Red) */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-600 to-red-400 rounded-t-full shadow-[0_-2px_10px_rgba(220,38,38,0.5)]" />
                  {/* South (White/Silver) */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-white/20 rounded-b-full" />
                </div>
              </div>
            </div>

            {/* Fixed Premium Heading Indicator (Top) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
              <div className="w-1 h-4 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)] rounded-b-full" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400/20 blur-sm rounded-full" />
            </div>

            {/* Center Cap with concentric rings */}
            <div className="w-4 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center border border-white/10 shadow-xl">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            </div>

            {/* View Label / Degree Readout Overlay */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-amber-400 tabular-nums">
                {Math.round((currentYaw + (view.viewingAngle || 0) + 720) % 360)}° {view.label.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
