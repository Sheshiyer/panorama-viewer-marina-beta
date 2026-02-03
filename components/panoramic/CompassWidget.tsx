"use client";

import { useEffect, useState, useRef } from "react";
import { glass } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";

// Type definition for the viewer prop
type PannellumViewer = {
    getYaw?: () => number;
};

type Props = {
    viewer: PannellumViewer | null;
};

export function CompassWidget({ viewer }: Props) {
    const [yaw, setYaw] = useState(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!viewer) return;

        const updateYaw = () => {
            if (viewer.getYaw) {
                // Get current yaw, normalize to 0-360
                // Pannellum yaw can be negative or >360
                const currentYaw = viewer.getYaw();
                setYaw(currentYaw);
            }
            rafRef.current = requestAnimationFrame(updateYaw);
        };

        // Start the loop
        rafRef.current = requestAnimationFrame(updateYaw);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [viewer]);

    // Calculate rotation for the compass dial
    // If the view rotates right (positive yaw), the compass needle should rotate left relative to the view
    // OR the compass rose rotates opposite to the view to keep "North" fixed.
    // Standard UI: The ring/rose rotates so 'N' points to North based on current view.
    // If I look 90 deg East, 'N' should be 90 deg to my Left (-90 deg).
    const rotation = -yaw;

    return (
        <div
            className={cn(
                glass,
                "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-black/20 border border-white/10 shadow-lg transition-opacity duration-500",
                !viewer ? "opacity-0" : "opacity-100"
            )}
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {/* Static Outer Ring (Optional decorative) */}
                <div className="absolute inset-1 rounded-full border border-white/20 opacity-50" />

                {/* North Indicator */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-red-500/80 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />

                {/* Cardinal Directions (Slightly visible) */}
                <span className="absolute top-0.5 text-[8px] font-bold text-red-400 font-mono">N</span>
                <span className="absolute bottom-0.5 text-[8px] font-medium text-white/40 font-mono">S</span>
                <span className="absolute right-1 text-[8px] font-medium text-white/40 font-mono">E</span>
                <span className="absolute left-1 text-[8px] font-medium text-white/40 font-mono">W</span>

            </div>

            {/* Center Pivot */}
            <div className="absolute w-1 h-1 bg-white/80 rounded-full z-10" />

            {/* View Cone (Optional: Shows current FOV direction relative to North) */}
            {/* Actually simpler: We rotate the whole compass rose against the fixed "Up" indicator of the HUD? */}
            {/* Implementation above: The user is "Up". The Compass ("N") rotates around them. Correct. */}
        </div>
    );
}
