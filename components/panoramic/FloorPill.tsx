"use client";

import { useState } from "react";
import { floors } from "@/lib/panoramaConfig";
import { glass, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    activeFloor: number;
    setActiveFloor: (id: number) => void;
};

export function FloorPill({ activeFloor, setActiveFloor }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const currentFloor = floors.find((f) => f.id === activeFloor);

    return (
        <div className="relative flex flex-col items-center">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className={cn(
                            glass,
                            "absolute bottom-full mb-3 p-1.5 rounded-2xl flex flex-col gap-1 shadow-2xl border border-white/10"
                        )}
                    >
                        {floors.map((f) => {
                            const isActive = f.id === activeFloor;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => {
                                        setActiveFloor(f.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        pressable,
                                        "px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap min-w-[100px]",
                                        isActive
                                            ? "bg-white text-black font-bold shadow-lg"
                                            : "text-white/80 hover:bg-white/10"
                                    )}
                                >
                                    {f.floorNumber} Floor
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    glass,
                    pressable,
                    "h-11 px-5 rounded-full flex items-center gap-3 border border-white/10 shadow-xl backdrop-blur-md bg-black/40 transition-all active:scale-95"
                )}
            >
                <span className="text-sm font-semibold text-white tracking-wide">
                    {currentFloor?.floorNumber}th Floor
                </span>
                <ChevronUp
                    className={cn(
                        "w-4 h-4 text-white/50 transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
        </div>
    );
}
