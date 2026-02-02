"use client";

import { useEffect, useRef, useState } from "react";
import { floors, viewerDefaults, type TimeKey, type ViewDirection } from "@/lib/panoramaConfig";
import { PanoramaViewer } from "./PanoramaViewer";
import { UnifiedControls } from "./UnifiedControls";
import { ControlPanel } from "./ControlPanel";
import { MobileMenu } from "./MobileMenu";
import { FallbackToast } from "./FallbackToast";
import { useAvailableDirections } from "@/lib/hooks/useAvailableDirections";
import { useViewPreload } from "@/lib/hooks/useViewPreload";

// Type for Pannellum viewer instance
type PannellumViewer = {
  setYaw?: (yaw: number) => void;
  setPitch?: (pitch: number) => void;
  setHfov?: (hfov: number) => void;
  getYaw?: () => number;
  getPitch?: () => number;
  getHfov?: () => number;
  startAutoRotate?: (speed: number) => void;
  stopAutoRotate?: () => void;
  toggleFullscreen?: () => void;
};

export function PanoramaShell() {
  const [activeFloor, setActiveFloor] = useState<number>(floors[0].id);
  const [activeTime, setActiveTime] = useState<TimeKey>("noon");
  const [activeDirection, setActiveDirection] = useState<ViewDirection>("central-sea");
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [viewer, setViewer] = useState<PannellumViewer | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute available directions and times
  const currentFloor = floors.find(f => f.id === activeFloor)!;
  const availableDirections = useAvailableDirections(currentFloor, activeTime);
  const { preloadView } = useViewPreload(floors);

  // Helper function to compute available times for the current floor/direction
  const computeAvailableTimes = (): TimeKey[] => {
    const times: TimeKey[] = [];
    const timeKeys: TimeKey[] = ["sunrise", "noon", "sunset", "night"];

    for (const time of timeKeys) {
      const view = currentFloor.views[time]?.[activeDirection];
      if (view) {
        times.push(time);
      }
    }

    return times;
  };

  const scheduleAutorotate = () => {
    if (!viewer) return;
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Respect reduced motion
    if (prefersReduced) return;

    inactivityTimerRef.current = setTimeout(() => {
      if (!viewer) return;
      // Set focus point & zoom before starting rotation
      viewer.setYaw?.(viewerDefaults.autoRotateYaw ?? 0);
      viewer.setPitch?.(viewerDefaults.autoRotatePitch ?? 0);
      viewer.setHfov?.(viewerDefaults.autoRotateHfov ?? viewerDefaults.defaultHfov);
      viewer.startAutoRotate?.(
        (viewerDefaults.autoRotateSpeed ?? viewerDefaults.autoRotate ?? -2) as number
      );
      setAutoRotate(true);
    }, viewerDefaults.inactivityTimeoutMs ?? 8000);
  };

  const handleReady = (instance?: unknown) => {
    if (instance) {
      setViewer(instance as PannellumViewer);
      if (viewerDefaults.autoRotate) {
        (instance as PannellumViewer).startAutoRotate?.(viewerDefaults.autoRotate);
        setAutoRotate(true);
      }
    }
  };

  const zoomStep = 8;

  const onReset = () => {
    if (!viewer) return;
    viewer.setYaw?.(0);
    viewer.setPitch?.(0);
    viewer.setHfov?.(viewerDefaults.defaultHfov);
  };

  const onZoomIn = () => {
    if (!viewer) return;
    const current = viewer.getHfov?.() ?? viewerDefaults.defaultHfov;
    viewer.setHfov?.(Math.max(viewerDefaults.minHfov, current - zoomStep));
  };

  const onZoomOut = () => {
    if (!viewer) return;
    const current = viewer.getHfov?.() ?? viewerDefaults.defaultHfov;
    viewer.setHfov?.(Math.min(viewerDefaults.maxHfov, current + zoomStep));
  };

  const onToggleFullscreen = () => {
    if (!viewer) return;
    viewer.toggleFullscreen?.();
  };

  const onToggleAutoRotate = () => {
    if (!viewer) return;
    if (autoRotate) {
      viewer.stopAutoRotate?.();
      setAutoRotate(false);
    } else {
      viewer.startAutoRotate?.(viewerDefaults.autoRotate ?? -2);
      setAutoRotate(true);
    }
  };

  // Auto-switch logic when floor/time changes and current direction is unavailable
  useEffect(() => {
    const available = availableDirections;
    if (available.length > 0 && !available.includes(activeDirection)) {
      setActiveDirection(available[0]); // switch to first available
    }
  }, [activeFloor, activeTime, availableDirections, activeDirection]);

  // Stop autorotation on any user activity and reschedule inactivity timer
  useEffect(() => {
    if (!viewer) return;

    const onActivity = () => {
      if (autoRotate) {
        viewer.stopAutoRotate?.();
        setAutoRotate(false);
      }
      scheduleAutorotate();
    };

    const events = ["pointerdown", "touchstart", "wheel", "keydown", "mousemove"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    // initial schedule when viewer becomes available
    scheduleAutorotate();

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer]);

  useEffect(() => {
    if (typeof window === "undefined" || !viewer) return;
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced && autoRotate) {
      viewer.stopAutoRotate?.();
      setAutoRotate(false);
    }
    // Reschedule inactivity timer whenever scene changes
    scheduleAutorotate();
  }, [viewer, autoRotate, activeFloor, activeTime]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center z-10">
      <PanoramaViewer
        floors={floors}
        activeFloor={activeFloor}
        activeTime={activeTime}
        activeDirection={activeDirection}
        onReady={handleReady}
        onFallback={(reason) => setFallbackMessage(reason)}
      />
      {/* Logo overlays */}
      <div
        className="fixed left-8 pointer-events-none z-30"
        style={{ top: "3.25rem" }}
      >
        <img
          src="/YM-Infra.png"
          alt="YM Infra"
          className="object-contain drop-shadow-xl h-24 md:h-32 w-auto"
        />
      </div>
      
      <div
        className="fixed left-0 right-0 pointer-events-none z-30 flex justify-center"
        style={{ top: "3.25rem" }}
      >
        <img
          src="/ONE_MARINA_LOGO_PNG.png"
          alt="One Marina"
          className="object-contain drop-shadow-xl h-32 md:h-40 w-auto"
        />
      </div>
      
      <div
        className="fixed right-8 pointer-events-none z-30"
        style={{ top: "3.25rem" }}
      >
        <img
          src="/AshwinShethFinalLogo.svg"
          alt="Ashwin Sheth Group"
          className="object-contain drop-shadow-xl h-24 md:h-32 w-auto"
        />
      </div>
      
      <UnifiedControls
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        activeTime={activeTime}
        setActiveTime={setActiveTime}
        availableTimes={computeAvailableTimes()}
        activeDirection={activeDirection}
        setActiveDirection={setActiveDirection}
        availableDirections={availableDirections}
      />
      {fallbackMessage && (
        <FallbackToast
          message={fallbackMessage}
          onDismiss={() => setFallbackMessage(null)}
        />
      )}
      <MobileMenu
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        activeTime={activeTime}
        setActiveTime={setActiveTime}
      />
      <ControlPanel
        onReset={onReset}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onToggleFullscreen={onToggleFullscreen}
        autoRotate={autoRotate}
        onToggleAutoRotate={onToggleAutoRotate}
      />
    </div>
  );
}
