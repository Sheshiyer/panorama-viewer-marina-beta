"use client";

import { useState } from "react";
import { glass, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Smartphone, Rotate3D } from "lucide-react";

type PannellumViewer = {
    startOrientation?: () => void;
    stopOrientation?: () => void;
    isOrientationSupported?: () => boolean; // Note: Pannellum might not expose this directly on the instance types commonly used? 
    // We'll trust the method exists or feature detect.
};

type Props = {
    viewer: PannellumViewer | null;
};

export function GyroToggle({ viewer }: Props) {
    const [active, setActive] = useState(false);
    const [supported, setSupported] = useState(true); // Assume supported initially

    const toggleGyro = () => {
        if (!viewer) return;

        if (active) {
            viewer.stopOrientation?.();
            setActive(false);
        } else {
            // Request permission on iOS 13+ if needed (Pannellum usually handles or needs an explicit call)
            // For now, simpler implementation:
            try {
                viewer.startOrientation?.();
                setActive(true);
            } catch (e) {
                console.warn("Orientation not supported", e);
                setSupported(false);
            }
        }
    };

    if (!viewer) return null;

    return (
        <button
            onClick={toggleGyro}
            className={cn(
                glass,
                pressable,
                "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-black/20 border border-white/10 shadow-lg transition-all",
                active ? "bg-amber-400/20 border-amber-400/50 text-amber-400" : "text-white/70"
            )}
            title="Toggle Magic Window (Gyroscope)"
        >
            <Smartphone className={cn("w-5 h-5 transition-transform", active && "scale-110")} />
            {active && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            )}
        </button>
    );
}
