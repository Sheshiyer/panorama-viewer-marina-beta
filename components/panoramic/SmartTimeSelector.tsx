"use client";

import { type TimeKey } from "@/lib/panoramaConfig";
import { glass, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SunMedium, Sunrise, Sunset, MoonStar } from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";

type Props = {
    activeTime: TimeKey;
    setActiveTime: (t: TimeKey) => void;
    availableTimes: TimeKey[];
};

const timeMeta: Record<
    TimeKey,
    { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
    sunrise: { label: "Sunrise", Icon: Sunrise },
    noon: { label: "Noon", Icon: SunMedium },
    sunset: { label: "Sunset", Icon: Sunset },
    night: { label: "Night", Icon: MoonStar },
};

export function SmartTimeSelector({ activeTime, setActiveTime, availableTimes }: Props) {
    return (
        <LayoutGroup>
            <div
                className={cn(
                    glass,
                    "h-11 p-1 rounded-full flex items-center border border-white/10 shadow-xl backdrop-blur-md bg-black/40"
                )}
            >
                {(Object.keys(timeMeta) as TimeKey[]).map((key) => {
                    const { Icon, label } = timeMeta[key];
                    const isActive = key === activeTime;
                    const isAvailable = availableTimes.includes(key);

                    return (
                        <button
                            key={key}
                            onClick={() => isAvailable && setActiveTime(key)}
                            disabled={!isAvailable}
                            className={cn(
                                pressable,
                                "relative flex items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors",
                                !isAvailable && "opacity-30 grayscale cursor-not-allowed"
                            )}
                        >
                            <div className="relative z-10 flex items-center gap-2">
                                <Icon
                                    className={cn(
                                        "w-4 h-4 transition-colors",
                                        isActive ? "text-slate-950" : "text-white/80"
                                    )}
                                />
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-xs font-bold text-slate-950 overflow-hidden whitespace-nowrap"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="active-time-bg"
                                    className="absolute inset-0 bg-white rounded-full z-0"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </LayoutGroup>
    );
}
