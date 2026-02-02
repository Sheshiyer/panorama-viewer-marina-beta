"use client";

import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  time: string;
  direction: string;
};

export function ViewPlaceholder({ time, direction }: Props) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col items-center justify-center",
        "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <ImageOff className="w-16 h-16 text-slate-400/60" strokeWidth={1.5} />
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-slate-300">
            View Not Available
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            No panoramic image is available for {direction} at {time}
          </p>
        </div>
      </div>
    </div>
  );
}
