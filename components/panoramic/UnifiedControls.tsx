"use client";

import { floors, TimeKey } from "@/lib/panoramaConfig";
import { glass, roundedPanel, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SunMedium, Sunrise, Sunset, MoonStar, ChevronDown } from "lucide-react";
import { Building2 } from "lucide-react";
import { WavesIcon } from "@/components/icons/WavesIcon";
import { StadiumIcon } from "@/components/icons/StadiumIcon";
import { useState } from "react";

export type Direction = "central-sea" | "marine-line" | "stadium";

type Props = {
  activeFloor: number;
  setActiveFloor: (id: number) => void;
  activeTime: TimeKey;
  setActiveTime: (t: TimeKey) => void;
  availableTimes: TimeKey[];
  activeDirection: Direction;
  setActiveDirection: (dir: Direction) => void;
  availableDirections: Direction[];
};

const timeMeta: Record<
  TimeKey,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  sunrise: {
    label: "Sunrise",
    Icon: Sunrise,
  },
  noon: {
    label: "Noon",
    Icon: SunMedium,
  },
  sunset: {
    label: "Sunset",
    Icon: Sunset,
  },
  night: {
    label: "Night",
    Icon: MoonStar,
  },
};

const directionConfig: Record<
  Direction,
  { icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  "central-sea": { icon: WavesIcon, label: "Sea" },
  "marine-line": { icon: Building2, label: "Marine" },
  stadium: { icon: StadiumIcon, label: "Stadium" },
};

export function UnifiedControls({
  activeFloor,
  setActiveFloor,
  activeTime,
  setActiveTime,
  availableTimes,
  activeDirection,
  setActiveDirection,
  availableDirections,
}: Props) {
  const [showFloors, setShowFloors] = useState(false);

  const currentFloor = floors.find((f) => f.id === activeFloor);
  const currentTime = timeMeta[activeTime];
  const CurrentTimeIcon = currentTime.Icon;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-40 flex flex-col items-center gap-2">
      {/* Floor Selector Dropdown */}
      {showFloors && (
        <div
          className={cn(
            glass,
            roundedPanel,
            "px-3 py-2 flex flex-wrap gap-2 max-w-md justify-center"
          )}
        >
          {floors.map((f) => {
            const active = f.id === activeFloor;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFloor(f.id);
                  setShowFloors(false);
                }}
                className={cn(
                  pressable,
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-black border-2 border-amber-400 text-amber-400 shadow-lg"
                    : "bg-white/5 text-slate-200 hover:bg-white/10 border-2 border-transparent"
                )}
              >
                {f.floorNumber}F
              </button>
            );
          })}
        </div>
      )}

      {/* Main Unified Control Panel */}
      <div
        className={cn(
          glass,
          roundedPanel,
          "px-4 py-3 flex items-center gap-4"
        )}
      >
        {/* Floor Display/Toggle */}
        <button
          onClick={() => setShowFloors(!showFloors)}
          className={cn(
            pressable,
            "flex items-center gap-2 px-3 py-2 rounded-xl",
            "bg-black border-2",
            "relative before:absolute before:inset-0 before:rounded-xl before:p-[2px]",
            "before:bg-gradient-to-r before:from-amber-400 before:to-amber-600 before:-z-10",
            "border-transparent text-white",
            "min-w-[80px] justify-between"
          )}
        >
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-70">Floor</span>
            <span className="text-lg font-bold leading-none">
              {currentFloor?.floorNumber}F
            </span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              showFloors && "rotate-180"
            )}
          />
        </button>

        {/* Divider */}
        <div className="h-10 w-px bg-white/20" />

        {/* Time Selector */}
        <div className="flex gap-1.5">
          {(Object.keys(timeMeta) as TimeKey[]).map((key) => {
            const { Icon } = timeMeta[key];
            const active = key === activeTime;
            const available = availableTimes.includes(key);
            return (
              <button
                key={key}
                onClick={() => available && setActiveTime(key)}
                disabled={!available}
                className={cn(
                  pressable,
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  "bg-black border-2",
                  active
                    ? "border-transparent relative before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-amber-400 before:to-amber-600 before:-z-10 scale-110"
                    : "border-white/30",
                  "text-white",
                  !available && "opacity-30 grayscale cursor-not-allowed"
                )}
                title={timeMeta[key].label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-white/20" />

        {/* Direction Selector */}
        <div className="flex gap-1.5">
          {(["central-sea", "marine-line", "stadium"] as Direction[]).map((dir) => {
            const config = directionConfig[dir];
            const Icon = config.icon;
            const active = dir === activeDirection;
            const available = availableDirections.includes(dir);
            return (
              <button
                key={dir}
                onClick={() => available && setActiveDirection(dir)}
                disabled={!available}
                className={cn(
                  pressable,
                  "w-9 h-9 flex items-center justify-center rounded-xl",
                  "bg-black border-2",
                  active &&
                    "border-transparent relative before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-amber-400 before:to-amber-600 before:-z-10 scale-110 text-amber-400",
                  !active && available && "border-white/30 text-slate-200 hover:bg-white/10",
                  !available &&
                    "opacity-30 grayscale cursor-not-allowed text-slate-400 border-white/10"
                )}
                title={config.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Selection Label */}
      <div className="text-xs text-slate-300/80 font-medium">
        {currentFloor?.label} • {currentTime.label} • {directionConfig[activeDirection].label}
      </div>
    </div>
  );
}
