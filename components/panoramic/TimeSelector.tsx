"use client";

import { TimeKey } from "@/lib/panoramaConfig";
import { glass, roundedPanel, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SunMedium, Sunrise, Sunset, MoonStar } from "lucide-react";

const timeMeta: Record<TimeKey, { label: string; Icon: React.ComponentType<{ className?: string }>; gradient: string }> = {
  sunrise: {
    label: "Sunrise",
    Icon: Sunrise,
    gradient: "from-orange-400 to-pink-400",
  },
  noon: {
    label: "Noon",
    Icon: SunMedium,
    gradient: "from-yellow-300 to-amber-500",
  },
  sunset: {
    label: "Sunset",
    Icon: Sunset,
    gradient: "from-pink-500 to-purple-500",
  },
  night: {
    label: "Night",
    Icon: MoonStar,
    gradient: "from-slate-800 to-indigo-700",
  },
};

type Props = {
  activeTime: TimeKey;
  setActiveTime: (t: TimeKey) => void;
  availableTimes: TimeKey[];
};

export function TimeSelector({ activeTime, setActiveTime, availableTimes }: Props) {
  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 bottom-6 z-40 flex gap-2 px-3 py-3",
        glass,
        roundedPanel
      )}
      aria-label="Select time of day"
    >
      {(Object.keys(timeMeta) as TimeKey[]).map((key) => {
        const { label, Icon, gradient } = timeMeta[key];
        const active = key === activeTime;
        const available = availableTimes.includes(key);
        return (
          <button
            key={key}
            onClick={() => setActiveTime(key)}
            className={cn(
              pressable,
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[70px] relative",
              active ? "bg-white/8" : "bg-transparent",
              !available && "opacity-40"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shadow-md",
                "bg-gradient-to-br",
                gradient,
                active ? "scale-105 ring-2 ring-amber-400/80" : ""
              )}
            >
              <Icon className="w-4 h-4 text-slate-950" />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium",
                active ? "text-amber-300" : "text-slate-100/80"
              )}
            >
              {label}
            </span>
            {!available && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-500/60 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
