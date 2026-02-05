"use client";

import { glass, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { WavesIcon } from "@/components/icons/WavesIcon";
import { StadiumIcon } from "@/components/icons/StadiumIcon";
import { motion, LayoutGroup } from "framer-motion";

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
    "central-sea": { icon: WavesIcon, label: "Sea View" },
    "marine-line": { icon: Building2, label: "Bandra-Worli Sea Link View" },
    stadium: { icon: StadiumIcon, label: "Stadium View" },
};

export function ViewSelector({ activeDirection, setActiveDirection, availableDirections }: Props) {
    return (
        <LayoutGroup>
            <div
                className={cn(
                    glass,
                    "h-11 p-1 rounded-full flex items-center gap-1 border border-white/10 shadow-xl backdrop-blur-md bg-black/40"
                )}
            >
                {(["stadium", "central-sea", "marine-line"] as Direction[]).map((dir) => {
                    const { icon: Icon, label } = directionConfig[dir];
                    const isActive = dir === activeDirection;
                    const isAvailable = availableDirections.includes(dir);

                    return (
                        <button
                            key={dir}
                            onClick={() => isAvailable && setActiveDirection(dir)}
                            disabled={!isAvailable}
                            className={cn(
                                pressable,
                                "relative h-9 px-3 rounded-full flex items-center justify-center gap-2 transition-all",
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
                                    layoutId="active-view-bg"
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
