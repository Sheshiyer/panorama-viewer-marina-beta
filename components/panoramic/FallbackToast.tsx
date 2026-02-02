"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  onDismiss: () => void;
};

export function FallbackToast({ message, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-50",
        "bg-amber-500/90 text-slate-950 rounded-xl shadow-lg",
        "px-6 py-3 max-w-md",
        "animate-in fade-in slide-in-from-top-2 duration-300"
      )}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
