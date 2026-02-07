"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { glass } from "@/lib/ui";
import { Info, X } from "lucide-react";

export function DisclaimerWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            {/* Floating Button */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block group">
                <button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        glass,
                        "flex flex-col items-center py-4 px-1.5 rounded-l-xl transition-all duration-300",
                        "hover:bg-white/10 hover:pr-2.5 active:scale-95 border-r-0",
                        "shadow-lg backdrop-blur-md"
                    )}
                    aria-label="View Disclaimer"
                >
                    <Info className="w-4 h-4 text-white/70 mb-2" />
                    <span
                        className="text-[10px] font-medium tracking-widest text-white/70 uppercase writing-vertical-rl rotate-180 select-none whitespace-nowrap"
                        style={{ writingMode: "vertical-rl" }}
                    >
                        Disclaimer
                    </span>
                </button>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        ref={modalRef}
                        className={cn(
                            glass,
                            "relative w-full max-w-lg p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10",
                            "animate-in zoom-in-95 duration-200 slide-in-from-bottom-2"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-light text-white tracking-wide">
                                Disclaimer
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="text-sm text-white/80 font-light leading-relaxed space-y-4">
                            <p>
                                This drone footage is shared exclusively for curated viewing and reference. All visuals are indicative and subject to refinement.
                            </p>
                            <p>
                                The content does not constitute an offer, solicitation, or legal assurance. Any form of unauthorised use, reproduction, or dissemination of this material is strictly prohibited.
                            </p>
                            <div className="h-px bg-white/10 my-4" />
                            <p className="text-xs text-white/50">
                                Intellectual property rights remain fully reserved. © {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
