"use client";

import { glass, roundedPanel, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { WavesIcon } from "@/components/icons/WavesIcon";
import { StadiumIcon } from "@/components/icons/StadiumIcon";

export type Direction = "central-sea" | "marine-line" | "stadium";

type Props = {
  activeDirection: Direction;
  setActiveDirection: (dir: Direction) => void;
  availableDirections: Direction[];
};

const directionConfig: Record<
  Direction,
  { icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  "central-sea": { icon: WavesIcon, label: "Central Sea" },
  "marine-line": { icon: Building2, label: "Marine Line" },
  stadium: { icon: StadiumIcon, label: "Stadium" },
};

export function DirectionSwitcher({
  activeDirection,
  setActiveDirection,
  availableDirections,
}: Props) {
  const directions: Direction[] = ["central-sea", "marine-line", "stadium"];

  return (
    <div
      className={cn(
        "fixed right-6 top-40 z-40 flex items-center gap-2 px-2 py-2",
        glass,
        roundedPanel
      )}
    >
      {directions.map((dir) => {
        const config = directionConfig[dir];
        const Icon = config.icon;
        const active = dir === activeDirection;
        const disabled = !availableDirections.includes(dir);

        return (
          <button
            key={dir}
            onClick={() => !disabled && setActiveDirection(dir)}
            disabled={disabled}
            className={cn(
              pressable,
              "w-11 h-11 flex items-center justify-center rounded-xl",
              active &&
                "bg-transparent ring-2 ring-amber-400 scale-105 text-amber-400",
              !active && !disabled && "text-slate-100 hover:bg-white/8",
              disabled &&
                "opacity-40 grayscale cursor-not-allowed pointer-events-none"
            )}
            aria-label={config.label}
            title={config.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
}
