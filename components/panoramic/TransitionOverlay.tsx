"use client";

import { useEffect, useState } from "react";

type Props = {
  isTransitioning: boolean;
  floorLabel: string;
  onTransitionEnd: () => void;
  timeColor: string;
};

export function TransitionOverlay({ isTransitioning, floorLabel, onTransitionEnd, timeColor }: Props) {
  const [show, setShow] = useState(false);
  const [displayFloor, setDisplayFloor] = useState(floorLabel);

  useEffect(() => {
    if (isTransitioning) {
      setShow(true);
      setDisplayFloor(floorLabel);
      
      const timer = setTimeout(() => {
        setShow(false);
        onTransitionEnd();
      }, 1500); // 1.5s transition

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, floorLabel, onTransitionEnd]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Blurred background */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />
      
      {/* Glowing ring/orb */}
      <div className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${timeColor} opacity-20 blur-3xl animate-pulse`} />
      
      <div className="relative flex flex-col items-center">
        <div className="text-slate-500 text-xs font-bold uppercase tracking-[0.5em] mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Moving to
        </div>
        <div className="text-white text-7xl font-black italic tracking-tighter animate-in zoom-in-95 fade-in duration-500">
          {displayFloor}
        </div>
        
        {/* Elevator Progress Line */}
        <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${timeColor} transition-all duration-[1500ms] ease-out w-full`}
          />
        </div>
      </div>
    </div>
  );
}
