"use client";

import { useState, useEffect } from "react";
import { floors, type TimeKey, type TimeConfig, type ViewConfig } from "@/lib/panoramaConfig.simple";
import { SimplePanoramaViewer } from "./SimplePanoramaViewer";
import { TransitionOverlay } from "./TransitionOverlay";
import { WeatherWidget } from "./WeatherWidget";

export function SimplePanoramaShell() {
  const [activeFloorId, setActiveFloorId] = useState<number>(floors[0].id);
  const [activeTimeId, setActiveTimeId] = useState<TimeKey>("noon");
  const [activeViewIndex, setActiveViewIndex] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeFloor = floors.find(f => f.id === activeFloorId) || floors[0];
  const activeTime = activeFloor.times.find((t: TimeConfig) => t.id === activeTimeId) || activeFloor.times[0];

  useEffect(() => {
    // If we changed floor or time, ensure the view index is still valid
    if (activeViewIndex >= activeTime.views.length) {
      setActiveViewIndex(0);
    }
  }, [activeFloorId, activeTimeId, activeViewIndex, activeTime.views.length]);

  const handleFloorChange = (floorId: number) => {
    if (floorId === activeFloorId) return;
    setIsTransitioning(true);
    setActiveFloorId(floorId);
    setDropdownOpen(false);
  };

  const handleTimeChange = (timeId: TimeKey) => {
    const nextTime = activeFloor.times.find((t: TimeConfig) => t.id === timeId);
    if (!nextTime) return;

    // Try to find a view with the same label in the new time
    const currentViewLabel = activeTime.views[activeViewIndex]?.label;
    const sameLabelIndex = nextTime.views.findIndex((v: ViewConfig) => v.label === currentViewLabel);

    setActiveTimeId(timeId);
    if (sameLabelIndex !== -1) {
      setActiveViewIndex(sameLabelIndex);
    } else {
      setActiveViewIndex(0);
    }
  };


  const timeColors: Record<string, string> = {
    morning: "from-rose-400 to-orange-400",
    noon: "from-sky-400 to-amber-400",
    evening: "from-orange-500 to-indigo-600",
    night: "from-slate-700 to-indigo-950",
  };

  const timeIcons = {
    morning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
    noon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 5.106a.75.75 0 011.06 0l1.591 1.591a.75.75 0 11-1.06 1.061l-1.591-1.59a.75.75 0 010-1.061zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 010 1.06l-1.591 1.591a.75.75 0 11-1.061-1.06l1.59-1.591a.75.75 0 011.061 0zM12 18.75a.75.75 0 01.75.75V21.75a.75.75 0 01-1.5 0V19.5a.75.75 0 01.75-.75zM5.106 18.894a.75.75 0 011.06 0l1.591 1.591a.75.75 0 01-1.061 1.06l-1.59-1.591a.75.75 0 010-1.061zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM5.106 5.106a.75.75 0 010 1.06l-1.591 1.591a.75.75 0 01-1.06-1.06l1.59-1.591a.75.75 0 011.061 0z" />
      </svg>
    ),
    evening: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l-5-5-5 5M12 11v9" />
      </svg>
    ),
    night: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
      </svg>
    )
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <SimplePanoramaViewer
        floor={activeFloor}
        timeId={activeTimeId}
        viewIndex={activeViewIndex}
        onReady={() => console.log('Viewer ready')}
      />

      {/* Brand Logos - Top Left */}
      <div className="fixed top-0 left-0 z-30 pointer-events-none px-6 md:px-12 pt-8 md:pt-12 pb-10">
        <div className="flex items-center gap-1 md:gap-1">
          <img
            src="/logo-ashwin-sheth-white.svg"
            alt="Ashwin Sheth Group"
            className="object-contain drop-shadow-2xl h-12 md:h-24 w-auto transition-all duration-300"
          />
          <span className="text-white/40 text-xl md:text-3xl font-light">&</span>
          <img
            src="/logo-ym-infra-white.svg"
            alt="YM Infra"
            className="object-contain drop-shadow-2xl h-12 md:h-24 w-auto transition-all duration-300"
          />
        </div>
      </div>

      {/* RERA Registration - Top Right */}
      <div className="fixed top-0 right-0 z-30 pointer-events-none px-6 md:px-12 pt-6 md:pt-10 scale-[0.7] origin-top-right">
        <div className="flex flex-col items-end text-white text-right drop-shadow-lg">
          <p className="text-[9px] md:text-[11px] font-medium tracking-tight opacity-90 mb-0">
            MahaRERA Registration No.:
          </p>
          <p className="text-xl md:text-3xl font-light tracking-tight leading-none mb-1">
            P51900019619
          </p>
          <p className="text-[8px] md:text-[10px] font-medium opacity-80">
            maharera.mahaonline.gov.in
          </p>
        </div>
      </div>

      {/* Weather Widget - Bottom Left (hidden on mobile) */}
      <div className="hidden md:block fixed bottom-12 left-12 z-40 pointer-events-auto">
        <WeatherWidget />
      </div>

      {/* Control Overlay Interface - Vertical stack on mobile */}
      <div className="fixed bottom-2 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center gap-2 md:gap-4 w-full px-2 md:px-4 max-w-2xl">

        {/* Time and Direction Controls - Stacked on mobile */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-2 md:gap-4 items-center w-full">

          {/* Time Switcher */}
          <div className="flex bg-slate-950/40 backdrop-blur-xl rounded-full p-1 md:p-1.5 border border-white/10 shadow-2xl">
            {(["morning", "noon", "evening", "night"] as const).map((timeId) => {
              const isActive = activeTimeId === timeId;
              const isAvailable = activeFloor.times.some((t: TimeConfig) => t.id === timeId);

              return (
                <button
                  key={timeId}
                  onClick={() => isAvailable && handleTimeChange(timeId)}
                  disabled={!isAvailable}
                  className={`relative p-2 md:p-2.5 rounded-full transition-all group ${isActive
                    ? `bg-gradient-to-br ${timeColors[timeId]} text-white shadow-lg scale-110`
                    : isAvailable
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-700 cursor-not-allowed opacity-30'
                    }`}
                  title={timeId.charAt(0).toUpperCase() + timeId.slice(1)}
                >
                  <div className="w-4 h-4 md:w-5 md:h-5">
                    {timeIcons[timeId]}
                  </div>
                  {isActive && (
                    <span className={`hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-white/10 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2`}>
                      {timeId}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* View Switcher (Direction Switcher) */}
          <div className="flex bg-slate-950/40 backdrop-blur-xl rounded-full p-1 md:p-1.5 border border-white/10 shadow-2xl overflow-hidden">
            {activeTime.views.map((view: ViewConfig, index: number) => (
              <button
                key={index}
                onClick={() => setActiveViewIndex(index)}
                className={`px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold transition-all whitespace-nowrap ${activeViewIndex === index
                  ? `bg-gradient-to-r ${timeColors[activeTimeId]} text-white shadow-lg`
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Floor Selection Bar - Compact on mobile */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-xl md:rounded-3xl px-3 py-2 md:px-8 md:py-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex items-center gap-2 md:gap-6 justify-center">
          {/* Floor Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`px-3 py-1.5 md:px-6 md:py-3 bg-gradient-to-br ${timeColors[activeTimeId]} text-white font-bold rounded-lg md:rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-1.5 md:gap-3 text-xs md:text-lg`}
            >
              <span>{activeFloor.label}</span>
              <svg className={`w-3 h-3 md:w-5 md:h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 md:mb-4 bg-slate-900/95 backdrop-blur-3xl rounded-xl md:rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden min-w-[160px] md:min-w-[220px] animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="max-h-[60vh] overflow-y-auto py-1 md:py-2 custom-scrollbar">
                  {floors.map((floor) => (
                    <button
                      key={floor.id}
                      onClick={() => handleFloorChange(floor.id)}
                      className={`w-full px-3 py-2 md:px-6 md:py-4 text-left hover:bg-white/5 transition-all flex items-center justify-between group ${floor.id === activeFloorId ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-slate-300'
                        }`}
                    >
                      <span className="text-xs md:text-base">{floor.label}</span>
                      {floor.id === activeFloorId && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 md:h-12 w-[1px] bg-white/10"></div>

          {/* Elevation Display - Compact on mobile */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-slate-500 text-[7px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]">Elevation</span>
            <span className="text-lg md:text-2xl font-black text-white tabular-nums">
              {activeFloor.elevation}<span className="text-slate-500 text-[10px] md:text-sm font-normal ml-0.5">m</span>
            </span>
          </div>

          <div className="h-6 md:h-12 w-[1px] bg-white/10"></div>

          {/* Actual View Disclaimer */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 md:px-4 md:py-1.5 shadow-lg">
            <p className="text-white/70 text-[9px] md:text-xs font-medium tracking-wide whitespace-nowrap">
              Actual View
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <TransitionOverlay
        isTransitioning={isTransitioning}
        floorLabel={activeFloor.label}
        onTransitionEnd={() => setIsTransitioning(false)}
        timeColor={timeColors[activeTimeId]}
      />
    </div>
  );
}
